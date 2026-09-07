import { axiosInstance, getBackendUrl } from "../config/axiosInstance";

export const signup = (data) =>
  axiosInstance.post("/auth/signup", data);

export const login = (data) =>
  axiosInstance.post("/auth/login", data);

export const getMe = () =>
  axiosInstance.get("/auth/me");

// Redirect logic on frontend (Google)
export const googleLogin = () => {
    window.location.href = `${getBackendUrl()}/api/auth/google`;
};
