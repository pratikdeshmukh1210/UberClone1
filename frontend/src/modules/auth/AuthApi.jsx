import { axiosInstance } from "../config/axiosInstance";

export const signup = (data) =>
  axiosInstance.post("/auth/signup", data);

export const login = (data) =>
  axiosInstance.post("/auth/login", data);

export const getMe = () =>
  axiosInstance.get("/auth/me");

export const googleLogin = () => {
    window.location.href = "http://localhost:3000/api/auth/google";
};
