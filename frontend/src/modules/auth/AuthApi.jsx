import { axiosInstance } from "../config/axiosInstance";

export const signup = (data) =>
  axiosInstance.post("/auth/signup", data);

export const login = (data) =>
  axiosInstance.post("/auth/login", data);

export const getMe = () =>
  axiosInstance.get("/auth/me");

const getBackendUrl = () => {
    if (import.meta.env.VITE_BACKEND_URL) {
        return import.meta.env.VITE_BACKEND_URL.replace(/\/$/, "");
    }
    if (import.meta.env.VITE_API_BASE_URL) {
        return import.meta.env.VITE_API_BASE_URL.replace(/\/api\/?$/, "");
    }
    if (import.meta.env.DEV) {
        return "http://localhost:3000";
    }
    return window.location.origin;
};

export const googleLogin = () => {
    window.location.href = `${getBackendUrl()}/api/auth/google`;
};
