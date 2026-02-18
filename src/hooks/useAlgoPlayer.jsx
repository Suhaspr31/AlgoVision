import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useAlgoPlayer - The Playback Engine
 * 
 * This hook implements the "Trace/Snapshot Pattern" for algorithm visualization.
 * Instead of running the algorithm with setTimeout (which makes pause/resume impossible),
 * we pre-compute all algorithm steps as a "trace" and simply play it back like a video.
 * 
 * Benefits:
 * - True Pause: We just stop the counter
 * - Rewind: We just decrease the counter
 * - Speed Control: We change the interval duration
 * - Smooth Animation: Heavy computation happens upfront
 */
export const useAlgoPlayer = (trace, speed = 500) => {
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timer = useRef(null);

  // Reset when trace changes (new algorithm selected)
  useEffect(() => {
    reset();
  }, [trace]);

  // Playback loop
  useEffect(() => {
    if (isPlaying) {
      timer.current = setInterval(() => {
        setStep((prev) => {
          if (prev < trace.length - 1) {
            return prev + 1;
          }
          // End of trace - stop playing
          setIsPlaying(false);
          return prev;
        });
      }, speed);
    } else {
      clearInterval(timer.current);
    }

    return () => clearInterval(timer.current);
  }, [isPlaying, speed, trace.length]);

  // Toggle play/pause
  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  // Reset to beginning
  const reset = useCallback(() => {
    setIsPlaying(false);
    setStep(0);
  }, []);

  // Go to next step
  const next = useCallback(() => {
    setIsPlaying(false);
    if (step < trace.length - 1) {
      setStep((s) => s + 1);
    }
  }, [step, trace.length]);

  // Go to previous step
  const prev = useCallback(() => {
    setIsPlaying(false);
    if (step > 0) {
      setStep((s) => s - 1);
    }
  }, [step]);

  // Jump to specific step
  const jumpTo = useCallback((targetStep) => {
    if (targetStep >= 0 && targetStep < trace.length) {
      setIsPlaying(false);
      setStep(targetStep);
    }
  }, [trace.length]);

  return {
    step,
    isPlaying,
    togglePlay,
    reset,
    next,
    prev,
    jumpTo,
    setStep: jumpTo,
    totalSteps: trace.length,
    progress: trace.length > 0 ? ((step + 1) / trace.length) * 100 : 0
  };
};

export default useAlgoPlayer;
