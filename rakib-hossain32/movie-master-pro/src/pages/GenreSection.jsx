import React from "react";
import {
  Flame,
  Heart,
  Laugh,
  Ghost,
  Rocket,
  Skull,
  Zap,
  Search,
  Clapperboard,
} from "lucide-react";
import { Link } from "react-router";

const genres = [
  {
    name: "Action",
    icon: Flame,
    color: "from-orange-500 to-red-600",
    shadow: "shadow-orange-500/20",
    desc: "Adrenaline rush",
  },
  {
    name: "Drama",
    icon: Clapperboard,
    color: "from-purple-500 to-indigo-600",
    shadow: "shadow-purple-500/20",
    desc: "Emotional journey",
  },
  {
    name: "Comedy",
    icon: Laugh,
    color: "from-yellow-400 to-orange-500",
    shadow: "shadow-yellow-500/20",
    desc: "Feel good vibes",
  },
  {
    name: "Romance",
    icon: Heart,
    color: "from-pink-500 to-rose-600",
    shadow: "shadow-pink-500/20",
    desc: "Love & Passion",
  },
  {
    name: "Horror",
    icon: Ghost,
    color: "from-gray-700 to-black",
    shadow: "shadow-gray-900/20",
    desc: "Thrills & Chills",
  },
  {
    name: "Sci-Fi",
    icon: Rocket,
    color: "from-blue-500 to-cyan-500",
    shadow: "shadow-blue-500/20",
    desc: "Future worlds",
  },
];

const GenreSection = () => {
  return (
    <section className="pb-20 bg-base-100 relative overflow-hidden">
      {/* Background Decorative Blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl px-4 mx-auto sm:px-6 lg:px-8">
        {/* --- Premium Header --- */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-3">
            <Search className="w-3 h-3" />
            <span>Discover</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-base-content tracking-tight mb-4">
            Explore by{" "}
            <span className="text-primary relative inline-block">
              Genre
              <svg
                className="absolute w-full h-3 -bottom-1 left-0 text-primary/20"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                />
              </svg>
            </span>
          </h2>
          <p className="text-base-content/60 max-w-lg text-lg">
            Find the perfect movie for your mood from our curated categories.
          </p>
        </div>

        {/* --- Genre Grid --- */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {genres.map((genre, idx) => {
            const Icon = genre.icon;
            return (
              <Link
                to="/all-movies" // You can change this to filter by genre later
                key={idx}
                className="group relative h-48 rounded-4xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2"
              >
                {/* Background linear */}
                <div
                  className={`absolute inset-0 bg-linear-to-br ${genre.color} opacity-90 transition-all duration-300 group-hover:opacity-100`}
                />

                {/* Overlay Pattern/Noise (Optional for texture) */}
                <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-linears.vercel.app/noise.svg')] bg-repeat" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center z-10">
                  {/* Icon Circle */}
                  <div className="w-12 h-12 mb-3 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-12 shadow-lg">
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-lg font-bold text-white tracking-wide group-hover:scale-105 transition-transform">
                    {genre.name}
                  </h3>

                  <span className="text-[10px] font-medium text-white/80 uppercase tracking-wider mt-1 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {genre.desc}
                  </span>
                </div>

                {/* Shine Effect on Hover */}
                <div className="absolute top-[-150%] left-[-50%] w-[200%] h-[200%] bg-linear-to-b from-transparent via-white/20 to-transparent rotate-45 translate-y-full transition-transform duration-700 group-hover:translate-y-[-200%]" />
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default GenreSection;
