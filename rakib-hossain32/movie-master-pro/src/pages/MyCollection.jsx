import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useAxiosSecure from "../hooks/useAxiosSecure";
import {
  Film,
  Plus,
  Search,
  FolderOpen,
  Layers,
  Edit,
  Trash2,
  Eye,
  Star,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router";
import CommonPageHeader from "../components/CommonPageHeader";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import { LazyLoadImage } from "react-lazy-load-image-component";

const MyCollection = () => {
  const [myMovies, setMyMovies] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // --- Fetch Data ---
  useEffect(() => {
    if (user?.email) {
      axiosSecure
        .get(`/movies/my-collection?addedBy=${user?.email}`)
        .then((data) => {
          setMyMovies(data.data);
          setFilteredMovies(data.data);
          setIsLoading(false);
        })
        .catch(() => setIsLoading(false));
    }
  }, [axiosSecure, user]);

  // --- Search Logic ---
  useEffect(() => {
    const result = myMovies.filter((movie) =>
      movie.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMovies(result);
  }, [searchQuery, myMovies]);

  // --- Delete Logic ---
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/movies/${id}`).then((res) => {
          if (res.data.deletedCount > 0) {
            const remaining = myMovies.filter((m) => m._id !== id);
            setMyMovies(remaining);
            // Filtered list update
            setFilteredMovies((prev) => prev.filter((m) => m._id !== id));
            Swal.fire("Deleted!", "Your movie has been deleted.", "success");
          }
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-base-100 pb-20 relative overflow-hidden -mt-15">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-150 h-150 bg-primary/5 rounded-full blur-[150px] -z-10" />

      {/* --- Header Section --- */}
      <CommonPageHeader
        title="My Movies"
        subtitle="Manage the masterpieces you have contributed to the world."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* --- Toolbar --- */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-base-100/80 backdrop-blur-xl p-4 rounded-4xl shadow-lg border border-base-content/5 mb-8">
          <div className="flex items-center gap-3 pl-2">
            <div className="p-3 bg-base-200 rounded-2xl text-primary">
              <Layers size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-base-content">
                Total Items
              </h2>
              <p className="text-xs font-bold text-base-content/40 uppercase tracking-widest">
                {myMovies.length} Movies
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
            <div className="relative group w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 w-4 h-4 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-base-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <button
              onClick={() => navigate("/dashboard/add-movie")}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-primary/20 hover:-translate-y-0.5 active:scale-95"
            >
              <Plus size={18} /> <span>Create New</span>
            </button>
          </div>
        </div>

        {/* --- LIST VIEW (Table Style) --- */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-24 bg-base-200 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : filteredMovies.length === 0 ? (
          // Empty State
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center bg-base-100 border-2 border-dashed border-base-200 rounded-[3rem]"
          >
            <div className="relative">
              <div className="w-24 h-24 bg-base-200 rounded-3xl flex items-center justify-center mb-6 rotate-3">
                <FolderOpen className="w-10 h-10 text-base-content/30" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white shadow-lg animate-bounce">
                <Plus size={16} />
              </div>
            </div>
            <h3 className="text-2xl font-black text-base-content mb-2">
              {searchQuery ? "No matches found" : "Start Your Collection"}
            </h3>
            <p className="text-base-content/60 max-w-sm mb-8">
              {searchQuery
                ? `We couldn't find any movie matching "${searchQuery}"`
                : "You haven't contributed any movies yet. Share your cinematic taste with the world."}
            </p>
            {!searchQuery && (
              <button
                onClick={() => navigate("/dashboard/add-movie")}
                className="px-8 py-3 bg-base-content text-base-100 font-bold rounded-xl hover:scale-105 transition-transform"
              >
                Add First Movie
              </button>
            )}
          </motion.div>
        ) : (
          <div className="bg-base-100 border border-base-content/5 rounded-[2.5rem] shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-175">
                <thead className="bg-base-200/50">
                  <tr className="text-xs font-bold text-base-content/50 uppercase tracking-wider border-b border-base-content/5">
                    <th className="py-5 pl-8">Movie Details</th>
                    <th className="py-5">Genre</th>
                    <th className="py-5">Rating</th>
                    <th className="py-5 text-center">Year</th>
                    <th className="py-5 pr-8 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-content/5">
                  <AnimatePresence>
                    {filteredMovies.map((movie) => (
                      <motion.tr
                        key={movie._id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="group hover:bg-base-200/40 transition-colors"
                      >
                        <td className="py-4 pl-8">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-16 rounded-xl overflow-hidden shadow-sm shrink-0 bg-base-300">
                                {/* <img
                                  src={movie.poster}
                                  alt={movie.title}
                                  className="w-full h-full object-cover"
                                /> */}
                                <LazyLoadImage
                                  src={movie.poster}
                                  alt={movie.title}
                                  className="w-full h-full object-cover"
                                  effect="blur"
                                />
                            </div>
                            <div>
                              <h3 className="font-bold text-base-content text-base line-clamp-1">
                                {movie.title}
                              </h3>
                              <p className="text-xs text-base-content/50 flex items-center gap-1 mt-1">
                                <Clock size={12} /> {movie.runtime} min
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="px-3 py-1 rounded-lg bg-base-200 text-xs font-bold text-base-content/70 uppercase">
                            {movie.genre}
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-1 text-sm font-bold">
                            <Star
                              size={14}
                              className="text-yellow-500 fill-current"
                            />
                            {movie.rating}
                          </div>
                        </td>
                        <td className="py-4 text-center font-medium text-base-content/60">
                          {movie.year}
                        </td>
                        <td className="py-4 pr-8 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Edit */}
                            <button
                              onClick={() =>
                                navigate(`/dashboard/edit-movie/${movie._id}`)
                              }
                              className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"
                              title="Edit"
                            >
                              <Edit size={16} />
                            </button>
                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(movie._id)}
                              className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                            {/* View Details (Optional) */}
                            <button
                              onClick={() =>
                                navigate(`/movie-details/${movie._id}`)
                              }
                              className="p-2 rounded-lg bg-base-200 text-base-content/60 hover:bg-base-content hover:text-base-100 transition-all"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCollection;
