import { create } from 'zustand';
import type { Deal, DealStage } from '../types';

interface DealsState {
  deals: Deal[];
  isLoading: boolean;
  error: Error | null;
  selectedDeals: Set<string>;
  setDeals: (deals: Deal[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  selectDeal: (id: string, selected: boolean) => void;
  selectAll: (selected: boolean, dealIds: string[]) => void;
  updateDealStage: (dealId: string, newStage: DealStage) => void;
}

export const useDealsStore = create<DealsState>((set) => ({
  deals: [],
  isLoading: false,
  error: null,
  selectedDeals: new Set(),
  setDeals: (deals) => set({ deals }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  selectDeal: (id, selected) =>
    set((state) => {
      const newSelected = new Set(state.selectedDeals);
      if (selected) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      return { selectedDeals: newSelected };
    }),
  selectAll: (selected, dealIds) =>
    set({ selectedDeals: selected ? new Set(dealIds) : new Set() }),
  updateDealStage: (dealId, newStage) =>
    set((state) => ({
      deals: state.deals.map((deal) =>
        deal.id === dealId ? { ...deal, stage: newStage } : deal
      ),
    })),
}));