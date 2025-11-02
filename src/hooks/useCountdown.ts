import { useState, useEffect, useRef, useCallback } from 'react';

export type UrgencyLevel = 'safe' | 'warning' | 'danger';

interface CountdownResult {
  timeRemaining: number; // milliseconds
  isExpired: boolean;
  urgencyLevel: UrgencyLevel;
  formattedTime: string; // MM:SS format
  pause: () => void;
  resume: () => void;
  isPaused: boolean;
}

/**
 * Custom hook for countdown timer with urgency levels
 * @param expiresAt - ISO timestamp when countdown expires
 * @param onExpire - Callback when countdown reaches zero
 * @param onWarning - Callback at warning thresholds (60s, 30s, 10s)
 */
export function useCountdown(
  expiresAt: string | null,
  onExpire?: () => void,
  onWarning?: (secondsRemaining: number) => void
): CountdownResult {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const warningTriggered = useRef<Set<number>>(new Set());

  // Calculate time remaining
  const calculateTimeRemaining = useCallback((): number => {
    if (!expiresAt) return 0;

    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const remaining = expiry - now;

    return Math.max(0, remaining);
  }, [expiresAt]);

  // Format time as MM:SS
  const formatTime = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Determine urgency level
  const getUrgencyLevel = (milliseconds: number): UrgencyLevel => {
    const seconds = milliseconds / 1000;

    if (seconds > 60) return 'safe'; // > 1 minute (green)
    if (seconds > 30) return 'warning'; // 30-60 seconds (yellow)
    return 'danger'; // < 30 seconds (red)
  };

  // Check and trigger warnings
  const checkWarnings = useCallback(
    (milliseconds: number) => {
      if (!onWarning) return;

      const seconds = Math.floor(milliseconds / 1000);
      const warningThresholds = [60, 30, 10];

      for (const threshold of warningThresholds) {
        if (
          seconds === threshold &&
          !warningTriggered.current.has(threshold)
        ) {
          warningTriggered.current.add(threshold);
          onWarning(threshold);
        }
      }
    },
    [onWarning]
  );

  // Pause countdown
  const pause = useCallback(() => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Resume countdown
  const resume = useCallback(() => {
    setIsPaused(false);
  }, []);

  // Main countdown effect
  useEffect(() => {
    if (!expiresAt || isPaused) {
      return;
    }

    // Initial calculation
    const remaining = calculateTimeRemaining();
    setTimeRemaining(remaining);

    if (remaining <= 0) {
      if (onExpire) {
        onExpire();
      }
      return;
    }

    // Set up interval
    intervalRef.current = setInterval(() => {
      const newRemaining = calculateTimeRemaining();
      setTimeRemaining(newRemaining);

      // Check warnings
      checkWarnings(newRemaining);

      // Check if expired
      if (newRemaining <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        if (onExpire) {
          onExpire();
        }
      }
    }, 1000);

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [expiresAt, isPaused, calculateTimeRemaining, onExpire, checkWarnings]);

  return {
    timeRemaining,
    isExpired: timeRemaining <= 0,
    urgencyLevel: getUrgencyLevel(timeRemaining),
    formattedTime: formatTime(timeRemaining),
    pause,
    resume,
    isPaused,
  };
}
