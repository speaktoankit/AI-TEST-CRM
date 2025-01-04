import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleGmailRedirect } from '../../lib/services/gmail';

export function GmailAuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const response = await handleGmailRedirect();
        if (response.success) {
          navigate('/email');
        } else {
          setError(response.error || 'Authentication failed');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed');
      }
    };

    handleAuth();
  }, [navigate]);

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      Completing authentication...
    </div>
  );
}