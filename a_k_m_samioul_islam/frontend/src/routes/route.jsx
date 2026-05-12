import { createBrowserRouter } from "react-router";
import RootLayout from "../layouts/RootLayout/RootLayout";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Register from "../pages/register/Register";

export const router=createBrowserRouter([
    {
        path:"/",
        element:<RootLayout></RootLayout>,
        children:[
            {
                index:true,
                element:<Home></Home>
            },
            {
                path:"home",
                element:<Home></Home>
            },
            {
                path:"login",
                element:<Login></Login>
            },
            {
                path:"register",
                element:<Register></Register>
            }
        ]
    },
    
]);