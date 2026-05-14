import { Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";
import PageLoader from "../components/PageLoader";


const ProtectedRoute = ({ children }) => {
  const { authUser, checkAuth, isCheckingAuth, } = useAuthStore();

  //   useEffect(() => {
  //   checkAuth();
  // }, [checkAuth]);

  // if (isCheckingAuth) return <PageLoader />;

  if (!authUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;