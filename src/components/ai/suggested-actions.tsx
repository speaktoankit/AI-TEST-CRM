import React from 'react';
import { Mail, Phone, Calendar } from 'lucide-react';

const suggestions = [
  {
    icon: Mail,
    text: 'Draft a follow-up email',
    prompt: 'Draft a follow-up email for my last conversation with the client',
  },
  {
    icon: Phone,
    text: 'Summarize last call',
    prompt: 'Summarize my last call notes and suggest next steps',
  },
  {
    icon: Calendar,
    text: 'Schedule next meeting',
    prompt: 'Help me schedule the next meeting with the team',
  },
];

interface SuggestedActionsProps {
  onSuggestionClick: (prompt: string) => void;
}

export function SuggestedActions({ onSuggestionClick }: SuggestedActionsProps) {
  return (
    <div className="border-t p-4 bg-gray-50">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Suggested Actions</h3>
      <div className="grid grid-cols-3 gap-4">
        {suggestions.map(({ icon: Icon, text, prompt }) => (
          <button
            key={text}
            onClick={() => onSuggestionClick(prompt)}
            className="flex flex-col items-center p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
          >
            <Icon className="h-5 w-5 text-gray-400 mb-2" />
            <span className="text-sm text-gray-700 text-center">{text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}