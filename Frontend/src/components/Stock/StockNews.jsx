import { useTranslation } from "react-i18next";

export const StockNews = ({ news = [] }) => {
    const { t } = useTranslation();

    if(!news.length) return null;

    return (
        <div className="bg-white dark:bg-midnight-light p-6 rounded-2xl shadow-md h-full flex flex-col">
             <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white shrink-0">
                {t('stockPage.news')}
             </h3>
             
             {/* Scrollable Container */}
             <div className="grow overflow-y-auto pr-2 custom-scrollbar min-h-100 max-h-100">
                <div className="space-y-4">
                    {news.map((item, index) => (
                        <a key={index} href={item.link} target="_blank" rel="noopener noreferrer" className="block group p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors">
                            <h4 className="font-semibold text-gray-800 dark:text-gray-200 group-hover:text-blue-500 transition-colors text-sm mb-2 leading-snug">
                                {item.title}
                            </h4>
                            <div className="flex items-center justify-between text-xs text-gray-400">
                                <span className="font-medium bg-gray-100 dark:bg-neutral-700 px-2 py-0.5 rounded text-gray-600 dark:text-gray-300">
                                    {item.publisher}
                                </span>
                                <span>{new Date(item.report_date).toLocaleDateString()}</span>
                            </div>
                        </a>
                    ))}
                </div>
             </div>
        </div>
    )
}