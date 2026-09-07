import axios from "axios" ;

export const getBackendUrl = () => {
  const envUrl = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, "");
  
  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }
  
  if (import.meta.env.DEV) {
    return "http://localhost:3000";
  }
  
  throw new Error(
    "FATAL CONFIGURATION ERROR: VITE_BACKEND_URL is not set! Please define VITE_BACKEND_URL in your production environment variables."
  );
};

const getApiBaseUrl = () => {
  const backendUrl = getBackendUrl();
  return `${backendUrl}/api`;
};

export const axiosInstance = axios.create({
    baseURL: getApiBaseUrl(),
    withCredentials: true
});

// Add interceptor to attach token to all requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && token !== "undefined" && token !== "null") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token expiration/invalidation
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  }
);