import React from 'react';
import { Bot, User } from 'lucide-react';
import type { AIMessage, AIAction } from '../../lib/types';

interface MessageListProps {
  messages: AIMessage[];
  onActionClick?: (action: AIAction) => void;
}

export function MessageList({ messages, onActionClick }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.role === 'user' ? 'justify-end' : 'justify-start'
          }`}
        >
          <div
            className={`flex space-x-2 max-w-2xl ${
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            <div
              className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                message.role === 'user'
                  ? 'bg-indigo-600'
                  : 'bg-gray-100'
              }`}
            >
              {message.role === 'user' ? (
                <User className="h-5 w-5 text-white" />
              ) : (
                <Bot className="h-5 w-5 text-gray-600" />
              )}
            </div>

            <div
              className={`rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}