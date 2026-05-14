import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import Spinner from "../components/Spinner";

export default function AuthSuccess() {
  const { login } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) { navigate("/login"); return; }
    localStorage.setItem("sw_token", token);
    api.get("/auth/me")
      .then(r => { login(token, r.data.user); navigate("/"); })
      .catch(() => { localStorage.removeItem("sw_token"); navigate("/login?error=google_failed"); });
  }, []);
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center card p-12">
        <div className="flex justify-center mb-4"><Spinner size="lg" /></div>
        <p className="font-semibold text-gray-700 dark:text-gray-300">Signing you in...</p>
        <p className="text-sm text-gray-400 mt-1">Please wait a moment</p>
      </div>
    </div>
  );
}
