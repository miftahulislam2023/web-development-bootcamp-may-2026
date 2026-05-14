import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout/RootLayout";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";
import NotFound from "../pages/notfound/NotFound";
import PublicRoute from "../providers/publicRoute/PublicRoute";
import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";
import MyActivity from "../pages/my-activity/MyActivity";
import PrivateRoute from "../providers/PrivateRoute/PrivateRoute";

export const router=createBrowserRouter([
    {
        path:"/",
        element:<PublicRoute>
            <RootLayout></RootLayout>
        </PublicRoute>,
        children:[
            {
                index:true,
                element:<Home></Home>
            },
            {
                path:"home",
                element: <Home></Home>
            },
            {
                path:"login",
                element:<Login></Login>
                
            },
            {
                path:"register",
                element: <Register></Register>
            }
        ]
    },
    {
        path:"/dashboard",
        element:<PrivateRoute>
            <DashboardLayout></DashboardLayout>
        </PrivateRoute>,
        children:[
            {
                index:true,
                element:<MyActivity></MyActivity>
            },
            {
                path: "my-activity",
                element:<MyActivity></MyActivity>
            }
        ]
    },
    {
        path:"*",
        element:<NotFound></NotFound>
    }
    
]);