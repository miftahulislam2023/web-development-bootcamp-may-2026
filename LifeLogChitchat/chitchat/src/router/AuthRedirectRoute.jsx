import { Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";
import PageLoader from "../components/PageLoader";

const AuthRedirectRoute = ({ children }) => {
  const { authUser, checkAuth, isCheckingAuth, } = useAuthStore();
  
    //   useEffect(() => {
    //   checkAuth();
    // }, [checkAuth]);
  
    // if (isCheckingAuth) return <PageLoader />;

  if (authUser) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AuthRedirectRoute;