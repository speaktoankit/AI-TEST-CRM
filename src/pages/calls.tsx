import React, { useState } from 'react';
import { useCalls } from '../hooks/use-calls';
import { useCallsStore } from '../lib/store/calls';
import { CallsHeader } from '../components/calls/calls-header';
import { CallsToolbar } from '../components/calls/calls-toolbar';
import { CallsTable } from '../components/calls/calls-table';
import type { Call } from '../lib/types';

export default function Calls() {
  const {
    calls,
    isLoading,
    error,
    selectedCalls,
    view,
    search,
    setView,
    setSearch,
    selectCall,
    selectAll,
  } = useCallsStore();

  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  const filters = {
    status: view === 'Completed' ? 'completed' : 
           view === 'Scheduled' ? 'scheduled' :
           view === 'Missed' ? 'missed' :
           undefined
  };

  useCalls({ search, filters });

  const handleCreateCall = () => {
    // TODO: Implement create call modal
  };

  const handleImport = () => {
    // TODO: Implement import functionality
  };

  const handleMoreFilters = () => {
    // TODO: Implement more filters
  };

  if (error) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              {error.message}
            </p>
            <p className="mt-2 text-sm text-yellow-700">
              Showing cached data. Some features may be limited.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CallsHeader
        callCount={calls.length}
        onCreateCall={handleCreateCall}
        onImport={handleImport}
      />

      <CallsToolbar
        view={view}
        onViewChange={setView}
        search={search}
        onSearchChange={setSearch}
        onMoreFilters={handleMoreFilters}
      />

      <CallsTable
        calls={calls}
        isLoading={isLoading}
        onCallClick={setSelectedCall}
        selectedCalls={selectedCalls}
        onSelectCall={selectCall}
        onSelectAll={selectAll}
      />
    </div>
  );
}