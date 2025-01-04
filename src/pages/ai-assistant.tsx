import React, { useState } from 'react';
import { ChatInput } from '../components/ai/chat-input';
import { MessageList } from '../components/ai/message-list';
import { SuggestedActions } from '../components/ai/suggested-actions';
import { EmailSuggestions } from '../components/ai/email-suggestions';
import { GmailConnect } from '../components/ai/gmail-connect';
import type { AIMessage, EmailSuggestion } from '../lib/types';

// Mock email suggestions for development
const mockSuggestions: EmailSuggestion[] = [
  {
    id: 'task1',
    email_id: 'email123',
    thread_id: 'thread1',
    subject: 'Review Project Timeline',
    suggested_reply: 'Create a follow-up task for the project timeline review',
    type: 'task',
    status: 'pending',
    due_date: new Date(Date.now() + 86400000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'reply1',
    email_id: 'email123',
    thread_id: 'thread1',
    subject: 'Follow up: Project Timeline Discussion',
    suggested_reply: 'Hi John,\n\nI noticed we haven\'t received your feedback on the project timeline yet. Would you be available for a quick call tomorrow to discuss this?\n\nBest regards',
    type: 'follow_up',
    status: 'pending',
    due_date: new Date(Date.now() + 86400000).toISOString(),
    created_at: new Date().toISOString(),
    task_approved: false,
  },
  {
    id: 'task2',
    email_id: 'email456',
    thread_id: 'thread2',
    subject: 'Client Proposal Review',
    suggested_reply: 'Schedule a review meeting for the client proposal',
    type: 'task',
    status: 'pending',
    due_date: new Date(Date.now() + 172800000).toISOString(),
    created_at: new Date().toISOString(),
  },
  {
    id: 'reply2',
    email_id: 'email456',
    thread_id: 'thread2',
    subject: 'Re: Client Proposal Review',
    suggested_reply: 'Dear Team,\n\nLet\'s schedule a review meeting for the client proposal. How does tomorrow at 2 PM sound?\n\nBest regards',
    type: 'reply',
    status: 'pending',
    due_date: new Date(Date.now() + 172800000).toISOString(),
    created_at: new Date().toISOString(),
    task_approved: false,
  },
];

// Mock initial messages for development
const initialMessages: AIMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hello! I\'m your AI assistant. I can help you manage emails, create tasks, and suggest replies. Connect your Gmail to get started!',
    created_at: new Date().toISOString(),
  },
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<AIMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [isGmailConnected, setIsGmailConnected] = useState(false);
  const [suggestions, setSuggestions] = useState<EmailSuggestion[]>(mockSuggestions);

  const handleConnectGmail = async () => {
    // TODO: Implement Gmail OAuth
    setIsGmailConnected(true);
  };

  const handleApproveSuggestion = async (suggestion: EmailSuggestion) => {
    if (suggestion.type === 'task') {
      // TODO: Create task
      console.log('Creating task:', suggestion);
      
      // Enable related reply suggestions
      setSuggestions(prev =>
        prev.map(s => 
          s.thread_id === suggestion.thread_id && s.type !== 'task'
            ? { ...s, task_approved: true }
            : s
        )
      );
    } else {
      // TODO: Send email reply
      console.log('Sending reply:', suggestion);
    }
    
    setSuggestions(prev =>
      prev.map(s => {
        if (s.id === suggestion.id) {
          return { ...s, status: 'approved' };
        }
        // If this is a task being approved, don't change related suggestions
        if (suggestion.type === 'task' && s.thread_id === suggestion.thread_id) {
          return s;
        }
        return s;
      })
    );
  };

  const handleDismissSuggestion = (suggestion: EmailSuggestion) => {
    setSuggestions(prev =>
      prev.map(s => s.id === suggestion.id ? { ...s, status: 'dismissed' } : s)
    );
  };

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: AIMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate AI response
    setIsLoading(true);
    try {
      // TODO: Replace with actual AI service call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const aiMessage: AIMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `I received your message: "${content}"\n\nThis is a mock response. Replace with actual AI integration.`,
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="grid grid-cols-3 gap-6 h-[calc(100vh-8rem)]">
      <div className="col-span-2 flex flex-col">
        <div className="flex-1 bg-white rounded-lg shadow overflow-hidden flex flex-col">
          <MessageList messages={messages} />
          <SuggestedActions onSuggestionClick={handleSuggestionClick} />
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </div>
      
      <div className="col-span-1 space-y-6">
        <GmailConnect
          onConnect={handleConnectGmail}
          isConnected={isGmailConnected}
        />
        
        {isGmailConnected && (
          <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="text-sm font-medium text-gray-900">
                Suggested Actions
              </h3>
            </div>
            <div className="p-4">
              <EmailSuggestions
                suggestions={suggestions}
                onApprove={handleApproveSuggestion}
                onDismiss={handleDismissSuggestion}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}