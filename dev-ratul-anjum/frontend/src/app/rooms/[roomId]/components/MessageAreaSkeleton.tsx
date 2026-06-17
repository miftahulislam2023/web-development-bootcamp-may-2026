const MessageAreaSkeleton = ({ count = 10 }: { count?: number }) => {
  return (
    <section className="custom-scrollbar flex flex-1 flex-col-reverse gap-3 overflow-y-auto p-4">
      {Array.from({ length: count }).map((_, i) => {
        const isLeft = i % 2 === 0;

        return (
          <div
            key={i}
            className={`flex ${isLeft ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`rounded-lg shadow-sm p-2 max-w-[85%] sm:max-w-[60%] animate-pulse
                ${
                  isLeft
                    ? "rounded-tl-none bg-gray-200"
                    : "rounded-tr-none bg-green-200"
                }
              `}
            >
              {/* Message lines */}
              <div className="flex flex-col gap-2 px-1">
                <div className="h-3 w-40 rounded bg-gray-300" />
                <div className="h-3 w-52 rounded bg-gray-300" />
                <div className="h-3 w-28 rounded bg-gray-300" />
              </div>

              {/* Time + ticks */}
              <div className="flex justify-end gap-1 mt-2">
                <div className="h-2 w-10 rounded bg-gray-300" />
                {!isLeft && <div className="h-3 w-4 rounded bg-gray-300" />}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default MessageAreaSkeleton;
