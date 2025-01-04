import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store/auth';
import { LoginForm } from '../components/auth/login-form';
import { handleGmailRedirect } from '../lib/services/gmail';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user) {
      navigate('/email');
    }
  }, [user, navigate]);

  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const response = await handleGmailRedirect();
        if (response.success) {
          navigate('/email');
        }
      } catch (error) {
        console.error('Error handling redirect:', error);
      }
    };
    checkRedirect();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}