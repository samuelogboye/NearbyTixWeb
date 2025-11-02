import { Link } from 'react-router-dom';
import { EventListItem } from '@/types';
import { formatDate, formatDistance } from '@utils/format';
import { Button } from '@components/common/Button';

interface EventCardProps {
  event: EventListItem;
}

export const EventCard = ({ event }: EventCardProps) => {
  const eventUrl = `/events/${event.id}`;

  return (
    <div className="group overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Event Image Placeholder */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-primary-400 to-secondary-400">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="h-16 w-16 text-white opacity-50"
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

        {/* Status Badge */}
        {event.is_sold_out ? (
          <div className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
            Sold Out
          </div>
        ) : event.tickets_available < 10 ? (
          <div className="absolute right-3 top-3 rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-white">
            Only {event.tickets_available} left
          </div>
        ) : null}

        {/* Distance Badge (if available) */}
        {event.distance_km !== undefined && (
          <div className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-gray-700 backdrop-blur-sm">
            {formatDistance(event.distance_km)}
          </div>
        )}
      </div>

      {/* Event Details */}
      <div className="p-6">
        {/* Title */}
        <Link to={eventUrl}>
          <h3 className="mb-2 text-xl font-semibold text-gray-900 transition-colors group-hover:text-primary-600">
            {event.title}
          </h3>
        </Link>

        {/* Description */}
        {event.description && (
          <p className="mb-3 line-clamp-2 text-sm text-gray-600">{event.description}</p>
        )}

        {/* Date */}
        <div className="mb-2 flex items-center text-sm text-gray-700">
          <svg
            className="mr-2 h-4 w-4 text-gray-400"
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
          <span>{formatDate(event.start_time)}</span>
        </div>

        {/* Location */}
        <div className="mb-4 flex items-center text-sm text-gray-700">
          <svg
            className="mr-2 h-4 w-4 text-gray-400"
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
          <span>
            {event.venue_name} • {event.city}, {event.state}
          </span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="text-sm">
            {event.tickets_available === 0 ? (
              <span className="text-gray-600">No tickets available</span>
            ) : (
              <>
                <span className="font-semibold text-gray-900">{event.tickets_available}</span>
                <span className="text-gray-600">
                  {' '}ticket{event.tickets_available === 1 ? '' : 's'} available
                </span>
              </>
            )}
          </div>
          <Link to={eventUrl}>
            <Button size="sm" disabled={event.is_sold_out}>
              {event.is_sold_out ? 'Sold Out' : 'View Details'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
