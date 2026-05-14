import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

// Request interceptor - inject token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("sw_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - handle errors and token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    // Handle 401 - token expired or invalid
    if (response?.status === 401) {
      localStorage.removeItem("sw_token");
      localStorage.removeItem("sw_user");
      window.location.href = "/login?error=session_expired";
    }

    // Handle 429 - rate limited
    if (response?.status === 429) {
      console.warn("Rate limited - please try again later");
    }

    // Handle 403 - forbidden/account deactivated
    if (response?.status === 403) {
      localStorage.removeItem("sw_token");
      localStorage.removeItem("sw_user");
      window.location.href = "/login?error=account_deactivated";
    }

    // Return error with better message
    const errorMsg =
      response?.data?.error || error.message || "Something went wrong";
    return Promise.reject({
      status: response?.status,
      message: errorMsg,
      details: response?.data?.details,
      originalError: error,
    });
  },
);

export default api;
