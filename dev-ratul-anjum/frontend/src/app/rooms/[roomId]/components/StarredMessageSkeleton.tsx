export const StarredMessageSkeleton = () => {
  return (
    <li className="border-b border-gray-100 animate-pulse">
      <article className="flex items-start p-3 sm:p-4 gap-3">
        {/* Avatar */}
        <aside className="shrink-0 mt-1">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-300" />
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Header */}
          <div className="flex justify-between items-center gap-2">
            <div className="h-4 w-40 sm:w-56 bg-gray-300 rounded" />
            <div className="h-3 w-12 bg-gray-200 rounded shrink-0" />
          </div>

          {/* Message Bubble */}
          <div className="flex items-center justify-between gap-2">
            <div className="relative px-3 py-2 rounded-lg bg-gray-200 max-w-[85%] sm:max-w-[80%] w-full">
              {/* Text lines */}
              <div className="space-y-2 pb-4">
                <div className="h-3 w-full bg-gray-300 rounded" />
                <div className="h-3 w-5/6 bg-gray-300 rounded" />
              </div>

              {/* Metadata */}
              <div className="absolute bottom-1 right-2 h-3 w-12 bg-gray-300 rounded" />
            </div>
          </div>
        </div>
      </article>
    </li>
  );
};

const StarredMessagesSkeletonList = () => {
  return (
    <section className="flex-1 overflow-y-auto custom-scrollbar">
      <ul className="flex flex-col">
        {Array.from({ length: 3 }).map((_, i) => (
          <StarredMessageSkeleton key={i} />
        ))}
      </ul>
    </section>
  );
};

export default StarredMessagesSkeletonList;
