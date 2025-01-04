import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './lib/store/auth';
import { Sidebar } from './components/ui/sidebar';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Contacts from './pages/contacts';
import Deals from './pages/deals';
import Tasks from './pages/tasks';
import Email from './pages/email';
import Settings from './pages/settings';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  const { user, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/dashboard" replace />} 
        />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <div className="flex h-screen bg-gray-100">
                <Sidebar />
                <main className="flex-1 overflow-y-auto p-8">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/contacts/*" element={<Contacts />} />
                    <Route path="/deals" element={<Deals />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/email" element={<Email />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </main>
              </div>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;