import { useContext } from "react";
import { AuthContext } from "../Provider/AuthProvider";
import { useLocation, Navigate } from "react-router";
import { toast } from "react-toastify";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-base-100 gap-5">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-4 border-base-300"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                </div>
                <div className="text-center">
                    <p className="text-sm font-extrabold uppercase tracking-[0.2em] bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Cashnivo
                    </p>
                    <p className="text-xs text-base-content/40 mt-1">Loading your account...</p>
                </div>
            </div>
        );
    }

    if (user) return children;

    toast.error('Please login to access this feature', { toastId: 'auth-error' });
    return <Navigate state={location.pathname} to="/login" />;
};

export default PrivateRoute;