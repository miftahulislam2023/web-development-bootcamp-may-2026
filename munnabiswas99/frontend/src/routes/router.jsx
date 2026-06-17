import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import NotFound from "../pages/404/NotFound";
import DashboardLayout from "../layouts/DashboardLayout";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../pages/dashboard/Dashboard";
import Transactions from "../pages/dashboard/Transactions";
import AddTransaction from "../pages/dashboard/AddTransaction";
import EditTransaction from "../pages/dashboard/EditTransaction";
import Wallet from "../pages/dashboard/Wallet";
import AddWallet from "../pages/dashboard/AddWallet";
import About from "../pages/about/About";
import ViewProfile from "../pages/profile/ViewProfile";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/about",
        Component: About,
      },
      {
        path: "/profile",
        element: <PrivateRoute><ViewProfile></ViewProfile></PrivateRoute>
      },
      {
        path: "*",
        Component: NotFound,
      },
    ],
  },

  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "/register",
        Component: Register,
      },
      {
        path: "/login",
        Component: Login,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout></DashboardLayout>
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        Component: Dashboard,
      },
      {
        path: "/dashboard/transactions",
        Component: Transactions,
      },
      {
        path: "/dashboard/add-transaction",
        Component: AddTransaction,
      },
      {
        path: "/dashboard/edit-transaction/:id",
        Component: EditTransaction,
      },
      {
        path: "/dashboard/wallet",
        Component: Wallet,
      },
      {
        path: "/dashboard/add-wallet",
        Component: AddWallet,
      },
    ],
  },
]);
