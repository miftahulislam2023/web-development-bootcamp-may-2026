import { createBrowserRouter } from "react-router";
import App from "../App";
import RootLayout from "../layout/RootLayout";
import chatPage from "../pages/chatPage";
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout></RootLayout>,
    children:[
        {
            index: true,
            Component: chatPage
        },
        {
            path: '/login',
            Component: LoginPage

        },
        {
            path: '/signup',
            Component: SignUpPage

        }
    ]
  },
]);