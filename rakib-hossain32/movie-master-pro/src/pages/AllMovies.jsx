import React, { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import MovieCard from "../components/MovieCard";
import { Plus, Search, SlidersHorizontal, Star, X } from "lucide-react";
import { useNavigate } from "react-router";
import useAxiosSecure from "../hooks/useAxiosSecure";
import CommonPageHeader from "../components/CommonPageHeader";


const AllMovies = () => {
  const { user: currentUser } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [filterGenres, setFilterGenres] = useState([]);
  const [ratingRange, setRatingRange] = useState([0, 10]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false); // Mobile filter toggle
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  const genres = useMemo(() => [
    "Action",
    "Drama",
    "Comedy",
    "Sci-Fi",
    "Horror",
    "Romance",
    "Thriller",
    "Animation",
    "Crime",
    "Adventure",
  ], []);

  const handleGenreClick = (genre) => {
    setFilterGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // 1. Initial State for Pagination
  const [visibleCount, setVisibleCount] = useState(12);

  // 2. Fetch Logic using React Query
  const { data: movies = [], isLoading } = useQuery({
    queryKey: ["movies", filterGenres, ratingRange, debouncedSearchQuery],
    queryFn: async () => {
      const genresParam = filterGenres.join(",");
      const [minRating, maxRating] = ratingRange;

      const { data } = await axiosSecure.get(
        filterGenres.length || ratingRange[0] > 0 || debouncedSearchQuery
          ? `/movies/filter?genres=${genresParam}&minRating=${minRating}&maxRating=${maxRating}&search=${debouncedSearchQuery}`
          : "/movies"
      );

      // Reset pagination when data changes
      setVisibleCount(12);

      // Local search filter if API doesn't support it fully or for extra safety
      if (debouncedSearchQuery) {
        return data.filter((movie) =>
          movie.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
        );
      }
      return data;
    },
    placeholderData: (previousData) => previousData,
  });

  // 3. Computed visible movies
  const visibleMovies = useMemo(() => {
    return movies.slice(0, visibleCount);
  }, [movies, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 12);
  };

  return (
    <div className="min-h-screen bg-base-100 py-20 font-poppins">
      {/* --- Header Section --- */}
      <CommonPageHeader
        title="Browse Movies"
        subtitle="Discover your next favorite film from our curated collection."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        {/* --- Top Controls Bar (Search & Add) --- */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-base-100 p-4 rounded-2xl shadow-lg border border-base-200 mb-8">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 w-5 h-5" />
            <input
              type="text"
              placeholder="Search movies..."
              className="w-full pl-12 pr-4 py-3 bg-base-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 bg-base-200 rounded-xl font-bold text-base-content hover:bg-base-300 transition-colors"
            >
              <SlidersHorizontal size={20} /> Filters
            </button>

            {currentUser && (
              <button
                onClick={() => navigate("/add-movie")}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-primary/20 active:scale-95"
              >
                <Plus size={20} />{" "}
                <span className="hidden sm:inline">Add Movie</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* --- SIDEBAR FILTERS (Left) --- */}
          <aside
            className={`lg:block ${showFilters ? "block" : "hidden"} space-y-8`}
          >
            <div className="bg-base-100 p-6 rounded-3xl border border-base-200 shadow-sm sticky top-24">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <SlidersHorizontal size={20} className="text-primary" />{" "}
                  Filters
                </h3>
                {(filterGenres.length > 0 || ratingRange[0] > 0) && (
                  <button
                    onClick={() => {
                      setFilterGenres([]);
                      setRatingRange([0, 10]);
                    }}
                    className="text-xs text-primary font-bold hover:underline transition-all"
                  >
                    Reset All
                  </button>
                )}
              </div>

              {/* Genre Filter */}
              <div className="mb-8">
                <h4 className="font-bold text-sm uppercase tracking-wider text-base-content/50 mb-4">
                  Genres
                </h4>
                <div className="flex flex-wrap gap-2">
                  {genres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => handleGenreClick(genre)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${filterGenres.includes(genre)
                        ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                        : "bg-base-200 text-base-content/70 border-transparent hover:border-base-content/20 hover:bg-base-300"
                        }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <div className="flex justify-between mb-4">
                  <h4 className="font-bold text-sm uppercase tracking-wider text-base-content/50">
                    Rating
                  </h4>
                  <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-1 rounded">
                    {ratingRange[0]} - {ratingRange[1]}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={ratingRange[0]}
                  onChange={(e) =>
                    setRatingRange([parseFloat(e.target.value), ratingRange[1]])
                  }
                  className="w-full h-2 bg-base-200 rounded-lg appearance-none cursor-pointer accent-primary mb-2 transition-all"
                />
                <div className="flex justify-between text-[10px] text-base-content/40 font-bold px-1">
                  <span>0</span>
                  <span>5</span>
                  <span>10</span>
                </div>
              </div>
            </div>
          </aside>

          {/* --- MAIN GRID (Right) --- */}
          <main className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-100 bg-base-200 rounded-2xl animate-pulse border border-base-300"
                  />
                ))}
              </div>
            ) : movies.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-base-100 rounded-4xl border-2 border-dashed border-base-200 text-center">
                <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-base-content/30" />
                </div>
                <h3 className="text-xl font-bold text-base-content">
                  No movies found
                </h3>
                <p className="text-base-content/60 max-w-xs mt-2">
                  Try adjusting your filters or search query to find what you're
                  looking for.
                </p>
                <button
                  onClick={() => {
                    setFilterGenres([]);
                    setRatingRange([0, 10]);
                    setSearchQuery("");
                  }}
                  className="mt-6 text-primary font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="space-y-12">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {visibleMovies.map((movie) => (
                    <MovieCard
                      key={movie._id}
                      movie={movie}
                      isEdit={false}
                      isAllMovies={true}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {visibleCount < movies.length && (
                  <div className="flex justify-center pt-8">
                    <button
                      onClick={handleLoadMore}
                      className="px-12 py-4 bg-base-200 hover:bg-base-300 text-base-content font-bold rounded-2xl transition-all border border-base-300 hover:border-primary/30 flex items-center gap-2 group"
                    >
                      <span>Load More Movies</span>
                      <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AllMovies;
