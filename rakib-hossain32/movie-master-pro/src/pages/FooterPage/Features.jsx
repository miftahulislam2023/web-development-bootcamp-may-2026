import React from "react";
import CommonPageHeader from "../../components/CommonPageHeader";
import { Zap, Shield, Smartphone, Globe, Cloud, Film } from "lucide-react";

const featuresData = [
  {
    icon: Film,
    title: "4K Streaming Info",
    desc: "Detailed meta-data about 4K availability.",
  },
  {
    icon: Cloud,
    title: "Cloud Sync",
    desc: "Access your watchlist from any device, anywhere.",
  },
  {
    icon: Shield,
    title: "Secure Data",
    desc: "Enterprise-grade encryption for your personal data.",
  },
  {
    icon: Smartphone,
    title: "Mobile First",
    desc: "Optimized experience for phones and tablets.",
  },
  {
    icon: Globe,
    title: "Global Database",
    desc: "Movies from over 190 countries worldwide.",
  },
  {
    icon: Zap,
    title: "Instant Updates",
    desc: "Real-time updates on latest releases.",
  },
];

const Features = () => {
  return (
    <div className="min-h-screen bg-base-100 py-20">
      <CommonPageHeader
        title="Premium Features"
        subtitle="Everything you need to manage your cinematic life."
      />

      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {featuresData.map((item, idx) => (
          <div
            key={idx}
            className="p-8 rounded-4xl bg-base-200/50 border border-base-content/5 hover:border-primary/50 transition-all duration-300 group hover:-translate-y-2"
          >
            <div className="w-14 h-14 bg-base-100 rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
              <item.icon size={28} />
            </div>
            <h3 className="text-xl font-bold mb-3">{item.title}</h3>
            <p className="text-base-content/60">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Features;
