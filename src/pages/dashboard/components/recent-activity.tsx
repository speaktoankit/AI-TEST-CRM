import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import type { Activity } from '../../../lib/types';

interface RecentActivityProps {
  activities: Activity[];
  isLoading: boolean;
}

export function RecentActivity({ activities, isLoading }: RecentActivityProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
      <div className="mt-6">
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex animate-pulse space-x-4">
                <div className="h-4 w-4/5 rounded bg-gray-200" />
                <div className="h-4 w-1/5 rounded bg-gray-200" />
              </div>
            ))}
          </div>
        ) : activities.length > 0 ? (
          <div className="flow-root">
            <ul className="-mb-8">
              {activities.map((activity, activityIdx) => (
                <li key={activity.id}>
                  <div className="relative pb-8">
                    {activityIdx !== activities.length - 1 ? (
                      <span
                        className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                        aria-hidden="true"
                      />
                    ) : null}
                    <div className="relative flex space-x-3">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center ring-8 ring-white">
                          <span className="text-white text-sm">{activity.type[0]}</span>
                        </span>
                      </div>
                      <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                        <div>
                          <p className="text-sm text-gray-500">{activity.description}</p>
                        </div>
                        <div className="whitespace-nowrap text-right text-sm text-gray-500">
                          {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No recent activity</p>
        )}
      </div>
    </div>
  );
}