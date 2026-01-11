import React from "react";
import { useTranslation } from "react-i18next";

export const StockAbout = ({ profile }) => {
  const { t } = useTranslation();

  if (!profile || !profile.long_business_summary) return null;

  return (
    <div className="bg-white dark:bg-midnight-light p-6 rounded-2xl shadow-md w-full">
      <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
        {t('stockPage.about', { name: profile.name || profile.symbol })}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
        {profile.long_business_summary}
      </p>
    </div>
  );
};