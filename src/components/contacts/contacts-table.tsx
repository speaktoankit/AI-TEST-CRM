import React from 'react';
import { format } from 'date-fns';
import type { Contact } from '../../lib/types';

interface ContactsTableProps {
  contacts: Contact[];
  isLoading: boolean;
  onContactClick: (contact: Contact) => void;
  selectedContacts: Set<string>;
  onSelectContact: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
}

export function ContactsTable({
  contacts,
  isLoading,
  onContactClick,
  selectedContacts,
  onSelectContact,
  onSelectAll,
}: ContactsTableProps) {
  if (isLoading) {
    return <ContactsTableSkeleton />;
  }

  const allSelected = contacts.length > 0 && contacts.every(c => selectedContacts.has(c.id));

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
              <input
                type="checkbox"
                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Phone
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Company
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Lead Score
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {contacts.map((contact) => (
            <tr
              key={contact.id}
              onClick={() => onContactClick(contact)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                <input
                  type="checkbox"
                  className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={selectedContacts.has(contact.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    onSelectContact(contact.id, e.target.checked);
                  }}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">
                  {contact.first_name} {contact.last_name}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{contact.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{contact.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{contact.company}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{contact.lead_score}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {format(new Date(contact.created_at), 'MMM d, yyyy')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ContactsTableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-12 bg-gray-200 mb-4" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 mb-2" />
      ))}
    </div>
  );
}