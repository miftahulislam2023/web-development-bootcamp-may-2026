import {
  ChevronLeft,
  Clock,
  Edit,
  Globe,
  Heart,
  Star,
  Trash2,
  Calendar,
  User,
  Film,
  Play,
  Share2,
} from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate, useParams } from "react-router";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { LazyLoadImage } from "react-lazy-load-image-component";

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // Fetch movie details
  const { data: movieData, isLoading, refetch } = useQuery({
    queryKey: ["movie", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/movies/${id}`);
      return res.data;
    },
  });

  // Check if movie is in watchlist
  const { data: watchlistData, refetch: refetchWatchlist } = useQuery({
    queryKey: ["watchlist", user?.email, movieData?._id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/watchlist/${movieData?._id}?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email && !!movieData?._id,
  });

  // Check if movie is saved in favorites (local)
  const { data: isSaved, refetch: refetchSavedStatus } = useQuery({
    queryKey: ["savedStatus", movieData?._id, user?.email],
    queryFn: () => {
      if (!user) return false;
      const savedMovies = JSON.parse(localStorage.getItem(`saved_${user.email}`) || "[]");
      return savedMovies.some((m) => m._id === movieData?._id);
    },
    enabled: !!movieData && !!user,
  });

  const handleDelete = () => {
    Swal.fire({
      title: "Delete Movie?",
      text: "This will remove the movie permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#D90429",
      cancelButtonColor: "#333",
      confirmButtonText: "Yes, Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/movies/${id}`).then((res) => {
          if (res.data.deletedCount) {
            navigate("/all-movies");
          }
        });
      }
    });
  };

  const onAddWatchlist = () => {
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "Please sign in to add movies to your watchlist.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#D90429",
        confirmButtonText: "Sign In",
      }).then((result) => {
        if (result.isConfirmed) navigate("/signin");
      });
      return;
    }

    const payload = {
      title: movieData?.title,
      id: movieData?._id,
      email: user?.email,
    };

    axiosSecure.post("/watchlist-create", payload).then((res) => {
      if (res.data.insertedId) {
        refetch();
        refetchWatchlist();
        Swal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: "Added to Watchlist",
          showConfirmButton: false,
          timer: 2000,
          background: "#D90429",
          color: "#fff",
        });
      }
    });
  };

  const onToggleSave = () => {
    if (!user) {
      Swal.fire({
        title: "Login Required",
        text: "Sign in to save favorites.",
        icon: "info",
      });
      return;
    }

    const saved = JSON.parse(localStorage.getItem(`saved_${user.email}`) || "[]");
    const exists = saved.some((m) => m._id === movieData._id);

    const updated = exists 
      ? saved.filter((m) => m._id !== movieData._id) 
      : [...saved, movieData];

    localStorage.setItem(`saved_${user.email}`, JSON.stringify(updated));
    refetchSavedStatus();

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: exists ? "info" : "success",
      title: exists ? "Removed from Favorites" : "Saved to Favorites",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const onShare = () => {
    if (navigator.share) {
      navigator.share({
        title: movieData.title,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Link Copied!",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-base-100">
      {/* Hero Banner Section */}
      <div className="relative w-full h-[85vh] overflow-hidden">
        <div className="absolute inset-0">
          <LazyLoadImage
            src={movieData.poster}
            alt={movieData.title}
            effect="blur"
            width="100%"
            height="100%"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-t from-base-100 via-transparent to-transparent" />
        </div>

        <div className="relative z-10 h-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col">
          <div className="pt-32 pb-4">
            <button
              onClick={() => navigate("/all-movies")}
              className="group flex items-center gap-2 text-white/80 hover:text-white"
            >
              <div className="p-2 rounded-full bg-black/30 backdrop-blur-sm group-hover:bg-black/50 transition-all">
                <ChevronLeft className="w-5 h-5" />
              </div>
              <span className="font-semibold hidden sm:inline">Back</span>
            </button>
          </div>

          <div className="flex-1 flex items-center">
            <div className="max-w-2xl space-y-6 -mt-20">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight">
                {movieData.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <div className="flex items-center gap-2 text-yellow-400 font-bold text-lg">
                  <Star className="w-5 h-5 fill-current" />
                  <span>{movieData.rating}</span>
                </div>
                <span className="text-white/50">•</span>
                <span className="font-semibold">{movieData.year}</span>
                <span className="text-white/50">•</span>
                <span>{movieData.runtime} min</span>
                <span className="text-white/50">•</span>
                <span className="px-3 py-1 border border-white/30 rounded text-xs font-bold uppercase tracking-wider">
                  {movieData.genre?.split(",")[0]}
                </span>
              </div>

              <p className="text-lg text-white/80 leading-relaxed line-clamp-3">
                {movieData.description}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  disabled={watchlistData}
                  onClick={onAddWatchlist}
                  className={`flex items-center gap-3 px-8 py-4 rounded-lg font-bold text-base transition-all ${
                    watchlistData
                      ? "bg-white/20 text-white/50 cursor-not-allowed"
                      : "bg-white text-black hover:bg-white/90"
                  }`}
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>{watchlistData ? "In Watchlist" : "Add to Watchlist"}</span>
                </button>

                <button
                  onClick={onToggleSave}
                  className={`flex items-center gap-3 px-8 py-4 rounded-lg backdrop-blur-sm font-bold transition-all ${
                    isSaved ? "bg-primary text-white" : "bg-white/20 text-white hover:bg-white/30"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isSaved ? "fill-current" : ""}`} />
                  <span className="hidden sm:inline">{isSaved ? "Saved" : "Save"}</span>
                </button>

                <button
                  onClick={onShare}
                  className="p-4 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Content Details */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 space-y-16">
        <section>
          <h2 className="text-3xl font-bold text-base-content mb-8">Cast</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {movieData.cast.map((actor, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="aspect-square rounded-xl bg-linear-to-br from-primary/20 to-red-600/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <span className="text-4xl font-black text-primary">
                    {actor.trim().charAt(0)}
                  </span>
                </div>
                <p className="text-sm font-semibold text-base-content text-center">
                  {actor.trim()}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-base-content/50 uppercase tracking-wider mb-2">About</h3>
              <p className="text-lg text-base-content/80 leading-relaxed">{movieData.description}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <User className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-base-content/50 mb-1">Director</p>
                  <p className="text-base font-semibold text-base-content">{movieData.director}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Globe className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-base-content/50 mb-1">Language</p>
                  <p className="text-base font-semibold text-base-content">{movieData.language}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Film className="w-5 h-5 text-primary mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-base-content/50 mb-1">Country</p>
                  <p className="text-base font-semibold text-base-content">{movieData.country}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-base-content/50 uppercase tracking-wider mb-4">Movie Info</h3>
              <div className="space-y-3">
                {[
                  { label: "Release Year", value: movieData.year },
                  { label: "Runtime", value: `${movieData.runtime} minutes` },
                  { label: "Genre", value: movieData.genre },
                ].map((info, i) => (
                  <div key={i} className="flex justify-between py-3 border-b border-base-content/10">
                    <span className="text-base-content/60">{info.label}</span>
                    <span className="font-semibold text-base-content">{info.value}</span>
                  </div>
                ))}
                <div className="flex justify-between py-3 border-b border-base-content/10">
                  <span className="text-base-content/60">Rating</span>
                  <span className="font-semibold text-yellow-500 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" /> {movieData.rating}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="text-base-content/60">Added By</span>
                  <span className="font-semibold text-base-content">{movieData.addedBy?.split("@")[0]}</span>
                </div>
              </div>
            </div>

            {user?.email === movieData.addedBy && (
              <div className="pt-6 border-t border-base-content/10">
                <h3 className="text-sm font-bold text-base-content/50 uppercase tracking-wider mb-4">Manage</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/edit-movie/${movieData._id}`)}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition-all"
                  >
                    <Edit className="w-4 h-4" /> <span>Edit Movie</span>
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-base-200 text-base-content font-semibold hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 className="w-4 h-4" /> <span>Delete</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-base-content mb-8">Poster Gallery</h2>
          <div className="max-w-md">
            <div className="relative group rounded-2xl overflow-hidden shadow-2xl">
              <LazyLoadImage
                src={movieData.poster}
                alt={movieData.title} 
                effect="blur"
                width="100%"
                height="auto"
                className="w-full h-auto"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center cursor-pointer transform group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 text-white fill-white pl-1" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MovieDetails;
