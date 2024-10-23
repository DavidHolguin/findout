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
                className="w-8 h-8 text-blue-500 dark:text-blue-400"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.5))'
                }}
              />
              {/* Clock hands animation */}
              <div className="absolute inset-0">
                <div className="absolute top-1/2 left-1/2 w-[1px] h-[40%] bg-blue-500 dark:bg-blue-400 origin-bottom -translate-x-1/2 animate-[spin_2s_linear_infinite]" />
                <div className="absolute top-1/2 left-1/2 w-[1px] h-[30%] bg-blue-600 dark:bg-blue-500 origin-bottom -translate-x-1/2 animate-[spin_24s_linear_infinite]" />
              </div>
              {/* Speedlines effect */}
              <div className="absolute inset-0 animate-[spin_1.5s_linear_infinite]">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 h-4 w-[1px] bg-gradient-to-t from-transparent to-blue-300 dark:to-blue-500 opacity-50"
                    style={{
                      transform: `rotate(${i * 45}deg) translateY(-8px)`
                    }}
                  />
                ))}
              </div>
            </div>
          ),
          gradient: 'from-blue-100 to-cyan-100 dark:from-blue-950 dark:to-cyan-950',
          textGradient: 'from-blue-500 to-cyan-500 dark:from-blue-400 dark:to-cyan-400'
        };
      
      case 'BEST_RATED':
        return {
          icon: (
            <div className="relative">
              <Star 
                className="w-8 h-8 text-yellow-500 dark:text-yellow-400"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(234, 179, 8, 0.5))'
                }}
              />
              {/* Rotating stars */}
              <div className="absolute inset-0 animate-[spin_4s_linear_infinite]">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-yellow-200 dark:bg-yellow-300 rounded-full"
                    style={{
                      top: `${Math.sin(i * 72 * Math.PI / 180) * 100 + 50}%`,
                      left: `${Math.cos(i * 72 * Math.PI / 180) * 100 + 50}%`,
                      animation: `twinkle ${1 + i * 0.2}s ease-in-out infinite alternate`
                    }}
                  />
                ))}
              </div>
              {/* Glow effect */}
              <div className="absolute inset-0 bg-yellow-200 dark:bg-yellow-300 rounded-full opacity-20 animate-pulse blur-xl" />
            </div>
          ),
          gradient: 'from-yellow-100 to-amber-100 dark:from-yellow-950 dark:to-amber-950',
          textGradient: 'from-yellow-500 to-amber-500 dark:from-yellow-400 dark:to-amber-400'
        };
      
      case 'INTENSE_FIRE':
        return {
          icon: (
            <div className="relative">
              <Flame 
                className="w-8 h-8 text-orange-500 dark:text-orange-400 animate-pulse" 
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(249, 115, 22, 0.5))'
                }}
              />
              <div className="absolute inset-0 animate-[ping_1.5s_ease-out_infinite]">
                <Flame 
                  className="w-8 h-8 text-orange-500/30 dark:text-orange-400/30" 
                />
              </div>
            </div>
          ),
          gradient: 'from-orange-100 to-pink-100 dark:from-orange-950 dark:to-pink-950',
          textGradient: 'from-orange-500 to-pink-500 dark:from-orange-400 dark:to-pink-400'
        };
      
      default:
        return {
          icon: <Flame className="w-8 h-8 text-gray-500 dark:text-gray-400" />,
          gradient: 'from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700',
          textGradient: 'from-gray-500 to-gray-600 dark:from-gray-400 dark:to-gray-300'
        };
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-4 mb-4">
      {badges.map((badge) => {
        const badgeContent = getBadgeContent(badge);
        
        return (
          <div 
            key={badge.id}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700"
          >
            <div className="px-4 py-2 flex items-center gap-4">
              <div className={`p-3 bg-gradient-to-r ${badgeContent.gradient} rounded-full shadow-sm`}>
                {badgeContent.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-bold bg-gradient-to-r ${badgeContent.textGradient} bg-clip-text text-transparent`}>
                  {badge.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-4">
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