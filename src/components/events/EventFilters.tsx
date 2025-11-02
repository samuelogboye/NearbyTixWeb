import { useState } from 'react';

interface EventFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  upcomingOnly: boolean;
  onUpcomingOnlyChange: (value: boolean) => void;
}

export const EventFilters = ({
  searchQuery,
  onSearchChange,
  upcomingOnly,
  onUpcomingOnlyChange,
}: EventFiltersProps) => {
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearch(value);
    // Debounce search
    setTimeout(() => {
      onSearchChange(value);
    }, 300);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search events..."
              value={localSearch}
              onChange={handleSearchChange}
              className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Upcoming Only Toggle */}
        <div className="flex items-center space-x-3">
          <label
            htmlFor="upcoming-only"
            className="flex cursor-pointer items-center space-x-2"
          >
            <input
              id="upcoming-only"
              type="checkbox"
              checked={upcomingOnly}
              onChange={(e) => onUpcomingOnlyChange(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm font-medium text-gray-700">Upcoming events only</span>
          </label>
        </div>
      </div>
    </div>
  );
};
