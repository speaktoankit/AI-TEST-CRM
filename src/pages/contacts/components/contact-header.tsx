import React from 'react';
import { UserPlus, Upload, Download } from 'lucide-react';

interface ContactHeaderProps {
  contactCount: number;
  onImport: () => void;
  onExport: () => void;
  onCreateContact: () => void;
}

export function ContactHeader({ contactCount, onImport, onExport, onCreateContact }: ContactHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-semibold text-gray-900">
        Contacts ({contactCount})
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
          onClick={onExport}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
        <button
          onClick={onCreateContact}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Contact
        </button>
      </div>
    </div>
  );
}