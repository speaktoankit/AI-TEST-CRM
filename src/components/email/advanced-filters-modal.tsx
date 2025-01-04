import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

interface Filter {
  field: string;
  operator: string;
  value: string;
}

interface AdvancedFiltersModalProps {
  onClose: () => void;
  onApply: (filters: Filter[]) => void;
}

const fields = [
  { id: 'subject', label: 'Subject' },
  { id: 'from', label: 'From' },
  { id: 'to', label: 'To' },
  { id: 'body', label: 'Body' },
  { id: 'date', label: 'Date' },
  { id: 'has_attachment', label: 'Has Attachment' },
];

const operators = [
  { id: 'contains', label: 'Contains' },
  { id: 'not_contains', label: 'Does not contain' },
  { id: 'equals', label: 'Equals' },
  { id: 'not_equals', label: 'Does not equal' },
  { id: 'starts_with', label: 'Starts with' },
  { id: 'ends_with', label: 'Ends with' },
];

export function AdvancedFiltersModal({ onClose, onApply }: AdvancedFiltersModalProps) {
  const [filters, setFilters] = useState<Filter[]>([
    { field: 'subject', operator: 'contains', value: '' },
  ]);

  const handleAddFilter = () => {
    setFilters([...filters, { field: 'subject', operator: 'contains', value: '' }]);
  };

  const handleRemoveFilter = (index: number) => {
    setFilters(filters.filter((_, i) => i !== index));
  };

  const handleUpdateFilter = (index: number, field: keyof Filter, value: string) => {
    setFilters(
      filters.map((filter, i) =>
        i === index ? { ...filter, [field]: value } : filter
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(filters.filter(f => f.value.trim()));
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-medium">Advanced Filters</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {filters.map((filter, index) => (
            <div key={index} className="flex items-center space-x-4">
              <select
                value={filter.field}
                onChange={(e) => handleUpdateFilter(index, 'field', e.target.value)}
                className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {fields.map((field) => (
                  <option key={field.id} value={field.id}>
                    {field.label}
                  </option>
                ))}
              </select>

              <select
                value={filter.operator}
                onChange={(e) => handleUpdateFilter(index, 'operator', e.target.value)}
                className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {operators.map((op) => (
                  <option key={op.id} value={op.id}>
                    {op.label}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={filter.value}
                onChange={(e) => handleUpdateFilter(index, 'value', e.target.value)}
                placeholder="Value"
                className="block w-1/3 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />

              <button
                type="button"
                onClick={() => handleRemoveFilter(index)}
                className="text-gray-400 hover:text-gray-500"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddFilter}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Filter
          </button>

          <div className="pt-4 border-t flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}