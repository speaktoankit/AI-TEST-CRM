import React from 'react';
import { Search, Filter, LayoutGrid } from 'lucide-react';

export interface TasksFiltersProps {
  view: string;
  onViewChange: (view: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onMoreFilters: () => void;
  onEditColumns: () => void;
  onSaveView: () => void;
  onStartTasks: () => void;
}

export function TasksFilters({
  view,
  onViewChange,
  search,
  onSearchChange,
  onMoreFilters,
  onEditColumns,
  onSaveView,
  onStartTasks,
}: TasksFiltersProps) {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            placeholder="Search task title"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <select
          value={view}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onViewChange(e.target.value)}
          className="block pl-3 pr-10 py-2 text-sm border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
        >
          <option value="all">All Tasks</option>
          <option value="my">My Tasks</option>
          <option value="team">Team Tasks</option>
        </select>

        <button
          onClick={onMoreFilters}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
        >
          <Filter className="h-4 w-4 mr-2" />
          More filters
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={onEditColumns}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          Edit columns
        </button>

        <button
          onClick={onSaveView}
          className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
        >
          Save view
        </button>

        <button
          onClick={onStartTasks}
          className="px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          Start tasks
        </button>
      </div>
    </div>
  );
}