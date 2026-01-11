import { useAuthStore } from "./Auth";

import {
  updateUserApi,
  deleteUserApi,
  addSymbolToWatchlistApi,
  deleteSymbolFromWatchlistApi,
} from "../api/authService";

// Update current user, send updates as parameter returns updated user data
// Example for updateCurrentUser
export async function updateCurrentUser(updates) {
  const { user, token, setLogin } = useAuthStore.getState();

  // SAFETY CHECK
  if (!user || !user.id) {
    return { error: "User is not authenticated" };
  }

  const data = await updateUserApi(user.id, updates);

  if (!data.error) {
    // Re-save the updated user data to the store
    setLogin(data.user, token);
  }
  return data;
}

export async function deleteCurrentUser() {
  const { user, setLogout } = useAuthStore.getState();

  if (!user || !user.id) {
    return { error: "User is not authenticated" };
  }

  const data = await deleteUserApi(user.id);

  if (!data.error) {
    setLogout();
    return data;
  }
  return { error: data.error };
}

export async function addSymbolToWatchlist(watchlistItem) {
  const { user } = useAuthStore.getState();

  if (!user || !user.id) {
    console.log(user);
    return { error: "User is not authenticated Symbol not added" };
  }

  const data = await addSymbolToWatchlistApi(user.id, watchlistItem);

  if (!data.error) {
    useAuthStore.getState().setLogin(data.user, useAuthStore.getState().token);
  }
  return data;
}

export async function deleteSymbolFromWatchlist(symbol) {
  const { user } = useAuthStore.getState();

  if (!user || !user.id) {
    console.log(user);
    return { error: "User is not authenticated Symbol not deleted" };
  }

  const data = await deleteSymbolFromWatchlistApi(user.id, symbol);

  if (!data.error) {
    useAuthStore.getState().setLogin(data.user, useAuthStore.getState().token);
  }
  return data;
}
