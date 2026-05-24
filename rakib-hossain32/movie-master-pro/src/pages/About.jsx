import React from "react";
import { Film, Star, Sliders, ShieldCheck, Globe, Zap } from "lucide-react";

const features = [
  {
    title: "Organize Collection",
    desc: "Curate your personal library. Add, edit, and manage your favorite films effortlessly in one secure place.",
    icon: Film,
  },
  {
    title: "Discover Top Hits",
    desc: "Stay ahead of the curve. Explore trending, top-rated, and critically acclaimed movies updated in real-time.",
    icon: Star,
  },
  {
    title: "Advanced Filtering",
    desc: "Find exactly what you want. Filter by genre, rating, release year, or duration with our powerful search engine.",
    icon: Sliders,
  },
  {
    title: "Secure Platform",
    desc: "Your data is safe with us. We use enterprise-grade security to protect your account and collection.",
    icon: ShieldCheck,
  },
  {
    title: "Global Database",
    desc: "Access a massive database of movies from around the world, complete with posters, cast, and crew info.",
    icon: Globe,
  },
  {
    title: "Lightning Fast",
    desc: "Experience zero lag. Our platform is optimized for speed, ensuring a smooth browsing experience on any device.",
    icon: Zap,
  },
];

const About = () => {
  return (
    <section id="#about" className="relative pb-20 bg-base-100 overflow-hidden">
      {/* --- Background Ambient Glow --- */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-125 bg-primary/5 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl px-6 mx-auto">
        {/* --- Header Section --- */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            About The Platform
          </div>

          <h2 className="text-4xl md:text-5xl font-black text-base-content mb-6 tracking-tight leading-tight">
            Redefining How You <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-orange-600">
              Experience Cinema
            </span>
          </h2>

          <p className="text-lg text-base-content/70 leading-relaxed">
            MovieMaster Pro isn't just a database; it's your ultimate companion
            for the cinematic journey. Designed for enthusiasts, built for
            performance.
          </p>
        </div>

        {/* --- Features Grid (Bento Style) --- */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group relative p-8 rounded-4xl bg-base-100 border border-base-200 hover:border-primary/30 shadow-lg hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden"
              >
                {/* Hover linear Background */}
                <div className="absolute inset-0 bg-linear-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className="w-14 h-14 mb-6 rounded-2xl bg-base-200 group-hover:bg-primary flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-inner group-hover:shadow-lg group-hover:rotate-3">
                    <Icon className="w-7 h-7 text-base-content group-hover:text-white transition-colors duration-500" />
                  </div>

                  {/* Text */}
                  <h3 className="text-xl font-bold text-base-content mb-3 group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-base-content/60 leading-relaxed text-sm">
                    {feature.desc}
                  </p>
                </div>

                {/* Decorative Corner Shape */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-base-200/50 to-transparent rounded-bl-[4rem] -mr-8 -mt-8 transition-all duration-500 group-hover:from-primary/10" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default About;
