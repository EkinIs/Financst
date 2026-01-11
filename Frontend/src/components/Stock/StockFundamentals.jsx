import { useTranslation } from "react-i18next";

const StatItem = ({ label, value }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-neutral-800 last:border-0">
    <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">{label}</span>
    <span className="text-gray-900 dark:text-gray-200 font-bold text-sm">{value || "-"}</span>
  </div>
);

export const StockFundamentals = ({ profile }) => {
  const { t } = useTranslation();

  if (!profile) return null;

  const formatNumber = (num) => {
    if (!num) return "-";
    return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(num);
  };

  return (
    <div className="bg-white dark:bg-midnight-light p-6 rounded-2xl shadow-md h-full flex flex-col">
      <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">{t('stockPage.fundamentals.title')}</h3>
      
      <div className="flex flex-col grow">
        <StatItem label={t('stockPage.fundamentals.marketCap')} value={profile.market_cap ? `$${formatNumber(profile.market_cap)}` : null} />
        <StatItem label={t('stockPage.fundamentals.peRatio')} value={profile.trailing_pe} />
        <StatItem label={t('stockPage.fundamentals.beta')} value={profile.beta} />
        <StatItem label={t('stockPage.fundamentals.employees')} value={profile.full_time_employees?.toLocaleString()} />
        <StatItem label={t('stockPage.fundamentals.industry')} value={profile.industry} />
        <StatItem label={t('stockPage.fundamentals.location')} value={profile.city ? `${profile.city}, ${profile.country}` : null} />
      </div>
    </div>
  );
};