import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface Column {
  id: string;
  label: string;
  visible: boolean;
}

interface TableCustomizerProps {
  columns: Column[];
  onColumnToggle: (columnId: string) => void;
  onColumnReorder: (startIndex: number, endIndex: number) => void;
}

export function TableCustomizer({
  columns,
  onColumnToggle,
}: TableCustomizerProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium mb-4">Customize Table Columns</h3>
      
      <div className="space-y-2">
        {columns.map((column, index) => (
          <div
            key={column.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
          >
            <span>{column.label}</span>
            <button
              onClick={() => onColumnToggle(column.id)}
              className="text-gray-400 hover:text-gray-500"
            >
              {column.visible ? (
                <Eye className="h-5 w-5" />
              ) : (
                <EyeOff className="h-5 w-5" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}