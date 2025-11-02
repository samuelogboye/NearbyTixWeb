import { useEffect, useMemo } from 'react';
import { useEventsStore } from '@stores/eventsStore';
import { MainLayout } from '@components/layout/MainLayout';
import { EventCard } from '@components/events/EventCard';
import { EventFilters } from '@components/events/EventFilters';
import { Pagination } from '@components/common/Pagination';
import { EventCardSkeleton } from '@components/common/LoadingSkeleton';
import { EmptyState } from '@components/common/EmptyState';

export const EventsPage = () => {
  const {
    events,
    total,
    skip,
    limit,
    isLoading,
    upcomingOnly,
    searchQuery,
    fetchEvents,
    setUpcomingOnly,
    setSearchQuery,
  } = useEventsStore();

  // Fetch events on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Calculate current page
  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  // Filter events by search query (client-side for now)
  const filteredEvents = useMemo(() => {
    if (!searchQuery.trim()) return events;

    const query = searchQuery.toLowerCase();
    return events.filter(
      (event) =>
        event.title.toLowerCase().includes(query) ||
        event.description?.toLowerCase().includes(query) ||
        event.venue_name.toLowerCase().includes(query) ||
        event.city.toLowerCase().includes(query) ||
        event.state.toLowerCase().includes(query)
    );
  }, [events, searchQuery]);

  const handlePageChange = (page: number) => {
    const newSkip = (page - 1) * limit;
    fetchEvents({ skip: newSkip });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-gray-900">Discover Events</h1>
          <p className="text-lg text-gray-600">
            Find and book tickets for amazing events near you
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <EventFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            upcomingOnly={upcomingOnly}
            onUpcomingOnlyChange={setUpcomingOnly}
          />
        </div>

        {/* Results Count */}
        {!isLoading && filteredEvents.length > 0 && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredEvents.length} of {total} events
          </div>
        )}

        {/* Events Grid */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: limit }).map((_, index) => (
              <EventCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredEvents.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  isLoading={isLoading}
                />
              </div>
            )}
          </>
        ) : (
          <EmptyState
            icon={
              <svg
                className="h-16 w-16"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            }
            title="No events found"
            description={
              searchQuery
                ? `No events match your search "${searchQuery}". Try adjusting your search.`
                : 'No events are currently available. Check back later for new events.'
            }
            action={
              searchQuery
                ? {
                    label: 'Clear search',
                    onClick: () => setSearchQuery(''),
                  }
                : undefined
            }
          />
        )}
      </div>
    </MainLayout>
  );
};
