import { useRef, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Star } from 'lucide-react';
import type { Email } from '../../lib/types/email';

interface EmailListProps {
  emails: Email[];
  loading: boolean;
  hasMore: boolean;
  selectedEmails: Set<string>;
  onSelectEmail: (id: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onLoadMore: () => void;
  onMarkRead: (ids: string[]) => void;
  onDelete: (ids: string[]) => void;
}

export function EmailList({
  emails,
  loading,
  hasMore,
  selectedEmails,
  onSelectEmail,
  onSelectAll,
  onLoadMore,
  onMarkRead,
  onDelete,
}: EmailListProps) {
  const observer = useRef<IntersectionObserver>();
  const lastEmailRef = useCallback((node: HTMLTableRowElement | null) => {
    if (loading) return;
    
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  }, [loading, hasMore, onLoadMore]);

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSelectAll(event.target.checked);
  };

  return (
    <div className="overflow-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                onChange={handleSelectAll}
                checked={selectedEmails.size === emails.length && emails.length > 0}
              />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              From
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Subject
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {emails.map((email, index) => (
            <tr
              key={email.id}
              ref={index === emails.length - 1 ? lastEmailRef : null}
              className={`${!email.isRead ? 'font-semibold bg-gray-50' : ''} hover:bg-gray-100`}
            >
              <td className="px-6 py-4">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  checked={selectedEmails.has(email.id)}
                  onChange={(e) => onSelectEmail(email.id, e.target.checked)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{email.from}</td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  {email.isStarred && (
                    <Star className="h-4 w-4 text-yellow-400 mr-2" />
                  )}
                  <span className="truncate">{email.subject}</span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatDistanceToNow(new Date(email.receivedAt), { addSuffix: true })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onMarkRead([email.id])}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  {email.isRead ? 'Mark unread' : 'Mark read'}
                </button>
                <button
                  onClick={() => onDelete([email.id])}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && (
        <div className="flex justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
    </div>
  );
}