import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

export const StockHeader = ({ profile, latestPrice, isWatchlisted, onWatchlistToggle }) => {
  const { t } = useTranslation();
  // Sadece profile yoksa null dön, fiyat yoksa devam et
  if (!profile) return null;

  // Güvenli veri erişimi (Optional Chaining ve Default Values)
  const price = latestPrice ? parseFloat(latestPrice.close) : 0;
  const openPrice = latestPrice ? parseFloat(latestPrice.open) : 0;
  
  // Değişim hesaplama
  const diff = price - openPrice;
  const percent = openPrice !== 0 ? ((diff / openPrice) * 100).toFixed(2) : "0.00";
  const isPositive = diff >= 0;

  return (
    <div className="bg-white dark:bg-midnight-light p-6 rounded-2xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      {/* Sol: İsim ve Sembol */}
      <div>
        <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{profile.symbol}</h1>
            <span className="bg-gray-100 dark:bg-neutral-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded text-sm font-semibold">
                {profile.sector || "Unknown Sector"}
            </span>
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">{profile.name}</p>
      </div>

      {/* Orta: Fiyat (Veri yoksa çizgi göster) */}
      <div className="flex items-end gap-3">
        <span className="text-4xl font-bold text-gray-900 dark:text-white">
            {latestPrice ? `$${price.toFixed(2)}` : "--"}
        </span>
        
        {latestPrice && (
          <div className={`flex items-center gap-1 mb-1.5 font-bold text-lg ${isPositive ? "text-green-500" : "text-red-500"}`}>
              {isPositive ? <FaArrowTrendUp /> : <FaArrowTrendDown />}
              <span>{percent}%</span>
          </div>
        )}
      </div>

      {/* Sağ: Watchlist Butonu */}
      <button 
        onClick={onWatchlistToggle}
        className="flex items-center gap-2 px-4 py-2 rounded-xl transition-colors bg-gray-50 dark:bg-midnight-lighter hover:bg-gray-100 dark:hover:bg-neutral-700"
      >
        <div className="text-blue-600 dark:text-blue-400">
            {isWatchlisted ? <ImCheckboxChecked size={20} /> : <ImCheckboxUnchecked size={20} />}
        </div>
        <span className="font-semibold text-gray-700 dark:text-gray-300">
            {isWatchlisted ? t('stockPage.inWatchlist') : t('stockPage.addToWatchlist')}
        </span>
      </button>
    </div>
  );
};