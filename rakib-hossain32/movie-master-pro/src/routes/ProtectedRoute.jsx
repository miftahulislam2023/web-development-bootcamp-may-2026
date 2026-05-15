import React from "react";
import useAuth from "../hooks/useAuth";
import { Navigate, useLocation } from "react-router";
;
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  const location = useLocation();
  // console.log(a)

  // console.log(loading)
  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return children;
  }

  return <Navigate state={location.pathname} to={"/signin"} />;
};

export default ProtectedRoute;
