import React from 'react';
import { Workflow } from 'lucide-react';

export default function WorkflowPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Workflow Automation</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12">
          <Workflow className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No workflows configured</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first workflow.</p>
          <div className="mt-6">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Create Workflow
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}