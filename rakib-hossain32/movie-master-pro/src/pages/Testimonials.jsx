import React from "react";
import { Quote } from "lucide-react";
import { LazyLoadImage } from "react-lazy-load-image-component";

const reviews = [
  {
    name: "Alex Johnson",
    role: "Film Critic",
    text: "MovieMaster Pro has completely changed how I organize my watchlists. The UI is stunning and blazing fast.",
    img: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    name: "Sarah Williams",
    role: "Casual Viewer",
    text: "I love the recommendations! Finally, a platform that feels modern and actually cares about user experience.",
    img: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    name: "Michael Chen",
    role: "Director",
    text: "A must-have tool for anyone in the industry or just a movie buff. The database accuracy is top-notch.",
    img: "https://i.pravatar.cc/150?u=a04258114e29026302d",
  },
];

const Testimonials = () => {
  return (
    <section className="pb-20 bg-base-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-base-content mb-4">
            Loved by <span className="text-primary">Thousands</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div
              key={idx}
              className="relative p-8 rounded-4xl bg-base-100 border border-base-content/5 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <Quote className="absolute top-8 right-8 text-primary/10 w-12 h-12" />
              <div className="flex items-center gap-4 mb-6">
                <LazyLoadImage
                  src={review.img}
                  alt={review.name}
                  className="w-14 h-14 rounded-full border-2 border-primary/20"
                  effect="blur"
                />
                <div>
                  <h4 className="font-bold text-lg text-base-content">
                    {review.name}
                  </h4>
                  <p className="text-sm text-primary font-medium">
                    {review.role}
                  </p>
                </div>
              </div>
              <p className="text-base-content/70 italic leading-relaxed">
                "{review.text}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
