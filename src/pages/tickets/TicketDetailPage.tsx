import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTicketsStore } from '@stores/ticketsStore';
import { useUIStore } from '@stores/uiStore';
import { TicketStatusBadge } from '@components/tickets/TicketStatusBadge';
import { CountdownTimer } from '@components/tickets/CountdownTimer';
import { LoadingSkeleton } from '@components/common/LoadingSkeleton';
import { formatDateTime, formatDate } from '@utils/format';
import { Card } from '@components/common/Card';

export const TicketDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentTicket, isLoading, error, fetchTicket, clearCurrentTicket } = useTicketsStore();
  const addToast = useUIStore((state) => state.addToast);

  // Fetch ticket on mount
  useEffect(() => {
    if (id) {
      fetchTicket(id);
    }

    return () => {
      clearCurrentTicket();
    };
  }, [id, fetchTicket, clearCurrentTicket]);

  // Handle ticket expiration
  const handleExpire = () => {
    addToast({
      type: 'warning',
      message: 'Your ticket reservation has expired',
    });
    // Refresh ticket data
    if (id) {
      fetchTicket(id);
    }
  };

  // Show error toast
  useEffect(() => {
    if (error) {
      addToast({
        type: 'error',
        message: error,
      });
    }
  }, [error, addToast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <LoadingSkeleton count={8} height={60} />
        </div>
      </div>
    );
  }

  if (!currentTicket) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card variant="bordered" className="text-center py-12">
            <div className="mb-4">
              <svg
                className="mx-auto h-16 w-16 text-gray-400"
                fill="none"
                strokeWidth="2"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Not Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find the ticket you're looking for.
            </p>
            <Link
              to="/my-tickets"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              View My Tickets
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  const ticket = currentTicket;
  const isReserved = ticket.status === 'reserved';
  const isPaid = ticket.status === 'paid';
  const isExpired = ticket.status === 'expired';

  // Defensive check for event data
  if (!ticket.event) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card variant="bordered" className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Information Unavailable</h2>
            <p className="text-gray-600 mb-6">
              Unable to load event details for this ticket.
            </p>
            <Link
              to="/my-tickets"
              className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Back to My Tickets
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/my-tickets')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to My Tickets</span>
          </button>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{ticket.event.title}</h1>
              <p className="text-gray-600 mt-1">Ticket ID: {ticket.id}</p>
            </div>
            <TicketStatusBadge status={ticket.status} size="lg" />
          </div>
        </div>

        {/* Countdown Timer for Reserved Tickets */}
        {isReserved && ticket.expires_at && (
          <Card variant="bordered" className="mb-6 bg-yellow-50 border-yellow-300">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  ⏰ Complete Payment Soon
                </h3>
                <p className="text-sm text-gray-600">
                  Your reservation will expire if payment is not completed
                </p>
              </div>
              <CountdownTimer
                expiresAt={ticket.expires_at}
                onExpire={handleExpire}
                size="lg"
              />
            </div>
          </Card>
        )}

        {/* Expired Warning */}
        {isExpired && (
          <Card variant="bordered" className="mb-6 bg-red-50 border-red-300">
            <div className="flex items-center gap-3">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="font-semibold text-red-900">Ticket Expired</h3>
                <p className="text-sm text-red-700">
                  This ticket reservation has expired. Please reserve a new ticket.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Event Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Information */}
            <Card variant="bordered">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Event Details</h2>

              {/* Date & Time */}
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 text-gray-400 mt-0.5"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Date & Time</p>
                    <p className="text-gray-600">{formatDateTime(ticket.event.start_time)}</p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 text-gray-400 mt-0.5"
                    fill="none"
                    strokeWidth="2"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">Venue</p>
                    <p className="text-gray-600">{ticket.event.venue_name}</p>
                    {(ticket.event.city || ticket.event.state) && (
                      <p className="text-gray-600 text-sm">
                        {ticket.event.city && ticket.event.state
                          ? `${ticket.event.city}, ${ticket.event.state}`
                          : ticket.event.city || ticket.event.state}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Ticket Information */}
            <Card variant="bordered">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Ticket Information</h2>

              <div className="space-y-3">
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Ticket Holder</span>
                  <span className="font-medium text-gray-900">{ticket.user.name}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium text-gray-900">{ticket.user.email}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Ticket ID</span>
                  <span className="font-mono text-sm text-gray-900">{ticket.id}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Status</span>
                  <TicketStatusBadge status={ticket.status} />
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-600">Reserved On</span>
                  <span className="font-medium text-gray-900">{formatDate(ticket.created_at)}</span>
                </div>
                {isPaid && ticket.paid_at && (
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="text-gray-600">Paid On</span>
                    <span className="font-medium text-gray-900">{formatDate(ticket.paid_at)}</span>
                  </div>
                )}
                {isReserved && ticket.expires_at && (
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Expires At</span>
                    <span className="font-medium text-red-600">{formatDateTime(ticket.expires_at)}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column - QR Code / Actions */}
          <div className="lg:col-span-1">
            <Card variant="bordered" className="sticky top-6">
              {/* QR Code for Paid Tickets */}
              {isPaid && (
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-4">Your Ticket</h3>
                  <div className="bg-gray-100 rounded-lg p-6 mb-4">
                    <div className="w-full aspect-square bg-white border-2 border-gray-300 rounded flex items-center justify-center">
                      <svg
                        className="h-32 w-32 text-gray-400"
                        fill="none"
                        strokeWidth="2"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0113.5 9.375v-4.5z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 6.75h.75v.75h-.75v-.75zM6.75 16.5h.75v.75h-.75v-.75zM16.5 6.75h.75v.75h-.75v-.75zM13.5 13.5h.75v.75h-.75v-.75zM13.5 19.5h.75v.75h-.75v-.75zM19.5 13.5h.75v.75h-.75v-.75zM19.5 19.5h.75v.75h-.75v-.75zM16.5 16.5h.75v.75h-.75v-.75z"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">Scan this QR code at the venue entrance</p>
                  <button className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium">
                    Download Ticket
                  </button>
                </div>
              )}

              {/* Payment Button for Reserved Tickets */}
              {isReserved && (
                <div className="text-center">
                  <h3 className="font-semibold text-gray-900 mb-4">Complete Payment</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Complete your payment to secure this ticket
                  </p>
                  <Link
                    to={`/tickets/${ticket.id}/payment`}
                    className="block w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-center"
                  >
                    Pay Now
                  </Link>
                  <button
                    onClick={() => navigate('/my-tickets')}
                    className="mt-3 w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Expired State */}
              {isExpired && (
                <div className="text-center">
                  <div className="mb-4">
                    <svg
                      className="mx-auto h-16 w-16 text-gray-400"
                      fill="none"
                      strokeWidth="2"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Ticket Expired</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    This reservation has expired. Please reserve a new ticket for this event.
                  </p>
                  <Link
                    to="/events"
                    className="block w-full px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-center"
                  >
                    Browse Events
                  </Link>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
