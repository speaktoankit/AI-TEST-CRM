import { useEffect, useCallback } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy } from 'firebase/firestore';
import { useAuthStore } from '../lib/store/auth';
import { useContactsStore } from '../lib/store/contacts';
import type { Contact } from '../lib/types';

interface UseContactsOptions {
  page?: number;
  perPage?: number;
  search?: string;
  filters?: Record<string, any>;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}

export function useContacts({
  page = 1,
  perPage = 10,
  search = '',
  filters = {},
  sortBy = 'created_at',
  sortDirection = 'desc',
}: UseContactsOptions = {}) {
  const { setContacts, setLoading, setError } = useContactsStore();
  const { user } = useAuthStore();

  const fetchContacts = useCallback(async () => {
    if (!user) {
      setContacts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const contactsRef = collection(db, 'contacts');
      const q = query(
        contactsRef,
        where('user_id', '==', user.uid),
        orderBy(sortBy, sortDirection)
      );

      const snapshot = await getDocs(q);
      const contacts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Contact[];

      // Apply search filter client-side
      const filteredContacts = contacts.filter(contact => {
        if (search) {
          const searchLower = search.toLowerCase();
          return (
            contact.first_name.toLowerCase().includes(searchLower) ||
            contact.last_name.toLowerCase().includes(searchLower) ||
            contact.email.toLowerCase().includes(searchLower)
          );
        }
        return true;
      });

      setContacts(filteredContacts);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [user, sortBy, sortDirection, search, setContacts, setLoading, setError]);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts, page, perPage, search, JSON.stringify(filters)]);

  const createContact = async (data: Omit<Contact, 'id' | 'created_at' | 'updated_at' | 'google_contact_id'>) => {
    if (!user) throw new Error('User not authenticated');
    
    const contactData = {
      ...data,
      user_id: user.uid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      google_contact_id: null
    };

    const docRef = await addDoc(collection(db, 'contacts'), contactData);
    await fetchContacts();
    return docRef.id;
  };

  const updateContact = async (id: string, data: Partial<Contact>) => {
    if (!user) throw new Error('User not authenticated');

    const contactRef = doc(db, 'contacts', id);
    await updateDoc(contactRef, {
      ...data,
      updated_at: new Date().toISOString(),
    });
    await fetchContacts();
  };

  const deleteContact = async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    const contactRef = doc(db, 'contacts', id);
    await deleteDoc(contactRef);
    await fetchContacts();
  };

  return {
    refetch: fetchContacts,
    createContact,
    updateContact,
    deleteContact,
  };
}