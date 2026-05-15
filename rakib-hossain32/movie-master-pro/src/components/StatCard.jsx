import React from "react";
import { motion } from "framer-motion";

const StatCard = ({ icon: Icon, value, label }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative group p-6 rounded-2xl border border-base-content/5 bg-base-100/50 backdrop-blur-xl shadow-lg hover:shadow-primary/10 overflow-hidden"
    >
      {/* Hover linear Background */}
      <div className="absolute inset-0 bg-linear-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Decorative Circle Blur */}
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500" />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icon Container */}
        <div className="mb-4 p-4 rounded-2xl bg-base-200/50 group-hover:bg-primary/10 transition-colors duration-300 ring-1 ring-base-content/5">
          <Icon className="w-8 h-8 text-primary transition-transform duration-300 group-hover:scale-110" />
        </div>

        {/* Value */}
        <h3 className="text-4xl font-black tracking-tight text-base-content mb-1 group-hover:text-primary transition-colors duration-300">
          {value}
        </h3>

        {/* Label */}
        <p className="text-sm font-bold uppercase tracking-widest text-base-content/60">
          {label}
        </p>
      </div>
    </motion.div>
  );
};

export default StatCard;
