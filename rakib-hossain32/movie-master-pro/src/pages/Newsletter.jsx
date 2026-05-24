import React from "react";
import { Mail, Send } from "lucide-react";

const Newsletter = () => {
  return (
    <section className="pb-20 bg-base-100 relative">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="w-20 h-20 mx-auto bg-base-200 rounded-4xl flex items-center justify-center mb-8 rotate-3 hover:rotate-6 transition-transform">
          <Mail className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-4xl md:text-5xl font-black text-base-content mb-6 tracking-tight">
          Never Miss a Premiere
        </h2>
        <p className="text-xl text-base-content/60 mb-10 max-w-2xl mx-auto">
          Join 50,000+ movie lovers. Get the latest trailers, reviews, and
          personalized recommendations straight to your inbox.
        </p>

        <form className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto relative">
          <input
            type="email"
            placeholder="Enter your email address"
            className="flex-1 px-6 py-4 rounded-2xl bg-base-200 border-2 border-transparent focus:border-primary/50 focus:bg-base-100 outline-none transition-all text-lg"
          />
          <button className="px-8 py-4 rounded-2xl bg-primary text-white font-bold text-lg shadow-lg shadow-primary/30 hover:bg-red-700 transition-all flex items-center justify-center gap-2">
            Subscribe <Send size={20} />
          </button>
        </form>
        <p className="mt-4 text-xs text-base-content/40 font-medium uppercase tracking-widest">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
};

export default Newsletter;
