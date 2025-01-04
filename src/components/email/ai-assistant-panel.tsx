import React, { useState } from 'react';
import { X, Wand2 } from 'lucide-react';
import type { Email } from '../../lib/types';

interface AIAssistantPanelProps {
  onClose: () => void;
  selectedEmails: string[];
}

export function AIAssistantPanel({ onClose, selectedEmails }: AIAssistantPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    // TODO: Implement AI generation
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSuggestions([
      "Thank you for your inquiry. I would be happy to help...",
      "I appreciate your message. Let me address each point...",
      "Thank you for reaching out. Here is what you need to know..."
    ]);
    setIsGenerating(false);
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-80 bg-white border-l shadow-lg overflow-y-auto">
      <div className="px-4 py-3 border-b flex items-center justify-between">
        <h3 className="text-lg font-medium">AI Assistant</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {selectedEmails.length > 0 ? (
          <>
            <div className="text-sm text-gray-500">
              {selectedEmails.length} email(s) selected
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                What would you like to do?
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Draft a polite response declining the meeting invitation"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                rows={4}
              />
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Generate Suggestions
              </button>
            </div>

            {suggestions.length > 0 && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">Suggestions</h4>
                {suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-md text-sm text-gray-700 cursor-pointer hover:bg-gray-100"
                  >
                    {suggestion}
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-6">
            <Wand2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500">
              Select one or more emails to get AI assistance
            </p>
          </div>
        )}
      </div>
    </div>
  );
}