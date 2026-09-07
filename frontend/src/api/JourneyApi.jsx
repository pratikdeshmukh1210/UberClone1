import { axiosInstance } from "../config/axiosInstance";

// RIDER API
export const createJourney = (data) =>
  axiosInstance.post("/journey/create", data);

export const getRiderHistory = (status = "") =>
  axiosInstance.get(`/journey/rider/history${status ? `?status=${status}` : ""}`);

export const cancelJourney = (journeyId, reason) =>
  axiosInstance.post(`/journey/${journeyId}/cancel`, { reason, cancelledBy: "RIDER" });

export const getPaymentQR = (journeyId) =>
  axiosInstance.get(`/journey/${journeyId}/payment-qr`);

export const confirmPayment = (journeyId) =>
  axiosInstance.post(`/journey/${journeyId}/confirm-payment`);

export const getAvailableJourneys = () =>
  axiosInstance.get("/journey/available");

// DRIVER API (Some in DriverApi.jsx, but these are journey specifics)
export const acceptJourney = (journeyId) =>
  axiosInstance.post(`/journey/${journeyId}/accept`);

export const updateJourneyStatus = (journeyId, status) =>
  axiosInstance.patch(`/journey/${journeyId}/status`, { status });

export const completeJourney = (journeyId, completionData) =>
  axiosInstance.post(`/journey/${journeyId}/complete`, completionData);

export const getDriverHistory = (status = "") =>
  axiosInstance.get(`/journey/driver/history${status ? `?status=${status}` : ""}`);

// SHARED
export const getJourneyById = (journeyId) =>
  axiosInstance.get(`/journey/${journeyId}`);
