import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useWorkflows } from '../hooks/use-workflows';
import { WorkflowList } from '../components/workflow/workflow-list';
import { WorkflowWizard } from '../components/workflow/workflow-wizard';
import type { Workflow, WorkflowStatus } from '../lib/types/workflow';

type WorkflowData = Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>;

export default function WorkflowsPage() {
  const {
    workflows,
    loading,
    error,
    selectedWorkflow,
    setSelectedWorkflow,
    create,
    update,
    remove,
    toggle,
  } = useWorkflows();

  const [showWizard, setShowWizard] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus | 'all'>('all');

  const filteredWorkflows = workflows.filter(workflow => {
    const matchesSearch = workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || workflow.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggle = async (id: string, active: boolean): Promise<void> => {
    await toggle(id, active);
  };

  const handleSave = async (workflowData: WorkflowData): Promise<void> => {
    if (selectedWorkflow) {
      await update(selectedWorkflow.id, workflowData);
    } else {
      await create(workflowData);
    }
    setShowWizard(false);
    setSelectedWorkflow(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Workflow Automation</h1>
        <button
          onClick={() => setShowWizard(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Workflow
        </button>
      </div>

      <div className="mb-6 flex space-x-4">
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search workflows..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as WorkflowStatus | 'all')}
          className="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <WorkflowList
        workflows={filteredWorkflows}
        loading={loading}
        onSelect={setSelectedWorkflow}
        onToggle={handleToggle}
        onDelete={remove}
      />

      {showWizard && (
        <WorkflowWizard
          workflow={selectedWorkflow}
          onClose={() => {
            setShowWizard(false);
            setSelectedWorkflow(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
