import { Search, Filter, Trash2, Mail, MailOpen } from 'lucide-react';

interface EmailToolbarProps {
  view: string;
  onViewChange: (view: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  selectedCount: number;
  onMarkRead: () => void;
  onMarkUnread: () => void;
  onDelete: () => void;
  onAdvancedFilters: () => void;
  onBulkEmail: () => void;
}

const views = ['Inbox', 'Unread', 'Starred', 'Sent', 'Drafts'];

export function EmailToolbar({
  view,
  onViewChange,
  search,
  onSearchChange,
  selectedCount,
  onMarkRead,
  onMarkUnread,
  onDelete,
  onAdvancedFilters,
  onBulkEmail,
}: EmailToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex border-b">
        {views.map((v) => (
          <button
            key={v}
            onClick={() => onViewChange(v)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
              view === v
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search emails..."
              className="pl-10 pr-4 py-2 border rounded-lg w-64"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={onAdvancedFilters}
            className="p-2 hover:bg-gray-100 rounded-lg"
            title="Advanced Filters"
          >
            <Filter className="h-5 w-5" />
          </button>
        </div>

        {selectedCount > 0 && (
          <div className="flex items-center space-x-2">
            <button
              onClick={onMarkRead}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Mark as Read"
            >
              <Mail className="h-5 w-5" />
            </button>
            <button
              onClick={onMarkUnread}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Mark as Unread"
            >
              <MailOpen className="h-5 w-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="Delete"
            >
              <Trash2 className="h-5 w-5" />
            </button>
            <button
              onClick={onBulkEmail}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Bulk Email
            </button>
          </div>
        )}
      </div>
    </div>
  );
}