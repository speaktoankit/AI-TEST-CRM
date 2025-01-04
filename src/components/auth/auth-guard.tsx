import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../lib/store/auth';
import { LoginForm } from './login-form';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
          <LoginForm />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}