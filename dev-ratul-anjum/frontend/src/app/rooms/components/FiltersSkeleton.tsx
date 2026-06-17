const FiltersSkeleton = () => (
  <div className="scrollbar-hide flex gap-2 overflow-x-auto px-3 py-2 animate-pulse">
    <div className="h-6 w-10 rounded-full bg-[#e9edef]" /> {/* All */}
    <div className="h-6 w-16 rounded-full bg-[#e9edef]" /> {/* Unread */}
    <div className="h-6 w-20 rounded-full bg-[#e9edef]" /> {/* Favourites */}
    <div className="h-6 w-14 rounded-full bg-[#e9edef]" /> {/* Groups */}
  </div>
);

export default FiltersSkeleton;
