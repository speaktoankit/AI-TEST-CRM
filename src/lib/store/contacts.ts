import { create } from 'zustand';
import type { Contact } from '../types';

interface ContactsState {
  contacts: Contact[];
  isLoading: boolean;
  error: Error | null;
  selectedContacts: Set<string>;
  view: string;
  search: string;
  leadStatus: string;
  setContacts: (contacts: Contact[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  selectContact: (id: string, selected: boolean) => void;
  selectAll: (selected: boolean, contactIds: string[]) => void;
  setView: (view: string) => void;
  setSearch: (search: string) => void;
  setLeadStatus: (status: string) => void;
}

export const useContactsStore = create<ContactsState>((set) => ({
  contacts: [],
  isLoading: false,
  error: null,
  selectedContacts: new Set(),
  view: 'All Contacts',
  search: '',
  leadStatus: 'All',
  setContacts: (contacts) => set({ contacts }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  selectContact: (id, selected) =>
    set((state) => {
      const newSelected = new Set(state.selectedContacts);
      if (selected) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      return { selectedContacts: newSelected };
    }),
  selectAll: (selected, contactIds) =>
    set({ selectedContacts: selected ? new Set(contactIds) : new Set() }),
  setView: (view) => set({ view }),
  setSearch: (search) => set({ search }),
  setLeadStatus: (leadStatus) => set({ leadStatus }),
}));