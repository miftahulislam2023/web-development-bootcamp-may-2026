import Hero from "../components/Hero";
import Statistics from "./Statistics";
import GenreSection from "./GenreSection";
import FeaturedCollections from "./FeaturedCollections";
import TopRatedMovies from "./TopRatedMovies";
import RecentlyAdded from "./RecentlyAdded";
import Testimonials from "./Testimonials";
import About from "./About";
import Newsletter from "./Newsletter";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";

const Home = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: movies, isLoading } = useQuery({
    queryKey: ["home-data", user?.email],
    queryFn: async () => {
      const response = await axiosSecure.get("/movies", {
        email: user?.email,
      });
      return response.data;
    },
  });

  // Prepare movie lists for different sections
  const recentMovies = [...(movies || [])]
    .sort((a, b) => new Date(b.createAt) - new Date(a.createAt))
    .slice(0, 6);

  const heroMovies = movies?.slice(0, 6);

  const topMovies = [...(movies || [])]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="overflow-x-hidden">
      <Hero splicedMovies={heroMovies} isLoading={isLoading} />

      <Statistics />

      <GenreSection />

      <FeaturedCollections />

      <TopRatedMovies topRatedMovies={topMovies} isLoading={isLoading} />

      <RecentlyAdded sortedMovies={recentMovies} isLoading={isLoading} />

      <Testimonials />

      <About />

      <Newsletter />
    </div>
  );
};

export default Home;
