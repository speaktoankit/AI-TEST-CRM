import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface ImportModalProps {
  onClose: () => void;
  onImport: (file: File, mappings: Record<string, string>) => Promise<void>;
}

export function ImportModal({ onClose, onImport }: ImportModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [headers, setHeaders] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const crmFields = [
    { id: 'first_name', label: 'First Name' },
    { id: 'last_name', label: 'Last Name' },
    { id: 'email', label: 'Email' },
    { id: 'phone', label: 'Phone' },
    { id: 'company', label: 'Company' },
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // Read CSV headers
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const headers = text.split('\n')[0].split(',').map(h => h.trim());
      setHeaders(headers);
    };
    reader.readAsText(selectedFile);
  };

  const handleImport = async () => {
    if (!file) return;
    
    setIsLoading(true);
    try {
      await onImport(file, mappings);
      onClose();
    } catch (error) {
      console.error('Import failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-medium">Import Contacts</h3>
          <button onClick={onClose}>
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {!file ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <div className="text-sm text-gray-600">
                <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                  <span>Upload a file</span>
                  <input
                    type="file"
                    className="sr-only"
                    accept=".csv"
                    onChange={handleFileChange}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
                <p className="text-xs text-gray-500">CSV up to 10MB</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{file.name}</span>
                <button
                  onClick={() => setFile(null)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Remove
                </button>
              </div>

              <div className="border rounded-md">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        CSV Column
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Maps To
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {headers.map((header) => (
                      <tr key={header}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {header}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={mappings[header] || ''}
                            onChange={(e) =>
                              setMappings({
                                ...mappings,
                                [header]: e.target.value,
                              })
                            }
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          >
                            <option value="">-- Select Field --</option>
                            {crmFields.map((field) => (
                              <option key={field.id} value={field.id}>
                                {field.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!file || isLoading}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
          >
            {isLoading ? 'Importing...' : 'Import'}
          </button>
        </div>
      </div>
    </div>
  );
}