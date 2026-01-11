import axios from "axios";
import { useAuthStore } from "../controller/Auth.js";

const isLocal = window.location.hostname === "localhost";

const apiClient = axios.create({
  baseURL: isLocal
    ? "http://localhost:4000/api"
    : "https://financst.onrender.com/api",

  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const { token } = useAuthStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Eğer sunucudan 401 (Unauthorized) hatası gelirse
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config.url.includes("/auth/login")
    ) {
      // Zustand store dışından erişim yöntemi:
      useAuthStore.getState().setLogout();

      // Kullanıcıyı login sayfasına at
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

//ping to server to check connectivity and show clienttime and servertime for debug
export const pingServer = async () => {
  try {
    const response = await apiClient.get("/ping");
    const serverTime = response.data.serverTime;
    const clientTime = new Date().toISOString();
    console.log(
      `Ping successful! Server time: ${serverTime}, Client time: ${clientTime}`,
    );
  } catch (error) {
    console.error("Ping failed:", error);
  }
};

// Test code ping to server on module load
pingServer();

export default apiClient;
