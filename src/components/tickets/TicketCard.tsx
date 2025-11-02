import { Link } from 'react-router-dom';
import type { Ticket } from '@/types';
import { TicketStatusBadge } from './TicketStatusBadge';
import { CountdownTimer } from './CountdownTimer';
import { formatDateTime } from '@utils/format';
import { Card } from '@components/common/Card';

interface TicketCardProps {
  ticket: Ticket;
  onExpire?: (ticketId: string) => void;
  showCountdown?: boolean;
}

export const TicketCard = ({
  ticket,
  onExpire,
  showCountdown = true,
}: TicketCardProps) => {
  const isReserved = ticket.status === 'reserved';
  const isPaid = ticket.status === 'paid';

  return (
    <Card variant="bordered" className="hover:shadow-lg transition-shadow">
      <div className="space-y-4">
        {/* Header with Status Badge */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {ticket.event.title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {ticket.event.venue_name}
            </p>
          </div>
          <TicketStatusBadge status={ticket.status} />
        </div>

        {/* Event Date & Time */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <svg
            className="h-4 w-4 text-gray-400"
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
          <span>{formatDateTime(ticket.event.start_time)}</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-gray-700">
          <svg
            className="h-4 w-4 text-gray-400"
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
          <span>
            {ticket.event.city}, {ticket.event.state}
          </span>
        </div>

        {/* Countdown Timer for Reserved Tickets */}
        {isReserved && showCountdown && ticket.expires_at && (
          <div className="pt-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                Time remaining:
              </span>
              <CountdownTimer
                expiresAt={ticket.expires_at}
                onExpire={() => onExpire?.(ticket.id)}
                size="sm"
              />
            </div>
          </div>
        )}

        {/* QR Code Placeholder for Paid Tickets */}
        {isPaid && (
          <div className="pt-3 border-t border-gray-200">
            <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-white border-2 border-gray-300 rounded flex items-center justify-center">
                <svg
                  className="h-16 w-16 text-gray-400"
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
              <p className="text-xs text-gray-600 mt-2">Scan at venue entrance</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-3 border-t border-gray-200 flex gap-2">
          <Link
            to={`/tickets/${ticket.id}`}
            className="flex-1 text-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium text-sm"
          >
            View Details
          </Link>

          {isReserved && (
            <Link
              to={`/tickets/${ticket.id}/payment`}
              className="flex-1 text-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
            >
              Pay Now
            </Link>
          )}
        </div>

        {/* Ticket ID (small print) */}
        <div className="text-xs text-gray-500 text-center">
          Ticket ID: {ticket.id.substring(0, 8)}...
        </div>
      </div>
    </Card>
  );
};
