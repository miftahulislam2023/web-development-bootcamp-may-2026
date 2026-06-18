import Loading from "@/components/Loading";
import { useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { TRole } from "@/types";
import { ComponentType } from "react";
import { Navigate } from "react-router";

export const withAuth = (Component: ComponentType, requiredRole?: TRole) => {
  return function AuthWrapper() {

    const { data, isLoading, isFetching } = useUserInfoQuery(undefined);
    // loading state
    if (isLoading || isFetching) {
      return <Loading />;
    }

    // not logged in
    if (!data?.data?.email) {
      return <Navigate to="/login" replace />;
    }

    if (requiredRole && !isLoading && requiredRole !== data?.data?.role) {
      return <Navigate to="/unauthorized" replace />;
    }

    return <Component />;
  };
};
