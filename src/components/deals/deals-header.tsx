import React from 'react';
import { Settings } from 'lucide-react';

interface DealsHeaderProps {
  onCreateDeal: () => void;
  onImport: () => void;
}

export function DealsHeader({ onCreateDeal, onImport }: DealsHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-semibold text-gray-900">Deals</h1>
        <button className="text-gray-400 hover:text-gray-500">
          <Settings className="h-5 w-5" />
        </button>
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={() => {}}
          className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
        >
          Actions
        </button>
        <button
          onClick={onImport}
          className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
        >
          Import
        </button>
        <button
          onClick={onCreateDeal}
          className="px-3 py-1.5 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md"
        >
          Create deal
        </button>
      </div>
    </div>
  );
}