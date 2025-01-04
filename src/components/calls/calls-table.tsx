import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Phone, PhoneIncoming, PhoneOutgoing, CheckCircle2, XCircle } from 'lucide-react';
import type { Call } from '../../lib/types';

interface CallsTableProps {
  calls: Call[];
  isLoading: boolean;
  onCallClick: (call: Call) => void;
  selectedCalls: Set<string>;
  onSelectCall: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
}

export function CallsTable({
  calls,
  isLoading,
  onCallClick,
  selectedCalls,
  onSelectCall,
  onSelectAll,
}: CallsTableProps) {
  if (isLoading) {
    return <CallsTableSkeleton />;
  }

  const allSelected = calls.length > 0 && calls.every(c => selectedCalls.has(c.id));

  return (
    <div className="bg-white shadow-sm rounded-lg border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th scope="col" className="relative w-12 px-6 sm:w-16 sm:px-8">
              <input
                type="checkbox"
                className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                checked={allSelected}
                onChange={(e) => onSelectAll(e.target.checked)}
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Contact
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Task Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Scheduled
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Duration
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Outcome
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {calls.map((call) => (
            <tr
              key={call.id}
              onClick={() => onCallClick(call)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="relative w-12 px-6 sm:w-16 sm:px-8">
                <input
                  type="checkbox"
                  className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={selectedCalls.has(call.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    onSelectCall(call.id, e.target.checked);
                  }}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {call.call_type === 'inbound' ? (
                  <PhoneIncoming className="h-5 w-5 text-green-500" />
                ) : (
                  <PhoneOutgoing className="h-5 w-5 text-blue-500" />
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">John Doe</div>
                <div className="text-sm text-gray-500">Acme Corp</div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900">{call.title}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  call.status === 'completed' ? 'bg-green-100 text-green-800' :
                  call.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {call.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {call.task_id && (
                  <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                    call.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {call.status === 'completed' ? 'Completed' : 'Pending'}
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDistanceToNow(new Date(call.scheduled_at), { addSuffix: true })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {call.duration ? `${call.duration} min` : '--'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {call.outcome && (
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    call.outcome === 'connected' ? 'bg-green-100 text-green-800' :
                    call.outcome === 'voicemail' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {call.outcome === 'connected' && <CheckCircle2 className="mr-1 h-3 w-3" />}
                    {call.outcome === 'voicemail' && <Phone className="mr-1 h-3 w-3" />}
                    {call.outcome === 'no_answer' && <XCircle className="mr-1 h-3 w-3" />}
                    {call.outcome}
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CallsTableSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-12 bg-gray-200 mb-4" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-100 mb-2" />
      ))}
    </div>
  );
}