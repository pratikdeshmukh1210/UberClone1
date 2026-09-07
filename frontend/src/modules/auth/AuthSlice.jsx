import { createSlice } from "@reduxjs/toolkit";

const initialToken = localStorage.getItem("token") || null;

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: initialToken,
    isRestoringSession: !!initialToken,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isRestoringSession = false;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      if (action.payload) {
        localStorage.setItem("token", action.payload);
      } else {
        localStorage.removeItem("token");
      }
    },
    finishSessionRestoration: (state) => {
      state.isRestoringSession = false;
    },
    retrySessionRestoration: (state) => {
      state.isRestoringSession = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isRestoringSession = false;
      localStorage.removeItem("token");
    },
  },
});

export const { setUser, logout, setToken, finishSessionRestoration, retrySessionRestoration } = authSlice.actions;
export default authSlice.reducer;
