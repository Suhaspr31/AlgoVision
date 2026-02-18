import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from 'lucide-react';

/**
 * Controls Component
 * 
 * Provides playback controls for the algorithm visualization:
 * - Play/Pause toggle
 * - Previous/Next step navigation
 * - Reset to beginning
 * - Speed control
 * - Draggable/seekable progress bar (like YouTube)
 */
const Controls = ({ 
  isPlaying, 
  togglePlay, 
  reset, 
  next, 
  prev, 
  step, 
  totalSteps, 
  speed, 
  setSpeed,
  progress,
  jumpTo
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(null);
  const progressRef = useRef(null);

  // Get current progress (either from drag or actual state)
  const currentProgress = isDragging ? dragProgress : progress;

  // Calculate target step from mouse/touch position
  const getTargetStepFromPosition = useCallback((clientX) => {
    if (!progressRef.current) return step;
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));
    return Math.floor(percentage * (totalSteps - 1));
  }, [totalSteps, step]);

  // Handle mouse down - start dragging
  const handleMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    const targetStep = getTargetStepFromPosition(e.clientX);
    const percentage = (targetStep / (totalSteps - 1)) * 100;
    setDragProgress(percentage);
    jumpTo(targetStep);
  };

  // Handle mouse move while dragging - use requestAnimationFrame for smooth updates
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      e.preventDefault();
      
      // Calculate position directly for immediate feedback
      if (!progressRef.current) return;
      const rect = progressRef.current.getBoundingClientRect();
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      if (clientX === undefined) return;
      
      const clickX = clientX - rect.left;
      const percentage = Math.max(0, Math.min(100, (clickX / rect.width) * 100));
      setDragProgress(percentage);
      
      const targetStep = Math.floor((percentage / 100) * (totalSteps - 1));
      jumpTo(targetStep);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setDragProgress(null);
    };

    document.addEventListener('mousemove', handleMouseMove, { passive: false });
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleMouseMove, { passive: false });
    document.addEventListener('touchend', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, totalSteps, jumpTo]);

  // Handle click (for non-drag clicking)
  const handleClick = (e) => {
    if (isDragging) return;
    const targetStep = getTargetStepFromPosition(e.clientX);
    jumpTo(targetStep);
  };

  // Calculate thumb position
  const thumbPosition = `calc(${currentProgress}% - 8px)`;

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl shadow-lg mt-6 w-full max-w-3xl mx-auto border border-gray-200 dark:border-slate-700">
      
      {/* Playback Buttons */}
      <div className="flex items-center gap-2">
        {/* Reset Button */}
        <button 
          onClick={reset}
          className="btn-icon tooltip"
          title="Reset"
        >
          <RotateCcw size={18} />
        </button>

        {/* Previous Step Button */}
        <button 
          onClick={prev}
          className="btn-icon"
          disabled={step === 0}
          title="Previous Step"
        >
          <SkipBack size={18} className={step === 0 ? 'opacity-30' : ''} />
        </button>

        {/* Play/Pause Button */}
        <button 
          onClick={togglePlay}
          className="p-3 bg-primary text-white rounded-full hover:bg-indigo-600 transition shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 active:scale-95"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
        </button>

        {/* Next Step Button */}
        <button 
          onClick={next}
          className="btn-icon"
          disabled={step === totalSteps - 1}
          title="Next Step"
        >
          <SkipForward size={18} className={step === totalSteps - 1 ? 'opacity-30' : ''} />
        </button>
      </div>

      {/* Draggable Progress Bar (like YouTube) */}
      <div className="flex-1 w-full px-2 md:px-4">
        <div 
          ref={progressRef}
          className="relative w-full h-3 bg-gray-200 dark:bg-slate-700 rounded-full cursor-pointer group select-none"
          onClick={handleClick}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          {/* Progress Fill - updates immediately during drag */}
          <div 
            className="absolute left-0 top-0 h-full bg-primary rounded-full"
            style={{ width: `${currentProgress}%` }}
          />

          {/* Thumb - moves immediately with cursor during drag */}
          <div 
            className={`
              absolute top-1/2 -translate-y-1/2 
              w-4 h-4 bg-white border-2 border-primary rounded-full 
              shadow-md transition-transform duration-75
              group-hover:w-5 group-hover:h-5
              ${isDragging ? 'w-5 h-5 scale-110' : ''}
            `}
            style={{ left: thumbPosition }}
          />
        </div>

        {/* Step Info */}
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">
          <span>Step: {step + 1} / {totalSteps}</span>
          <span>{progress.toFixed(1)}%</span>
        </div>
      </div>

      {/* Speed Selector */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500 dark:text-gray-400 hidden md:inline">Speed:</span>
        <select 
          value={speed} 
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="bg-gray-100 dark:bg-slate-700 text-sm p-2 rounded-lg border-none outline-none focus:ring-2 focus:ring-primary cursor-pointer min-w-[80px]"
        >
          <option value={800}>Very Slow</option>
          <option value={400}>Slow</option>
          <option value={200}>Normal</option>
          <option value={100}>Fast</option>
          <option value={50}>Very Fast</option>
          <option value={25}>Turbo</option>
        </select>
      </div>
    </div>
  );
};

export default Controls;
