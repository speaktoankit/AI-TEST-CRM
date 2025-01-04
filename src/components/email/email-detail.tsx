import React from 'react';
import { X, Reply, ReplyAll, Forward, Trash2, Archive, Star, Mail } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Email } from '../../lib/types';

interface EmailDetailProps {
  email: Email;
  onClose: () => void;
  onReply: () => void;
}

export function EmailDetail({ email, onClose, onReply }: EmailDetailProps) {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">{email.subject}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {/* Email Header */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{email.from}</p>
                <p className="text-sm text-gray-500">
                  To: {email.to.join(', ')}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDistanceToNow(new Date(email.created_at), { addSuffix: true })}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1 text-gray-400 hover:text-gray-500">
                  <Star className="h-5 w-5" />
                </button>
                <button className="p-1 text-gray-400 hover:text-gray-500">
                  <Mail className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Email Body */}
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-900">{email.body}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={onReply}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Reply className="h-4 w-4 mr-2" />
              Reply
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <ReplyAll className="h-4 w-4 mr-2" />
              Reply All
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Forward className="h-4 w-4 mr-2" />
              Forward
            </button>
          </div>

          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </button>
            <button className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}