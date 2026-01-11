import express from "express";
import {
    // Dashboard & Discovery (Home Page)
    getTopGainers,
    getTopLosers,
    getMostActive,
    getSectorPerformance,
    getUpcomingEarnings,
    getMarketNews,

    // Stock Details (Detail Page)
    getStockHistory,
    getStockProfile,
    getStockFinancials,
    getStockNews,

    // General List (Search/List)
    getAllStocksList
} from "../controllers/StocksController.js";

const StocksRoutes = express.Router();

// --- 1. DASHBOARD ROUTES (Home Page Data) ---
// Static routes should always come before dynamic ones (:symbol).

StocksRoutes.get("/dashboard/gainers", getTopGainers);     // Top Gainers
StocksRoutes.get("/dashboard/losers", getTopLosers);       // Top Losers
StocksRoutes.get("/dashboard/active", getMostActive);      // Most Active
StocksRoutes.get("/dashboard/sectors", getSectorPerformance); // Sector Performance
StocksRoutes.get("/dashboard/earnings", getUpcomingEarnings); // Upcoming Earnings

// --- 2. NEWS ROUTES ---
StocksRoutes.get("/news/market", getMarketNews);           // General Market News

// --- 3. GENERAL LIST ---
StocksRoutes.get("/list", getAllStocksList);               // All stocks list (For search)

// --- 4. STOCK DETAIL ROUTES (Stock Details) ---
// Dynamic parameters (:symbol) should always come last.

StocksRoutes.get("/:symbol/profile", getStockProfile);     // Company profile (Bio, Market Cap etc.)
StocksRoutes.get("/:symbol/financials", getStockFinancials); // Financial summary (Income statement)
StocksRoutes.get("/:symbol/news", getStockNews);           // News specific to that stock
StocksRoutes.get("/:symbol/history/:days", getStockHistory); // Chart data (OHLCV)

export default StocksRoutes;