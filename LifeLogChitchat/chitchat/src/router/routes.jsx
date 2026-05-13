import { createBrowserRouter } from "react-router";

import RootLayout from "../layout/RootLayout";

import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";

import ProtectedRoute from "./ProtectedRoute";
import AuthRedirectRoute from "./AuthRedirectRoute";
import ChatPage from "../pages/chatPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
          <ChatPage></ChatPage>
          </ProtectedRoute>
        ),
      },

      {
        path: "/login",
        element: (
          <AuthRedirectRoute>
            <LoginPage />
          </AuthRedirectRoute>
        ),
      },

      {
        path: "/signup",
        element: (
          <AuthRedirectRoute>
            <SignUpPage />
          </AuthRedirectRoute>
        ),
      },
    ],
  },
]);