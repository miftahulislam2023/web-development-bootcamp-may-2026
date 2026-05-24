import React from "react";
import { Sparkles } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-base-100">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-primary/10 via-base-100 to-base-100 animate-pulse" />

      <div className="relative flex flex-col items-center gap-4">
        {/* Animated Logo Container */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          {/* Outer Rotating Ring */}
          <div className="absolute inset-0 rounded-full border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />

          {/* Inner Reverse Ring */}
          <div className="absolute inset-2 rounded-full border-4 border-b-red-500 border-t-transparent border-r-transparent border-l-transparent animate-[spin_1.5s_linear_infinite_reverse]" />

          {/* Center Icon */}
          <div className="relative z-10 p-3 bg-base-100 rounded-full shadow-lg shadow-primary/20">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
        </div>

        {/* Text Loading */}
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-black tracking-tight text-base-content">
            MovieMaster
          </h2>
          <div className="flex gap-1 mt-1">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
