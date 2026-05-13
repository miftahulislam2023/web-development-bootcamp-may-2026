import { Navigate } from "react-router";
import { useAuthStore } from "../store/useAuthStore";

const AuthRedirectRoute = ({ children }) => {
  const { authUser } = useAuthStore();

  if (authUser) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AuthRedirectRoute;