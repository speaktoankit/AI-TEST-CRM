import { useState } from 'react';
import { X } from 'lucide-react';
import type {
  Workflow,
  TriggerType,
  TriggerCondition,
  WorkflowAction,
  WorkflowStatus
} from '../../lib/types/workflow';

type WorkflowData = Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>;

interface WorkflowWizardProps {
  workflow?: Workflow | null;
  onClose: () => void;
  onSave: (workflow: WorkflowData) => Promise<void>;
}

export function WorkflowWizard({ workflow, onClose, onSave }: WorkflowWizardProps) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Workflow>>({
    name: workflow?.name || '',
    description: workflow?.description || '',
    triggerType: workflow?.triggerType || 'time',
    triggerConditions: workflow?.triggerConditions || [],
    actions: workflow?.actions || [],
    status: workflow?.status || 'draft',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;

    setSaving(true);
    setError(null);

    try {
      await onSave(formData as WorkflowData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save workflow');
    } finally {
      setSaving(false);
    }
  };

  const addTriggerCondition = (condition: TriggerCondition) => {
    setFormData(prev => ({
      ...prev,
      triggerConditions: [...(prev.triggerConditions || []), condition],
    }));
  };

  const removeTriggerCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      triggerConditions: prev.triggerConditions?.filter((_, i) => i !== index),
    }));
  };

  const addAction = (action: WorkflowAction) => {
    setFormData(prev => ({
      ...prev,
      actions: [...(prev.actions || []), action],
    }));
  };

  const removeAction = (index: number) => {
    setFormData(prev => ({
      ...prev,
      actions: prev.actions?.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-medium">
            {workflow ? 'Edit Workflow' : 'Create Workflow'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
            disabled={saving}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Trigger Type
                </label>
                <select
                  value={formData.triggerType}
                  onChange={(e) => setFormData({ ...formData, triggerType: e.target.value as TriggerType })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="time">Time-based</option>
                  <option value="record">Record-based</option>
                  <option value="email">Email-based</option>
                </select>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Trigger Conditions
                </label>
                {formData.triggerConditions?.map((condition, index) => (
                  <div key={index} className="mt-2 flex items-center space-x-2">
                    <span className="text-sm">{condition.type}</span>
                    <span className="text-sm">{condition.operator}</span>
                    <span className="text-sm">{condition.value}</span>
                    <button
                      type="button"
                      onClick={() => removeTriggerCondition(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addTriggerCondition({
                    type: 'no_reply',
                    value: '7',
                  })}
                  className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Condition
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Actions
                </label>
                {formData.actions?.map((action, index) => (
                  <div key={index} className="mt-2 flex items-center space-x-2">
                    <span className="text-sm">{action.type}</span>
                    <button
                      type="button"
                      onClick={() => removeAction(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addAction({
                    type: 'create_task',
                    config: {},
                  })}
                  className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Add Action
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as WorkflowStatus })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
              </div>

              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="text-sm font-medium text-gray-900">Summary</h4>
                <dl className="mt-2 divide-y divide-gray-200">
                  <div className="py-2 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Name</dt>
                    <dd className="text-sm text-gray-900">{formData.name}</dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Trigger Type</dt>
                    <dd className="text-sm text-gray-900">{formData.triggerType}</dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Conditions</dt>
                    <dd className="text-sm text-gray-900">
                      {formData.triggerConditions?.length || 0}
                    </dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Actions</dt>
                    <dd className="text-sm text-gray-900">
                      {formData.actions?.length || 0}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 text-sm text-red-600">{error}</div>
          )}

          <div className="mt-6 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1 || saving}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Previous
            </button>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {saving ? 'Saving...' : 'Save Workflow'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
