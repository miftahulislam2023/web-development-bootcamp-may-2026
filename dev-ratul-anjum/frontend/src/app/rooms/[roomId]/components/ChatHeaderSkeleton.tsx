const ChatHeaderSkeleton = () => {
  return (
    <header className="z-10 flex h-15 w-full items-center justify-between border-b border-[#e9edef] bg-[#f0f2f5] px-4 py-2">
      {/* Left side */}
      <div className="flex items-center gap-3">
        {/* Back button skeleton (mobile only) */}
        <div className="md:hidden h-5 w-5 rounded bg-gray-300 animate-pulse" />

        {/* Avatar skeleton */}
        <div className="h-10 w-10 rounded-full bg-gray-300 animate-pulse" />

        {/* Name skeleton */}
        <div className="flex flex-col gap-2">
          <div className="h-4 w-32 rounded bg-gray-300 animate-pulse" />
          <div className="h-3 w-20 rounded bg-gray-200 animate-pulse md:hidden" />
        </div>
      </div>

      {/* Right side icons */}
      <div className="flex items-center gap-5">
        <div className="h-4 w-4 rounded bg-gray-300 animate-pulse" />
        <div className="h-5 w-5 rounded bg-gray-300 animate-pulse" />
        <div className="h-5 w-5 rounded bg-gray-300 animate-pulse hidden sm:block" />
        <div className="h-5 w-5 rounded bg-gray-300 animate-pulse" />
      </div>
    </header>
  );
};
export default ChatHeaderSkeleton;
