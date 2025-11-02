import { useState, useEffect, useCallback } from 'react';

export interface GeoPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export type PermissionState = 'prompt' | 'granted' | 'denied' | 'unavailable';

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean;
  timeout?: number;
  maximumAge?: number;
  watch?: boolean; // Enable continuous tracking
}

interface UseGeolocationResult {
  position: GeoPosition | null;
  error: string | null;
  isLoading: boolean;
  permissionState: PermissionState;
  requestPermission: () => void;
  getCurrentLocation: () => void;
  clearError: () => void;
}

/**
 * Custom hook for geolocation with permission handling
 * @param options - Geolocation options
 */
export function useGeolocation(
  options: UseGeolocationOptions = {}
): UseGeolocationResult {
  const {
    enableHighAccuracy = true,
    timeout = 10000,
    maximumAge = 0,
    watch = false,
  } = options;

  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [permissionState, setPermissionState] = useState<PermissionState>('prompt');

  // Check if geolocation is available
  const checkAvailability = useCallback((): boolean => {
    if (!navigator.geolocation) {
      setPermissionState('unavailable');
      setError('Geolocation is not supported by your browser');
      return false;
    }
    return true;
  }, []);

  // Check permission status
  const checkPermission = useCallback(async () => {
    if (!navigator.permissions) {
      return;
    }

    try {
      const result = await navigator.permissions.query({ name: 'geolocation' as PermissionName });
      setPermissionState(result.state as PermissionState);

      // Listen for permission changes
      result.onchange = () => {
        setPermissionState(result.state as PermissionState);
      };
    } catch (err) {
      // Some browsers don't support permissions API
      console.warn('Permissions API not supported');
    }
  }, []);

  // Success callback
  const handleSuccess = useCallback((pos: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = pos.coords;
    setPosition({
      latitude,
      longitude,
      accuracy,
      timestamp: pos.timestamp,
    });
    setError(null);
    setIsLoading(false);
    setPermissionState('granted');
  }, []);

  // Error callback
  const handleError = useCallback((err: GeolocationPositionError) => {
    setIsLoading(false);

    switch (err.code) {
      case err.PERMISSION_DENIED:
        setError('Location permission denied. Please enable location access in your browser settings.');
        setPermissionState('denied');
        break;
      case err.POSITION_UNAVAILABLE:
        setError('Location information unavailable. Please check your device settings.');
        break;
      case err.TIMEOUT:
        setError('Location request timed out. Please try again.');
        break;
      default:
        setError('An unknown error occurred while getting your location.');
    }
  }, []);

  // Get current position
  const getCurrentLocation = useCallback(() => {
    if (!checkAvailability()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );
  }, [checkAvailability, handleSuccess, handleError, enableHighAccuracy, timeout, maximumAge]);

  // Request permission and get location
  const requestPermission = useCallback(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Watch position (continuous tracking)
  useEffect(() => {
    if (!watch || !checkAvailability()) {
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      {
        enableHighAccuracy,
        timeout,
        maximumAge,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [watch, checkAvailability, handleSuccess, handleError, enableHighAccuracy, timeout, maximumAge]);

  // Check permission on mount
  useEffect(() => {
    checkAvailability();
    checkPermission();
  }, [checkAvailability, checkPermission]);

  return {
    position,
    error,
    isLoading,
    permissionState,
    requestPermission,
    getCurrentLocation,
    clearError,
  };
}
