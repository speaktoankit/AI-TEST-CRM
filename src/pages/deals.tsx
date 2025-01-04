import { useState } from 'react';
import { useDealsStore } from '../lib/store/deals';
import { PipelineColumn } from '../components/deals/pipeline-column';
import { DealsHeader } from '../components/deals/deals-header';
import { DealsToolbar } from '../components/deals/deals-toolbar';
import type { Deal, DealStage } from '../lib/types';

const stages: Array<{ id: DealStage; label: string }> = [
  { id: 'prospect', label: 'Prospect' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'proposal', label: 'Proposal' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'closed_won', label: 'Closed Won' },
  { id: 'closed_lost', label: 'Closed Lost' }
];

export default function Deals() {
  const { deals, isLoading, error } = useDealsStore();
  const [view, setView] = useState<'board' | 'table'>('board');
  const [search, setSearch] = useState('');

  const handleCreateDeal = () => {
    // TODO: Implement create deal modal
  };

  const handleDealClick = (deal: Deal) => {
    // TODO: Implement deal click
    console.log('Deal clicked:', deal.id);
  };

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error loading deals: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DealsHeader
        onCreateDeal={handleCreateDeal}
        onImport={() => {}}
      />

      <DealsToolbar
        view={view}
        onViewChange={setView}
        search={search}
        onSearchChange={setSearch}
        onAdvancedFilters={() => {}}
      />

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
          </div>
        ) : (
          <div className="inline-flex space-x-4 p-4">
            {stages.map((stage) => (
              <PipelineColumn
                key={stage.id}
                stage={stage.id}
                title={stage.label}
                deals={deals.filter((deal) => deal.stage === stage.id)}
                onDealClick={handleDealClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}