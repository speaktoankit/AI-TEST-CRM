import { create } from 'zustand';
import type { Task, Queue } from '../types';

interface TasksState {
  tasks: Task[];
  queues: Queue[];
  selectedTasks: string[];
  view: 'list' | 'board';
  search: string;
  isLoading: boolean;
  error: string | null;
  setView: (view: 'list' | 'board') => void;
  setSearch: (search: string) => void;
  selectTask: (taskId: string) => void;
  addQueue: (name: string) => void;
  updateQueue: (id: string, name: string) => void;
  deleteQueue: (id: string) => void;
}

export const useTasksStore = create<TasksState>((set) => ({
  tasks: [],
  queues: [],
  selectedTasks: [],
  view: 'list',
  search: '',
  isLoading: false,
  error: null,
  setView: (view) => set({ view }),
  setSearch: (search) => set({ search }),
  selectTask: (taskId) => 
    set((state) => ({
      selectedTasks: state.selectedTasks.includes(taskId)
        ? state.selectedTasks.filter(id => id !== taskId)
        : [...state.selectedTasks, taskId]
    })),
  addQueue: (name) =>
    set((state) => ({
      queues: [...state.queues, {
        id: Date.now().toString(),
        name,
        tasks: [],
        taskCount: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }]
    })),
  updateQueue: (id, name) =>
    set((state) => ({
      queues: state.queues.map(queue =>
        queue.id === id ? { 
          ...queue, 
          name, 
          updated_at: new Date().toISOString() 
        } : queue
      )
    })),
  deleteQueue: (id) =>
    set((state) => ({
      queues: state.queues.filter(queue => queue.id !== id)
    }))
}));