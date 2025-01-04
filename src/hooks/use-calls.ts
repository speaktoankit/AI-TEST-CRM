import { useEffect, useCallback } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { useAuthStore } from '../lib/store/auth';
import { useCallsStore } from '../lib/store/calls';
import type { Call } from '../lib/types';

interface UseCallsOptions {
  search?: string;
  filters?: Record<string, any>;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export function useCalls({
  search = '',
  filters = {},
  sortBy = 'scheduled_at',
  sortDirection = 'asc',
}: UseCallsOptions = {}) {
  const { setCalls, setLoading, setError } = useCallsStore();
  const { user } = useAuthStore();

  const fetchCalls = useCallback(async () => {
    if (!user) {
      setCalls([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);

      const callsRef = collection(db, 'calls');
      const baseQuery = [
        where('user_id', '==', user.uid),
        orderBy(sortBy, sortDirection)
      ];

      // Add status filter if specified
      if (filters.status) {
        baseQuery.push(where('status', '==', filters.status));
      }

      const q = query(callsRef, ...baseQuery);
      const snapshot = await getDocs(q);
      
      const calls = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Call[];

      const filteredCalls = calls.filter((call) => {
        if (search && !call.title.toLowerCase().includes(search.toLowerCase())) {
          return false;
        }
        return true;
      });

      setCalls(filteredCalls);
      setError(null);
    } catch (err) {
      const error = err as Error;
      if (error.code === 'failed-precondition') {
        setError(new Error('Unable to access offline data. Please refresh the page.'));
      } else {
        setError(new Error('Error loading calls. Please try again.'));
        console.error('Error fetching calls:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [user, sortBy, sortDirection, search, JSON.stringify(filters), setCalls, setLoading, setError]);

  useEffect(() => {
    fetchCalls();
  }, [fetchCalls]);

  const createCall = async (data: Omit<Call, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');
    
    // Start a batch write
    const batch = writeBatch(db);
    
    // Create the call document
    const callData = {
      ...data,
      user_id: user.uid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    const callRef = doc(collection(db, 'calls'));
    batch.set(callRef, callData);

    // Create associated task if it's a scheduled call
    if (data.status === 'scheduled') {
      const taskData = {
        user_id: user.uid,
        contact_id: data.contact_id,
        title: `Call: ${data.title}`,
        description: data.title,
        due_date: data.scheduled_at,
        status: 'pending',
        type: 'call',
        call_id: callRef.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      const taskRef = doc(collection(db, 'tasks'));
      batch.set(taskRef, taskData);
      
      // Update call with task reference
      batch.update(callRef, { task_id: taskRef.id });
    }

    // Commit the batch
    await batch.commit();

    await fetchCalls();
    return callRef.id;
  };

  const updateCall = async (id: string, data: Partial<Call>) => {
    if (!user) throw new Error('User not authenticated');

    const callRef = doc(db, 'calls', id);
    const call = await getDoc(callRef);
    if (!call.exists()) throw new Error('Call not found');

    const batch = writeBatch(db);
    
    // Update call
    batch.update(callRef, {
      ...data,
      updated_at: new Date().toISOString(),
    });

    // Update associated task if exists
    if (call.data().task_id) {
      const taskRef = doc(db, 'tasks', call.data().task_id);
      batch.update(taskRef, {
        status: data.status === 'completed' ? 'completed' : 'pending',
        updated_at: new Date().toISOString(),
      });
    }

    await batch.commit();
    await fetchCalls();
  };

  const deleteCall = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    const callRef = doc(db, 'calls', id);
    await deleteDoc(callRef);
    await fetchCalls();
  };

  return {
    refetch: fetchCalls,
    createCall,
    updateCall,
    deleteCall,
  };
}