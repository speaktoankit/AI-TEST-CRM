import { useEffect, useCallback } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { useAuthStore } from '../lib/store/auth';
import { useTasksStore } from '../lib/store/tasks';
import type { Task } from '../lib/types';

interface UseTasksOptions {
  search?: string;
  filters?: Record<string, any>;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export function useTasks({
  search = '',
  filters = {},
  sortBy = 'due_date',
  sortDirection = 'asc',
}: UseTasksOptions = {}) {
  const { setTasks, setLoading, setError } = useTasksStore();
  const { user } = useAuthStore();

  const fetchTasks = useCallback(async () => {
    if (!user) {
      setTasks([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);

      const tasksRef = collection(db, 'tasks');
      const baseQuery = [
        where('user_id', '==', user.uid),
        ...(filters.type ? [where('type', '==', filters.type)] : []),
        orderBy(sortBy, sortDirection)
      ];

      // Add status filter if specified
      if (filters.status) {
        baseQuery.push(where('status', '==', filters.status));
      }

      const q = query(tasksRef, ...baseQuery);
      const snapshot = await getDocs(q);
      
      const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Task[];

      const filteredTasks = tasks.filter((task) => {
        if (search && !task.title.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }
        return true;
      });

      setTasks(filteredTasks);
      setError(null);
    } catch (err) {
      const error = err as Error;
      if (error.code === 'failed-precondition') {
        setError(new Error('Unable to access offline data. Please refresh the page.'));
      } else {
        setError(new Error('Error loading tasks. Please try again.'));
        console.error('Error fetching tasks:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [user, sortBy, sortDirection, search, JSON.stringify(filters), setTasks, setLoading, setError]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (data: Omit<Task, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');
    
    const taskData = {
      ...data,
      user_id: user.uid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'tasks'), taskData);
    await fetchTasks();
    return docRef.id;
  };

  const updateTask = async (id: string, data: Partial<Task>) => {
    if (!user) throw new Error('User not authenticated');

    const taskRef = doc(db, 'tasks', id);
    await updateDoc(taskRef, {
      ...data,
      updated_at: new Date().toISOString(),
    });
    await fetchTasks();
  };

  const deleteTask = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    const taskRef = doc(db, 'tasks', id);
    await deleteDoc(taskRef);
    await fetchTasks();
  };

  return {
    refetch: fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}