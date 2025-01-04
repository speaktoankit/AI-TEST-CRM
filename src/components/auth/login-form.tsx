import { useState, useEffect } from 'react';
import { useAuthStore } from '../../lib/store/auth';
import { signInWithGmail, handleGmailRedirect } from '../../lib/services/gmail';
import { Mail } from 'lucide-react';

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuthStore();

  useEffect(() => {
    // Check for redirect result when component mounts
    const checkRedirect = async () => {
      try {
        const response = await handleGmailRedirect();
        if (response.success && response.token) {
          await signIn(response.token, 'gmail');
        } else if (response.error) {
          setError(response.error);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };
    checkRedirect();
  }, [signIn]);

  const handleGmailLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGmail();
      // The page will redirect to Google sign-in
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-4 p-4">
      <button
        onClick={handleGmailLogin}
        disabled={loading}
        className="flex items-center justify-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
      >
        <Mail className="h-5 w-5" />
        <span>{loading ? 'Redirecting to Gmail...' : 'Sign in with Gmail'}</span>
      </button>
      {error && (
        <div className="text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}