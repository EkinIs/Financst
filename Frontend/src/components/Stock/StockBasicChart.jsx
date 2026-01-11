import { useState, useMemo } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

const TIMEFRAMES = ["1W", "1M", "3M", "1Y"];

export const StockBasicChart = ({ historyData = [], className = "" }) => {
  const { t } = useTranslation();
  const [timeframe, setTimeframe] = useState("3M");

  // Prepare Data for Chart
  const formattedData = useMemo(() => {
    if (!Array.isArray(historyData) || historyData.length === 0) return [];

    return historyData
      .map((item) => ({
        fullDate: new Date(item.report_date),
        date: new Date(item.report_date).toLocaleDateString("en-US", {
          month: "short", day: "numeric",
        }),
        value: parseFloat(item.close),
      }))
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
      <div className={`rounded-2xl shadow-md w-full h-96 bg-white dark:bg-midnight-light flex items-center justify-center ${className}`}>
        <p className="text-gray-500">{t("stockPage.chart.loading")}</p>
      </div>
    );
  }

  const currentValue = chartData[chartData.length - 1].value;
  const startValue = chartData[0].value;
  const isPositive = currentValue >= startValue;
  const trendColor = isPositive ? "#10b981" : "#ef4444";

  return (
    <div className={`rounded-2xl shadow-md bg-white dark:bg-midnight-light w-full h-full p-6 ${className}`}>
      {/* Chart Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h3 className="text-lg font-bold text-gray-700 dark:text-gray-200">Price History</h3>
        <div className="flex gap-1 bg-gray-100 dark:bg-midnight-lighter p-1 rounded-lg">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${
                timeframe === tf
                  ? "bg-white dark:bg-neutral-700 shadow-sm text-black dark:text-white"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-64 md:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={trendColor} stopOpacity={0.2} />
                <stop offset="95%" stopColor={trendColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-700" />
            <XAxis 
              dataKey="date" 
              hide={true} // I hide x-axis for cleaner look
            />
            <YAxis 
              domain={['auto', 'auto']} 
              orientation="right" 
              tick={{fontSize: 12, fill: '#9ca3af'}} 
              axisLine={false} 
              tickLine={false}
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
              labelStyle={{ color: "#6b7280" }}
            />
            <Area type="monotone" dataKey="value" stroke={trendColor} strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};