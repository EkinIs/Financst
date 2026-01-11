import { useEffect } from "react";
import { useParams } from "react-router";
import { useTranslation } from "react-i18next";

// Components
import { StockHeader } from "../../components/Stock/StockHeader";
import { StockChart } from "../../components/Stock/StockChart";
import { StockFundamentals } from "../../components/Stock/StockFundamentals";
import { StockAbout } from "../../components/Stock/StockAbout";

// Store & Controllers
import { useStockStore } from "../../controller/Stock";
import { addSymbolToWatchlist, deleteSymbolFromWatchlist } from "../../controller/User";
import { useAuthStore } from "../../controller/Auth";

export const StockPage = () => {
  const { t } = useTranslation();
  const { symbol } = useParams();
  const user = useAuthStore((state) => state.user);
  
  // 1.get Stock Store from useStockStore
  const { currentStock, fetchStockDetails, clearCurrentStock } = useStockStore();
  const { profile, history, loading } = currentStock;

  // Watchlist Check
  const IsStockAdded = user?.watchList?.some((item) => item.symbol === symbol);

  // 2. Fetch data when symbol changes
  useEffect(() => {
    if (symbol) {
      fetchStockDetails(symbol);
    }
    // Component destroy olduğunda (sayfadan çıkınca) veriyi temizle
    return () => {
      clearCurrentStock();
    };
  }, [clearCurrentStock, fetchStockDetails, symbol]);

  const handleWatchlistToggle = async () => {
    if (IsStockAdded) {
      await deleteSymbolFromWatchlist(symbol);
    } else {
      const latest = history.length > 0 ? history[history.length - 1] : null;
      const addPrice = latest ? parseFloat(latest.close) : 0;
      
      await addSymbolToWatchlist({
        type: "Stock",
        symbol,
        addPrice,
        notes: "",
        addedAt: new Date(),
      });
    }
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-xl text-gray-500">{t("stockPage.loadingSymbol", { symbol })}</div>
        </div>
    );
  }

  const latestPriceData = history.length > 0 ? history[history.length - 1] : null;

  return (
    <div className="flex flex-col w-full mx-auto p-4 pt-10 gap-6 pb-20">
      
      <StockHeader 
        profile={profile} 
        latestPrice={latestPriceData}
        isWatchlisted={IsStockAdded}
        onWatchlistToggle={handleWatchlistToggle}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-112.5">
            <StockChart historyData={history} />
        </div>
        <div className="lg:col-span-1 h-full">
            <StockFundamentals profile={profile} />
        </div>
      </div>

      <div className="w-full">
          <StockAbout profile={profile} />
      </div>

    </div>
  );
};