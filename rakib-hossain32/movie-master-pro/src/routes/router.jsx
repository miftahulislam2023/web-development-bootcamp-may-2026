import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home";
import AllMovies from "../pages/AllMovies";
import MyCollection from "../pages/MyCollection";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import MovieDetails from "../components/MovieDetalis/MovieDetails";

import EditMovie from "../components/EditMovie/EditMovie";
import Watchlist from "../pages/Watchlist";
import ProtectedRoute from "./ProtectedRoute";

import PageNotFound from "../components/PageNotFound";
import Features from "../pages/FooterPage/Features.jsx";
import Privacy from "../pages/FooterPage/Privacy.jsx";

import Contact from "../pages/FooterPage/Contact.jsx";
import Pricing from "../pages/FooterPage/Pricing.jsx";
import Terms from "../pages/FooterPage/Terms.jsx";
import DashboardHome from "../pages/Dashboard/DashboardHome.jsx";
import DashboardLayout from "../layouts/DashboardLayout.jsx";
import Profile from "../pages/Dashboard/Profile.jsx";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner.jsx";
import Support from "../pages/Support/Support.jsx";
import ProtectedDashboard from "./ProtectedDashboard.jsx";
import Blogs from "../pages/Blogs/Blogs.jsx";
import AdminRoute from "./AdminRoute.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    hydrateFallbackElement: <LoadingSpinner />,
    errorElement: <PageNotFound />,
    Component: RootLayout,
    children: [
      {
        index: true,
        loader: () =>
          fetch("https://movies-master-pro-api-server.vercel.app/watchlist"),
        Component: Home,
      },
      {
        path: "/all-movies",
        element: <AllMovies />,
      },
      {
        path: "/support",
        Component: Support,
      },
      {
        path: "/blogs",
        Component: Blogs,
      },
      {
        path: "/movie-details/:id",
        Component: MovieDetails,
      },
      {
        path: "/watchlist",
        element: (
          <ProtectedRoute>
            <Watchlist />
          </ProtectedRoute>
        ),
      },
      {
        path: "/features",
        Component: Features,
      },
      {
        path: "/terms",
        Component: Terms,
      },
      {
        path: "/privacy",
        Component: Privacy,
      },

      {
        path: "/contact",
        Component: Contact,
      },
      {
        path: "/pricing",
        Component: Pricing,
      },
      {},
      {
        path: "/signin",
        Component: Login,
      },
      {
        path: "/register",
        Component: Register,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <ProtectedDashboard>
            <DashboardHome />
          </ProtectedDashboard>
        ),
      },
      {
        path: "add-movie",
        element: (
          <AdminRoute>
            <EditMovie isEdit={false}/>
          </AdminRoute>
        ), // Reuse your AddMovie component
      },
      {
        path: "my-movies",
        element: (
          <AdminRoute>
            <MyCollection />
          </AdminRoute>
        ), // Reuse MyCollection component
      },
      {
        path: "edit-movie/:id",
        element: (
          <AdminRoute>
            <EditMovie isEdit={true} />
          </AdminRoute>
        ), // Edit route inside dashboard
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
