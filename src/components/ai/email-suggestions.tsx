import React from 'react';
import { Mail, Check, X, Clock } from 'lucide-react';
import type { EmailSuggestion } from '../../lib/types';
import { formatDistanceToNow } from 'date-fns';

interface EmailSuggestionsProps {
  suggestions: EmailSuggestion[];
  onApprove: (suggestion: EmailSuggestion) => void;
  onDismiss: (suggestion: EmailSuggestion) => void;
}

export function EmailSuggestions({ suggestions, onApprove, onDismiss }: EmailSuggestionsProps) {
  // First show pending tasks, then show pending replies for approved tasks
  const pendingSuggestions = suggestions
    .filter(s => s.status === 'pending')
    .sort((a, b) => {
      // Sort tasks first
      if (a.type === 'task' && b.type !== 'task') return -1;
      if (a.type !== 'task' && b.type === 'task') return 1;
      // For replies, show only those with approved tasks
      if (a.type !== 'task' && !a.task_approved) return 1;
      if (b.type !== 'task' && !b.task_approved) return -1;
      return 0;
    });

  if (pendingSuggestions.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        No pending suggestions
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {pendingSuggestions.map((suggestion) => (
        <div
          key={suggestion.id}
          className="bg-white rounded-lg shadow-sm border p-4 space-y-3"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {suggestion.type === 'task' ? (
                <div className="h-5 w-5 flex items-center justify-center rounded-full bg-blue-100">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
              ) : (
                <div className="h-5 w-5 flex items-center justify-center rounded-full bg-green-100">
                  <Mail className="h-4 w-4 text-green-600" />
                </div>
              )}
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {suggestion.type === 'task' ? 'Task: ' : 'Reply: '}{suggestion.subject}
                </h4>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(suggestion.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
            {suggestion.due_date && (
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {formatDistanceToNow(new Date(suggestion.due_date), { addSuffix: true })}
              </div>
            )}
          </div>

          <p className="text-sm text-gray-600 whitespace-pre-wrap">
            {suggestion.suggested_reply}
          </p>

          <div className="flex justify-end space-x-3">
            {suggestion.type !== 'task' && !suggestion.task_approved && (
              <p className="text-xs text-gray-500 italic mr-auto">
                Approve related task first
              </p>
            )}
            <button
              onClick={() => onDismiss(suggestion)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
            >
              <X className="h-4 w-4 mr-1" />
              Dismiss
            </button>
            <button
              onClick={() => onApprove(suggestion)}
              disabled={suggestion.type !== 'task' && !suggestion.task_approved}
              title={suggestion.type !== 'task' && !suggestion.task_approved ? 'Approve related task first' : ''}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Check className="h-4 w-4 mr-1" />
              {suggestion.type === 'task' ? 'Create Task' : 'Send Reply'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}