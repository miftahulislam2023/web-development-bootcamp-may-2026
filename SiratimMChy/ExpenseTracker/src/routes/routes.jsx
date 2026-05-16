import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../Pages/Home/Home";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import Categories from "../Pages/Categories";
import AboutUs from "../Pages/AboutUs";
import ForgetPassword from "../Pages/Forgetpassword";
import Footer from "../Components/Footer/Footer";
import AddTransaction from "../Dashboard/AddTransaction.jsx";
import DashboadHome from "../Dashboard/DashboardHome/DashboardHome.jsx";
import Hero from "../Pages/Home/Hero.jsx";
import Profile from "../Pages/Profile.jsx";
import DashboardLayout from "../Components/DashboardLayout/DashboardLayout.jsx";
import Transactions from "../Dashboard/Transactions/Transactions.jsx";
import PrivateRoute from "./PrivateRoute.jsx";
import ContactUs from "../Pages/ContactUs.jsx";
import TermsConditions from "../Pages/TermsConditions.jsx";
import ErrorPage from "../Pages/ErrorPage.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        errorElement:<ErrorPage/>,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/register',
                element: <Register />
            },
            {
                path: '/categories',
                element: <Categories />
            },
            {
                path: '/hero',
                element: <Hero />
            },
            {
                path: '/about-us',
                element: <AboutUs />
            },{
                path: '/contact',
                element: <ContactUs />
            },
            {
                path: '/terms-conditions',
                element: <TermsConditions />
            },
            {
                path: '/footer',
                element: <Footer />
            },
            {
                path: '/forgetpassword/:email',
                element: <ForgetPassword />
            },
        ]
    },
    {
        path: "/dashboard",
        element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
        errorElement:<ErrorPage/>,
        children: [
            {
                path: 'add-transaction',
                element: <AddTransaction />
            },
            {
                path: 'Profile',
                element: <Profile />
            },
            {
                path: 'dashboardhome',
                element: <DashboadHome />
            },
            {
                path: 'categories',
                element: <Categories />
            },
            {
                path: 'transactions',
                element: <Transactions />
            },
           
        ]
    }

]);

export default router;