import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  name: string;
  value: number;
  icon: LucideIcon;
  isLoading: boolean;
}

export function StatsCard({ name, value, icon: Icon, isLoading }: StatsCardProps) {
  return (
    <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-6 w-6 text-gray-400" aria-hidden="true" />
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="truncate text-sm font-medium text-gray-500">{name}</dt>
            <dd className="text-lg font-semibold text-gray-900">
              {isLoading ? (
                <div className="h-6 w-12 animate-pulse rounded bg-gray-200" />
              ) : (
                value
              )}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  );
}