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

  const sortedMovies = [...(movies || [])]?.sort(
    (a, b) => new Date(b.createAt) - new Date(a.createAt)
  )?.slice(0, 6);

  const splicedMovies = movies?.slice(0, 6);
  const topRatedMovies = [...(movies || [])]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  // console.log(sortedMovies, topRatedMovies,isLoading, splicedMovies);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="overflow-x-hidden">
      {/* 1. Hero Section */}
      <Hero splicedMovies={splicedMovies} isLoading={isLoading} />

      {/* 2. Statistics (Proof of scale) */}
      <Statistics />

      {/* 3. Genre (Exploration) */}
      <GenreSection />

      {/* 4. Featured Collections (Curated Content) */}
      <FeaturedCollections />

      {/* 5. Top Rated (Quality Content) */}
      <TopRatedMovies topRatedMovies={topRatedMovies} isLoading={isLoading} />

      {/* 6. Membership/Pricing (Value Proposition) */}
      {/* <Membership /> */}

      {/* 7. Recently Added (Fresh Content) */}
      <RecentlyAdded sortedMovies={sortedMovies} isLoading={isLoading} />

      {/* 8. Testimonials (Social Proof) */}
      <Testimonials />

      {/* 9. About (Brand Story) */}
      <About />

      {/* 10. Newsletter (Final CTA) */}
      <Newsletter />
    </div>
  );
};

export default Home;
