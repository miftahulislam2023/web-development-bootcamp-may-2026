const ContactInfoSkeleton = () => {
  return (
    <div className="space-y-3 animate-pulse">
      {/* Profile Section */}
      <div className="flex flex-col items-center bg-white p-4 shadow-sm rounded-lg">
        <div className="mb-3 h-26 w-26 rounded-full bg-gray-300 sm:h-26 sm:w-26"></div>

        <div className="h-3 w-28 rounded bg-gray-300 mb-1 sm:w-32"></div>
        <div className="h-3 w-32 rounded bg-gray-200 sm:w-36"></div>

        {/* Action Buttons */}
        <div className="mt-4 flex w-full justify-center gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="h-6 w-6 rounded-lg bg-gray-200"></div>
              <div className="h-2.5 w-6 rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white p-3 shadow-sm rounded-lg">
        <div className="h-2.5 w-16 rounded bg-gray-200 mb-2"></div>
        <div className="space-y-1.5">
          <div className="h-2.5 w-full rounded bg-gray-200 sm:w-5/6"></div>
          <div className="h-2.5 w-full rounded bg-gray-200 sm:w-4/6"></div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfoSkeleton;
