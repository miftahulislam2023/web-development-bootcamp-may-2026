import React from "react";
import { Link, useNavigate } from "react-router"; // Use 'react-router-dom' if specifically needed, usually it's 'react-router-dom'
import { motion } from "framer-motion";
import { Home, ArrowLeft, Film, AlertCircle } from "lucide-react";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-base-100 flex items-center justify-center overflow-hidden">
      {/* --- Ambient Background Effects --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-150 h-150 bg-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-150 h-150 bg-blue-600/5 rounded-full blur-[150px]" />
        {/* Cinematic Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-linears.vercel.app/noise.svg')] opacity-5" />
      </div>

      <div className="relative z-10 px-6 text-center max-w-3xl mx-auto">
        {/* --- Animated 404 Visual --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative inline-block"
        >
          {/* Main 404 Text */}
          <h1 className="text-[150px] sm:text-[200px] md:text-[250px] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-base-content/10 to-base-content/5 select-none">
            404
          </h1>

          {/* Overlay Floating Icon */}
          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          >
            <div className="p-6 rounded-4xl bg-base-100 shadow-2xl border border-base-200">
              <Film className="w-16 h-16 sm:w-20 sm:h-20 text-primary" />
            </div>
          </motion.div>
        </motion.div>

        {/* --- Error Message --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="space-y-6 -mt-10 sm:-mt-16 relative z-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest">
            <AlertCircle size={14} /> Scene Missing
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-base-content">
            Cut! We lost the shot.
          </h2>

          <p className="text-lg text-base-content/60 max-w-lg mx-auto leading-relaxed">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>

          {/* --- Action Buttons --- */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-base-200 text-base-content font-bold hover:bg-base-300 transition-all active:scale-95 group"
            >
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
              Go Back
            </button>

            <Link
              to="/"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 hover:bg-red-700 hover:-translate-y-1 transition-all active:scale-95"
            >
              <Home size={18} />
              Back to Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PageNotFound;
