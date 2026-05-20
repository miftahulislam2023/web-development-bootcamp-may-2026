import { Navigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const { t } = useTheme();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: t?.pageBg || "#fff",
          gap: 16,
        }}
      >
        {/* Animated spinner ring */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: `3px solid ${t?.border || "#eee"}`,
            borderTopColor: t?.accent || "#e11d48",
            animation: "spin 0.75s linear infinite",
          }}
        />
        <span
          style={{
            fontSize: 13,
            color: t?.textSub || "#888",
            fontWeight: 500,
          }}
        >
          Loading…
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
};

export default PrivateRoute;