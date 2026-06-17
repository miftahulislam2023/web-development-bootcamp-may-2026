const AttachmentsSkeleton = ({ count = 2 }) => {
  return (
    <section className="flex-1 overflow-y-auto custom-scrollbar">
      <ul className="flex flex-col pb-4">
        <div
          className={`grid gap-1 px-5 py-2 rounded-lg mb-5 ${
            count > 1 ? "grid-cols-2" : "grid-cols-1"
          }`}
        >
          {Array.from({ length: count }).map((_, idx) => (
            <div key={idx} className="flex justify-center">
              <div className="w-full max-w-75 sm:max-w-100">
                {/* Image Skeleton */}
                <div className="aspect-4/3 w-full rounded-lg bg-gray-200 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </ul>
    </section>
  );
};

export default AttachmentsSkeleton;
