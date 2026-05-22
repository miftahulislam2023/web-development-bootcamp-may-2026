/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
const API_URL = import.meta.env.VITE_BACKEND_URL || "/api/auth";

const TOKEN_KEY = "lifeos-token";

/** Get the stored JWT token (useful for other hooks making authenticated API calls) */
export function getAuthToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

// Types
export interface User {
    id: string;
    name: string;
    email: string;
}

export interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    token: string | null;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string; requiresVerification?: boolean }>;
    register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; error?: string }>;
    forgotPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
    resetPassword: (email: string, otp: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
    googleLogin: (credential: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Helper to persist auth state
    const persistAuth = useCallback((userData: User, jwt: string) => {
        setUser(userData);
        setToken(jwt);
        localStorage.setItem(TOKEN_KEY, jwt);
        // Keep legacy key for backward compat with data hooks that may read it
        localStorage.setItem("lifeos-user", JSON.stringify(userData));
    }, []);

    const clearAuth = useCallback(() => {
        setUser(null);
        setToken(null);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem("lifeos-user");
    }, []);

    // On mount: verify stored JWT via /api/auth/me
    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        if (!storedToken) {
            // Migrate: if there's a legacy user but no token, clear it
            localStorage.removeItem("lifeos-user");
            setIsLoading(false);
            return;
        }

        // Build the /me URL from the auth API URL
        const meUrl = API_URL.replace(/\/auth$/, "/auth/me");

        fetch(meUrl, {
            method: "GET",
            headers: { Authorization: `Bearer ${storedToken}` },
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Token invalid");
                const data = await res.json();
                if (data.success && data.user) {
                    setUser(data.user);
                    setToken(storedToken);
                    localStorage.setItem("lifeos-user", JSON.stringify(data.user));
                } else {
                    throw new Error("Invalid response");
                }
            })
            .catch(() => {
                clearAuth();
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [clearAuth]);

    const login = useCallback(async (email: string, password: string) => {
        try {
            const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            // Guard against non-JSON responses (e.g. 404 HTML pages from Vite)
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                console.error("Login endpoint returned non-JSON response:", res.status, res.statusText);
                return { success: false, error: `Server error (${res.status}). Make sure the API server is running.` };
            }

            const data = await res.json();

            if (data.success && data.token) {
                persistAuth(data.user, data.token);
                return { success: true };
            }
            return { success: false, error: data.error, requiresVerification: data.requiresVerification };
        } catch (error) {
            console.error("Login failed:", error);
            return { success: false, error: "Network error. Make sure the backend is running (npm run dev:api)." };
        }
    }, []);

    const register = useCallback(async (name: string, email: string, password: string) => {
        try {
            const res = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password }),
            });

            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                return { success: false, error: `Server error (${res.status}). Make sure the API server is running (npm run dev:api).` };
            }

            const data = await res.json();
            return { success: !!data.success, error: data.error };
        } catch (error) {
            console.error("Registration failed:", error);
            return { success: false, error: "Network error. Make sure the backend is running (npm run dev:api)." };
        }
    }, []);

    const verifyOtp = useCallback(async (email: string, otp: string) => {
        try {
            const res = await fetch(`${API_URL}/verify`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });
            const data = await res.json();
            if (data.success && data.token) {
                persistAuth(data.user, data.token);
            }
            return { success: !!data.success, error: data.error };
        } catch (error) {
            return { success: false, error: "Network error." };
        }
    }, []);

    const forgotPassword = useCallback(async (email: string) => {
        try {
            const res = await fetch(`${API_URL}/forgot-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            return { success: !!data.success, error: data.error };
        } catch (error) {
            return { success: false, error: "Network error." };
        }
    }, []);

    const resetPassword = useCallback(async (email: string, otp: string, newPassword: string) => {
        try {
            const res = await fetch(`${API_URL}/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });
            const data = await res.json();
            return { success: !!data.success, error: data.error };
        } catch (error) {
            return { success: false, error: "Network error." };
        }
    }, []);

    const googleLogin = useCallback(async (credential: string) => {
        try {
            const res = await fetch(`${API_URL}/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ credential }),
            });
            const data = await res.json();

            if (data.success && data.token) {
                persistAuth(data.user, data.token);
                return { success: true };
            }
            return { success: false, error: data.error };
        } catch (error) {
            console.error("Google Login failed:", error);
            return { success: false, error: "Network error." };
        }
    }, []);

    const logout = useCallback(() => {
        clearAuth();
    }, [clearAuth]);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                token,
                login,
                register,
                verifyOtp,
                forgotPassword,
                resetPassword,
                googleLogin,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
