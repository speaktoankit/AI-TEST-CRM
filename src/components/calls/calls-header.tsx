import React from 'react';
import { Phone, Upload } from 'lucide-react';

interface CallsHeaderProps {
  callCount: number;
  onCreateCall: () => void;
  onImport: () => void;
}

export function CallsHeader({ callCount, onCreateCall, onImport }: CallsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-gray-900">
        Calls ({callCount})
      </h1>
      <div className="flex space-x-4">
        <button
          onClick={onImport}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Upload className="h-4 w-4 mr-2" />
          Import
        </button>
        <button
          onClick={onCreateCall}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <Phone className="mr-2 h-4 w-4" />
          Schedule Call
        </button>
      </div>
    </div>
  );
}