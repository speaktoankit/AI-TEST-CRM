import React from 'react';

export interface TasksHeaderProps {
  taskCount: number;
  onCreateTask: () => void;
  onManageQueues: () => void;
  onImport: () => void;
}

export function TasksHeader({ taskCount, onCreateTask, onManageQueues, onImport }: TasksHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-2">
        <h1 className="text-xl font-semibold text-gray-900">Tasks</h1>
        <span className="text-sm text-gray-500">{taskCount} records</span>
      </div>
      
      <div className="flex items-center space-x-3">
        <button
          onClick={onManageQueues}
          className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
        >
          Manage queues
        </button>
        <button
          onClick={onImport}
          className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
        >
          Import
        </button>
        <button
          onClick={onCreateTask}
          className="px-3 py-1.5 text-sm text-white bg-red-500 hover:bg-red-600 rounded-md"
        >
          Create task
        </button>
      </div>
    </div>
  );
}