import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Calendar, Clock, TrendingUp, Search, Mail } from "lucide-react";
import CommonPageHeader from "../../components/CommonPageHeader";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
 import { LazyLoadImage } from "react-lazy-load-image-component";

const Blogs = () => {
  const [activeCategory, setActiveCategory] = useState("Trending");
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);


  const TMDB_API_KEY = "f548a75d4b897cae51002667efcb3a58"; // 

  const categories = ["Trending", "Upcoming", "Top Rated", "Now Playing"];


  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        let endpoint = "trending/movie/week"; 

       
        if (activeCategory === "Upcoming") endpoint = "movie/upcoming";
        else if (activeCategory === "Top Rated") endpoint = "movie/top_rated";
        else if (activeCategory === "Now Playing")
          endpoint = "movie/now_playing";

        const { data } = await axios.get(
          `https://api.themoviedb.org/3/${endpoint}?api_key=${TMDB_API_KEY}&language=en-US&page=1`
        );

       
        const formattedData = data.results.map((movie, index) => ({
          id: movie.id,
          title: movie.title,
          excerpt: movie.overview
            ? movie.overview
            : "No description available for this movie yet. Stay tuned for updates.",
          image: movie.backdrop_path
            ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
            : "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1459&auto=format&fit=crop", 
          category: activeCategory,
          author: "MovieMaster Team", 
          date: movie.release_date || "Coming Soon",
          readTime: `${Math.floor(Math.random() * 5) + 3} min read`, 
          featured: index === 0, 
          rating: movie.vote_average.toFixed(1),
        }));

        setNewsData(formattedData);
      } catch (error) {
        console.error("Error fetching news:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [activeCategory]);

  // Loading State
  if (loading) {
    return <LoadingSpinner />;
   
  }

  const featuredPost = newsData.length > 0 ? newsData[0] : null;
  const gridPosts = newsData.slice(1); 

  return (
    <div className="min-h-screen bg-base-100 py-20 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-150 h-150 bg-primary/5 rounded-full blur-[150px] -z-10" />

      {/* --- Header --- */}
      <CommonPageHeader
        title="Movie News & Insights"
        subtitle="Latest updates directly from the cinematic universe."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        
        {featuredPost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative w-full h-125 md:h-150 rounded-[2.5rem] overflow-hidden shadow-2xl mb-16 cursor-pointer"
          >
            {/* Background Image */}
            <LazyLoadImage
              src={featuredPost.image}
              alt={featuredPost.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              effect="blur"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-90" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary text-white text-xs font-bold uppercase tracking-wider mb-4">
                Featured: {featuredPost.category}
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 group-hover:text-primary transition-colors max-w-4xl">
                {featuredPost.title}
              </h2>
              <p className="text-lg text-gray-300 max-w-2xl line-clamp-2 mb-6 hidden md:block">
                {featuredPost.excerpt}
              </p>

              <div className="flex items-center gap-6 text-sm text-gray-400 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs">
                    MM
                  </div>
                  <span className="text-white">{featuredPost.author}</span>
                </div>
                <span className="flex items-center gap-2">
                  <Calendar size={16} /> {featuredPost.date}
                </span>
                <span className="flex items-center gap-2">
                  <Clock size={16} /> {featuredPost.readTime}
                </span>
              </div>
            </div>
          </motion.div>
        )}

     
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10">
          {/* Categories */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-base-content text-base-100 shadow-lg"
                    : "bg-base-200 text-base-content/60 hover:bg-base-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar (Visual Only for now) */}
          <div className="relative w-full md:w-80">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40"
              size={18}
            />
            <input
              type="text"
              placeholder="Search movies..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-base-200/50 border border-transparent focus:border-primary/50 focus:bg-base-100 outline-none transition-all font-medium text-sm"
            />
          </div>
        </div>

   
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-20">
          <AnimatePresence mode="popLayout">
            {gridPosts.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group flex flex-col md:flex-row gap-6 p-4 rounded-4xl bg-base-100 border border-base-content/5 hover:border-primary/30 transition-all hover:shadow-2xl"
              >
                {/* Image */}
                <div className="w-full md:w-56 h-56 shrink-0 rounded-2xl overflow-hidden relative">
                  <LazyLoadImage
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    effect="blur"
                  />
                  <div className="absolute top-3 left-3 bg-base-100/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider flex items-center gap-1">
                    <TrendingUp size={12} /> {post.rating}
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center flex-1 pr-4">
                  <div className="flex items-center gap-3 text-xs font-bold text-base-content/40 mb-3 uppercase tracking-wide">
                    <span className="text-primary">{post.category}</span>
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="text-2xl font-bold leading-tight mb-3 group-hover:text-primary transition-colors cursor-pointer line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-base-content/60 text-sm line-clamp-2 mb-5">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between mt-auto border-t border-base-content/5 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-base-300 flex items-center justify-center text-[10px] font-bold">
                        MM
                      </div>
                      <span className="text-xs font-bold text-base-content/70">
                        {post.author}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-base-content/40 flex items-center gap-1">
                      <Clock size={12} /> {post.readTime}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

       
        <div className="relative rounded-[3rem] overflow-hidden bg-gray-900 text-white p-10 md:p-16 text-center">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517604931442-710c8ed4a86c?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-primary/40 mb-4">
              <Mail size={32} />
            </div>
            <h2 className="text-3xl md:text-4xl font-black">
              Stay in the Loop!
            </h2>
            <p className="text-white/70 text-lg">
              Get the latest movie news, release dates, and exclusive content
              delivered straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 mt-8">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-6 py-4 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-primary outline-none transition-all font-medium"
              />
              <button className="px-8 py-4 bg-primary text-white font-bold rounded-xl hover:bg-red-600 transition-all shadow-lg hover:shadow-primary/30">
                Subscribe Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
