import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDate,
  formatDateTime,
  formatRelativeTime,
  isDatePast,
  formatCountdown,
  formatDistance,
  truncateText,
} from './format';

describe('Format Utilities', () => {
  beforeEach(() => {
    // Mock the current date to ensure consistent test results
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-01-15T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('formatDate', () => {
    it('should format valid ISO date string', () => {
      const date = '2025-01-15T12:00:00Z';
      const result = formatDate(date);
      expect(result).toMatch(/January/); // Should contain month name
      expect(result).toMatch(/15/); // Should contain day
      expect(result).toMatch(/2025/); // Should contain year
    });

    it('should format date with custom format string', () => {
      const date = '2025-01-15T12:00:00Z';
      const result = formatDate(date, 'yyyy-MM-dd');
      expect(result).toBe('2025-01-15');
    });

    it('should handle invalid date strings', () => {
      const invalidDate = 'not-a-date';
      const result = formatDate(invalidDate);
      expect(result).toBe('Invalid date');
    });

    it('should handle empty string', () => {
      const result = formatDate('');
      expect(result).toBe('Invalid date');
    });
  });

  describe('formatDateTime', () => {
    it('should format date with time', () => {
      const dateTime = '2025-01-15T14:30:00Z';
      const result = formatDateTime(dateTime);
      expect(result).toMatch(/January/);
      expect(result).toMatch(/15/);
      expect(result).toMatch(/2025/);
      // Should include time component
      expect(result.length).toBeGreaterThan(20);
    });

    it('should handle invalid date strings', () => {
      const result = formatDateTime('invalid');
      expect(result).toBe('Invalid date');
    });
  });

  describe('formatRelativeTime', () => {
    it('should format recent past dates', () => {
      const pastDate = '2025-01-15T11:00:00Z'; // 1 hour ago
      const result = formatRelativeTime(pastDate);
      expect(result).toContain('ago');
    });

    it('should format future dates', () => {
      const futureDate = '2025-01-15T13:00:00Z'; // 1 hour from now
      const result = formatRelativeTime(futureDate);
      expect(result).toContain('in');
    });

    it('should handle invalid dates', () => {
      const result = formatRelativeTime('invalid');
      expect(result).toBe('Invalid date');
    });
  });

  describe('isDatePast', () => {
    it('should return true for past dates', () => {
      const pastDate = '2025-01-15T11:00:00Z';
      expect(isDatePast(pastDate)).toBe(true);
    });

    it('should return false for future dates', () => {
      const futureDate = '2025-01-15T13:00:00Z';
      expect(isDatePast(futureDate)).toBe(false);
    });

    it('should return false for invalid dates', () => {
      expect(isDatePast('invalid')).toBe(false);
    });

    it('should handle edge case - current time', () => {
      const now = '2025-01-15T12:00:00Z';
      // Current time might be considered past
      const result = isDatePast(now);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('formatCountdown', () => {
    it('should format countdown in MM:SS format', () => {
      const twoMinutes = 2 * 60 * 1000;
      expect(formatCountdown(twoMinutes)).toBe('2:00');
    });

    it('should pad seconds with leading zero', () => {
      const oneMinuteFiveSeconds = (60 + 5) * 1000;
      expect(formatCountdown(oneMinuteFiveSeconds)).toBe('1:05');
    });

    it('should handle zero milliseconds', () => {
      expect(formatCountdown(0)).toBe('0:00');
    });

    it('should handle large values', () => {
      const tenMinutes = 10 * 60 * 1000;
      expect(formatCountdown(tenMinutes)).toBe('10:00');
    });

    it('should handle sub-second values', () => {
      const halfSecond = 500;
      expect(formatCountdown(halfSecond)).toBe('0:00');
    });

    it('should handle exactly 59 seconds', () => {
      const fiftyNineSeconds = 59 * 1000;
      expect(formatCountdown(fiftyNineSeconds)).toBe('0:59');
    });

    it('should handle exactly 1 minute', () => {
      const oneMinute = 60 * 1000;
      expect(formatCountdown(oneMinute)).toBe('1:00');
    });
  });

  describe('formatDistance', () => {
    it('should format distances less than 1 km in meters', () => {
      expect(formatDistance(0.5)).toBe('500m away');
    });

    it('should format very small distances in meters', () => {
      expect(formatDistance(0.1)).toBe('100m away');
    });

    it('should format distances >= 1 km with one decimal', () => {
      expect(formatDistance(1.5)).toBe('1.5km away');
    });

    it('should format large distances', () => {
      expect(formatDistance(25.7)).toBe('25.7km away');
    });

    it('should handle exactly 1 km', () => {
      expect(formatDistance(1.0)).toBe('1.0km away');
    });

    it('should handle zero distance', () => {
      expect(formatDistance(0)).toBe('0m away');
    });

    it('should round meters to nearest integer', () => {
      expect(formatDistance(0.5555)).toBe('556m away');
    });
  });

  describe('truncateText', () => {
    it('should not truncate text shorter than max length', () => {
      const text = 'Short text';
      expect(truncateText(text, 20)).toBe('Short text');
    });

    it('should truncate text longer than max length', () => {
      const text = 'This is a very long text that needs to be truncated';
      const result = truncateText(text, 20);
      expect(result).toBe('This is a very long ...');
      expect(result.length).toBe(23); // 20 chars + '...'
    });

    it('should handle text exactly at max length', () => {
      const text = '12345678901234567890';
      const result = truncateText(text, 20);
      expect(result).toBe(text);
    });

    it('should handle empty string', () => {
      expect(truncateText('', 10)).toBe('');
    });

    it('should handle max length of 0', () => {
      const result = truncateText('Hello', 0);
      expect(result).toBe('...');
    });

    it('should add ellipsis when truncating', () => {
      const text = 'Hello World!';
      const result = truncateText(text, 5);
      expect(result).toContain('...');
      expect(result.startsWith('Hello')).toBe(true);
    });
  });
});
