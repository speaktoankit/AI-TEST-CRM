import React from 'react';
import { Mail } from 'lucide-react';

interface GmailConnectProps {
  onConnect: () => void;
  isConnected: boolean;
}

export function GmailConnect({ onConnect, isConnected }: GmailConnectProps) {
  if (isConnected) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 text-center">
      <Mail className="h-8 w-8 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Connect your Gmail account
      </h3>
      <p className="text-sm text-gray-500 mb-4">
        Connect your Gmail to get AI-powered suggestions for emails and tasks
      </p>
      <button
        onClick={onConnect}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
      >
        <Mail className="h-4 w-4 mr-2" />
        Connect Gmail
      </button>
    </div>
  );
}