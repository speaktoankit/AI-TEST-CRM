import React from 'react';
import { Trash2, Mail, Phone, Download } from 'lucide-react';

interface BulkActionsProps {
  selectedCount: number;
  onDelete: () => void;
  onEmail: () => void;
  onCall: () => void;
  onExport: () => void;
}

export function BulkActions({
  selectedCount,
  onDelete,
  onEmail,
  onCall,
  onExport,
}: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="bg-white shadow rounded-lg p-4 mb-6 flex items-center justify-between">
      <div className="text-sm text-gray-700">
        {selectedCount} contact{selectedCount === 1 ? '' : 's'} selected
      </div>
      <div className="flex space-x-4">
        <button
          onClick={onEmail}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Mail className="h-4 w-4 mr-2" />
          Email
        </button>
        <button
          onClick={onCall}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Phone className="h-4 w-4 mr-2" />
          Call
        </button>
        <button
          onClick={onExport}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
        <button
          onClick={onDelete}
          className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </button>
      </div>
    </div>
  );
}