import React, { memo } from "react";
import { Heart, Star, Trash2, Calendar, Clock, Eye } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { LazyLoadImage } from "react-lazy-load-image-component";
// import "react-lazy-load-image-component/src/effects/blur.css";

const MovieCard = ({ movie, isEdit, setId, isWatchList, setWatchId }) => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleMovieDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D90429", // Primary Red
      cancelButtonColor: "#8D99AE", // Secondary Gray
      confirmButtonText: "Yes, delete it!",
      background: "#fff",
      color: "#000",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/movies/${id}`).then((data) => {
          if (data.data.deletedCount) {
            setId(id);
            Swal.fire({
              title: "Deleted!",
              text: "Movie has been removed.",
              icon: "success",
              confirmButtonColor: "#D90429",
            });
          }
        });
      }
    });
  };

  // console.log(movie)

  const handleWatchlistDelete = (id) => {
    Swal.fire({
      title: "Remove from Watchlist?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D90429",
      cancelButtonColor: "#8D99AE",
      confirmButtonText: "Yes, remove!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/watchlist/${id}`).then((data) => {
          if (data.data.deletedCount) {
            setWatchId(id);
            Swal.fire({
              title: "Removed!",
              text: "Movie removed from watchlist.",
              icon: "success",
              confirmButtonColor: "#D90429",
            });
          }
        });
      }
    });
  };

  const handleWatchlistAdd = () => {
    if (user && user?.email) {
      const { _id, title, poster, duration, year, rating, genre } = movie;
      const watchItem = {
        movie_id: _id,
        email: user.email,
        title,
        poster,
        duration,
        year,
        rating,
        genre
      };

      axiosSecure.post("/watchlist", watchItem).then((data) => {
        if (data.data.insertedId) {
          toast.success("Added to Watchlist!");
        } else {
          toast.error("Already in Watchlist!");
        }
      });
    } else {
      Swal.fire({
        title: "Please Login",
        text: "You need to login to add to watchlist",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Login"
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/signin");
        }
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-base-100 rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-base-200 hover:border-primary/20 transition-all duration-300"
    >
      {/* Poster Image */}
      {/* Poster Image (Clickable Link) */}
      <NavLink
        to={`/movie-details/${movie._id}`}
        className="block relative h-80 overflow-hidden bg-base-200 cursor-pointer"
      >
        {/* <img
          src={movie.poster}
          alt={movie.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/400x600/1f2937/ffffff?text=No+Poster";
          }}
        /> */}
        <LazyLoadImage
        className=""
          src={movie.poster}
          alt={movie.title}
          effect="blur"
          width="100%"
          height={300}
        />

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Genre Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white bg-primary/90 backdrop-blur-md rounded-lg shadow-sm">
            {movie.genre?.split(",")[0]}
          </span>
        </div>

        {/* Detail/Remove Button (appears on hover) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
          {isWatchList ? (
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleWatchlistDelete(movie._id);
              }}
              className="px-6 py-2.5 bg-error text-white font-bold rounded-xl shadow-xl hover:bg-red-700 transition-all transform active:scale-95 flex items-center gap-2 cursor-pointer pointer-events-auto"
            >
              <Trash2 size={18} />
              <span>Remove</span>
            </div>
          ) : (
            <div className="px-6 py-2.5 bg-white text-primary font-bold rounded-xl shadow-xl hover:bg-primary hover:text-white transition-all transform active:scale-95 flex items-center gap-2 pointer-events-none">
              <Eye size={18} />
              <span>Details</span>
            </div>
          )}
        </div>

        {/* Top Right Actions - Stop Propagation to prevent navigating when clicking heart */}
        <div
          className="absolute top-4 right-4"
          onClick={(e) => e.preventDefault()}
        >
          {isWatchList ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                handleWatchlistDelete(movie._id);
              }}
              className="p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-white" />
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent navigating to details
                e.preventDefault(); // Prevent navigating to details (double check for NavLink)
                handleWatchlistAdd();
              }}
              className="p-2 bg-black/30 backdrop-blur-sm text-white rounded-full hover:bg-white hover:text-primary transition-colors cursor-pointer"
            >
              <Heart className="w-4 h-4" />
            </button>
          )}
        </div>
      </NavLink>

      {/* Content */}
      <div className="p-5 ">
        <div className="flex justify-between items-start gap-4 mb-3">
          <NavLink
            to={`/movie-details/${movie._id}`}
            className="font-bold text-lg text-base-content line-clamp-1 leading-tight hover:text-primary transition-colors cursor-pointer"
          >
            {movie.title}
          </NavLink>
          <div className="flex items-center gap-1 text-warning shrink-0">
            <Star size={14} className="fill-current" />
            <span className="text-xs font-bold">{movie.rating}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-base-content/50 uppercase tracking-tighter border-t border-base-200 pt-4">
          <div className="flex items-center gap-1.5 ">
            <Calendar size={14} />
            <span>{movie.year}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={14} />
            <span>{movie.runtime}m</span>
          </div>
          {isEdit && !isWatchList && (
            <button
              onClick={() => handleMovieDelete(movie._id)}
              className="text-error hover:text-red-700 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {/* Mobile-Only Details/Remove Button */}
        <div className="lg:hidden">
          {isWatchList ? (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleWatchlistDelete(movie._id);
              }}
              className="w-full py-2 bg-error/10 hover:bg-error hover:text-white text-error font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2 mt-5"
            >
              <Trash2 size={14} />
              <span>Remove</span>
            </button>
          ) : (
            <NavLink
              to={`/movie-details/${movie._id}`}
              className="w-full py-2 bg-base-200/50 hover:bg-primary hover:text-white text-base-content font-bold rounded-lg  transition-colors flex items-center justify-center gap-2 mt-4"
            >
              <Eye size={14} />
              <span>View Details</span>
            </NavLink>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default memo(MovieCard);
