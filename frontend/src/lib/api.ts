import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

if (typeof window !== "undefined") {
  api.interceptors.request.use((config) => {
    const token = window.localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Don't retry refresh endpoint or if already retried
      if (
        originalRequest.url?.includes("/auth/v1/refresh") ||
        originalRequest._retry
      ) {
        return Promise.reject(error);
      }

      if (
        error.response?.status === 401 &&
        originalRequest.headers.Authorization
      ) {
        // Only attempt refresh if a token was sent (i.e., token exists but is invalid/expired)
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const refreshResponse = await api.post("/auth/v1/refresh");
            const accessToken = refreshResponse.data?.data?.accessToken;
            if (accessToken) {
              window.localStorage.setItem("accessToken", accessToken);
              refreshPromise = Promise.resolve(accessToken);
            } else {
              throw new Error("No access token in refresh response");
            }
          } catch {
            window.localStorage.removeItem("accessToken");
            window.location.href = "/auth/login";
            refreshPromise = Promise.resolve(null);
          } finally {
            isRefreshing = false;
          }
        }

        // Wait for refresh to complete
        if (refreshPromise) {
          const token = await refreshPromise;
          if (token) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          } else {
            return Promise.reject(error);
          }
        }
      }

      return Promise.reject(error);
    },
  );
}

export const apiClient = {
  register: (payload: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => api.post("/auth/v1/register", payload),
  login: (payload: { email: string; password: string }) =>
    api.post("/auth/v1/login", payload),
  getProfile: () => api.get("/auth/v1/me"),
  updateProfile: (payload: Record<string, unknown>) =>
    api.patch("/auth/v1/me", payload),
  logout: () => api.post("/auth/v1/logout"),
  getTransactions: (params: Record<string, unknown>) =>
    api.get("/transactions/v1", { params }),
  createTransaction: (payload: Record<string, unknown>) =>
    api.post("/transactions/v1", payload),
  updateTransaction: (id: string, payload: Record<string, unknown>) =>
    api.patch(`/transactions/v1/${id}`, payload),
  deleteTransaction: (id: string) => api.delete(`/transactions/v1/${id}`),
  getBudgets: () => api.get("/budgets/v1"),
  createBudget: (payload: Record<string, unknown>) =>
    api.post("/budgets/v1", payload),
  updateBudget: (id: string, payload: Record<string, unknown>) =>
    api.patch(`/budgets/v1/${id}`, payload),
  deleteBudget: (id: string) => api.delete(`/budgets/v1/${id}`),
  getCategories: (params?: Record<string, unknown>) =>
    api.get("/categories/v1", { params }),
  createCategory: (payload: Record<string, unknown>) =>
    api.post("/categories/v1", payload),
  updateCategory: (id: string, payload: Record<string, unknown>) =>
    api.patch(`/categories/v1/${id}`, payload),
  deleteCategory: (id: string) => api.delete(`/categories/v1/${id}`),
  getSavingsGoals: () => api.get("/savings-goals/v1"),
  createSavingsGoal: (payload: Record<string, unknown>) =>
    api.post("/savings-goals/v1", payload),
  updateSavingsGoal: (id: string, payload: Record<string, unknown>) =>
    api.patch(`/savings-goals/v1/${id}`, payload),
  deleteSavingsGoal: (id: string) => api.delete(`/savings-goals/v1/${id}`),
};
