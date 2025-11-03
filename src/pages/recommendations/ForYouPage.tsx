import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '@services/api';
import { useAuthStore } from '@stores/authStore';
import { useUIStore } from '@stores/uiStore';
import { EventListItem, RecommendationQueryParams } from '@/types';
import { MainLayout } from '@components/layout/MainLayout';
import { EventCard } from '@components/events/EventCard';
import { LoadingSkeleton } from '@components/common/LoadingSkeleton';
import { Button } from '@components/common/Button';
import { GEOLOCATION, PAGINATION, ROUTES } from '@constants/index';

export const ForYouPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateUserLocation = useAuthStore((state) => state.updateUserLocation);
  const addToast = useUIStore((state) => state.addToast);

  const [events, setEvents] = useState<EventListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [skip, setSkip] = useState(0);
  const [radiusKm, setRadiusKm] = useState<number>(GEOLOCATION.DEFAULT_RADIUS_KM);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

  // Check if user has location
  const hasLocation = user?.latitude !== null && user?.longitude !== null;

  // Fetch recommendations
  const fetchRecommendations = async (params?: RecommendationQueryParams) => {
    try {
      const response = await apiClient.getRecommendations({
        skip: params?.skip ?? 0,
        limit: params?.limit ?? PAGINATION.DEFAULT_LIMIT,
        radius_km: params?.radius_km ?? radiusKm,
      });

      setUserLocation(response.user_location);

      // Handle case where response.events might be undefined or null
      const responseEvents = response.events || [];

      if (params?.skip === 0) {
        setEvents(responseEvents);
      } else {
        setEvents((prev) => [...prev, ...responseEvents]);
      }

      setHasMore(responseEvents.length === (params?.limit ?? PAGINATION.DEFAULT_LIMIT));
    } catch (error) {
      addToast('error', error instanceof Error ? error.message : 'Failed to load recommendations');
      // Reset events to empty array on error
      if (params?.skip === 0) {
        setEvents([]);
      }
    }
  };

  // Initial load
  useEffect(() => {
    if (hasLocation) {
      setIsLoading(true);
      fetchRecommendations({ skip: 0, limit: PAGINATION.DEFAULT_LIMIT, radius_km: radiusKm })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, [hasLocation, radiusKm]);

  // Load more
  const handleLoadMore = async () => {
    const nextSkip = skip + PAGINATION.DEFAULT_LIMIT;
    setIsLoadingMore(true);
    await fetchRecommendations({ skip: nextSkip, limit: PAGINATION.DEFAULT_LIMIT, radius_km: radiusKm });
    setSkip(nextSkip);
    setIsLoadingMore(false);
  };

  // Request location permission
  const requestLocation = async () => {
    setIsRequestingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setIsRequestingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await updateUserLocation(
            position.coords.latitude,
            position.coords.longitude
          );
          addToast('success', 'Location updated successfully!');
          setLocationError(null);
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to update location';
          setLocationError(message);
          addToast('error', message);
        } finally {
          setIsRequestingLocation(false);
        }
      },
      (error) => {
        let message = 'Failed to get location';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out';
            break;
        }
        setLocationError(message);
        addToast('error', message);
        setIsRequestingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Change radius
  const handleRadiusChange = (newRadius: number) => {
    setRadiusKm(newRadius);
    setSkip(0);
    setEvents([]);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">For You</h1>
          <p className="mt-2 text-gray-600">
            Events near you, personalized based on your location
          </p>
        </div>

        {/* Location Permission Required */}
        {!hasLocation && (
          <div className="mb-8 rounded-lg border border-yellow-200 bg-yellow-50 p-6">
            <div className="flex items-start">
              <svg
                className="mt-0.5 h-6 w-6 flex-shrink-0 text-yellow-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-yellow-900">
                  Location Access Required
                </h3>
                <p className="mt-2 text-sm text-yellow-800">
                  To see personalized event recommendations near you, we need access to your
                  location. Your location will only be used to show nearby events and is never
                  shared with other users.
                </p>
                {locationError && (
                  <div className="mt-3 rounded-md bg-red-50 p-3">
                    <p className="text-sm text-red-800">{locationError}</p>
                  </div>
                )}
                <div className="mt-4">
                  <Button
                    onClick={requestLocation}
                    disabled={isRequestingLocation}
                    className="bg-yellow-600 hover:bg-yellow-700"
                  >
                    {isRequestingLocation ? (
                      <>
                        <svg
                          className="mr-2 h-4 w-4 animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Getting Location...
                      </>
                    ) : (
                      <>
                        <svg
                          className="mr-2 h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Enable Location Access
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Location Info & Filters */}
        {hasLocation && userLocation && (
          <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center">
                <svg
                  className="mr-2 h-5 w-5 text-primary-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-sm text-gray-700">
                  Showing events within <span className="font-semibold">{radiusKm} km</span> of
                  your location
                </span>
              </div>

              {/* Radius Selector */}
              <div className="flex items-center gap-2">
                <label htmlFor="radius" className="text-sm font-medium text-gray-700">
                  Search Radius:
                </label>
                <select
                  id="radius"
                  value={radiusKm}
                  onChange={(e) => handleRadiusChange(Number(e.target.value))}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                >
                  <option value={5}>5 km</option>
                  <option value={10}>10 km</option>
                  <option value={25}>25 km</option>
                  <option value={50}>50 km</option>
                  <option value={100}>100 km</option>
                  <option value={200}>200 km</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <LoadingSkeleton height="192px" />
                <LoadingSkeleton height="24px" />
                <LoadingSkeleton height="20px" />
                <LoadingSkeleton height="40px" />
              </div>
            ))}
          </div>
        )}

        {/* Events Grid */}
        {!isLoading && hasLocation && (
          <>
            {events && events.length > 0 ? (
              <>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="mt-8 flex justify-center">
                    <Button
                      onClick={handleLoadMore}
                      disabled={isLoadingMore}
                      variant="secondary"
                      size="lg"
                    >
                      {isLoadingMore ? (
                        <>
                          <svg
                            className="mr-2 h-5 w-5 animate-spin"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Loading...
                        </>
                      ) : (
                        'Load More Events'
                      )}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-12 text-center">
                <svg
                  className="mx-auto h-16 w-16 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  No events found near you
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  Try increasing your search radius or browse all events
                </p>
                <div className="mt-6">
                  <Button onClick={() => navigate(ROUTES.EVENTS)} variant="secondary">
                    Browse All Events
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};
