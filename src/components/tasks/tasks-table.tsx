import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Circle } from 'lucide-react';
import type { Task } from '../../lib/types';

interface TasksTableProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  selectedTasks: Set<string>;
  onSelectTask: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
}

export function TasksTable({
  tasks,
  onTaskClick,
  selectedTasks,
  onSelectTask,
  onSelectAll,
}: TasksTableProps) {
  const allSelected = tasks.length > 0 && tasks.every((t) => selectedTasks.has(t.id));

  return (
    <div className="mt-4 bg-white shadow-sm rounded-lg border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
              <input
                type="checkbox"
                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Associated Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Associated Company
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Last Contacted
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Last Engaged
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr
              key={task.id}
              onClick={() => onTaskClick(task)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                <input
                  type="checkbox"
                  className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={selectedTasks.has(task.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    onSelectTask(task.id, e.target.checked);
                  }}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Circle className={`h-5 w-5 ${
                  task.status === 'completed' ? 'text-green-500' : 'text-gray-400'
                }`} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{task.title}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">Contact Name</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">Company Name</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDistanceToNow(new Date(task.updated_at), { addSuffix: true })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                --
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}