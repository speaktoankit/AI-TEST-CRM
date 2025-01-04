import { create } from 'zustand';
import type { Call } from '../types';

interface CallsState {
  calls: Call[];
  isLoading: boolean;
  error: Error | null;
  selectedCalls: Set<string>;
  view: string;
  search: string;
  setCalls: (calls: Call[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  selectCall: (id: string, selected: boolean) => void;
  selectAll: (selected: boolean) => void;
  setView: (view: string) => void;
  setSearch: (search: string) => void;
}

export const useCallsStore = create<CallsState>((set) => ({
  calls: [],
  isLoading: false,
  error: null,
  selectedCalls: new Set(),
  view: 'All',
  search: '',
  setCalls: (calls) => set({ calls }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  selectCall: (id, selected) =>
    set((state) => {
      const newSelected = new Set(state.selectedCalls);
      if (selected) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      return { selectedCalls: newSelected };
    }),
  selectAll: (selected) =>
    set((state) => ({
      selectedCalls: selected ? new Set(state.calls.map(c => c.id)) : new Set(),
    })),
  setView: (view) => set({ view }),
  setSearch: (search) => set({ search }),
}));