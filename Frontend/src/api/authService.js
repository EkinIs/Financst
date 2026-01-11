import apiClient from "./apiClient";

// This api service handles user authentication requests

// send credentials as { email: '', password: '' }
// get current user info {
//  id: '', name: '', surname: '', email: '', watchList: [] }
// watchlist items are stored as { type: '', symbol: '', addPrice: '', addedAt: '', notes: '' }
export const loginUserApi = async (credentials) => {
  try {
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return { error: error.response.data.error };
    }
    return { error: "Network error" };
  }
};

// send user info as { name: '', surname: '', email: '', password: '' }
// get created user info { id: '', name: '', email: '' }
export const signupUserApi = async (userInfo) => {
  try {
    const response = await apiClient.post("/auth/signup", userInfo);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return { error: error.response.data.error };
    }
    return { error: "Network error" };
  }
};

// Google OAuth login
// send Google credential token OR access token, returns user info and JWT token
// input can be { credential: '...' } OR { accessToken: '...' }
export const googleLogin = async (data) => {
  try {
    // If input is a string, assume it's a credential (legacy/component support) - though standard now is object
    // If input is object, just pass it.
    const payload = typeof data === "string" ? { credential: data } : data;

    const response = await apiClient.post("/auth/google-login", payload);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return { error: error.response.data.error };
    }
    return { error: "Network error" };
  }
};

// Get user by ID send userId as parameter returns user data
export const getUserByIdApi = async (userId) => {
  try {
    const response = await apiClient.get(`/user/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return { error: error.response.data.error };
    }
    return { error: "Network error" };
  }
};

// Update user by ID, send userId and updates as parameters returns updated user data
export const updateUserApi = async (userId, updates) => {
  try {
    const response = await apiClient.put(`/user/${userId}`, updates);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return { error: error.response.data.error };
    }
    return { error: "Network error" };
  }
};

// Delete user by ID, send userId as parameter returns success message
export const deleteUserApi = async (userId) => {
  try {
    const response = await apiClient.delete(`/user/${userId}`);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return { error: error.response.data.error };
    }
    return { error: "Network error" };
  }
};

export const addSymbolToWatchlistApi = async (userId, watchlistItem) => {
  try {
    const response = await apiClient.post(
      `/user/${userId}/watchlist`,
      watchlistItem,
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return { error: error.response.data.error };
    }
    return { error: "Network error" };
  }
};

export const deleteSymbolFromWatchlistApi = async (userId, symbol) => {
  try {
    const response = await apiClient.delete(
      `/user/${userId}/watchlist`,
      { data: { symbol } },
    );
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return { error: error.response.data.error };
    }
    return { error: "Network error" };
  }
};
export const forgotPasswordApi = async (email) => {
  try {
    const response = await apiClient.post("/auth/forgot-password", { email });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return { error: error.response.data.error };
    }
    return { error: "Network error" };
  }
};

export const resetPasswordApi = async (token, newPassword) => {
  try {
    const response = await apiClient.post(`/auth/reset-password/${token}`, { password: newPassword });
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      return { error: error.response.data.error };
    }
    return { error: "Network error" };
  }
};