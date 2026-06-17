const ChatRowSkeleton = () => (
  <div className="flex items-center gap-3 border-b border-[#e9edef]/50 px-3 py-3 animate-pulse">
    <div className="h-12 w-12 rounded-full bg-[#e9edef]" />

    <div className="min-w-0 flex-1">
      <div className="flex items-baseline justify-between">
        <div className="h-4 w-1/3 rounded bg-[#e9edef]" />
        <div className="h-3 w-10 rounded bg-[#e9edef]" />
      </div>

      <div className="mt-2 h-3 w-3/4 rounded bg-[#e9edef]" />
    </div>
  </div>
);

export default ChatRowSkeleton;
