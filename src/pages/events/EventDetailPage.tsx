import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useEventsStore } from '@stores/eventsStore';
import { useTicketsStore } from '@stores/ticketsStore';
import { useAuthStore } from '@stores/authStore';
import { useUIStore } from '@stores/uiStore';
import { MainLayout } from '@components/layout/MainLayout';
import { Button } from '@components/common/Button';
import { Card } from '@components/common/Card';
import { LoadingSkeleton } from '@components/common/LoadingSkeleton';
import { formatDateTime } from '@utils/format';
import { ROUTES } from '@constants/index';

export const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentEvent, isLoading, error, fetchEvent, clearCurrentEvent } = useEventsStore();
  const { reserveTicket, isLoading: isReserving } = useTicketsStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addToast = useUIStore((state) => state.addToast);

  useEffect(() => {
    if (id) {
      fetchEvent(id);
    }

    return () => {
      clearCurrentEvent();
    };
  }, [id, fetchEvent, clearCurrentEvent]);

  const handleReserveTicket = async () => {
    if (!isAuthenticated) {
      addToast('info', 'Please sign in to reserve tickets');
      navigate(ROUTES.LOGIN, { state: { from: { pathname: `/events/${id}` } } });
      return;
    }

    if (!id) return;

    try {
      const ticket = await reserveTicket(id);
      addToast('success', 'Ticket reserved successfully! Complete payment within 2 minutes.');
      navigate(`/tickets/${ticket.id}/payment`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to reserve ticket';
      addToast('error', message);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <LoadingSkeleton height="400px" className="mb-8" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              <LoadingSkeleton height="200px" />
              <LoadingSkeleton height="300px" />
            </div>
            <div>
              <LoadingSkeleton height="400px" />
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error || !currentEvent) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <Card variant="bordered" className="text-center">
            <div className="py-12">
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
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h2 className="mt-4 text-2xl font-semibold text-gray-900">Event not found</h2>
              <p className="mt-2 text-gray-600">
                {error || 'The event you are looking for does not exist.'}
              </p>
              <Link to={ROUTES.EVENTS}>
                <Button className="mt-6">Browse Events</Button>
              </Link>
            </div>
          </Card>
        </div>
      </MainLayout>
    );
  }

  const event = currentEvent;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center space-x-2 text-sm text-gray-600">
          <Link to={ROUTES.HOME} className="hover:text-primary-600">
            Home
          </Link>
          <span>/</span>
          <Link to={ROUTES.EVENTS} className="hover:text-primary-600">
            Events
          </Link>
          <span>/</span>
          <span className="text-gray-900">{event.title}</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-8 overflow-hidden rounded-xl bg-gradient-to-br from-primary-400 to-secondary-400">
          <div className="relative h-96 flex items-center justify-center">
            <svg
              className="h-32 w-32 text-white opacity-30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title & Description */}
            <div>
              <h1 className="mb-4 text-4xl font-bold text-gray-900">{event.title}</h1>
              {event.description && (
                <p className="whitespace-pre-wrap text-gray-700">{event.description}</p>
              )}
            </div>

            {/* Event Details */}
            <Card variant="bordered">
              <h2 className="mb-4 text-xl font-semibold">Event Details</h2>
              <dl className="space-y-4">
                <div className="flex items-start">
                  <dt className="flex items-center text-gray-600 w-32">
                    <svg
                      className="mr-2 h-5 w-5"
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
                    Starts
                  </dt>
                  <dd className="font-medium text-gray-900">{formatDateTime(event.start_time)}</dd>
                </div>
                <div className="flex items-start">
                  <dt className="flex items-center text-gray-600 w-32">
                    <svg
                      className="mr-2 h-5 w-5"
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
                    Ends
                  </dt>
                  <dd className="font-medium text-gray-900">{formatDateTime(event.end_time)}</dd>
                </div>
              </dl>
            </Card>

            {/* Venue Information */}
            <Card variant="bordered">
              <h2 className="mb-4 text-xl font-semibold">Venue</h2>
              <div className="space-y-3">
                <div>
                  <p className="font-semibold text-gray-900">{event.venue_name}</p>
                  <p className="text-gray-600">{event.address_line1}</p>
                  {event.address_line2 && <p className="text-gray-600">{event.address_line2}</p>}
                  <p className="text-gray-600">
                    {event.city}, {event.state} {event.postal_code}
                  </p>
                  <p className="text-gray-600">{event.country}</p>
                </div>

                {/* Map Placeholder */}
                <div className="mt-4 h-64 rounded-lg border border-gray-300 bg-gray-100 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg
                      className="mx-auto h-12 w-12 mb-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                    <p className="text-sm">Map integration coming soon</p>
                    <p className="text-xs mt-1">
                      Lat: {event.latitude}, Lng: {event.longitude}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card variant="elevated" className="sticky top-24">
              <h2 className="mb-4 text-xl font-semibold">Ticket Information</h2>

              {/* Ticket Availability */}
              <div className="mb-6">
                {event.is_sold_out ? (
                  <div className="rounded-lg bg-red-50 p-4 text-center">
                    <p className="text-lg font-semibold text-red-800">Sold Out</p>
                    <p className="mt-1 text-sm text-red-600">
                      All {event.total_tickets} tickets have been sold
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Available</span>
                      <span className="font-semibold text-gray-900">
                        {event.tickets_available} / {event.total_tickets}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className={`h-full transition-all ${
                          event.tickets_available / event.total_tickets > 0.5
                            ? 'bg-green-500'
                            : event.tickets_available / event.total_tickets > 0.2
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                        style={{
                          width: `${(event.tickets_available / event.total_tickets) * 100}%`,
                        }}
                      />
                    </div>
                    {event.tickets_available < 10 && (
                      <p className="text-sm font-medium text-yellow-700">
                        Only {event.tickets_available} tickets left!
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Button */}
              <Button
                fullWidth
                size="lg"
                onClick={handleReserveTicket}
                disabled={event.is_sold_out || isReserving}
                isLoading={isReserving}
              >
                {event.is_sold_out ? 'Sold Out' : 'Reserve Ticket'}
              </Button>

              {/* Info */}
              <div className="mt-6 rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> Reserved tickets must be paid within 2 minutes or they will
                  be released.
                </p>
              </div>

              {/* Share */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <p className="mb-3 text-sm font-medium text-gray-700">Share this event</p>
                <div className="flex space-x-2">
                  <button className="flex-1 rounded-lg border border-gray-300 p-2 hover:bg-gray-50">
                    <svg
                      className="mx-auto h-5 w-5 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </button>
                  <button className="flex-1 rounded-lg border border-gray-300 p-2 hover:bg-gray-50">
                    <svg
                      className="mx-auto h-5 w-5 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                    </svg>
                  </button>
                  <button className="flex-1 rounded-lg border border-gray-300 p-2 hover:bg-gray-50">
                    <svg
                      className="mx-auto h-5 w-5 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};
