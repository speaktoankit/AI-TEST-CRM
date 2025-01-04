import React from 'react';
import { UserPlus, DollarSign, Mail, CalendarPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

const actions = [
  { name: 'New Contact', icon: UserPlus, to: '/contacts/new' },
  { name: 'New Deal', icon: DollarSign, to: '/deals/new' },
  { name: 'Send Email', icon: Mail, to: '/email/compose' },
  { name: 'Schedule Event', icon: CalendarPlus, to: '/calendar/new' },
];

export function QuickActions() {
  return (
    <div className="flex space-x-4">
      {actions.map(({ name, icon: Icon, to }) => (
        <Link
          key={name}
          to={to}
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
        >
          <Icon className="mr-2 h-4 w-4" />
          {name}
        </Link>
      ))}
    </div>
  );
}