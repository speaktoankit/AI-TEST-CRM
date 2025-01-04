import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { DollarSign, Calendar } from 'lucide-react';
import type { Deal } from '../../lib/types';

interface DealCardProps {
  deal: Deal;
  onClick: () => void;
}

export function DealCard({ deal, onClick }: DealCardProps) {
  const closeDate = new Date(deal.close_date);
  const isOverdue = closeDate < new Date();
  const priority = deal.amount > 40000 ? 'High' : deal.amount > 20000 ? 'Medium' : 'Low';
  const priorityColor = {
    High: 'text-red-500',
    Medium: 'text-yellow-500',
    Low: 'text-green-500',
  }[priority];

  return (
    <div
      onClick={onClick}
      className="bg-white p-4 rounded-lg shadow-sm border-l-4 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium text-gray-900 truncate flex-1">{deal.title}</h3>
        <span className={`text-xs font-medium ${priorityColor}`}>{priority}</span>
      </div>
      
      <div className="mt-2 space-y-2">
        <div className="flex items-center text-sm text-gray-500">
          <DollarSign className="h-4 w-4 mr-1" />
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(deal.amount)}
        </div>
        
        <div className="flex items-center text-sm">
          <Calendar className="h-4 w-4 mr-1" />
          <span className={isOverdue ? 'text-red-600' : 'text-gray-500'}>
            {formatDistanceToNow(closeDate, { addSuffix: true })}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Task due in 12 days</span>
          <span>Call 7 days ago</span>
        </div>
      </div>
    </div>
  );
}