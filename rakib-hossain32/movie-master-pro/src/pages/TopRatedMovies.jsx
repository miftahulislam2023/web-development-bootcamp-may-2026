
import MovieCard from "../components/MovieCard";
import { Link } from "react-router";
import { ArrowRight, Trophy } from "lucide-react";

const TopRatedMovies = ({ topRatedMovies: movies, isLoading }) => {
  // const { movies } = useAuth();
  // const [topRatedMovies, setTopRatedMovies] = useState([]);

  // useEffect(() => {
  //   // Sort movies by rating in descending order
  //   const topRated = [...movies].sort((a, b) => b.rating - a.rating);
  //   setTopRatedMovies(topRated);
  // }, [movies]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-96 bg-base-300 rounded-2xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <section className="pb-20 bg-base-100">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-row justify-center sm:justify-between gap-4 mb-10 border-b border-base-200 pb-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs max-sm:justify-center">
              <Trophy className="w-4 h-4" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-base-content tracking-tight">
              Top Rated <span className="text-primary">Movies</span>
            </h2>
          </div>

          <Link
            to="/all-movies"
            className="hidden sm:flex group items-center gap-2 text-sm font-bold text-base-content/70 hover:text-primary transition-colors"
          >
            <span>View All Movies</span>
            <div className="p-1 rounded-full bg-base-200 group-hover:bg-primary group-hover:text-white transition-all">
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* Movies Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie._id} movie={movie} isEdit={false} />
          ))}

          {/* Mobile only — bottom button */}
        <div className="flex sm:hidden justify-center mt-8">
          <Link
            to="/all-movies"
            className="group flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-base-200 hover:bg-primary hover:text-white rounded-full transition-all duration-300"
          >
            <span>View All Movies</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        </div>
      </div>
    </section>
  );
};

export default TopRatedMovies;
