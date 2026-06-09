// src/utils/api.js
import axios from "axios";

let backendUrl =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// CHANGED: If it does NOT end with a slash, add one!
if (!backendUrl.endsWith("/")) {
  backendUrl += "/";
}

const api = axios.create({
  baseURL: backendUrl,
  timeout: 60000,
  withCredentials: false,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (import.meta.env.DEV) {
      console.log(
        `📡 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`
      );
    }

    return config;
  },
  (error) => {
    console.error("Request setup error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      return Promise.reject(
        new Error(
          "Request timeout - the server took too long to respond."
        )
      );
    }

    if (error.response?.status === 401) {
      localStorage.removeItem("token");

      setTimeout(() => {
        window.location.href = "/";
      }, 500);

      return Promise.reject(
        new Error("Your session has expired. Please log in again.")
      );
    }

    if (error.response?.status === 403) {
      return Promise.reject(
        new Error("Access denied.")
      );
    }

    if (error.response?.status === 500) {
      return Promise.reject(
        new Error("Server error. Please try again later.")
      );
    }

    if (!error.response) {
      return Promise.reject(
        new Error(
          "Unable to reach the server. Check your internet connection."
        )
      );
    }

    return Promise.reject(error);
  }
);

export default api;