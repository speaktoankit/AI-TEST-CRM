import { create } from 'zustand';
import type { Email, EmailView } from '../types/email';

interface EmailState {
  emails: Email[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  selectedEmails: Set<string>;
  view: EmailView;
  search: string;
  setEmails: (emails: Email[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setHasMore: (hasMore: boolean) => void;
  loadMore: () => Promise<void>;
  selectEmail: (id: string, selected: boolean) => void;
  selectAll: (selected: boolean) => void;
  setView: (view: EmailView) => void;
  setSearch: (search: string) => void;
  markAsRead: (ids: string[]) => void;
  markAsUnread: (ids: string[]) => void;
  moveToTrash: (ids: string[]) => void;
  deleteEmails: (ids: string[]) => void;
}

export const useEmailStore = create<EmailState>((set) => ({
  emails: [],
  loading: false,
  error: null,
  hasMore: true,
  selectedEmails: new Set(),
  view: 'inbox',
  search: '',
  setEmails: (emails) => set({ emails }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setHasMore: (hasMore) => set({ hasMore }),
  loadMore: async () => {
    // Implement loadMore logic
  },
  selectEmail: (id, selected) =>
    set((state) => {
      const newSelected = new Set(state.selectedEmails);
      if (selected) {
        newSelected.add(id);
      } else {
        newSelected.delete(id);
      }
      return { selectedEmails: newSelected };
    }),
  selectAll: (selected) =>
    set((state) => ({
      selectedEmails: selected ? new Set(state.emails.map(e => e.id)) : new Set(),
    })),
  setView: (view) => set({ view }),
  setSearch: (search) => set({ search }),
  markAsRead: (ids) =>
    set((state) => ({
      emails: state.emails.map((email) =>
        ids.includes(email.id) ? { ...email, isRead: true } : email
      ),
    })),
  markAsUnread: (ids) =>
    set((state) => ({
      emails: state.emails.map((email) =>
        ids.includes(email.id) ? { ...email, isRead: false } : email
      ),
    })),
  moveToTrash: (ids) =>
    set((state) => ({
      emails: state.emails.filter((email) => !ids.includes(email.id)),
    })),
  deleteEmails: (ids) =>
    set((state) => ({
      emails: state.emails.filter((email) => !ids.includes(email.id)),
    })),
}));