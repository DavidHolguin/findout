import React from 'react';
import { Flame } from 'lucide-react';

const PromotionBadge = ({ promotion }) => {
  const isPercentage = promotion.discount_type === 'PERCENTAGE';

  return (
    <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
      <div className="relative group">
        <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg animate-bounce-slow">
          <Flame 
            className="w-6 h-6 text-orange-500 animate-pulse" 
            style={{
              filter: 'drop-shadow(0 0 8px rgba(249, 115, 22, 0.5))'
            }}
          />
        </div>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute bottom-full right-0 mb-2 whitespace-nowrap">
          <div className="bg-white dark:bg-gray-800 text-xs rounded-lg py-1 px-2 shadow-lg">
            {promotion.title}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-fade-in-right">
        {isPercentage ? (
          <span>-{promotion.discount_display}</span>
        ) : (
          <span>Ahorra ${promotion.discount_value}</span>
        )}
      </div>
    </div>
  );
};

const ProductCard = ({ product, onClick }) => {
  const hasPromotion = product.active_promotions && product.active_promotions.length > 0;
  const promotion = hasPromotion ? product.active_promotions[0] : null;

  return (
    <div
      className="flex-none w-[65%] snap-start cursor-pointer"
      style={{ scrollSnapAlign: 'start' }}
      onClick={onClick}
    >
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden relative">
        {hasPromotion && <PromotionBadge promotion={promotion} />}
        <ImageWithFallback 
          src={product.image_url} 
          alt={product.name} 
          className="w-full h-40 object-cover"
        />
        <div className="p-4">
          <h4 className="text-lg font-semibold leading-4 mb-2 dark:text-white">{product.name}</h4>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-4 line-clamp-2">{product.description}</p>
          <div className="mt-2 flex items-center gap-2">
            <p className="text-green-600 dark:text-green-400 font-bold">
              ${product.price}
            </p>
            {hasPromotion && (
              <p className="text-gray-400 line-through text-sm">
                ${(parseFloat(product.price) * (1 + parseFloat(promotion.discount_value)/100)).toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;