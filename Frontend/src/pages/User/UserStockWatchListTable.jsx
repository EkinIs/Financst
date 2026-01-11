import { useState } from "react";
import { GoArrowUpRight, GoArrowDownRight, GoTrash, GoLinkExternal, GoAlert } from "react-icons/go";
import { useTranslation } from "react-i18next";
import { deleteSymbolFromWatchlist } from "../../controller/User";

// --- DELETE MODAL ---
const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, symbol }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-midnight-light rounded-2xl shadow-2xl w-full max-w-sm border border-gray-200 dark:border-neutral-700">
        <div className="p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
            <GoAlert className="h-6 w-6 text-red-600 dark:text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Delete {symbol}?</h3>
          <div className="flex justify-center gap-3 mt-6">
            <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
            <button onClick={onConfirm} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700">Delete</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- TABLE COMPONENT ---
export const WatchListTable = ({ data, onRowClick }) => {
  const { t } = useTranslation();
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // HANDLERS

  const handleDeleteClick = (e, symbol) => {
    e.stopPropagation();
    setItemToDelete(symbol);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      await deleteSymbolFromWatchlist(itemToDelete);
      setDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };

  // BOŞ DURUM: Yüksekliği koru ki layout bozulmasın
  if (!data || data.length === 0) {
    return (
      <div className="bg-white dark:bg-midnight-light rounded-2xl border border-gray-200 dark:border-neutral-800 h-[600px] flex items-center justify-center text-center text-gray-500 text-sm p-10">
        <div className="flex flex-col items-center gap-2">
            <span className="text-4xl opacity-20">📊</span>
            <p>{t("watchlist.empty")}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white dark:bg-midnight-light rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-hidden flex flex-col shadow-sm h-125"> {/* Sabit Yükseklik */}
          
          {/* Header */}
          <div className="bg-gray-50 dark:bg-neutral-800/50 border-b border-gray-100 dark:border-neutral-800 pr-2"> {/* pr-2 scrollbar payı */}
              <table className="w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase w-[35%]">{t("watchlist.headers.symbol")}</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase w-[40%]">{t("watchlist.headers.currentPrice")}</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase w-[25%]">{t("watchlist.headers.action")}</th>
                    </tr>
                  </thead>
              </table>
          </div>

          {/* Only Body Scrolls */}
          <div className="overflow-y-auto grow custom-scrollbar">
            <table className="w-full">
              <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                {data.map((row) => {
                  const currentPrice = row.currentPrice || 0;
                  const addPrice = parseFloat(row.addPrice) || 0;
                  const change = currentPrice - addPrice;
                  const changePercent = addPrice !== 0 ? (change / addPrice) * 100 : 0;
                  const isPositive = change >= 0;

                  return (
                    <tr
                      key={row.symbol}
                      onClick={() => onRowClick(row.symbol)}
                      className="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-neutral-800/60 border-l-4 border-transparent hover:border-blue-500 group"
                    >
                      <td className="px-4 py-3 w-[35%]">
                        <div className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{row.symbol}</div>
                        <div className="text-xs text-gray-500">Buy: <span className="font-medium text-gray-700 dark:text-gray-400">${addPrice.toFixed(2)}</span></div>
                      </td>
                      
                      <td className="px-4 py-3 text-right w-[25%]">
                        <div className="font-bold text-gray-800 dark:text-gray-200">
                          {currentPrice > 0 ? `$${currentPrice.toFixed(2)}` : <span className="text-gray-400 text-xs animate-pulse">Updating...</span>}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-right w-[25%]">
                        {currentPrice > 0 && (
                            <>
                                <div className={`flex items-center justify-end gap-1 font-bold ${isPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}>
                                    <span className="text-xs">{isPositive ? "+" : ""}{changePercent.toFixed(1)}%</span>
                                    {isPositive ? <GoArrowUpRight size={12}/> : <GoArrowDownRight size={12}/>}
                                </div>
                                <div className={`text-[10px] opacity-70 ${isPositive ? "text-green-600" : "text-red-600"}`}>
                                    {isPositive ? "+" : ""}{change.toFixed(2)}
                                </div>
                            </>
                        )}
                      </td>

                      <td className="px-2 py-3 w-[15%]">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={(e) => handleDeleteClick(e, row.symbol)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg" title="Delete">
                            <GoTrash size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
      </div>
      <DeleteConfirmModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={confirmDelete} symbol={itemToDelete} />
    </>
  );
};