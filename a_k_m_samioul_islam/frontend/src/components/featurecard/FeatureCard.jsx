import React from 'react';

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="group rounded-3xl border border-black bg-white text-black p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white border text-black">
        <Icon size={22} strokeWidth={3} />
      </div>

      <h3 className="mt-6 text-2xl font-semibold tracking-tight">
        {title}
      </h3>

      <p className="mt-3 text-base leading-7 text-black/65">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;