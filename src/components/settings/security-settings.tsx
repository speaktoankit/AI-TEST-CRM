import React, { useState } from 'react';

export function SecuritySettings() {
  const [formData, setFormData] = useState({
    require2FA: false,
    minPasswordLength: 8,
    requireSpecialChars: true,
    requireNumbers: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement security settings update
    console.log('Update security settings:', formData);
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">
          Security Settings
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-900">
                  Two-Factor Authentication
                </label>
                <p className="text-sm text-gray-500">
                  Require 2FA for all users
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setFormData({ ...formData, require2FA: !formData.require2FA })
                }
                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  formData.require2FA ? 'bg-indigo-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    formData.require2FA ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Minimum Password Length
              </label>
              <input
                type="number"
                min="8"
                max="32"
                value={formData.minPasswordLength}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minPasswordLength: parseInt(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireSpecialChars"
                checked={formData.requireSpecialChars}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    requireSpecialChars: e.target.checked,
                  })
                }
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="requireSpecialChars"
                className="ml-2 block text-sm text-gray-900"
              >
                Require special characters in passwords
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="requireNumbers"
                checked={formData.requireNumbers}
                onChange={(e) =>
                  setFormData({ ...formData, requireNumbers: e.target.checked })
                }
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label
                htmlFor="requireNumbers"
                className="ml-2 block text-sm text-gray-900"
              >
                Require numbers in passwords
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Session Timeout (minutes)
              </label>
              <input
                type="number"
                min="5"
                max="1440"
                value={formData.sessionTimeout}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sessionTimeout: parseInt(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maximum Login Attempts
              </label>
              <input
                type="number"
                min="3"
                max="10"
                value={formData.maxLoginAttempts}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxLoginAttempts: parseInt(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}