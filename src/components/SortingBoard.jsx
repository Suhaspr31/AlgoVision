import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * SortingBoard Component
 * 
 * Visualizes array sorting/searching algorithms using animated square boxes.
 * Numbers are displayed inside boxes with custom swap animations:
 * - One number goes up and moves from right to left
 * - Other number goes down and moves from left to right
 */
const SortingBoard = ({ state, type, algorithm }) => {
  const [prevSwap, setPrevSwap] = useState([]);
  
  // Show placeholder when no state or no array
  if (!state || !state.array || !Array.isArray(state.array)) {
    return (
      <div className="h-[300px] md:h-[400px] w-full flex items-center justify-center bg-white dark:bg-slate-900 rounded-xl shadow-inner border dark:border-slate-800">
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  const { 
    array = [], 
    compare = [], 
    swap = [], 
    sorted = [], 
    highlight = [],
    low,
    high,
    mid,
    found
  } = state;

  // Track swap for animation
  useEffect(() => {
    if (swap.length > 0) {
      setPrevSwap(swap);
    }
  }, [swap]);

  // Determine if this is a swap step
  const isSwapping = swap.length === 2;

  // Color coding for different states
  const getBoxColor = (index) => {
    if (type === 'binary') {
      // Binary search colors
      if (found === index) return 'bg-green-500 border-green-600';
      if (index === mid) return 'bg-yellow-500 border-yellow-600';
      if (low !== undefined && high !== undefined && index >= low && index <= high) {
        return 'bg-primary border-primary-dark';
      }
      if (sorted && sorted.includes(index)) return 'bg-gray-400 dark:bg-slate-600 border-gray-500 dark:border-slate-500';
      return 'bg-gray-300 dark:bg-slate-700 border-gray-400 dark:border-slate-600';
    }

    // Sorting algorithm colors
    if (swap.includes(index)) return 'bg-red-500 border-red-600';
    if (compare.includes(index)) return 'bg-yellow-500 border-yellow-600';
    if (sorted.includes(index)) return 'bg-green-500 border-green-600';
    if (highlight.includes(index)) return 'bg-blue-500 border-blue-600';
    return 'bg-primary border-primary-dark';
  };

  // Get position for swap animation
  const getSwapAnimation = (index) => {
    if (!isSwapping) return {};
    
    const [leftIdx, rightIdx] = swap;
    
    if (index === leftIdx) {
      // Left element: goes DOWN and moves RIGHT (left to right)
      return {
        y: 80,
        x: 100,
        transition: { type: "spring", stiffness: 200, damping: 20 }
      };
    }
    
    if (index === rightIdx) {
      // Right element: goes UP and moves LEFT (right to left)
      return {
        y: -80,
        x: -100,
        transition: { type: "spring", stiffness: 200, damping: 20 }
      };
    }
    
    return {};
  };

  // Check if index is in previous swap (for smooth exit animation)
  const wasSwapping = (index) => prevSwap.includes(index);

  return (
    <div className="h-[300px] md:h-[400px] w-full flex items-center justify-center bg-white dark:bg-slate-900 rounded-xl shadow-inner border dark:border-slate-800 relative overflow-hidden">
      
      {/* Explanation Bubble */}
      <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow border dark:border-slate-700 z-10 max-w-md">
        <p className="font-mono text-sm md:text-base text-gray-700 dark:text-gray-200">
          {state.desc}
        </p>
      </div>

      {/* Legend */}
      <div className="absolute top-4 right-4 flex flex-wrap gap-2 text-xs z-10">
        {type === 'binary' ? (
          <>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-yellow-500 rounded"></span> Mid
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded"></span> Found
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-primary rounded"></span> Range
            </span>
          </>
        ) : (
          <>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-yellow-500 rounded"></span> Compare
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-500 rounded"></span> Swap
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded"></span> Sorted
            </span>
          </>
        )}
      </div>

      {/* Square Boxes with Numbers */}
      <div className="flex items-center justify-center gap-2 md:gap-3 w-full max-w-4xl px-4">
        <AnimatePresence mode="popLayout">
          {array.map((val, idx) => (
            <motion.div
              key={`${type}-${algorithm}-${val}-${idx}`}
              layout
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                y: 0,
                ...getSwapAnimation(idx)
              }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25,
                mass: 1
              }}
              className={`
                w-10 md:w-14 h-10 md:h-14 flex items-center justify-center
                rounded-lg border-2 font-bold text-sm md:text-lg
                text-white shadow-lg select-none
                ${getBoxColor(idx)}
              `}
              style={{
                boxShadow: isSwapping && swap.includes(idx) 
                  ? '0 8px 20px rgba(239, 68, 68, 0.5)' 
                  : '0 4px 10px rgba(0, 0, 0, 0.2)'
              }}
            >
              {val}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SortingBoard;
