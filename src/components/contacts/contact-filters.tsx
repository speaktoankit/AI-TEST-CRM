import React from 'react';
import { Search } from 'lucide-react';

interface ContactFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  leadStatus: string;
  onLeadStatusChange: (value: string) => void;
  view: string;
  onViewChange: (value: string) => void;
}

const leadStatuses = ['All', 'New', 'Open', 'In Progress', 'Closed'];
const views = ['All Contacts', 'My Contacts', 'Unassigned'];

export function ContactFilters({
  search,
  onSearchChange,
  leadStatus,
  onLeadStatusChange,
  view,
  onViewChange,
}: ContactFiltersProps) {
  return (
    <div className="space-y-4">
      {/* View Switcher */}
      <div className="flex space-x-2">
        {views.map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={`px-3 py-1 text-sm rounded-md ${
              view === v
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Search and Lead Status */}
      <div className="flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search contacts..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <select
          value={leadStatus}
          onChange={(e) => onLeadStatusChange(e.target.value)}
          className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {leadStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}