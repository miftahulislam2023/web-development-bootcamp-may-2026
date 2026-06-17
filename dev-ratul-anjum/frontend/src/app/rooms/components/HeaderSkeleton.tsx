const HeaderSkeleton = () => (
  <header className="flex h-15 items-center justify-between bg-white px-4 py-2 animate-pulse">
    {/* Title */}
    <div className="h-6 w-24 rounded bg-[#e9edef]" />

    {/* Action icons */}
    <div className="flex gap-3">
      <div className="h-5 w-5 rounded bg-[#e9edef]" />
      <div className="h-5 w-5 rounded bg-[#e9edef]" />
    </div>
  </header>
);

export default HeaderSkeleton;
