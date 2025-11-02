import { useEffect } from 'react';
import clsx from 'clsx';
import { useCountdown } from '@hooks/useCountdown';
import { useUIStore } from '@stores/uiStore';

interface CountdownTimerProps {
  expiresAt: string | null;
  onExpire?: () => void;
  showWarnings?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CountdownTimer = ({
  expiresAt,
  onExpire,
  showWarnings = true,
  size = 'md',
  className,
}: CountdownTimerProps) => {
  const addToast = useUIStore((state) => state.addToast);

  const { isExpired, urgencyLevel, formattedTime } =
    useCountdown(
      expiresAt,
      onExpire,
      showWarnings
        ? (seconds) => {
            if (seconds === 60) {
              addToast('warning', '⏰ 1 minute remaining to complete payment!', 4000);
            } else if (seconds === 30) {
              addToast('warning', '⏰ 30 seconds remaining!', 4000);
            } else if (seconds === 10) {
              addToast('error', '⏰ Only 10 seconds left!', 4000);
            }
          }
        : undefined
    );

  // Auto-show expiration message
  useEffect(() => {
    if (isExpired && showWarnings) {
      addToast('error', '⏱️ Time expired! Your reservation has been released.', 5000);
    }
  }, [isExpired, showWarnings, addToast]);

  if (!expiresAt) {
    return null;
  }

  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3',
  };

  const urgencyColors = {
    safe: 'bg-green-100 text-green-800 border-green-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    danger: 'bg-red-100 text-red-800 border-red-300 animate-pulse',
  };

  if (isExpired) {
    return (
      <div
        className={clsx(
          'inline-flex items-center gap-2 rounded-lg border-2 font-semibold',
          'bg-gray-100 text-gray-600 border-gray-300',
          sizeClasses[size],
          className
        )}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          strokeWidth="2"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
        <span>Expired</span>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'inline-flex items-center gap-2 rounded-lg border-2 font-semibold transition-all',
        urgencyColors[urgencyLevel],
        sizeClasses[size],
        className
      )}
      role="timer"
      aria-live="polite"
      aria-atomic="true"
    >
      <svg
        className="h-4 w-4"
        fill="none"
        strokeWidth="2"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{formattedTime}</span>
      {urgencyLevel === 'danger' && (
        <span className="text-xs font-normal">(hurry!)</span>
      )}
    </div>
  );
};
