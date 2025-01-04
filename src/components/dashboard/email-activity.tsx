import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { EmailThread } from '../../lib/types';

interface EmailActivityProps {
  threads: EmailThread[];
}

export function EmailActivity({ threads }: EmailActivityProps) {
  if (threads.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Recent Email Activity</h2>
        <p className="text-sm text-gray-500">No recent email activity</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium text-gray-900">Recent Email Activity</h2>
      </div>
      <div className="divide-y">
        {threads.map((thread) => (
          <div key={thread.id} className="p-4 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{thread.subject}</h3>
                  <p className="text-sm text-gray-500">
                    {formatDistanceToNow(new Date(thread.last_message_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <button className="text-sm text-indigo-600 hover:text-indigo-900">
                View <ArrowRight className="inline h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}