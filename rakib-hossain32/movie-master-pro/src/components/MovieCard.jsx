import React, { memo } from "react";
import { Heart, Star, Trash2, Calendar, Clock, Eye } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";

const MovieCard = ({ movie, isEdit, setId, isWatchList, setWatchId, isFavorite, setFavoriteId }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Delete movie handler (Admin only)
  const onDeleteMovie = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This movie will be permanently removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D90429",
      cancelButtonColor: "#8D99AE",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/movies/${id}`).then((res) => {
          if (res.data.deletedCount) {
            if (setId) setId(id);
            toast.success("Movie deleted successfully");
          }
        });
      }
    });
  };

  // Remove from watchlist
  const onRemoveWatchlist = (id) => {
    axiosSecure.delete(`/watchlist/${id}`).then((res) => {
      if (res.data.deletedCount) {
        if (setWatchId) setWatchId(id);
        toast.success("Removed from watchlist");
      }
    });
  };

  // Add to watchlist
  const onAddWatchlist = () => {
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "Please sign in to add movies to your watchlist.",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Login",
      }).then((result) => {
        if (result.isConfirmed) navigate("/signin");
      });
      return;
    }

    const { _id, title, poster, duration, year, rating, genre } = movie;
    const item = { movie_id: _id, email: user.email, title, poster, duration, year, rating, genre };

    axiosSecure.post("/watchlist", item).then((res) => {
      if (res.data.insertedId) {
        toast.success("Added to Watchlist!");
      } else {
        toast.error("Already in Watchlist!");
      }
    });
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-base-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-base-200 transition-all duration-300"
    >
      {/* Poster Section */}
      <NavLink
        to={`/movie-details/${movie._id}`}
        className="block relative h-80 overflow-hidden bg-base-200"
      >
        <LazyLoadImage
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          wrapperClassName="w-full h-full"
          src={movie.poster}
          alt={movie.title}
          effect="blur"
          width="100%"
          height="100%"
        />

        {/* Overlay effect */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Category Label */}
        <div className="absolute top-4 left-4">
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase text-white bg-primary/90 rounded-lg shadow-sm">
            {movie.genre?.split(",")[0]}
          </span>
        </div>

        {/* Interaction buttons on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
          {isWatchList || isFavorite ? (
            <div
              onClick={(e) => {
                e.preventDefault(); e.stopPropagation();
                if (isWatchList) onRemoveWatchlist(movie._id);
                if (isFavorite) setFavoriteId(movie._id);
              }}
              className="px-6 py-2 bg-error text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Trash2 size={16} /> <span>Remove</span>
            </div>
          ) : (
            <div className="px-6 py-2 bg-white text-primary font-bold rounded-xl flex items-center gap-2">
              <Eye size={16} /> <span>Details</span>
            </div>
          )}
        </div>

        {/* Favorite Icon */}
        {!isWatchList && !isFavorite && (
          <div className="absolute top-4 right-4" onClick={(e) => e.preventDefault()}>
            <button
              onClick={(e) => { e.stopPropagation(); onAddWatchlist(); }}
              className="p-2 bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-white hover:text-primary transition-colors"
            >
              <Heart className="w-4 h-4" />
            </button>
          </div>
        )}
      </NavLink>

      {/* Info Section */}
      <div className="p-5">
        <div className="flex justify-between items-start gap-4 mb-3">
          <NavLink
            to={`/movie-details/${movie._id}`}
            className="font-bold text-lg text-base-content line-clamp-1 hover:text-primary"
          >
            {movie.title}
          </NavLink>
          <div className="flex items-center gap-1 text-warning shrink-0">
            <Star size={14} className="fill-current" />
            <span className="text-xs font-bold">{movie.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-base-content/50 uppercase tracking-tighter border-t border-base-200 pt-4">
          <div className="flex items-center gap-1.5">
            <Calendar size={14} /> <span>{movie.year}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} /> <span>{movie.runtime}m</span>
          </div>
          {isEdit && !isWatchList && (
            <button
              onClick={() => onDeleteMovie(movie._id)}
              className="text-error hover:scale-110 transition-transform"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default memo(MovieCard);
