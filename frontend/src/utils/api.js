// src/utils/api.js
import axios from "axios";

// Ensure the base URL always has a trailing slash for correct Axios routing
let backendUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
if (!backendUrl.endsWith('/')) {
    backendUrl += '/';
}

// Create Axios instance with production-ready configuration
const api = axios.create({
  // Base URL from environment or fallback to localhost
  baseURL: backendUrl,
  // CRITICAL: Request timeout to prevent hanging forever
   // Set to 60 seconds for AI simulations (longer operations can take time)
   timeout: 60000, // 60 seconds in milliseconds
   
   // Allow cookies for cross-domain authenticated requests
   withCredentials: true,
});

// Request Interceptor: Attach authentication token and log requests
api.interceptors.request.use(config => {
  const token = localStorage.getItem("token");
  if (token) {
    // Include token in Authorization header for protected routes
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Log request in development mode only
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📡 API Request: ${config.method?.toUpperCase()} ${config.url}`);
  }
  
  return config;
}, error => {
  // If request setup fails, reject the promise
  console.error("Request setup error:", error);
  return Promise.reject(error);
});

// Response Interceptor: Handle errors, expired tokens, and timeouts
api.interceptors.response.use(
  response => {
    // If we got a successful response, just pass it through
    return response;
  },
  error => {
    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      console.error("⏱️ Request timeout - server took too long to respond");
      return Promise.reject(new Error(
        "Request timeout - the server is not responding. Please check your connection or try again."
      ));
    }
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      console.warn("🔐 Authentication token expired - redirecting to login");
      localStorage.removeItem("token");
      // Give user a moment to see the error before redirecting
      setTimeout(() => {
        window.location.href = "/";
      }, 500);
      return Promise.reject(new Error("Your session has expired. Please log in again."));
    }
    
    // Handle authorization errors
    if (error.response?.status === 403) {
      console.error("🚫 Access denied - insufficient permissions");
      return Promise.reject(new Error("Access denied - you don't have permission for this action"));
    }
    
    // Handle server errors
    if (error.response?.status === 500) {
      console.error("⚠️ Server error - backend encountered an error");
      return Promise.reject(new Error("Server error - please try again later"));
    }
    
    // Handle network errors (no response received)
    if (!error.response) {
      console.error("📡 Network error - unable to reach server");
      return Promise.reject(new Error(
        "Network error - unable to reach the server. Check your internet connection and try again."
      ));
    }
    
    // Return other errors as-is for specific handling
    return Promise.reject(error);
  }
);

export default api;