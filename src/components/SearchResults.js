import React from 'react';

const CompanyCardSkeleton = () => (
  <div className="relative overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg animate-pulse">
    <div className="relative">
      {/* Cover image skeleton */}
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700" />
      
      {/* Logo skeleton */}
      <div className="absolute top-2 right-2 w-[55px] h-[55px] rounded-full bg-gray-300 dark:bg-gray-600" />
      
      {/* Status badge skeleton */}
      <div className="absolute top-2 left-2">
        <div className="w-32 h-6 bg-gray-300 dark:bg-gray-600 rounded-full" />
      </div>
    </div>
    
    <div className="p-4">
      {/* Title skeleton */}
      <div className="w-3/4 h-6 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      
      {/* Category skeleton */}
      <div className="w-1/2 h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      
      {/* Description skeleton */}
      <div className="space-y-2">
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="w-4/5 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  </div>
);

const ProductCardSkeleton = () => (
  <div className="relative rounded-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-pulse">
    {/* Image skeleton */}
    <div className="relative">
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700" />
      
      <div className="absolute top-0 left-0 right-0 p-2 flex justify-between items-start">
        {/* Company logo skeleton */}
        <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600" />
        
        {/* Price badge skeleton */}
        <div className="w-20 h-8 bg-gray-300 dark:bg-gray-600 rounded-full" />
      </div>
    </div>
    
    <div className="p-4">
      {/* Title skeleton */}
      <div className="w-3/4 h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      
      {/* Description skeleton */}
      <div className="space-y-2">
        <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="w-4/5 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
      
      {/* Footer skeleton */}
      <div className="mt-2 flex justify-between items-center">
        <div className="w-1/3 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="w-1/4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    </div>
  </div>
);

const SearchResults = ({ isLoading, activeTab, children }) => {
  if (!isLoading) return children;

  return (
    <div className={
      activeTab === 'companies' 
        ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
        : "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
    }>
      {Array.from({ length: 6 }).map((_, index) => (
        activeTab === 'companies' 
          ? <CompanyCardSkeleton key={index} />
          : <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default SearchResults;