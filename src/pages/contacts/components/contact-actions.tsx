import React from 'react';
import { Filter } from 'lucide-react';

interface ContactActionsProps {
  onShowTableCustomizer: () => void;
  onShowAdvancedFilters: () => void;
}

export function ContactActions({ onShowTableCustomizer, onShowAdvancedFilters }: ContactActionsProps) {
  return (
    <div className="flex space-x-4">
      <button
        onClick={onShowTableCustomizer}
        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        Customize Columns
      </button>
      <button
        onClick={onShowAdvancedFilters}
        className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
      >
        <Filter className="h-4 w-4 mr-2" />
        Advanced Filters
      </button>
    </div>
  );
}