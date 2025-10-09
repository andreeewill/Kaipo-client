import axios from "axios";

// Get API base URL and token from environment or use defaults
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.kaipo.my.id";

const API_TOKEN = 
  process.env.NEXT_PUBLIC_API_TOKEN || 
  "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjY4SEc4dUVVSmlVbUpaY1ZZYXVkbG8xdE1NTEZIMGtNb0JTVl9ic25ONDQifQ.eyJzdWIiOiI2Y2JhMTAyMS0yOWNlLTQxNTAtODg1MS0wMTgwMTc4YjBhZGQiLCJpYXQiOjE3NTk1NjU2OTMsImV4cCI6MTc1OTU2OTI5MywiaXNzIjoiaHR0cHM6Ly9hcGkua2FpcG8ubXkuaWQiLCJyb2xlIjpbXSwic2NvcGVzIjpbImFwaTphY2Nlc3MiXSwib3JnYW5pemF0aW9uSWQiOiJvcmdfV2RNM2tIdnVVQXBhUUNFaSJ9.fUtj9ACTIdnXN-jLE0ILlBSlrTQCtsScJ1xlmWPGd7sKp_mJGK-u4DSrxY85uujK4eD79WNs0UCFhso-owwAyVuVF3ctGREJda3Cwk_kEUW9bpBFAv_nbGGxBcZKL2RdnFmsnC4lLhXGUBe8wuU1wE1taTpA40PzVWiLpknmh5mCeu6_ar0sXbV8evYesXDb89-yEV6xRFkv9iYe_6ZkQSFhj2QCQ1LyPX_6qQ7g2CWsKaObBuIRTgTdFLBKq9HU_ea1JhKiJIZ7-p_4HtFQjeqRdSGeE8_qO9A2mQ5yLkYwe3hWWqeM659Dw1ZtJudASei9Qsx1nL0DLbQHRAurJQ";

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${API_TOKEN}`,
  },
  // withCredentials: true, // Include cookies in requests
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
