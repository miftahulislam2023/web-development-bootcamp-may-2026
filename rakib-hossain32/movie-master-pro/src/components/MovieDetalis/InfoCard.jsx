import React from 'react';

const InfoCard = ({ icon: Icon, label, value, sub }) => {
  return (
    <div className="p-5 rounded-2xl bg-base-100 border border-base-200 shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
      <div className="flex items-start justify-between mb-2">
        <div className="p-2 rounded-lg bg-base-200 text-base-content/60 group-hover:bg-primary group-hover:text-white transition-colors">
          <Icon size={20} />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-base-content/40">
          {sub}
        </span>
      </div>
      <h4 className="text-sm font-medium text-base-content/60 mb-0.5">
        {label}
      </h4>
      <p className="text-lg font-bold text-base-content">{value}</p>
    </div>
  );
};

export default InfoCard;