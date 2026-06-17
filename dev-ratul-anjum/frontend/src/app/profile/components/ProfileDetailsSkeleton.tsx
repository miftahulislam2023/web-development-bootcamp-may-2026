const ProfileDetailsSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Image Skeleton */}
      <div className="flex justify-center py-7 bg-white">
        <div className="h-32 w-32 sm:h-40 sm:w-40 md:h-48 md:w-48 rounded-full bg-gray-300" />
      </div>

      {/* Name Skeleton */}
      <div className="bg-white px-8 py-6 mb-3">
        <div className="h-4 w-24 bg-gray-300 mb-4 rounded" />
        <div className="h-5 w-40 bg-gray-300 rounded" />
      </div>

      {/* Bio Skeleton */}
      <div className="bg-white px-8 py-6">
        <div className="h-4 w-20 bg-gray-300 mb-4 rounded" />
        <div className="h-5 w-56 bg-gray-300 rounded" />
      </div>
    </div>
  );
};

export default ProfileDetailsSkeleton;
