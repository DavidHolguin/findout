import React from 'react';

const SkeletonProductCard = () => (
  <div className="flex-none w-[65%] snap-start">
    <div className="bg-gray-100 dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden animate-pulse">
      <div className="w-full h-40 bg-gray-200 dark:bg-gray-700" />
      <div className="p-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </div>
    </div>
  </div>
);

const CompanyDetailSkeleton = () => {
  return (
    <div className="flex flex-col items-center font-poppins dark:bg-gray-900">
      {/* Profile Section Skeleton */}
      <section className="w-full mb-3 flex flex-col items-center">
        <div className="flex flex-col items-center mb-4 mt-2">
          {/* Profile Picture Skeleton */}
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
          
          {/* Name and Category Skeleton */}
          <div className="mt-2 text-center">
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
          </div>
        </div>

        {/* Categories Skeleton */}
        <div className="w-full flex gap-2 overflow-x-auto px-4 mb-2 pb-2">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="flex-shrink-0 h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"
            />
          ))}
        </div>

        {/* Info and Status Section Skeleton */}
        <div className="w-full px-3 pb-4">
          <div className="flex items-start gap-2">
            {/* Status Skeleton */}
            <div className="flex flex-col items-center min-w-fit">
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </div>

            {/* Description Skeleton */}
            <div className="flex-1 border-l border-gray-200 dark:border-gray-700 pl-4">
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-4/6 animate-pulse" />
              </div>
            </div>
          </div>
        </div>

        {/* Social Links Skeleton */}
        <div className="w-11/12 flex justify-center gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div 
              key={i}
              className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"
            />
          ))}
        </div>
      </section>

      {/* Products Section Skeleton */}
      <section className="w-full">
        {[1, 2].map((category) => (
          <div key={category} className="mb-6">
            {/* Category Title Skeleton */}
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-4 mx-4 animate-pulse" />
            
            {/* Products Carousel Skeleton */}
            <div className="flex gap-4 px-4 overflow-x-auto">
              {[1, 2, 3].map((product) => (
                <SkeletonProductCard key={product} />
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default CompanyDetailSkeleton;