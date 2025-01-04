import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import type { UserRole } from '../../lib/types';

// Mock data for development
const mockRoles: UserRole[] = [
  {
    id: '1',
    name: 'Admin',
    permissions: {
      contacts: { create: true, read: true, update: true, delete: true },
      deals: { create: true, read: true, update: true, delete: true },
      tasks: { create: true, read: true, update: true, delete: true },
      settings: { access: true },
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sales Rep',
    permissions: {
      contacts: { create: true, read: true, update: true, delete: false },
      deals: { create: true, read: true, update: true, delete: false },
      tasks: { create: true, read: true, update: true, delete: true },
      settings: { access: false },
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function RoleManagement() {
  const [roles] = useState<UserRole[]>(mockRoles);

  const handleCreateRole = () => {
    // TODO: Implement create role modal
    console.log('Open create role modal');
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Role Management
            </h3>
            <p className="mt-2 text-sm text-gray-700">
              Define roles and permissions for different types of users.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={handleCreateRole}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {roles.map((role) => (
            <div
              key={role.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-medium text-gray-900">{role.name}</h4>
                <button className="text-sm text-indigo-600 hover:text-indigo-900">
                  Edit
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(role.permissions).map(([module, perms]) => (
                  <div key={module} className="border rounded p-3">
                    <h5 className="font-medium text-gray-900 capitalize mb-2">
                      {module}
                    </h5>
                    <ul className="space-y-1">
                      {Object.entries(perms).map(([action, allowed]) => (
                        <li
                          key={action}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <span
                            className={`w-4 h-4 rounded-full mr-2 ${
                              allowed ? 'bg-green-100' : 'bg-red-100'
                            }`}
                          />
                          <span className="capitalize">{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}