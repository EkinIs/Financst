import { DuckDBInstance } from '@duckdb/node-api';

// --- Initialize DuckDB (Persistent Connection) ---
const DB_PATH = '../server/finance.duckdb';
const instance = await DuckDBInstance.create(DB_PATH);
const conn = await instance.connect();

console.log(`Connected to DuckDB at ${DB_PATH}`);

// --- HELPER QUERIES (CTEs) ---
// İsimleri calendar tablosundan çekmek için ortak CTE
const LATEST_NAME_CTE = `
  WITH latest_names AS (
     SELECT symbol, name, 
     ROW_NUMBER() OVER (PARTITION BY symbol ORDER BY report_date DESC) as rn
     FROM stock_earning_calendar
  )
`;

// --- CONTROLLERS: DASHBOARD & DISCOVERY ---

// 1. Top Gainers
export const getTopGainers = async (req, res) => {
  try {
    const query = `
      ${LATEST_NAME_CTE}
      SELECT 
          m.symbol,
          n.name,
          m.close AS price,
          m.daily_return_pct AS change_percent
      FROM stock_performance_metrics m
      LEFT JOIN latest_names n ON m.symbol = n.symbol AND n.rn = 1
      WHERE m.report_date = (SELECT MAX(report_date) FROM stock_performance_metrics)
      ORDER BY m.daily_return_pct DESC
      LIMIT 5;
    `;
    const reader = await conn.runAndReadAll(query);
    res.status(200).json(reader.getRowObjectsJson());
  } catch (error) {
    console.error("Top Gainers Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 2. Top Losers
export const getTopLosers = async (req, res) => {
  try {
    const query = `
      ${LATEST_NAME_CTE}
      SELECT 
          m.symbol,
          n.name,
          m.close AS price,
          m.daily_return_pct AS change_percent
      FROM stock_performance_metrics m
      LEFT JOIN latest_names n ON m.symbol = n.symbol AND n.rn = 1
      WHERE m.report_date = (SELECT MAX(report_date) FROM stock_performance_metrics)
      ORDER BY m.daily_return_pct ASC
      LIMIT 5;
    `;
    const reader = await conn.runAndReadAll(query);
    res.status(200).json(reader.getRowObjectsJson());
  } catch (error) {
    console.error("Top Losers Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 3. Most Active Stocks
export const getMostActive = async (req, res) => {
  try {
    const query = `
      ${LATEST_NAME_CTE}
      SELECT 
          p.symbol,
          n.name,
          p.close AS price,
          p.volume
      FROM stock_prices p
      LEFT JOIN latest_names n ON p.symbol = n.symbol AND n.rn = 1
      WHERE p.report_date = (SELECT MAX(report_date) FROM stock_prices)
      ORDER BY p.volume DESC
      LIMIT 5;
    `;
    const reader = await conn.runAndReadAll(query);
    res.status(200).json(reader.getRowObjectsJson());
  } catch (error) {
    console.error("Most Active Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 4. Sector Performance
export const getSectorPerformance = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.sector, 
        AVG(m.daily_return_pct) as avg_change
      FROM stock_profile p
      JOIN stock_performance_metrics m ON p.symbol = m.symbol
      WHERE m.report_date = (SELECT MAX(report_date) FROM stock_performance_metrics)
      AND p.sector IS NOT NULL
      GROUP BY p.sector
      ORDER BY avg_change DESC;
    `;
    const reader = await conn.runAndReadAll(query);
    res.status(200).json(reader.getRowObjectsJson());
  } catch (error) {
    console.error("Sector Perf Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 5. Upcoming Earnings
export const getUpcomingEarnings = async (req, res) => {
  try {
    const query = `
      SELECT symbol, name, report_date, time 
      FROM stock_earning_calendar
      WHERE CAST(report_date AS DATE) BETWEEN current_date AND (current_date + INTERVAL 7 DAY)
      ORDER BY report_date ASC
      LIMIT 10;
    `;
    const reader = await conn.runAndReadAll(query);
    res.status(200).json(reader.getRowObjectsJson());
  } catch (error) {
    console.error("Earnings Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// 6. Market News
export const getMarketNews = async (req, res) => {
  try {
    const query = `
      SELECT title, publisher, report_date, link, type
      FROM stock_news
      ORDER BY report_date DESC
      LIMIT 10;
    `;
    const reader = await conn.runAndReadAll(query);
    res.status(200).json(reader.getRowObjectsJson());
  } catch (error) {
    console.error("News Error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// --- CONTROLLERS: STOCK DETAIL PAGE ---

// 1. Chart Data
export const getStockHistory = async (req, res) => {
  const stockSymbol = req.params.symbol.toUpperCase();
  const days = parseInt(req.params.days, 10) || 90;

  try {
    const query = `
      SELECT 
        report_date, open, close, high, low, volume
      FROM stock_prices
      WHERE symbol = $1 
      AND CAST(report_date AS DATE) >= current_date - ($2 * INTERVAL 1 DAY)
      ORDER BY report_date ASC
    `;
    const prepared = await conn.prepare(query);
    prepared.bindVarchar(1, stockSymbol);
    prepared.bindInteger(2, days);
    
    const reader = await prepared.runAndReadAll();
    res.status(200).json(reader.getRowObjectsJson());
  } catch (error) {
    console.error("History Error:", error);
    res.status(500).json({ error: "History Error" });
  }
};

// 2. Stock Profile (FIXED: pe_ratio -> trailing_pe AND added name join)
export const getStockProfile = async (req, res) => {
  const stockSymbol = req.params.symbol.toUpperCase();
  try {
    const query = `
      WITH latest_name AS (
         SELECT name 
         FROM stock_earning_calendar 
         WHERE symbol = $1
         ORDER BY report_date DESC 
         LIMIT 1
      )
      SELECT 
        p.*, 
        n.name, -- İsim Eklendi
        s.market_cap, 
        s.trailing_pe, -- Düzeltildi: pe_ratio yerine trailing_pe
        s.beta
      FROM stock_profile p
      LEFT JOIN stock_summary s ON p.symbol = s.symbol
      LEFT JOIN latest_name n ON 1=1 -- Cross join but limited to 1 row by CTE logic
      WHERE p.symbol = $1
    `;
    const prepared = await conn.prepare(query);
    prepared.bindVarchar(1, stockSymbol);
    
    const reader = await prepared.runAndReadAll();
    const rows = reader.getRowObjectsJson();
    
    if (rows.length === 0) return res.status(404).json({ error: "Profile not found" });
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error("Profile Error:", error); // Log error to terminal
    res.status(500).json({ error: "Profile Error" });
  }
};

// 3. Stock Financials
export const getStockFinancials = async (req, res) => {
  const stockSymbol = req.params.symbol.toUpperCase();
  try {
    const query = `
      SELECT report_date, item_name, item_value
      FROM stock_statement
      WHERE symbol = $1 
      AND item_name IN ('Total Revenue', 'Net Income')
      ORDER BY report_date DESC
      LIMIT 8;
    `;
    const prepared = await conn.prepare(query);
    prepared.bindVarchar(1, stockSymbol);
    
    const reader = await prepared.runAndReadAll();
    res.status(200).json(reader.getRowObjectsJson());
  } catch (error) {
    res.status(500).json({ error: "Financials Error" });
  }
};

// 4. Stock Specific News
export const getStockNews = async (req, res) => {
  const stockSymbol = req.params.symbol.toUpperCase();
  try {
    const query = `
      SELECT n.title, n.publisher, n.report_date, n.link
      FROM stock_news n
      JOIN stock_news_lookup l ON n.uuid = l.uuid
      WHERE l.symbol = $1
      ORDER BY n.report_date DESC
      LIMIT 5;
    `;
    const prepared = await conn.prepare(query);
    prepared.bindVarchar(1, stockSymbol);
    
    const reader = await prepared.runAndReadAll();
    res.status(200).json(reader.getRowObjectsJson());
  } catch (error) {
    res.status(500).json({ error: "News Error" });
  }
};

// 5. Search List
export const getAllStocksList = async (req, res) => {
  try {
    const query = `
      ${LATEST_NAME_CTE}
      SELECT s.symbol, n.name 
      FROM stock_summary s
      LEFT JOIN latest_names n ON s.symbol = n.symbol AND n.rn = 1
      ORDER BY s.symbol ASC
    `;
    const reader = await conn.runAndReadAll(query);
    res.status(200).json(reader.getRowObjectsJson());
  } catch (error) {
    res.status(500).json({ error: "List Error" });
  }
};