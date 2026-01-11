import { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine
} from "recharts";
import { useTranslation } from "react-i18next";

const TIMEFRAMES = ["1W", "1M", "3M", "1Y"];

// Special Tooltip Component
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-neutral-800/90 backdrop-blur-sm p-3 border border-gray-200 dark:border-neutral-700 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">{label}</p>
        <p className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
          ${payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export const StockChart = ({ historyData = [], className = "" }) => {
  const { t } = useTranslation();
  const [timeframe, setTimeframe] = useState("3M");

  // Prepare Data
  const formattedData = useMemo(() => {
    if (!Array.isArray(historyData) || historyData.length === 0) return [];

    return historyData
      .map((item) => {
        const d = new Date(item.report_date);
        return {
          fullDate: d,
          // Short date format to display under the chart (e.g., Jan 12)
          axisDate: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          // Long date format to display in the tooltip (e.g., Fri, Jan 12, 2024)
          tooltipDate: d.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
          value: parseFloat(item.close),
        };
      })
      .sort((a, b) => a.fullDate - b.fullDate);
  }, [historyData]);

  // Apply Time Filter
  const chartData = useMemo(() => {
    if (formattedData.length === 0) return [];
    
    const lastDate = formattedData[formattedData.length - 1].fullDate;
    const cutoffDate = new Date(lastDate);

    switch (timeframe) {
      case "1W": cutoffDate.setDate(lastDate.getDate() - 7); break;
      case "1M": cutoffDate.setMonth(lastDate.getMonth() - 1); break;
      case "3M": cutoffDate.setMonth(lastDate.getMonth() - 3); break;
      case "1Y": cutoffDate.setFullYear(lastDate.getFullYear() - 1); break;
      default: break;
    }

    return formattedData.filter((item) => item.fullDate >= cutoffDate);
  }, [timeframe, formattedData]);

  if (!chartData.length) {
    return (
      <div className={`rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 w-full h-full bg-white dark:bg-midnight-light flex items-center justify-center ${className}`}>
        <div className="flex flex-col items-center gap-2">
            <div className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-sm text-gray-400">{t("stockPage.chart.loading")}</p>
        </div>
      </div>
    );
  }

  // Determine Trend Color
  const currentValue = chartData[chartData.length - 1].value;
  const startValue = chartData[0].value;
  const isPositive = currentValue >= startValue;
  const trendColor = isPositive ? "#10b981" : "#ef4444"; // Emerald-500 vs Red-500

  return (
    <div className={`rounded-2xl shadow-sm border border-gray-100 dark:border-neutral-800 bg-white dark:bg-midnight-light w-full h-full p-6 flex flex-col ${className}`}>
      
      {/* Header: Title & Timeframe Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-2">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
            {t("stockPage.chart.title")}
        </h3>
        
        <div className="flex bg-gray-100 dark:bg-neutral-800/50 p-1 rounded-xl">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 ${
                timeframe === tf
                  ? "bg-white dark:bg-neutral-700 shadow-sm text-gray-900 dark:text-white"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Main Chart Area */}
      <div className="grow w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                {/* Üst Kısım: Daha belirgin (%30 opaklık) */}
                <stop offset="5%" stopColor={trendColor} stopOpacity={0.3} />
                {/* Alt Kısım: Tamamen kaybolmuyor, hafif bir iz kalıyor (%5 opaklık) */}
                <stop offset="95%" stopColor={trendColor} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="#f3f4f6" 
                className="dark:stroke-neutral-800" 
            />
            
            <XAxis 
              dataKey="axisDate" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              minTickGap={40} // Tarihlerin üst üste binmesini engeller
              dy={10} // Tarihleri biraz aşağı iter
            />
            
            <YAxis 
              domain={['auto', 'auto']} 
              orientation="right" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              tickFormatter={(val) => `$${val}`}
              width={60}
            />
            
            <Tooltip 
                content={<CustomTooltip />}
                cursor={{ stroke: '#9ca3af', strokeWidth: 1, strokeDasharray: '4 4' }} // Crosshair efekti
            />
            
            <Area 
                type="monotone" 
                dataKey="value" 
                stroke={trendColor} 
                strokeWidth={2} 
                fillOpacity={1} 
                fill="url(#colorPrice)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: trendColor }} // Hover noktası
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};