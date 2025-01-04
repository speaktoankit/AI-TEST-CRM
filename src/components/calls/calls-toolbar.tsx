import React from 'react';
import { Search, Filter } from 'lucide-react';

interface CallsToolbarProps {
  view: string;
  onViewChange: (view: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onMoreFilters: () => void;
}

const views = ['All', 'Scheduled', 'Completed', 'Missed'];

export function CallsToolbar({
  view,
  onViewChange,
  search,
  onSearchChange,
  onMoreFilters,
}: CallsToolbarProps) {
  return (
    <div className="space-y-4">
      {/* View Tabs */}
      <div className="flex border-b">
        {views.map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              view === v
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search calls..."
              className="block w-96 pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <button
            onClick={onMoreFilters}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="h-4 w-4 mr-2" />
            More filters
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <select className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option>Call type</option>
            <option>Inbound</option>
            <option>Outbound</option>
          </select>

          <select className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option>Date range</option>
            <option>Today</option>
            <option>This week</option>
            <option>This month</option>
            <option>Custom range</option>
          </select>
        </div>
      </div>
    </div>
  );
}