import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useEffect, useMemo } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { AIProvider } from "@/contexts/AIContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { AnimatedPage } from "./components/layout/AnimatedPage";
import { AnimatePresence } from "framer-motion";

import { PageLoader } from "@/components/ui/PageLoader";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import TasksPage from "./pages/TasksPage";
import FinancePage from "./pages/FinancePage";
import NotesPage from "./pages/NotesPage";
import InventoryPage from "./pages/InventoryPage";
import StudyPage from "./pages/StudyPage";
import HabitsPage from "./pages/HabitsPage";
import SettingsPage from "./pages/SettingsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import WelcomePage from "./pages/WelcomePage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 2,
            retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
        },
    },
});
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "no-client-id";

const AppContent = () => {


  return (
    <AIProvider>
      <React.Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public routes wrapped in individual AnimatePresence/AnimatedPage if needed, but for now let's just use standard routes for them or wrap them */}
          <Route path="/welcome" element={<AnimatedPage><WelcomePage /></AnimatedPage>} />
          <Route path="/login" element={<AnimatedPage><LoginPage /></AnimatedPage>} />
          <Route path="/register" element={<AnimatedPage><RegisterPage /></AnimatedPage>} />
          <Route path="/verify-otp" element={<AnimatedPage><VerifyOtpPage /></AnimatedPage>} />
          <Route path="/forgot-password" element={<AnimatedPage><ForgotPasswordPage /></AnimatedPage>} />

          {/* Protected routes under DashboardLayout */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/inventory" element={<InventoryPage />} />
            <Route path="/study" element={<StudyPage />} />
            <Route path="/habits" element={<HabitsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<AnimatedPage><NotFound /></AnimatedPage>} />
        </Routes>
      </React.Suspense>
    </AIProvider>
  );
};

const App = () => {
  // Initialize light mode by default
  useEffect(() => {
    const stored = localStorage.getItem("lifeos-theme");
    if (!stored) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("lifeos-theme", "light");
    } else {
      if (stored === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }

    // Initialize database tables
    // initDatabase().catch(console.error); // Deprecated/Removed
  }, []);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner
              theme="system"
              toastOptions={{
                style: {
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  color: "hsl(var(--foreground))",
                },
              }}
            />
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <AppContent />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
};

export default App;
