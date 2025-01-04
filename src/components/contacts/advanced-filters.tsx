import React from 'react';
import { X, Plus, Filter } from 'lucide-react';

interface FilterCondition {
  field: string;
  operator: string;
  value: string;
}

interface AdvancedFiltersProps {
  conditions: FilterCondition[];
  onAddCondition: () => void;
  onRemoveCondition: (index: number) => void;
  onUpdateCondition: (index: number, condition: FilterCondition) => void;
  onApply: () => void;
  onSaveView: () => void;
}

const fields = [
  { id: 'first_name', label: 'First Name' },
  { id: 'last_name', label: 'Last Name' },
  { id: 'email', label: 'Email' },
  { id: 'phone', label: 'Phone' },
  { id: 'company', label: 'Company' },
  { id: 'lead_score', label: 'Lead Score' },
  { id: 'created_at', label: 'Created Date' },
];

const operators = [
  { id: 'equals', label: 'Equals' },
  { id: 'contains', label: 'Contains' },
  { id: 'greater_than', label: 'Greater Than' },
  { id: 'less_than', label: 'Less Than' },
];

export function AdvancedFilters({
  conditions,
  onAddCondition,
  onRemoveCondition,
  onUpdateCondition,
  onApply,
  onSaveView,
}: AdvancedFiltersProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Advanced Filters</h3>
        <button
          onClick={onAddCondition}
          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Condition
        </button>
      </div>

      <div className="space-y-4">
        {conditions.map((condition, index) => (
          <div key={index} className="flex items-center space-x-4">
            <select
              value={condition.field}
              onChange={(e) =>
                onUpdateCondition(index, { ...condition, field: e.target.value })
              }
              className="block w-1/3 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {fields.map((field) => (
                <option key={field.id} value={field.id}>
                  {field.label}
                </option>
              ))}
            </select>

            <select
              value={condition.operator}
              onChange={(e) =>
                onUpdateCondition(index, { ...condition, operator: e.target.value })
              }
              className="block w-1/3 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {operators.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              value={condition.value}
              onChange={(e) =>
                onUpdateCondition(index, { ...condition, value: e.target.value })
              }
              className="block w-1/3 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              placeholder="Value"
            />

            <button
              onClick={() => onRemoveCondition(index)}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t">
        <button
          onClick={onSaveView}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Save as View
        </button>
        <button
          onClick={onApply}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}