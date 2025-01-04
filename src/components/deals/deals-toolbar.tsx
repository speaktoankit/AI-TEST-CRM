import React from 'react';
import { ViewIcon, LayoutGrid, Search, Filter, RefreshCw } from 'lucide-react';

interface DealsToolbarProps {
  view: 'board' | 'table';
  onViewChange: (view: 'board' | 'table') => void;
  onAdvancedFilters: () => void;
  search: string;
  onSearchChange: (value: string) => void;
}

export function DealsToolbar({
  view,
  onViewChange,
  onAdvancedFilters,
  search,
  onSearchChange,
}: DealsToolbarProps) {
  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 border rounded-md">
          <button
            onClick={() => onViewChange('table')}
            className={`p-1.5 ${
              view === 'table'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ViewIcon className="h-5 w-5" />
          </button>
          <button
            onClick={() => onViewChange('board')}
            className={`p-1.5 ${
              view === 'board'
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search deals..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <button
          onClick={onAdvancedFilters}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
        >
          <Filter className="h-4 w-4 mr-2" />
          Advanced filters
        </button>

        <button className="p-2 text-gray-400 hover:text-gray-600">
          <RefreshCw className="h-5 w-5" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <select className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
          <option>New Pipeline</option>
        </select>

        <select className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
          <option>Deal owner</option>
        </select>

        <select className="block pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
          <option>Create date</option>
        </select>

        <button className="text-sm text-gray-500 hover:text-gray-700">
          Clear quick filters
        </button>
      </div>
    </div>
  );
}