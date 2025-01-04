import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../lib/store/auth';
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  CheckSquare, 
  Mail, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { cn } from '../../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Contacts', path: '/contacts' },
  { icon: DollarSign, label: 'Deals', path: '/deals' },
  { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
  { icon: Mail, label: 'Email', path: '/email' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();
  const { signOut, user } = useAuthStore();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <aside className="bg-white w-64 min-h-screen flex flex-col shadow-lg">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-indigo-600">AI CRM</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4">
        <ul className="space-y-2">
          {navItems.map(({ icon: Icon, label, path }) => (
            <li key={path}>
              <Link
                to={path}
                className={cn(
                  'flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors',
                  location.pathname === path && 'bg-indigo-50 text-indigo-600'
                )}
              >
                <Icon className="w-5 h-5 mr-3" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t">
        <div className="mb-4">
          <p className="text-sm text-gray-600">Signed in as</p>
          <p className="text-sm font-medium truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center w-full px-4 py-2 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}