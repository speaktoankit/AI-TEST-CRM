import { Edit2, Trash2, Play, Pause } from 'lucide-react';
import type { Workflow } from '../../lib/types/workflow';

interface WorkflowListProps {
  workflows: Workflow[];
  loading: boolean;
  onSelect: (workflow: Workflow) => void;
  onToggle: (id: string, active: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function WorkflowList({
  workflows,
  loading,
  onSelect,
  onToggle,
  onDelete,
}: WorkflowListProps) {
  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 h-20 rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">No workflows</h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new workflow.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {workflows.map((workflow) => (
          <li key={workflow.id}>
            <div className="px-4 py-4 flex items-center sm:px-6">
              <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <div className="flex text-sm">
                    <p className="font-medium text-indigo-600 truncate">
                      {workflow.name}
                    </p>
                    <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                      {workflow.triggerType === 'time'
                        ? 'Time-based'
                        : workflow.triggerType === 'record'
                        ? 'Record-based'
                        : 'Email-based'}
                    </p>
                  </div>
                  <div className="mt-2 flex">
                    <div className="flex items-center text-sm text-gray-500">
                      <p>
                        Last run:{' '}
                        {workflow.lastRunAt
                          ? new Date(workflow.lastRunAt).toLocaleString()
                          : 'Never'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                  <div className="flex -space-x-1 overflow-hidden">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        workflow.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : workflow.status === 'paused'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {workflow.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="ml-5 flex-shrink-0 flex space-x-2">
                <button
                  type="button"
                  onClick={() => onToggle(workflow.id, workflow.status !== 'active')}
                  className="inline-flex items-center p-2 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {workflow.status === 'active' ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => onSelect(workflow)}
                  className="inline-flex items-center p-2 border border-gray-300 rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(workflow.id)}
                  className="inline-flex items-center p-2 border border-gray-300 rounded-full shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
