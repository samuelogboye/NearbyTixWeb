import { useEffect, useState, useMemo } from 'react';
import { useTicketsStore } from '@stores/ticketsStore';
import { TicketCard } from '@components/tickets/TicketCard';
import { LoadingSkeleton } from '@components/common/LoadingSkeleton';
import { EmptyState } from '@components/common/EmptyState';
import { Pagination } from '@components/common/Pagination';
import type { TicketStatus } from '@/types';
import clsx from 'clsx';

type TabType = 'all' | 'paid' | 'reserved' | 'expired';

export const MyTicketsPage = () => {
  const {
    tickets,
    total,
    skip,
    limit,
    isLoading,
    error,
    fetchMyTickets,
    setStatusFilter,
  } = useTicketsStore();

  const [activeTab, setActiveTab] = useState<TabType>('all');

  // Calculate current page from skip and limit
  const currentPage = Math.floor(skip / limit) + 1;
  const totalPages = Math.ceil(total / limit);

  // Fetch tickets on mount
  useEffect(() => {
    fetchMyTickets();
  }, [fetchMyTickets]);

  // Handle tab change and filter
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (tab === 'all') {
      setStatusFilter(null);
    } else {
      setStatusFilter(tab as TicketStatus);
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    const newSkip = (page - 1) * limit;
    fetchMyTickets({ skip: newSkip });
  };

  // Count tickets by status
  const ticketCounts = useMemo(() => {
    return {
      all: total,
      paid: tickets.filter((t) => t.status === 'paid').length,
      reserved: tickets.filter((t) => t.status === 'reserved').length,
      expired: tickets.filter((t) => t.status === 'expired').length,
    };
  }, [tickets, total]);

  // Tabs configuration
  const tabs: Array<{ id: TabType; label: string; count: number }> = [
    { id: 'all', label: 'All Tickets', count: ticketCounts.all },
    { id: 'paid', label: 'Active', count: ticketCounts.paid },
    { id: 'reserved', label: 'Reserved', count: ticketCounts.reserved },
    { id: 'expired', label: 'Expired', count: ticketCounts.expired },
  ];

  // Handle ticket expiration
  const handleTicketExpire = () => {
    // Refresh tickets after expiration
    fetchMyTickets();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
          <p className="mt-2 text-gray-600">
            Manage and view all your event tickets
          </p>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={clsx(
                  'px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'text-primary-600 border-primary-600'
                    : 'text-gray-600 border-transparent hover:text-gray-900 hover:border-gray-300'
                )}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={clsx(
                      'ml-2 px-2 py-0.5 rounded-full text-xs',
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-gray-100 text-gray-700'
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <svg
                className="h-5 w-5 text-red-600"
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
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <LoadingSkeleton key={i} className="h-64" />
            ))}
          </div>
        ) : tickets.length === 0 ? (
          /* Empty State */
          <EmptyState
            icon={
              <svg
                className="h-16 w-16"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"
                />
              </svg>
            }
            title={`No ${activeTab === 'all' ? '' : activeTab} tickets found`}
            description={
              activeTab === 'all'
                ? "You haven't reserved any tickets yet. Browse events to get started!"
                : `You don't have any ${activeTab} tickets at the moment.`
            }
            action={{
              label: 'Browse Events',
              onClick: () => window.location.href = '/events',
            }}
          />
        ) : (
          /* Tickets Grid */
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {tickets.map((ticket) => (
                <TicketCard
                  key={ticket.id}
                  ticket={ticket}
                  onExpire={handleTicketExpire}
                />
              ))}
            </div>

            {/* Pagination */}
            {total > limit && (
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
        )}
      </div>
    </div>
  );
};
