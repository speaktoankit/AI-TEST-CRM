import { useState, useEffect } from 'react';
import { Mail, Calendar, Users, MessageSquare } from 'lucide-react';
import { signInWithGmail, handleGmailRedirect, checkGmailAuth, signOut } from '../../lib/services/gmail';
import type { Integration } from '../../lib/types/email';

const integrationIcons = {
  gmail: Mail,
  google_calendar: Calendar,
  google_contacts: Users,
  whatsapp: MessageSquare,
};

const integrationNames = {
  gmail: 'Gmail',
  google_calendar: 'Google Calendar',
  google_contacts: 'Google Contacts',
  whatsapp: 'WhatsApp',
};

const defaultIntegrations: Integration[] = [
  {
    id: '1',
    type: 'gmail',
    status: 'disconnected',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    subject: '',
    suggested_reply: ''
  },
  {
    id: '2',
    type: 'google_calendar',
    status: 'disconnected',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    subject: '',
    suggested_reply: ''
  },
  {
    id: '3',
    type: 'google_contacts',
    status: 'disconnected',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    subject: '',
    suggested_reply: ''
  },
  {
    id: '4',
    type: 'whatsapp',
    status: 'disconnected',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    subject: '',
    suggested_reply: ''
  }
];

export function IntegrationsSettings() {
  const [integrations, setIntegrations] = useState(defaultIntegrations);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthed = await checkGmailAuth();
      if (isAuthed) {
        setIntegrations(prev => 
          prev.map(integration => 
            integration.type === 'gmail' 
              ? { ...integration, status: 'connected' } 
              : integration
          )
        );
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        const response = await handleGmailRedirect();
        if (response.success) {
          setIntegrations(prev => 
            prev.map(integration => 
              integration.type === 'gmail' 
                ? { ...integration, status: 'connected' } 
                : integration
            )
          );
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to connect to Gmail');
      }
    };
    handleRedirect();
  }, []);

  const handleConnect = async (type: string) => {
    setLoading(true);
    setError(null);
    try {
      if (type === 'gmail') {
        await signInWithGmail();
        // Will redirect to Google sign-in
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect');
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async (type: string) => {
    setLoading(true);
    setError(null);
    try {
      if (type === 'gmail') {
        await signOut();
        setIntegrations(prev => 
          prev.map(integration => 
            integration.type === type 
              ? { ...integration, status: 'disconnected' } 
              : integration
          )
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}
      
      <div className="grid gap-6">
        {integrations.map((integration) => {
          const Icon = integrationIcons[integration.type];
          return (
            <div
              key={integration.id}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
            >
              <div className="flex items-center space-x-4">
                <Icon className="h-6 w-6" />
                <div>
                  <h3 className="text-lg font-medium">{integrationNames[integration.type]}</h3>
                  <p className="text-sm text-gray-500">
                    {integration.status === 'connected' ? 'Connected' : 'Not connected'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => integration.status === 'connected' 
                  ? handleDisconnect(integration.type)
                  : handleConnect(integration.type)
                }
                disabled={loading}
                className={`px-4 py-2 rounded-md ${
                  integration.status === 'connected'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                } disabled:opacity-50`}
              >
                {loading
                  ? 'Processing...'
                  : integration.status === 'connected'
                  ? 'Disconnect'
                  : 'Connect'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}