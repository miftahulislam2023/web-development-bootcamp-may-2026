import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import MainLayout from "./layouts/MainLayout";

import ProtectedRoute from "./components/ProtectedRoute";

import DashboardLayout from "./dashboard/DashboardLayout";

import Overview from "./dashboard/Overview";
import Transactions from "./dashboard/Transactions";
import Analytics from "./dashboard/Analytics";
import Budgets from "./dashboard/Budgets";
import Recurring from "./dashboard/Reccuring";
import Insights from "./dashboard/Insights";
import Features from "./components/Features";
import About from "./pages/About";
import MoodTracker from "./pages/MoodTracker";

export default function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route element={<MainLayout />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/features"
            element={<Features />}
          />

          <Route
            path="/about"
            element={<About />}
          />

          

        </Route>

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>

              <DashboardLayout />

            </ProtectedRoute>
          }
        >

          <Route
            index
            element={<Overview />}
          />

          <Route
            path="transactions"
            element={<Transactions />}
          />

          <Route
            path="/dashboard/mood-tracker"
            element={<MoodTracker></MoodTracker>}
          />

          <Route
            path="analytics"
            element={<Analytics />}
          />

          <Route
            path="budgets"
            element={<Budgets />}
          />

          <Route
            path="recurring"
            element={<Recurring />}
          />

          <Route
            path="insights"
            element={<Insights />}
          />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}