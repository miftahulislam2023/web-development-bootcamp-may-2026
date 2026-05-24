const CommonPageHeader = ({ title, subtitle }) => {
  return (
    <div className="relative py-20 lg:py-28 bg-base-100 overflow-hidden text-center">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-150 h-100 bg-primary/10 rounded-full blur-[100px] -z-10" />

      <div className="relative z-10 px-4">
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
          {title} <span className="text-primary">.</span>
        </h1>
        <p className="text-lg md:text-xl text-base-content/60 max-w-2xl mx-auto">
          {subtitle}
        </p>
      </div>
    </div>
  );
};

export default CommonPageHeader;
