import MovieCard from "../components/MovieCard";
import { Link } from "react-router";
import { ArrowRight, Clock, Sparkles } from "lucide-react";

const RecentlyAdded = ({ sortedMovies, isLoading }) => {
  
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-96 bg-base-300 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <section className="py-20 bg-base-100">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-row justify-center sm:justify-between gap-4 mb-10 border-b border-base-200 pb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs max-sm:justify-center">
              <Clock size={16} />
              <span>New Arrivals</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-base-content">
              Recently <span className="text-primary">Added</span>
            </h2>
          </div>

          <Link
            to="/all-movies"
            className="hidden sm:flex group items-center gap-2 shrink-0 text-sm font-bold text-base-content/70 hover:text-primary transition-colors"
          >
            <span>Explore Library</span>
            <div className="p-1.5 rounded-full bg-base-200 group-hover:bg-primary group-hover:text-white transition-all">
              <ArrowRight size={16} className="group-hover:-rotate-45 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Movies Grid */}
        {sortedMovies.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedMovies.map((movie) => (
              <MovieCard key={movie._id} movie={movie} isEdit={false} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-base-200 rounded-3xl">
            <div className="p-4 bg-base-200 rounded-full mb-4">
              <Sparkles className="w-8 h-8 text-base-content/40" />
            </div>
            <h3 className="text-xl font-bold text-base-content">No Recent Movies</h3>
            <p className="text-base-content/60">Check back later for new additions.</p>
          </div>
        )}

        {/* Mobile View Explore Link */}
        <div className="flex sm:hidden justify-center mt-8">
          <Link
            to="/all-movies"
            className="group flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-base-200 hover:bg-primary hover:text-white rounded-full transition-all"
          >
            <span>Explore Library</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RecentlyAdded;
