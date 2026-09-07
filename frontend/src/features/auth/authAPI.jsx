import { axiosInstance } from "../../services/axiosInstance";

export const loginUser = (data) =>
  axiosInstance.post("/auth/login", data);

export const registerUser = (data) =>
  axiosInstance.post("/auth/signup", data);