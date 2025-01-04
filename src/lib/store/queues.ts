import { create } from 'zustand';
import type { Queue } from '../types';

interface QueuesState {
  queues: Queue[];
  isLoading: boolean;
  error: Error | null;
  setQueues: (queues: Queue[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  addQueue: (queue: Queue) => void;
  updateQueue: (id: string, updates: Partial<Queue>) => void;
  removeQueue: (id: string) => void;
}

export const useQueuesStore = create<QueuesState>((set) => ({
  queues: [],
  isLoading: false,
  error: null,
  setQueues: (queues) => set({ queues }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  addQueue: (queue) =>
    set((state) => ({ queues: [...state.queues, queue] })),
  updateQueue: (id, updates) =>
    set((state) => ({
      queues: state.queues.map((queue) =>
        queue.id === id ? { ...queue, ...updates } : queue
      ),
    })),
  removeQueue: (id) =>
    set((state) => ({
      queues: state.queues.filter((queue) => queue.id !== id),
    })),
}));