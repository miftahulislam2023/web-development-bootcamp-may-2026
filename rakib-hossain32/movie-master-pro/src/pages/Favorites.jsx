import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";
import MovieCard from "../components/MovieCard";
import { Heart, Search, Library, BookmarkMinus } from "lucide-react";
import CommonPageHeader from "../components/CommonPageHeader";
import { motion, AnimatePresence } from "framer-motion";

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load saved movies from local storage
  useEffect(() => {
    if (user?.email) {
      const data = localStorage.getItem(`saved_${user.email}`);
      setFavorites(data ? JSON.parse(data) : []);
    }
    setLoading(false);
  }, [user]);

  // Remove a movie from favorites
  const onRemove = (id) => {
    const updated = favorites.filter((m) => m._id !== id);
    setFavorites(updated);
    localStorage.setItem(`saved_${user.email}`, JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-base-100 py-20 relative overflow-hidden">
      {/* Visual background decoration */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] -z-10" />

      <CommonPageHeader
        title="My Favorites"
        subtitle="Your handpicked collection of favorite films."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Page Summary bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-base-content/10">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-base-200 rounded-xl text-primary">
              <Heart size={24} className="fill-current" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-base-content">Favorites</h2>
              <p className="text-xs text-base-content/50 uppercase font-bold tracking-widest">
                {favorites.length} Movies Saved
              </p>
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[400px] bg-base-200 rounded-3xl animate-pulse" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-base-200 rounded-[2.5rem]"
          >
            <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mb-6">
              <Heart className="w-8 h-8 text-base-content/20" />
            </div>
            <h3 className="text-2xl font-bold text-base-content mb-2">No favorites yet</h3>
            <p className="text-base-content/60 max-w-sm mb-8">
              Explore our library and click the heart icon to save your favorite movies here.
            </p>
            <button
              onClick={() => navigate("/all-movies")}
              className="flex items-center gap-3 px-8 py-4 bg-primary text-white font-bold rounded-2xl hover:bg-red-700 transition-all shadow-lg shadow-primary/20"
            >
              <Search size={20} />
              Browse Library
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence mode="popLayout">
              {favorites.map((movie) => (
                <motion.div
                  key={movie._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <MovieCard
                    movie={movie}
                    isFavorite={true}
                    setFavoriteId={onRemove}
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

export default Favorites;
