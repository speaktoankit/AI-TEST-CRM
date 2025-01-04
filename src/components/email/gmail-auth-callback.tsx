import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../lib/store/auth';
import { handleGmailRedirect } from '../../lib/services/gmail';

export function GmailAuthCallback() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { signIn } = useAuthStore();

  useEffect(() => {
    const handleAuth = async () => {
      try {
        const response = await handleGmailRedirect();
        if (response.success && response.token) {
          await signIn(response.token, 'gmail');
          navigate('/email');
        } else {
          setError(response.error || 'Authentication failed');
          setTimeout(() => navigate('/login'), 3000);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    handleAuth();
  }, [navigate, signIn]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full space-y-8 p-4">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Authentication Error
            </h2>
            <p className="mt-2 text-sm text-red-600">
              {error}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Redirecting to login page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-4">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Completing Authentication
          </h2>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}