import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// API
import { 
  getTopGainersApi, 
  getMarketNewsApi, 
  getStockProfileApi, 
  getStockHistoryApi 
} from "../api/stockService";

// Initial State
const initialState = {
  // 1. Dashboard Data (Cached)
  marketData: {
    topGainers: [],
    news: [],
    lastUpdated: null,
  },
  
  // 2. Watchlist Prices (Cached)
  watchlistPrices: {}, 
  lastWatchlistUpdated: null,

  // 3. Selected Stock (Not Cached)
  currentStock: {
    symbol: null,
    profile: null,
    history: [],
    loading: false,
    error: null,
  },
};

export const useStockStore = create(
  persist(
    (set, get) => ({
      ...initialState, // Load initial values

      // --- ACTIONS ---

      // A. Fetch Dashboard Data (Gainers + News)
      fetchDashboardData: async (forceUpdate = false) => {
        const { marketData } = get();
        const now = Date.now();
        const CACHE_DURATION = 5 * 60 * 1000; // 5 Minute Cache
        // If data is fresh and no force update, do not fetch
        if (
          !forceUpdate && 
          marketData.lastUpdated && 
          (now - marketData.lastUpdated < CACHE_DURATION) &&
          marketData.topGainers.length > 0
        ) {
          return; 
        }

        try {
          // Parallel requests (For speed)
          const [gainers, news] = await Promise.all([
            getTopGainersApi(),
            getMarketNewsApi()
          ]);

          set((state) => ({
            marketData: {
              topGainers: gainers.error ? [] : gainers,
              news: news.error ? [] : news,
              lastUpdated: now,
            }
          }));
        } catch (error) {
          console.error("Dashboard fetch error:", error);
        }
      },

      // B. Fetch Watchlist Prices
      fetchWatchlistPrices: async (watchlistItems) => {
        if (!watchlistItems || watchlistItems.length === 0) return;

        const { watchlistPrices, lastWatchlistUpdated } = get();
        const now = Date.now();
        const CACHE_DURATION = 2 * 60 * 1000; // 2 Minute Cache

        // Cache check + Missing stock check
        if (lastWatchlistUpdated && (now - lastWatchlistUpdated < CACHE_DURATION)) {
            const missing = watchlistItems.some(item => !watchlistPrices[item.symbol]);
            if (!missing) return;
        }

        try {
            const promises = watchlistItems.map(async (item) => {
                const history = await getStockHistoryApi(item.symbol, 1);
                if (!history.error && history.length > 0) {
                    const latest = history[history.length - 1]; // Most recent data
                    return { 
                        symbol: item.symbol, 
                        data: { close: parseFloat(latest.close), prev: parseFloat(latest.open) }
                    };
                }
                return null;
            });

            const results = await Promise.all(promises);
            
            const newPrices = { ...watchlistPrices };
            results.forEach(res => {
                if(res) newPrices[res.symbol] = res.data;
            });

            set({
                watchlistPrices: newPrices,
                lastWatchlistUpdated: now
            });
        } catch (error) {
            console.error("Watchlist fetch error:", error);
        }
      },

      // C. Fetch Stock Details
      fetchStockDetails: async (symbol) => {
        set((state) => ({
            currentStock: { ...state.currentStock, loading: true, error: null, symbol }
        }));

        try {
          const [profile, history] = await Promise.all([
            getStockProfileApi(symbol),
            getStockHistoryApi(symbol, 365)
          ]);

          set({
            currentStock: {
              symbol,
              profile: profile.error ? null : profile,
              history: history.error ? [] : history,
              loading: false,
              error: profile.error || history.error || null
            }
          });

        } catch (error) {
          set((state) => ({
            currentStock: { ...state.currentStock, loading: false, error: "Network Error" }
          }));
        }
      },

      // D. Clear Selected Stock (When leaving the page)
      clearCurrentStock: () => {
        set({
            currentStock: initialState.currentStock
        });
      },

      // E. Reset Entire Store (On logout)
      resetStore: () => {
        console.log("Stock Store is being reset (Cache cleared)...");
        set(initialState);
      }
    }),
    {
      name: "stock-storage",
      storage: createJSONStorage(() => localStorage),
      // Only save these fields to localStorage
      partialize: (state) => ({ 
          marketData: state.marketData,
          watchlistPrices: state.watchlistPrices 
      }),
    }
  )
);