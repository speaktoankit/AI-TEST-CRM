import React from 'react';
import { DealCard } from './deal-card';
import type { Deal, DealStage } from '../../lib/types';

interface PipelineColumnProps {
  stage: DealStage;
  title: string;
  deals: Deal[];
  onDealClick: (deal: Deal) => void;
}

export function PipelineColumn({ stage, title, deals, onDealClick }: PipelineColumnProps) {
  const totalAmount = deals.reduce((sum, deal) => sum + deal.amount, 0);

  return (
    <div className="w-80 flex-shrink-0">
      <div className="mb-3">
        <h3 className="font-medium text-gray-900">
          {title} ({deals.length})
        </h3>
        <p className="text-sm text-gray-500">
          {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
          }).format(totalAmount)}
        </p>
      </div>

      <div className="space-y-3">
        {deals.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            onClick={() => onDealClick(deal)}
          />
        ))}
      </div>
    </div>
  );
}