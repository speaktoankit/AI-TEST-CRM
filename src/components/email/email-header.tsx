import { Mail, Plus, Star, Send, Trash } from 'lucide-react';
import type { EmailView } from '../../lib/types/email';

interface GmailResponse {
  success: boolean;
  error?: string;
}

interface EmailHeaderProps {
  view: EmailView;
  onViewChange: (view: EmailView) => void;
  onCompose: () => void;
  onConnectGmail: () => Promise<GmailResponse>;
  isConnecting: boolean;
  isGmailConnected: boolean;
  unreadCount?: number;
}

export function EmailHeader({
  view,
  onViewChange,
  onCompose,
  onConnectGmail,
  isConnecting,
  isGmailConnected,
  unreadCount = 0
}: EmailHeaderProps) {
  const handleConnect = async () => {
    try {
      const response = await onConnectGmail();
      if (!response.success && response.error) {
        console.error(response.error);
      }
    } catch (err) {
      console.error('Gmail connection error:', err);
    }
  };

  return (
    <div className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => onViewChange('inbox')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
              view === 'inbox' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Mail className="h-5 w-5" />
            <span>Inbox {unreadCount > 0 && `(${unreadCount})`}</span>
          </button>
          <button
            onClick={() => onViewChange('sent')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
              view === 'sent' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Send className="h-5 w-5" />
            <span>Sent</span>
          </button>
          <button
            onClick={() => onViewChange('starred')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
              view === 'starred' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Star className="h-5 w-5" />
            <span>Starred</span>
          </button>
          <button
            onClick={() => onViewChange('trash')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
              view === 'trash' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Trash className="h-5 w-5" />
            <span>Trash</span>
          </button>
        </div>
        <div className="flex items-center space-x-4">
          {!isGmailConnected && (
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
            >
              {isConnecting ? 'Connecting...' : 'Connect Gmail'}
            </button>
          )}
          <button
            onClick={onCompose}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Compose
          </button>
        </div>
      </div>
    </div>
  );
}