import { format, formatDistanceToNow, isPast, parseISO } from 'date-fns';

/**
 * Format date to readable string
 */
export const formatDate = (dateString: string, formatStr = 'PPP'): string => {
  try {
    const date = parseISO(dateString);
    return format(date, formatStr);
  } catch {
    return 'Invalid date';
  }
};

/**
 * Format date and time
 */
export const formatDateTime = (dateString: string): string => {
  return formatDate(dateString, 'PPP p');
};

/**
 * Format date to relative time (e.g., "2 hours ago")
 */
export const formatRelativeTime = (dateString: string): string => {
  try {
    const date = parseISO(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return 'Invalid date';
  }
};

/**
 * Check if date is in the past
 */
export const isDatePast = (dateString: string): boolean => {
  try {
    const date = parseISO(dateString);
    return isPast(date);
  } catch {
    return false;
  }
};

/**
 * Format countdown timer (MM:SS)
 */
export const formatCountdown = (milliseconds: number): string => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Format distance in km
 */
export const formatDistance = (distanceKm: number): string => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)}m away`;
  }
  return `${distanceKm.toFixed(1)}km away`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format currency in USD
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};
