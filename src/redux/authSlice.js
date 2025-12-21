import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Load initial user from local storage if available
  currentUser: localStorage.getItem("user") 
    ? JSON.parse(localStorage.getItem("user")) 
    : null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
      state.error = null;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    
    // --- LOGOUT REDUCER ---
    logout: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("user");
      // Note: Since you use httpOnly cookies for tokens, these might be redundant 
      // but good to keep if you ever switch to localStorage tokens.
      localStorage.removeItem("accessToken"); 
      localStorage.removeItem("refreshToken");
    },

    // --- SYNC FAVORITES REDUCER ---
    updateUserFavorites: (state, action) => {
      if (state.currentUser) {
        state.currentUser.favItems = action.payload;
        localStorage.setItem("user", JSON.stringify(state.currentUser));
      }
    },

    // --- NEW: GENERIC USER UPDATE REDUCER ---
    // Use this when adding Addresses, updating Profile, or changing Delivery Status
    updateUserData: (state, action) => {
      if (state.currentUser) {
        // Merge existing user data with the new changes
        state.currentUser = { ...state.currentUser, ...action.payload };
        // Sync with Local Storage
        localStorage.setItem("user", JSON.stringify(state.currentUser));
      }
    },
  },
});

export const { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  logout, 
  updateUserFavorites,
  updateUserData // Export the new action
} = authSlice.actions;

export default authSlice.reducer;