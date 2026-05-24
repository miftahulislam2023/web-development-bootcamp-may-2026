import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  User,
  Mail,
  Lock,
  UserPlus,
  ArrowRight,
  CheckCircle2,
  Circle,
  ChevronLeft,
} from "lucide-react";

import api from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password", "");

  const validations = [
    { label: "At least 6 characters", test: password.length >= 6 },
    { label: "At least one uppercase letter", test: /[A-Z]/.test(password) },
    { label: "At least one number", test: /[0-9]/.test(password) },
  ];

  const onSubmit = async (data) => {
    try {
      const payload = {
        name: data.name,
        email: data.email,
        password: data.password,
      };

      await api.post("/auth/register", payload);

      toast.success("Account created successfully! Please login.");

      reset();

      navigate("/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#071028] flex items-center justify-center px-6 relative overflow-hidden py-10">
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-8 left-8 z-50"
      >
        <Link
          to="/"
          className="group flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 hover:border-cyan-500/50 transition-all duration-300 shadow-xl"
        >
          <div className="bg-white/10 p-1.5 rounded-full group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
            <ChevronLeft size={18} />
          </div>
          <span className="text-sm font-bold tracking-wide pr-1">
            Back to Home
          </span>
        </Link>
      </motion.div>

      <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/20 rounded-2xl mb-4 text-cyan-400">
              <UserPlus size={32} />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              Join <span className="text-cyan-400">FinTrack</span>
            </h1>
            <p className="text-gray-400 mt-2 font-medium">
              Create your professional account
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* NAME */}
            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                  <User size={20} />
                </div>

                <input
                  type="text"
                  placeholder="Full Name"
                  {...register("name", { required: "Name is required" })}
                  className="w-full bg-[#0B1736]/50 border border-white/10 p-4 pl-12 rounded-2xl outline-none text-white focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all duration-300"
                />
              </div>

              {errors.name && (
                <p className="text-red-400 text-xs ml-2">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                  <Mail size={20} />
                </div>

                <input
                  type="email"
                  placeholder="Email Address"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Invalid email format",
                    },
                  })}
                  className="w-full bg-[#0B1736]/50 border border-white/10 p-4 pl-12 rounded-2xl outline-none text-white focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all duration-300"
                />
              </div>

              {errors.email && (
                <p className="text-red-400 text-xs ml-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                  <Lock size={20} />
                </div>

                <input
                  type="password"
                  placeholder="Password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimum 6 characters",
                    },
                  })}
                  className="w-full bg-[#0B1736]/50 border border-white/10 p-4 pl-12 rounded-2xl outline-none text-white focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all duration-300"
                />
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 pl-2">
                {validations.map((v, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-2 text-xs transition-colors duration-300 ${
                      v.test ? "text-green-400" : "text-gray-500"
                    }`}
                  >
                    {v.test ? (
                      <CheckCircle2 size={14} />
                    ) : (
                      <Circle size={14} />
                    )}
                    {v.label}
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full group relative bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden mt-4"
            >
              <span className="relative z-10">
                Create Free Account
              </span>
              <ArrowRight
                size={20}
                className="relative z-10 group-hover:translate-x-1 transition-transform"
              />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-400 text-sm font-medium">
              Already using FinTrack?
              <Link
                to="/login"
                className="text-cyan-400 ml-2 hover:text-cyan-300 transition-colors font-bold"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}