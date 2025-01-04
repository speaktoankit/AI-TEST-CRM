import React from 'react';
import { format } from 'date-fns';
import { CheckCircle2, Circle } from 'lucide-react';
import type { Task } from '../../lib/types';

interface TodayTasksProps {
  tasks: Task[];
  onComplete: (taskId: string) => void;
}

export function TodayTasks({ tasks, onComplete }: TodayTasksProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-lg font-medium text-gray-900">Today's Tasks</h2>
      </div>
      <div className="divide-y">
        {tasks.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No tasks due today</div>
        ) : (
          tasks.map((task) => (
            <div key={task.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => onComplete(task.id)}
                  className="text-gray-400 hover:text-indigo-600"
                >
                  {task.status === 'completed' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : (
                    <Circle className="h-5 w-5" />
                  )}
                </button>
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
                  <p className="text-sm text-gray-500">
                    Due {format(new Date(task.due_date), 'h:mm a')}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}