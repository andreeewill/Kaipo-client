import axios from "axios";
import Cookies from "js-cookie";
import useAuthStore from "@/app/store/authStore";

// Get API base URL from environment or use default
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.kaipo.my.id";

// Helper function to get JWT from cookie
const getJWTFromCookie = (): string | null => {
  if (typeof window === "undefined") return null;

  // Try common JWT cookie names
  return (
    Cookies.get("jwt") ||
    Cookies.get("token") ||
    Cookies.get("authToken") ||
    null
  );
};

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include cookies in requests
});

// // Request interceptor to add auth token
// apiClient.interceptors.request.use(
//   (config) => {
//     // Get token from cookie
//     const token = getJWTFromCookie()

//     // Add Authorization header if token exists
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }

//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// // Response interceptor for error handling
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     const { logout } = useAuthStore.getState()

//     // Handle 401 (Unauthorized) - token expired or invalid
//     if (error.response?.status === 401) {
//       // Clear auth state and redirect to login
//       logout()
//       if (typeof window !== 'undefined') {
//         window.location.href = '/login'
//       }
//     }

//     // Handle 403 (Forbidden) - insufficient permissions
//     if (error.response?.status === 403) {
//       console.error('Access denied: Insufficient permissions')
//     }

//     // Handle network errors
//     if (!error.response) {
//       console.error('Network error: Please check your connection')
//     }

//     return Promise.reject(error)
//   }
// )

export default apiClient;
