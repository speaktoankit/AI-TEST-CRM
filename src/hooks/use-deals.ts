import { useEffect, useCallback } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { useAuthStore } from '../lib/store/auth';
import { useDealsStore } from '../lib/store/deals';
import type { Deal } from '../lib/types';

interface UseDealsOptions {
  search?: string;
  filters?: Record<string, any>;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export function useDeals({
  search = '',
  filters = {},
  sortBy = 'created_at',
  sortDirection = 'desc',
}: UseDealsOptions = {}) {
  const { setDeals, setLoading, setError } = useDealsStore();
  const { user } = useAuthStore();

  const fetchDeals = useCallback(async () => {
    if (!user) {
      setDeals([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);

      const dealsRef = collection(db, 'deals');
      const q = query(
        dealsRef,
        where('user_id', '==', user.uid),
        orderBy(sortBy, sortDirection)
      );

      const snapshot = await getDocs(q);
      
      const deals = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Deal[];

      const filteredDeals = deals.filter(deal => {
        if (search) {
          const searchLower = search.toLowerCase();
          return deal.title.toLowerCase().includes(searchLower);
        }
        return true;
      });

      setDeals(filteredDeals);
      setError(null);
    } catch (err) {
      const error = err as Error;
      if (error.code === 'failed-precondition') {
        setError(new Error('Unable to access offline data. Please refresh the page.'));
      } else {
        setError(new Error('Error loading deals. Please try again.'));
        console.error('Error fetching deals:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [user, sortBy, sortDirection, search, setDeals, setLoading, setError]);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals, search, JSON.stringify(filters)]);

  const createDeal = async (data: Omit<Deal, 'id' | 'created_at' | 'updated_at'>) => {
    if (!user) throw new Error('User not authenticated');
    
    const dealData = {
      ...data,
      user_id: user.uid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, 'deals'), dealData);
    await fetchDeals();
    return docRef.id;
  };

  const updateDeal = async (id: string, data: Partial<Deal>) => {
    if (!user) throw new Error('User not authenticated');

    const dealRef = doc(db, 'deals', id);
    await updateDoc(dealRef, {
      ...data,
      updated_at: new Date().toISOString(),
    });
    await fetchDeals();
  };

  const deleteDeal = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    const dealRef = doc(db, 'deals', id);
    await deleteDoc(dealRef);
    await fetchDeals();
  };

  return {
    refetch: fetchDeals,
    createDeal,
    updateDeal,
    deleteDeal,
  };
}