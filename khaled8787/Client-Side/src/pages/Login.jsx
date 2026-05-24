import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { Mail, Lock, ArrowRight, LogIn, ChevronLeft, Home } from "lucide-react"; 

import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      toast.success("Welcome back! Login successful");
      reset();
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen bg-[#071028] flex items-center justify-center px-6 relative overflow-hidden">
      
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
          <span className="text-sm font-bold tracking-wide pr-1">Back to Home</span>
        </Link>
      </motion.div>

      <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl">
          
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-cyan-500/20 rounded-2xl mb-4">
              <LogIn className="text-cyan-400 w-8 h-8" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tight">
              Welcome <span className="text-cyan-400">Back</span>
            </h1>
            <p className="text-gray-400 mt-2 font-medium">
              Enter your details to access your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  {...register("email", { required: true })}
                  className="w-full bg-[#0B1736]/50 border border-white/10 p-4 pl-12 rounded-2xl outline-none text-white focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all duration-300"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-gray-300">Password</label>
                <Link to="/forgot-password" size="sm" className="text-xs text-cyan-400 hover:underline">Forgot password?</Link>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-cyan-400 transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password", { required: true })}
                  className="w-full bg-[#0B1736]/50 border border-white/10 p-4 pl-12 rounded-2xl outline-none text-white focus:border-cyan-500/50 focus:ring-4 focus:ring-cyan-500/10 transition-all duration-300"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full group relative bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-4 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden"
            >
              <span className="relative z-10">Login to Account</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
            </button>

          </form>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-gray-400 font-medium">
              Don't have an account?
              <Link
                to="/register"
                className="text-cyan-400 ml-2 hover:text-cyan-300 transition-colors font-bold"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}