import React, { useState } from 'react';
import { X, Pencil, Trash2, Plus } from 'lucide-react';
import type { Queue } from '../../lib/types';

interface ManageQueuesModalProps {
  queues: Queue[];
  onClose: () => void;
  onCreateQueue: (name: string) => Promise<void>;
  onRenameQueue: (id: string, name: string) => Promise<void>;
  onDeleteQueue: (id: string) => Promise<void>;
}

export function ManageQueuesModal({
  queues,
  onClose,
  onCreateQueue,
  onRenameQueue,
  onDeleteQueue,
}: ManageQueuesModalProps) {
  const [newQueueName, setNewQueueName] = useState('');
  const [editingQueue, setEditingQueue] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreateQueue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQueueName.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      await onCreateQueue(newQueueName);
      setNewQueueName('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create queue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenameQueue = async (id: string) => {
    if (!editName.trim()) return;

    try {
      setIsLoading(true);
      setError(null);
      await onRenameQueue(id, editName);
      setEditingQueue(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rename queue');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQueue = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this queue?')) return;

    try {
      setIsLoading(true);
      setError(null);
      await onDeleteQueue(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete queue');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Manage Task Queues</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* Create new queue */}
          <form onSubmit={handleCreateQueue} className="flex space-x-4">
            <input
              type="text"
              value={newQueueName}
              onChange={(e) => setNewQueueName(e.target.value)}
              placeholder="New queue name"
              className="flex-1 block border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <button
              type="submit"
              disabled={isLoading || !newQueueName.trim()}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Queue
            </button>
          </form>

          {/* Queue list */}
          <div className="space-y-2">
            {queues.map((queue) => (
              <div
                key={queue.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
              >
                {editingQueue === queue.id ? (
                  <div className="flex-1 flex items-center space-x-4">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 block border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleRenameQueue(queue.id)}
                        disabled={isLoading}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingQueue(null)}
                        className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <span className="text-sm font-medium text-gray-900">
                        {queue.name}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({queue.taskCount} tasks)
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingQueue(queue.id);
                          setEditName(queue.name);
                        }}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteQueue(queue.id)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}