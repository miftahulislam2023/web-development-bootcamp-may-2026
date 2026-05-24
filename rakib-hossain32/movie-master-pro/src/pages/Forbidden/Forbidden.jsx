import React from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { ShieldBan, ArrowLeft, LockKeyhole, Home } from "lucide-react";

const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-base-100 flex items-center justify-center overflow-hidden font-sans">
      {/* --- 1. Ambient Background Effects --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Red Glow for Danger/Warning Vibe */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-red-600/10 rounded-full blur-[150px]" />
        
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[24px_24px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl px-6 text-center">
        {/* --- 2. Animated Icon & 403 Text --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative inline-block mb-6"
        >
          {/* Floating Lock Icon */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-12 left-1/2 -translate-x-1/2 bg-base-100 p-4 rounded-full border-4 border-base-100 shadow-2xl shadow-red-500/20 z-20"
          >
            <div className="p-4 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
              <LockKeyhole size={40} />
            </div>
          </motion.div>

          {/* Main 403 Number */}
          <h1 className="text-[120px] md:text-[180px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-base-content/20 to-base-content/5 select-none relative z-10">
            403
          </h1>

          {/* "Restricted" Badge */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rotate-12 bg-red-600 text-white text-xs md:text-sm font-bold px-4 py-1 uppercase tracking-[0.3em] rounded shadow-lg border border-red-400">
            Access Denied
          </div>
        </motion.div>

        {/* --- 3. Message Content --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-3xl md:text-4xl font-black text-base-content">
            Wait! You don't have the script.
          </h2>

          <p className="text-lg text-base-content/60 max-w-md mx-auto leading-relaxed">
            This area is restricted to authorized personnel only. It seems you
            lack the necessary permissions (VIP Pass) to view this scene.
          </p>

          {/* --- 4. Action Buttons --- */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-base-200 text-base-content font-bold hover:bg-base-300 transition-all active:scale-95 group border border-base-content/5"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Go Back
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-red-700 hover:-translate-y-1 transition-all active:scale-95"
            >
              <Home size={18} />
              Return Home
            </button>
          </div>
        </motion.div>

        {/* Footer Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-xs font-bold text-base-content/30 uppercase tracking-widest"
        >
          Error Code: 403_FORBIDDEN
        </motion.p>
      </div>
    </div>
  );
};

export default Forbidden;
