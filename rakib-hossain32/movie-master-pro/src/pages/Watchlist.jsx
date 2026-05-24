import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";
import MovieCard from "../components/MovieCard";
import { Heart, Search, Library, BookmarkMinus } from "lucide-react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import CommonPageHeader from "../components/CommonPageHeader";
import { motion, AnimatePresence } from "framer-motion";

const Watchlist = () => {
  const { movies, user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [watchlists, setWatchlists] = useState([]);
  const [watchIn, setWatchIn] = useState([]);
  const [watchId, setWatchId] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch Watchlist IDs
  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/watchlist?email=${user?.email}`)
        .then((data) => {
          setWatchIn(data.data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [axiosSecure, user]);

  // 2. Filter Movies
  useEffect(() => {
    if (movies && movies.length > 0 && watchIn.length > 0) {
      const commonMovies = movies.filter((movie) =>
        watchIn.some((fav) => fav.id === movie._id)
      );
      setWatchlists(commonMovies);
    } else if (watchIn.length === 0) {
      setWatchlists([]);
    }
  }, [movies, watchIn]);

  // 3. Remove Item Handler
  useEffect(() => {
    if (!watchId) return;
    setWatchlists((prev) => prev.filter((m) => m._id !== watchId));
  }, [watchId]);

  return (
    <div className="min-h-screen bg-base-100 py-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -z-10" />

      {/* Header */}
      <CommonPageHeader
        title="My Watchlist"
        subtitle="Your personally curated collection of must-watch cinema."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Stats Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-base-content/10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-base-200 rounded-xl text-primary">
              <Library size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-base-content">
                Saved Movies
              </h2>
              <p className="text-xs text-base-content/50 uppercase tracking-widest">
                {watchlists.length} Items
              </p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        {isLoading ? (
          // Skeleton Loader
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-[400px] bg-base-200 rounded-4xl animate-pulse"
              />
            ))}
          </div>
        ) : watchlists.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-20 text-center bg-base-100 border-2 border-dashed border-base-200 rounded-[3rem]"
          >
            <div className="w-24 h-24 bg-base-200 rounded-full flex items-center justify-center mb-6 relative">
              <BookmarkMinus className="w-10 h-10 text-base-content/30" />
              <div className="absolute top-0 right-0 w-8 h-8 bg-primary/20 rounded-full animate-ping" />
            </div>
            <h3 className="text-3xl font-black text-base-content mb-3">
              Your list is empty
            </h3>
            <p className="text-base-content/60 max-w-md mb-8 text-lg">
              Looks like you haven't added any movies yet. Explore our library
              and save your favorites here.
            </p>
            <button
              onClick={() => navigate("/all-movies")}
              className="group flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/30 hover:bg-red-700 transition-all hover:-translate-y-1"
            >
              <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Browse Movies
            </button>
          </motion.div>
        ) : (
          // Movie Grid (Fixed Animation - Direct Control)
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {watchlists.map((movie) => (
                <motion.div
                  key={movie._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }} // Start State
                  animate={{ opacity: 1, scale: 1, y: 0 }} // End State (Force Visible)
                  exit={{
                    opacity: 0,
                    scale: 0.5,
                    transition: { duration: 0.2 },
                  }} // Exit State
                  transition={{ duration: 0.3 }}
                >
                  <MovieCard
                    movie={movie}
                    isWatchList={true}
                    setWatchId={setWatchId}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Watchlist;
