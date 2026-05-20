import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/home/Home";
import RootLayout from "../layouts/RootLayout";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import Dashboard from "../pages/Dashboard";
import AddExpense from "../pages/AddExpense";
import DashboardLayout from "../pages/home/DashboardLayout/DashboardLayout";
import Transactions from "../pages/Transaction";
import Service from "../components/Service";
import Features from "../components/Features";
import About from "../components/AboutUs";
import Charts from "../pages/Charts";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children :[
      {
        index:true,
        Component: Home,
      },
      {
        path: 'payments',
        Component: Transactions
      },
      {
        path: 'services',
        Component: Service
      },
      {
        path: 'features',
        Component: Features
      },
      {
        path: 'about',
        Component: About
      },
    ]
  },
  {
    path: '/',
    Component : AuthLayout,
    children: [
      {
         path: '/login',
       Component : Login,
      },
      {
         path: 'register',
       Component : Register,
      },
    ]
  },
  {
    path: '/dashboardLayout',
    Component: DashboardLayout,
    children:[
      {
        index: true,
        Component:Dashboard
      },
      {
        path:'add-expense',
        Component:AddExpense
      },
      {
        path:'charts',
        Component:Charts
      },
      {
        path:'transactions',
        Component:Transactions
      },
    ]
  }
])