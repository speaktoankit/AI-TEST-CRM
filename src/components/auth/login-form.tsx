import { useState } from 'react';
import { signInWithGmail } from '../../lib/services/gmail';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGmailLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithGmail();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Gmail');
      console.error('Gmail login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        <div className="mt-8 space-y-6">
          <button
            onClick={handleGmailLogin}
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin mr-2 h-4 w-4 border-b-2 border-white rounded-full" />
                Signing in...
              </div>
            ) : (
              'Sign in with Gmail'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}