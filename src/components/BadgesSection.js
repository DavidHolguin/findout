import React from 'react';
import { Flame, Clock, Star } from 'lucide-react';

const BadgesSection = ({ badges }) => {
  const getBadgeContent = (badge) => {
    switch (badge.badge_type) {
      case 'RECORD_TIME':
        return {
          icon: (
            <div className="relative group">
              <Clock 
                className="w-6 h-6 text-[#09fdfd] dark:text-[#09fdfd]"
                style={{
                  filter: 'drop-shadow(0 0 4px rgba(9, 253, 253, 0.5))'
                }}
              />
              <div className="absolute inset-[-4px] rounded-full border-2 border-transparent border-t-[#09fdfd] animate-[spin_2s_linear_infinite]" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#09fdfd]/20 to-transparent animate-pulse" />
              <div className="absolute inset-[-8px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 rounded-full border border-[#09fdfd]/30"
                    style={{
                      animation: `ping 1s cubic-bezier(0, 0, 0.2, 1) infinite ${i * 0.2}s`
                    }}
                  />
                ))}
              </div>
            </div>
          ),
          gradient: 'from-cyan-100 to-blue-100 dark:from-cyan-950 dark:to-blue-950',
          textGradient: 'from-[#09fdfd] to-blue-500 dark:from-[#09fdfd] dark:to-blue-400'
        };
      
      case 'BEST_RATED':
        return {
          icon: (
            <div className="relative group">
              <div className="relative">
                <Star 
                  className="w-6 h-6 text-[#09fdfd] dark:text-[#09fdfd] transform transition-transform group-hover:scale-110"
                  style={{
                    filter: 'drop-shadow(0 0 4px rgba(9, 253, 253, 0.5))'
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Star 
                    className="w-6 h-6 text-white/50 animate-pulse"
                  />
                </div>
              </div>
              <div className="absolute inset-[-4px] animate-[spin_3s_linear_infinite]">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#09fdfd] to-transparent"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${i * 45}deg) translateY(-12px)`,
                      opacity: 0.6,
                      animation: `twinkle 1.5s ease-in-out infinite ${i * 0.2}s`
                    }}
                  />
                ))}
              </div>
              <div className="absolute inset-[-2px] bg-gradient-to-r from-[#09fdfd]/20 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm" />
            </div>
          ),
          gradient: 'from-cyan-100 to-blue-100 dark:from-cyan-950 dark:to-blue-950',
          textGradient: 'from-[#09fdfd] to-blue-500 dark:from-[#09fdfd] dark:to-blue-400'
        };
      
      case 'INTENSE_FIRE':
        return {
          icon: (
            <div className="relative">
              <Flame 
                className="w-8 h-8 text-orange-500 animate-pulse" 
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
          textGradient: 'from-orange-500 to-pink-500'
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
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-lg shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 group"
          >
            <div className="px-2 py-2 flex items-center gap-4">
              <div className={`p-3 rounded-full shadow-sm ${badgeContent.gradient}`}>
                {badgeContent.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`text-base font-bold bg-gradient-to-r ${badgeContent.textGradient} bg-clip-text text-transparent`}>
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

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default BadgesSection;