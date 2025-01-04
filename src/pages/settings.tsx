import React, { useState } from 'react';
import { OrganizationSettings } from '../components/settings/organization-settings';
import { UsersAndTeams } from '../components/settings/users-and-teams';
import { RoleManagement } from '../components/settings/role-management';
import { IntegrationsSettings } from '../components/settings/integrations-settings';
import { SecuritySettings } from '../components/settings/security-settings';
import { Users, Shield, Building2, Plug2, Lock } from 'lucide-react';

const tabs = [
  { id: 'organization', name: 'Organization', icon: Building2 },
  { id: 'users', name: 'Users & Teams', icon: Users },
  { id: 'roles', name: 'Role Management', icon: Shield },
  { id: 'integrations', name: 'Integrations', icon: Plug2 },
  { id: 'security', name: 'Security', icon: Lock },
] as const;

type TabId = typeof tabs[number]['id'];

export default function Settings() {
  const [activeTab, setActiveTab] = useState<TabId>('organization');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
      </div>

      <div className="flex space-x-6">
        {/* Sidebar Navigation */}
        <div className="w-64 space-y-1">
          {tabs.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                activeTab === id
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="h-5 w-5 mr-2" />
              {name}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {activeTab === 'organization' && <OrganizationSettings />}
          {activeTab === 'users' && <UsersAndTeams />}
          {activeTab === 'roles' && <RoleManagement />}
          {activeTab === 'integrations' && <IntegrationsSettings />}
          {activeTab === 'security' && <SecuritySettings />}
        </div>
      </div>
    </div>
  );
}