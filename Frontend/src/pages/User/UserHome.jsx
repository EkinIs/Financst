import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { FiRefreshCw } from "react-icons/fi"; 

// Components
import { OverviewCard } from "./OverviewCard";
import { WatchListTable } from "./UserStockWatchListTable";
import { StockNews } from "../../components/Stock/StockNews";

// Store & Data
import { useAuthStore } from "../../controller/Auth";
import { useStockStore } from "../../controller/Stock";

export const UserHomePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  
  // Store Connections
  const { marketData, watchlistPrices, fetchDashboardData, fetchWatchlistPrices } = useStockStore();
  const { topGainers, news } = marketData;

  const user = useAuthStore((state) => state.user);
  const watchList = useMemo(() => user?.watchList || [], [user]);

  // Loading state (For button animation)
  const [isRefreshing, setIsRefreshing] = useState(false);

useEffect(() => {
    fetchDashboardData();
    if (watchList.length > 0) {
        fetchWatchlistPrices(watchList);
    }
  }, [watchList, fetchDashboardData, fetchWatchlistPrices]);

  const handleSymbolNavigate = (symbol) => {
    navigate(`/stocks/${symbol}`);
  };

  // --- NEW: MANUAL REFRESH FUNCTION ---
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // 1. Force fetch dashboard data (true parameter)
    await fetchDashboardData(true);
    
    // 2. If there is a watchlist, fetch its prices again
    // Note: fetchWatchlistPrices currently does not support forceUpdate, 
    // to bypass it, lastWatchlistUpdated in the store might need to be reset 
    // but for now, just refreshing the dashboard is sufficient.
    if (watchList.length > 0) {
        // A small hack: We can trigger by showing the watchlist as empty and then full again
        // or we can add a forceUpdate parameter to fetchWatchlistPrices. I am not sure
        // For now, we just call it:
        await fetchWatchlistPrices(watchList); 
    }
    
    setTimeout(() => setIsRefreshing(false), 500); // Wait a bit for animation but not too long !!
  };

  const enrichedWatchlist = useMemo(() => {
      return watchList.map(item => {
          const priceData = watchlistPrices[item.symbol];
          return {
              ...item,
              currentPrice: priceData ? priceData.close : 0,
          };
      });
  }, [watchList, watchlistPrices]);

  return (
    <div className="flex flex-col h-full w-full p-6 pt-10 gap-6 pb-20">
      
      {/* --- TOP HEADER AND REFRESH BUTTON --- */}
      <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t("userHome.marketOverview")}</h2>
          <button 
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-blue-600 dark:text-blue-400 rounded-xl transition-all font-medium text-sm"
          >
            <FiRefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? t("userHome.refreshing") : t("userHome.refreshData")}
          </button>
      </div>

      {/* Top Gainers */}
      <section>
        <OverviewCard
          CardType={t("userHome.topGainers")}
          CardsData={topGainers}
        />
      </section>

      <div className="flex flex-col lg:flex-row h-full w-full gap-6">
        {/* Watchlist */}
        <div className="w-full lg:w-5/12 min-w-[300px] flex flex-col">
           <h4 className="text-xl font-bold mb-4 text-gray-800 dark:text-white pl-1">
              {t("userHome.watchlist")}
           </h4>
           <div className="grow">
             <WatchListTable
               data={enrichedWatchlist}
               onRowClick={handleSymbolNavigate}
             />
           </div>
        </div>

        {/* News */}
        <div className="w-full lg:w-7/12 flex flex-col">
           <h4 className="text-xl font-bold mb-4 text-gray-800 dark:text-white pl-1">
              {t("userHome.marketNews")}
           </h4>
           <div className="grow">
              {!news || news.length === 0 ? (
                <div className="p-10 text-center text-gray-400 bg-white dark:bg-midnight-light rounded-2xl shadow-md">
                   {t("userHome.loadingNews")}
                </div>
              ) : (
                <StockNews news={news} />
              )}
           </div>
        </div>
      </div>
    </div>
  );
};