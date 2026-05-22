import axios from "axios";

const AUTH_PATH = "/auth";
const AUTH_API_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
];

const getNextUrl = () => {
  
  // check if we are in a browser
  if (typeof window === "undefined") return "";

  // construct the full path including query and hash
  // e.g. /dashboard?tab=profile#section2
  // we want to ensure the user is redirected back to the exact page they were on after login
  const { pathname, search, hash } = window.location;
  return `${pathname}${search}${hash}`;
};

// authcontext will use this function to determine where to redirect after login/register
// it ensures we only redirect to safe internal paths and prevents open redirect vulnerabilities
const buildAuthRedirectUrl = () => {
  const nextUrl = getNextUrl();
  if (!nextUrl) return AUTH_PATH;

  const params = new URLSearchParams();
  params.set("next", nextUrl);
  return `${AUTH_PATH}?${params.toString()}`;
};

const api = axios.create({
  // use environment variable for API URL, fallback to localhost for development
  // json content type is used for all requests by default
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  // if we are in a browser, attach the token from localStorage to the Authorization header
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error?.response?.status === 401) {
      const reqUrl = error?.config?.url || "";
      const authPath = window.location.pathname.startsWith(AUTH_PATH);
      const authApiCall = AUTH_API_PATHS.some((path) => reqUrl.includes(path));

      if (!authPath && !authApiCall) {
        // Clear token and redirect to login page with next param 
        // to return to the current page after successful login
        localStorage.removeItem("token");
        window.location.assign(buildAuthRedirectUrl());
      }
    }
    return Promise.reject(error);
  },
);

export default api;
