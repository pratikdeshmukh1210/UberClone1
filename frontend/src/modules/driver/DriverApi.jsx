import { axiosInstance } from "../config/axiosInstance";

export const registerDriver = (data) =>
  axiosInstance.post("/driver/register", data);

export const getDriverCompletionStatus = () =>
  axiosInstance.get("/driver/me/completion");

export const updateDriverStatus = (isOnline) =>
  axiosInstance.patch("/driver/me/status", { isOnline }); // Corrected to match backend expectation

export const getDriverProfile = () =>
  axiosInstance.get("/driver/me");

export const updateDriverProfile = (data) =>
  axiosInstance.patch("/driver/me", data);
