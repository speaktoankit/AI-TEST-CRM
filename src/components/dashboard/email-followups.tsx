import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { EmailSuggestion } from '../../lib/types';

interface EmailFollowupsProps {
  suggestions: EmailSuggestion[];
  onApprove: (suggestion: EmailSuggestion) => void;
  onDismiss: (suggestion: EmailSuggestion) => void;
}

export function EmailFollowups({ suggestions, onApprove, onDismiss }: EmailFollowupsProps) {
  const pendingSuggestions = suggestions.filter(s => s.status === 'pending');

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Email Follow-ups</h2>
        <span className="text-sm text-gray-500">{pendingSuggestions.length} pending</span>
      </div>
      <div className="divide-y">
        {pendingSuggestions.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No pending follow-ups</div>
        ) : (
          pendingSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-900">{suggestion.subject}</h3>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(suggestion.created_at), { addSuffix: true })}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 truncate">{suggestion.suggested_reply}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => onDismiss(suggestion)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => onApprove(suggestion)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 flex items-center"
                  >
                    Send <ArrowRight className="h-3 w-3 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}