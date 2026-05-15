import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import StatCard from "../components/StatCard";
import { Star, Film, Users, Calendar } from "lucide-react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { motion } from "framer-motion";

const Statistics = () => {
  const { movies } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [usersCollection, setUsersCollection] = useState([]);

  useEffect(() => {
    axiosSecure.get("/users").then((data) => {
      setUsersCollection(data.data);
    });
  }, [axiosSecure]);

  // Statistics Data Array
  const stats = [
    {
      id: 1,
      icon: Film,
      value: movies?.length || 0,
      label: "Total Movies",
    },
    {
      id: 2,
      icon: Users,
      value: usersCollection?.length || 0,
      label: "Active Users",
    },
    {
      id: 3,
      icon: Star,
      value: "4.8",
      label: "Average Rating",
    },
    {
      id: 4,
      icon: Calendar,
      value: new Date().getFullYear(),
      label: "Current Year",
    },
  ];

  return (
    <div className="relative py-20 overflow-hidden bg-base-100">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 mb-4 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-bold tracking-[0.2em] uppercase"
          >
            Our Impact
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-base-content mb-6 tracking-tight"
          >
            Trusted by{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-primary to-red-600">
              Movie Lovers
            </span>{" "}
            Worldwide
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-base-content/70 leading-relaxed"
          >
            Join millions of users who have made MovieMaster Pro their go-to
            platform for movie discovery, collection management, and cinematic
            exploration.
          </motion.p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard
              key={stat.id}
              icon={stat.icon}
              value={stat.value}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
