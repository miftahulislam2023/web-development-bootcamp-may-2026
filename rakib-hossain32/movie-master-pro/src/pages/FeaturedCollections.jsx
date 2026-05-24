import React from "react";
import { ArrowRight, Layers, Sparkles, Trophy } from "lucide-react";
import { Link } from "react-router";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const collections = [
  {
    title: "Oscar Winners",
    count: "45 Movies",
    icon: Trophy,
    color: "from-yellow-500 to-amber-600",
    image:
      "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Weekend Binges",
    count: "12 Series",
    icon: Layers,
    color: "from-purple-500 to-indigo-600",
    image:
      "https://images.unsplash.com/photo-1608737739007-f0019bc67f59?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YmluZ2UlMjB3YXRjaHxlbnwwfHwwfHx8MA%3D%3D",
  },
  {
    title: "Hidden Gems",
    count: "28 Movies",
    icon: Sparkles,
    color: "from-emerald-500 to-teal-600",
    image:
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=800&auto=format&fit=crop",
  },
];

const FeaturedCollections = () => {
  return (
    <section className="pb-20 bg-base-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-base-content tracking-tight">
              Curated <span className="text-primary">Collections</span>
            </h2>
            <p className="text-base-content/60 mt-2">
              Handpicked lists for every mood.
            </p>
          </div>
          <Link
            to="/all-movies"
            className="hidden md:flex items-center gap-2 font-bold text-primary hover:underline"
          >
            View All Collections <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {collections.map((item, idx) => (
            <div
              key={idx}
              className="group relative h-80 rounded-4xl overflow-hidden cursor-pointer"
            >
              {/* Background Image */}
              {/* <img
                src={item.image}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              /> */}
              <LazyLoadImage
                src={item.image}
                alt={item.title}
                effect="blur"
                width="100%"
                height={300}
              />

              {/* linear Overlay */}
              <div
                className={`absolute inset-0 bg-linear-to-t ${item.color} opacity-80 mix-blend-multiply transition-opacity duration-300`}
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <div className="flex items-center gap-2 text-white/80 text-sm font-bold uppercase tracking-wider mb-2">
                  <item.icon size={16} />
                  <span>{item.count}</span>
                </div>
                <h3 className="text-3xl font-black text-white leading-none group-hover:-translate-y-2 transition-transform duration-300">
                  {item.title}
                </h3>
                <div className="mt-4 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <Link
                    to={"all-movies"}
                    className="inline-flex items-center gap-2 text-white font-bold text-sm border-b border-white"
                  >
                    Explore <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
