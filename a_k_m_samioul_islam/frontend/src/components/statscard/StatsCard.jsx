import React from "react";

const StatsCard = ({ title, value }) => {
  return (
    <div className="group rounded-3xl border-2 border-white bg-black text-white p-6 transition-colors duration-500 hover:bg-white hover:text-black hover:border-black">
      <p className="text-sm uppercase tracking-[0.2em] text-gray-400 group-hover:text-black/60 transition-colors duration-500">
        {title}
      </p>
      <h2 className="mt-4 text-4xl font-bold">{value}</h2>
    </div>
  );
};

export default StatsCard;
