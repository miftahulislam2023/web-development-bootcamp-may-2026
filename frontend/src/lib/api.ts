// src/lib/api.ts
import axios, { AxiosInstance, AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3030";

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    requestId?: string;
    timestamp?: string;
    pagination?: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

interface DecodedToken {
  sub: string;
  iat: number;
  exp: number;
}

class ApiClient {
  private client: AxiosInstance;
  private accessToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true, // Send cookies for refresh token
    });

    // Load token from localStorage on init
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("accessToken");
    }

    // Add auth interceptor
    this.client.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error),
    );

    // Add response interceptor for token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const response = await this.client.post("/auth/v1/refresh");
            const newToken = response.data.data.accessToken;
            this.setAccessToken(newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch {
            // Refresh failed, logout user
            this.clearTokens();
            window.location.href = "/auth/login";
          }
        }
        return Promise.reject(error);
      },
    );
  }

  setAccessToken(token: string) {
    this.accessToken = token;
    localStorage.setItem("accessToken", token);
  }

  clearTokens() {
    this.accessToken = null;
    localStorage.removeItem("accessToken");
  }

  getAccessToken() {
    return this.accessToken;
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  // Auth endpoints
  async register(
    email: string,
    firstName: string,
    lastName: string,
    password: string,
  ) {
    const response = await this.client.post<ApiResponse>("/auth/v1/register", {
      email,
      firstName,
      lastName,
      password,
    });
    return response.data;
  }

  async login(email: string, password: string) {
    const response = await this.client.post<ApiResponse>("/auth/v1/login", {
      email,
      password,
    });
    if (response.data.data?.accessToken) {
      this.setAccessToken(response.data.data.accessToken);
    }
    return response.data;
  }

  async getProfile() {
    const response = await this.client.get<ApiResponse>("/auth/v1/me");
    return response.data;
  }

  async updateProfile(data: Record<string, any>) {
    const response = await this.client.patch<ApiResponse>("/auth/v1/me", data);
    return response.data;
  }

  async logout() {
    try {
      await this.client.post<ApiResponse>("/auth/v1/logout");
    } finally {
      this.clearTokens();
    }
  }

  // Transaction endpoints
  async createTransaction(data: Record<string, any>) {
    const response = await this.client.post<ApiResponse>(
      "/transactions/v1",
      data,
    );
    return response.data;
  }

  async getTransactions(
    page = 1,
    pageSize = 20,
    filters?: Record<string, any>,
  ) {
    const response = await this.client.get<ApiResponse>("/transactions/v1", {
      params: { page, pageSize, ...filters },
    });
    return response.data;
  }

  async getTransaction(id: string) {
    const response = await this.client.get<ApiResponse>(
      `/transactions/v1/${id}`,
    );
    return response.data;
  }

  async updateTransaction(id: string, data: Record<string, any>) {
    const response = await this.client.patch<ApiResponse>(
      `/transactions/v1/${id}`,
      data,
    );
    return response.data;
  }

  async deleteTransaction(id: string) {
    const response = await this.client.delete<ApiResponse>(
      `/transactions/v1/${id}`,
    );
    return response.data;
  }

  async getTransactionSummary(startDate?: string, endDate?: string) {
    const response = await this.client.get<ApiResponse>(
      "/transactions/v1/summary",
      {
        params: { startDate, endDate },
      },
    );
    return response.data;
  }

  // Category endpoints
  async createCategory(data: Record<string, any>) {
    const response = await this.client.post<ApiResponse>(
      "/categories/v1",
      data,
    );
    return response.data;
  }

  async getCategories(type?: string) {
    const response = await this.client.get<ApiResponse>("/categories/v1", {
      params: type ? { type } : {},
    });
    return response.data;
  }

  // Budget endpoints
  async createBudget(data: Record<string, any>) {
    const response = await this.client.post<ApiResponse>("/budgets/v1", data);
    return response.data;
  }

  async getBudgets() {
    const response = await this.client.get<ApiResponse>("/budgets/v1");
    return response.data;
  }

  async getBudget(id: string) {
    const response = await this.client.get<ApiResponse>(`/budgets/v1/${id}`);
    return response.data;
  }

  async updateBudget(id: string, data: Record<string, any>) {
    const response = await this.client.patch<ApiResponse>(
      `/budgets/v1/${id}`,
      data,
    );
    return response.data;
  }

  async deleteBudget(id: string) {
    const response = await this.client.delete<ApiResponse>(`/budgets/v1/${id}`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
export type { ApiResponse };
