import React from 'react';
import { Flame, Clock, Star } from 'lucide-react';

const BadgesSection = ({ badges }) => {
  const getBadgeContent = (badge) => {
    switch (badge.badge_type) {
      case 'RECORD_TIME':
        return {
          icon: (
            <div className="relative">
              <Clock 
                className="w-8 h-8 text-blue-500"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))'
                }}
              />
              <div className="absolute inset-0 animate-[spin_3s_linear_infinite] origin-center">
                <div className="absolute top-0 left-1/2 -translate-x-[1px] h-1/2 w-[2px] origin-bottom">
                  <div className="w-[2px] h-full bg-gradient-to-t from-transparent to-blue-500"></div>
                </div>
              </div>
            </div>
          ),
          gradient: 'from-blue-100 to-cyan-100',
          textGradient: 'from-blue-500 to-cyan-500'
        };
      
      case 'TOP_RATED':
        return {
          icon: (
            <div className="relative">
              <Star 
                className="w-8 h-8 text-yellow-500 animate-[ping_1s_ease-in-out_infinite]"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(234, 179, 8, 0.5))'
                }}
              />
              <div className="absolute inset-0 animate-[spin_4s_linear_infinite]">
                <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-yellow-200 rounded-full"></div>
                <div className="absolute top-1/4 left-3/4 w-1 h-1 bg-yellow-200 rounded-full"></div>
                <div className="absolute top-3/4 left-1/4 w-1 h-1 bg-yellow-200 rounded-full"></div>
              </div>
            </div>
          ),
          gradient: 'from-yellow-100 to-amber-100',
          textGradient: 'from-yellow-500 to-amber-500'
        };
      
      case 'INTENSE_FIRE':
        return {
          icon: (
            <Flame 
              className="w-8 h-8 text-orange-500 animate-pulse" 
              style={{
                filter: 'drop-shadow(0 0 4px rgba(249, 115, 22, 0.5))'
              }}
            />
          ),
          gradient: 'from-orange-100 to-pink-100',
          textGradient: 'from-orange-500 to-pink-500'
        };
      
      default:
        return {
          icon: <Flame className="w-8 h-8 text-gray-500" />,
          gradient: 'from-gray-100 to-gray-200',
          textGradient: 'from-gray-500 to-gray-600'
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-4 mb-8">
      {badges.map((badge) => {
        const badgeContent = getBadgeContent(badge);
        
        return (
          <div 
            key={badge.id}
            className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
          >
            <div className="p-4 flex items-center gap-4">
              <div className={`p-3 bg-gradient-to-r ${badgeContent.gradient} rounded-full shadow-sm`}>
                {badgeContent.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-bold bg-gradient-to-r ${badgeContent.textGradient} bg-clip-text text-transparent`}>
                  {badge.name}
                </h3>
                <p className="text-gray-600 text-sm leading-4">
                  {badge.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default BadgesSection;