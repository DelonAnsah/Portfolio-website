import React from 'react';
import { motion } from 'framer-motion';

const GamesSkeleton = () => {
  return (
    <motion.div
      className="px-5 md:px-16 py-8 md:py-12 min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-[82rem] mx-auto">
        {/* Header Skeleton */}
        <div className="mb-12 text-center">
          <div className="h-5 w-40 bg-gray-700 rounded-full mx-auto mb-3"></div>
          <div className="h-10 w-64 bg-gray-800 rounded-full mx-auto mb-4"></div>
          <div className="mt-4 max-w-2xl mx-auto space-y-2">
            <div className="h-4 bg-gray-700 rounded-full"></div>
            <div className="h-4 bg-gray-700 rounded-full w-5/6 mx-auto"></div>
            <div className="h-4 bg-gray-700 rounded-full w-4/6 mx-auto"></div>
          </div>
        </div>

        {/* Game Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={index}
              className="bg-gradient-to-br from-[#1e1e2f] to-[#2e2e4d] rounded-2xl p-6 border border-[#915EFF]/20 overflow-hidden relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-4xl mb-4 w-16 h-16 bg-gray-700 rounded-xl"></div>
                  <div className="h-6 w-20 bg-gray-700 rounded-full"></div>
                </div>
                
                <div className="h-7 w-3/4 bg-gray-700 rounded-full mb-3"></div>
                
                <div className="space-y-2 mb-4 flex-grow">
                  <div className="h-3 bg-gray-700 rounded-full"></div>
                  <div className="h-3 bg-gray-700 rounded-full w-5/6"></div>
                  <div className="h-3 bg-gray-700 rounded-full w-4/6"></div>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-auto">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-6 w-16 bg-gray-700 rounded-full"></div>
                  ))}
                </div>
              </div>
              
              {/* Shimmer effect */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#915EFF]/10 to-transparent animate-shimmer"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GamesSkeleton;