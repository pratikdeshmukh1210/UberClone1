import { axiosInstance } from "../config/axiosInstance";

export const signup = (data) =>
  axiosInstance.post("/auth/signup", data);

export const login = (data) =>
  axiosInstance.post("/auth/login", data);

export const getMe = () =>
  axiosInstance.get("/auth/me");

// Redirect logic on frontend (Google)
export const googleLogin = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    window.location.href = `${backendUrl}/api/auth/google`;
};
