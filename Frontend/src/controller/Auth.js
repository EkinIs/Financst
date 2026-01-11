import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";

import {
  loginUserApi,
  signupUserApi,
  getUserByIdApi,
} from "../api/authService";

//Import Stock Store to clear its data on logout
import { useStockStore } from "./Stock"; 

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setLogin: (userData, token) =>
        set({
          user: userData,
          token: token,
          isAuthenticated: true,
        }),

      setLogout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
      
      checkSession: () => {
        const { token, setLogout } = get();

        if (!token) return;

        try {
          const decoded = jwtDecode(token);
          const currentTime = Date.now();

          // If token is expired
          if (decoded.exp * 1000 < currentTime) {
            console.log("Token is expired.");
            setLogout();
            // Clear Stock data as well
            useStockStore.getState().resetStore();
          } else {
            console.log("Session is valid.");
          }
        } catch (error) {
          console.error("Invalid token:", error);
          setLogout();
          useStockStore.getState().resetStore();
        }
      },
    }),
    { name: "auth-storage" },
  ),
);

// --- ASYNC FUNCTIONS (Actions) ---

export async function loginUser(credentials) {
  const data = await loginUserApi(credentials);
  
  if (!data.error) {
    // 1. Save user to Auth Store
    useAuthStore.getState().setLogin(data.user, data.token);

    // 2. STOCK PRE-FETCH (Start fetching data before user is redirected)
    console.log("Login successful. Preparing market data...");
    // Force update dashboard data (force=true) because a new login occurred
    useStockStore.getState().fetchDashboardData(true);

    // If the user has a watchlist, fetch its prices as well
    if (data.user.watchList && data.user.watchList.length > 0) {
        useStockStore.getState().fetchWatchlistPrices(data.user.watchList);
    }

    return data;
  }
  return { error: data.error };
}

export async function signupUser(userInfo) {
  const data = await signupUserApi(userInfo);
  if (!data.error) {
    useAuthStore.getState().setLogin(data.user, data.token);
    
    // Also fetch dashboard data on signup (Watchlist is empty but gainers are needed)
    useStockStore.getState().fetchDashboardData(true);
    
    return data;
  }
  return { error: data.error };
}

export async function logoutUser() {
  // 1. Clear Auth information
  useAuthStore.getState().setLogout();
  
  // 2. Clear Stock data (Cache)
  useStockStore.getState().resetStore();
  
  console.log("User logged out and Stock cache cleared.");
  return { message: "User logged out successfully." };
}

export async function getUserById() {
  const userId = useAuthStore.getState().user.id;
  const data = await getUserByIdApi(userId);
  return data;
}