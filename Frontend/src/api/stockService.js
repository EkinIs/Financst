import apiClient from "./apiClient";

// --- GENERAL LIST & SEARCH ---

// Tüm hisse listesini getirir (Arama ve Listeleme için)
export const getStocksListApi = async () => {
  try {
    const response = await apiClient.get("/stocks/list");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// --- DASHBOARD APIs (ANA SAYFA) ---

// En çok yükselenler
export const getTopGainersApi = async () => {
  try {
    const response = await apiClient.get("/stocks/dashboard/gainers");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// En çok düşenler
export const getTopLosersApi = async () => {
  try {
    const response = await apiClient.get("/stocks/dashboard/losers");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// En hareketliler (Hacim)
export const getMostActiveApi = async () => {
  try {
    const response = await apiClient.get("/stocks/dashboard/active");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Sektör Performansı
export const getSectorPerformanceApi = async () => {
  try {
    const response = await apiClient.get("/stocks/dashboard/sectors");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Yaklaşan Bilançolar
export const getUpcomingEarningsApi = async () => {
  try {
    const response = await apiClient.get("/stocks/dashboard/earnings");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Genel Piyasa Haberleri
export const getMarketNewsApi = async () => {
  try {
    const response = await apiClient.get("/stocks/news/market");
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// --- STOCK DETAIL APIs (HİSSE DETAY SAYFASI) ---

// Şirket Profili (Bio, Market Cap vb.)
export const getStockProfileApi = async (symbol) => {
  try {
    const response = await apiClient.get(`/stocks/${symbol}/profile`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Finansal Özet (Gelir Tablosu)
export const getStockFinancialsApi = async (symbol) => {
  try {
    const response = await apiClient.get(`/stocks/${symbol}/financials`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Hisseye Özel Haberler
export const getStockNewsApi = async (symbol) => {
  try {
    const response = await apiClient.get(`/stocks/${symbol}/news`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// Grafik Verisi (OHLCV)
export const getStockHistoryApi = async (symbol, days) => {
  try {
    const response = await apiClient.get(`/stocks/${symbol}/history/${days}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

// --- HELPER ---

// Hata yönetimi tekrarını önlemek için yardımcı fonksiyon
const handleApiError = (error) => {
  if (error.response && error.response.data) {
    return { error: error.response.data.error };
  }
  return { error: "Network error" };
};