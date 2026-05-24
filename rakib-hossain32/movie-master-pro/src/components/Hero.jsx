import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Clock,
  Play,
  ChevronRight,
  Info,
  Calendar,
  TrendingUp,
  ChevronLeft,
} from "lucide-react";
import { useNavigate } from "react-router";
import { LazyLoadImage } from "react-lazy-load-image-component";


export default function Hero({ splicedMovies, isLoading }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const hasMovies = splicedMovies.length > 0;

  // --- Logic: Next / Prev ---
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % splicedMovies.length);
  }, [splicedMovies.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + splicedMovies.length) % splicedMovies.length
    );
  }, [splicedMovies.length]);

  // --- Auto Play with Pause on Hover ---
  useEffect(() => {
    if (isHovered || !hasMovies) return;
    timerRef.current = setInterval(nextSlide, 7000); // 7 Seconds per slide
    return () => clearInterval(timerRef.current);
  }, [isHovered, hasMovies, nextSlide]);

  // --- Keyboard Navigation (Your Specific Request) ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  // --- Skeleton Loading State ---
  if (!splicedMovies || splicedMovies.length === 0 || isLoading) {
    return <HeroSkeleton />;
  }

  const currentMovie = splicedMovies[currentIndex];

  // Logic for Sidebar Previews (Next 2 movies)
  const nextMovie1 = splicedMovies[(currentIndex + 1) % splicedMovies.length];
  const nextMovie2 = splicedMovies[(currentIndex + 2) % splicedMovies.length];

  return (
    <div
      className="relative w-full h-150 md:h-175 lg:h-200 bg-base-100 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
     
      <AnimatePresence mode="wait">
        <motion.div
          key={currentMovie._id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 z-0"
        >
          {/* Main Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${currentMovie.poster})` }}
          />

       
          <div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/60 to-transparent" />

          {/* 2. Top linear (For Navbar visibility) */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-linear-to-b from-black/80 to-transparent opacity-80" />

          {/* 3. Bottom linear (Seamless Blend to Theme) */}
          {/* This ensures professional look in both Light & Dark mode */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-linear-to-t from-base-100 via-base-100/60 to-transparent" />
        </motion.div>
      </AnimatePresence>

    
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full pt-16">
          {/* --- LEFT: Main Info (8 Columns) --- */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8 max-w-4xl relative z-20">
            {/* Badges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={`badge-${currentMovie._id}`}
              className="flex flex-wrap items-center gap-3"
            >
              <div className="flex items-center gap-2 px-3 py-1 bg-primary text-white text-[10px] font-bold tracking-widest uppercase rounded-md shadow-lg shadow-primary/40">
                <TrendingUp className="w-3 h-3" /> Featured
              </div>
              <div className="px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase rounded-md">
                {currentMovie.genre}
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1
              key={`title-${currentMovie._id}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none drop-shadow-2xl"
            >
              {currentMovie.title}
            </motion.h1>

            {/* Meta Data */}
            <motion.div
              key={`meta-${currentMovie._id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-300 font-medium text-sm md:text-lg"
            >
              <div className="flex items-center gap-2 text-yellow-400">
                <Star className="w-5 h-5 fill-current" />
                <span className="text-white font-bold text-xl">
                  {currentMovie.rating}
                </span>
                <span className="text-xs opacity-70">IMDb</span>
              </div>
              <span className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-primary" />
                <span>{currentMovie.year || 2024}</span>
              </div>
              <span className="w-1.5 h-1.5 bg-gray-600 rounded-full" />
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <span>{currentMovie.runtime} min</span>
              </div>
            </motion.div>

            {/* Description */}
            <motion.p
              key={`desc-${currentMovie._id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-gray-300/90 text-sm md:text-lg leading-relaxed line-clamp-3 md:line-clamp-3 max-w-2xl"
            >
              {currentMovie.summary || currentMovie.description}
            </motion.p>

            {/* Buttons */}
            <motion.div
              key={`btns-${currentMovie._id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                onClick={() => navigate(`/movie-details/${currentMovie._id}`)}
                className="group relative px-8 py-4 bg-primary text-white font-bold rounded-2xl overflow-hidden shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 cursor-pointer" />
                <div className="relative flex items-center gap-3">
                  <Play className="w-5 h-5 fill-white" />
                  <span>Watch Trailer</span>
                </div>
              </button>

              <button
                onClick={() => navigate(`/movie-details/${currentMovie._id}`)}
                className="group px-8 py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-bold rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Info className="w-5 h-5" />
                  <span>More Details</span>
                </div>
              </button>
            </motion.div>
          </div>

       
          <div className="hidden lg:flex lg:col-span-4 flex-col gap-4 items-end justify-center z-20 mt-12">
        
            <div
              onClick={nextSlide}
              className="relative w-64 h-36 rounded-2xl overflow-hidden cursor-pointer group border-2 border-transparent hover:border-primary transition-all duration-300"
            >
             
              <LazyLoadImage
                src={nextMovie1.poster}
                effect="blur"
                width="100%"
                height={300}
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
                  <ChevronRight className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black to-transparent">
                <p className="text-white font-bold text-sm truncate">
                  {nextMovie1.title}
                </p>
                <p className="text-xs text-gray-400">Next Up</p>
              </div>
            </div>

            {/* Next Movie 2 */}
            <div
              onClick={() => {
                nextSlide();
                nextSlide();
              }}
              className="relative w-64 h-36 rounded-2xl overflow-hidden cursor-pointer group border-2 border-transparent hover:border-primary transition-all duration-300 opacity-60 hover:opacity-100"
            >
            
              <LazyLoadImage
                src={nextMovie2.poster}
                effect="blur"
                width="100%"
                height={300}
              />
              <div className="absolute inset-0 bg-black/60 group-hover:bg-black/30 transition-colors" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black to-transparent">
                <p className="text-white font-bold text-sm truncate">
                  {nextMovie2.title}
                </p>
                <p className="text-xs text-gray-400">Coming Later</p>
              </div>
            </div>

            {/* Navigation Buttons (Circle) */}
            <div className="flex gap-3 mt-2">
              <button
                onClick={prevSlide}
                className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-primary hover:border-primary transition-all active:scale-95"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextSlide}
                className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-primary hover:border-primary transition-all active:scale-95"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      
      <div className="absolute bottom-0 left-0 right-0 z-30">
        {/* Progress Bar Line */}
        <div className="w-full h-1.5 bg-white/10">
          <motion.div
            key={currentIndex}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 7, ease: "linear" }}
            className="h-full bg-primary shadow-[0_0_10px_rgba(217,4,41,0.8)]"
          />
        </div>

        {/* Mobile Dots */}
        <div className="lg:hidden absolute bottom-6 w-full flex justify-center gap-2">
          {splicedMovies.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? "w-8 bg-primary" : "w-2 bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Premium Skeleton Loader ---
function HeroSkeleton() {
  return (
    <div className="relative w-full h-150 bg-base-300 animate-pulse overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-r from-base-100/50 via-transparent to-base-100/50" />
      <div className="container mx-auto px-6 h-full flex items-center">
        <div className="space-y-6 max-w-2xl w-full">
          <div className="h-6 w-32 bg-base-content/10 rounded-full" />
          <div className="h-16 w-3/4 bg-base-content/10 rounded-xl" />
          <div className="flex gap-4">
            <div className="h-4 w-12 bg-base-content/10 rounded" />
            <div className="h-4 w-12 bg-base-content/10 rounded" />
            <div className="h-4 w-12 bg-base-content/10 rounded" />
          </div>
          <div className="h-24 w-full bg-base-content/10 rounded-xl" />
          <div className="flex gap-4 pt-4">
            <div className="h-14 w-40 bg-base-content/10 rounded-xl" />
            <div className="h-14 w-40 bg-base-content/10 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
