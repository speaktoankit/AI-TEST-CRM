import { useState, useCallback, useEffect } from 'react';
import { listEmails, markEmailAsRead, moveEmailToTrash } from '../lib/services/gmail';
import type { Email, EmailView } from '../lib/types/email';

interface EmailState {
  emails: Email[];
  loading: boolean;
  error: Error | null;
  hasMore: boolean;
  nextPageToken?: string;
}

interface UseEmailsOptions {
  search?: string;
  view?: EmailView;
  pageSize?: number;
}

export function useEmails({ 
  search = '', 
  view = 'inbox', 
  pageSize = 20 
}: UseEmailsOptions = {}) {
  const [state, setState] = useState<EmailState>({
    emails: [],
    loading: false,
    error: null,
    hasMore: true,
    nextPageToken: undefined,
  });
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

  const loadEmails = useCallback(async (refresh: boolean = false, nextPageToken?: string) => {
    if (state.loading || (!refresh && !state.hasMore)) return;

    setState(prev => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const response = await listEmails(
        view,
        refresh ? undefined : nextPageToken,
        pageSize
      );
      
      const filteredEmails = response.emails.filter((email) => {
        if (!search) return true;
        
        const searchLower = search.toLowerCase();
        return (
          email.subject.toLowerCase().includes(searchLower) ||
          email.from.toLowerCase().includes(searchLower) ||
          (email.bodyText && email.bodyText.toLowerCase().includes(searchLower))
        );
      });

      setState(prev => ({
        ...prev,
        emails: refresh ? filteredEmails : [...prev.emails, ...filteredEmails],
        hasMore: !!response.nextPageToken,
        nextPageToken: response.nextPageToken,
        loading: false,
      }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err : new Error('Failed to load emails'),
        loading: false,
      }));
    }
  }, [search, view, state.loading, state.hasMore, state.nextPageToken, pageSize]);

  const markAsRead = useCallback(async (emailId: string) => {
    try {
      await markEmailAsRead(emailId);
      setState(prev => ({
        ...prev,
        emails: prev.emails.map(email => 
          email.googleMessageId === emailId ? { ...email, isRead: true } : email
        ),
      }));
    } catch (err) {
      console.error('Failed to mark email as read:', err);
    }
  }, []);

  const moveToTrash = useCallback(async (emailId: string) => {
    try {
      await moveEmailToTrash(emailId);
      setState(prev => ({
        ...prev,
        emails: prev.emails.filter(email => email.googleMessageId !== emailId),
      }));
    } catch (err) {
      console.error('Failed to move email to trash:', err);
    }
  }, []);

  const toggleEmailSelection = useCallback((emailId: string) => {
    setSelectedEmails(prev => 
      prev.includes(emailId)
        ? prev.filter(id => id !== emailId)
        : [...prev, emailId]
    );
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedEmails([]);
  }, []);

  useEffect(() => {
    loadEmails();
  }, [loadEmails]);

  return {
    ...state,
    selectedEmails,
    loadEmails,
    markAsRead,
    moveToTrash,
    toggleEmailSelection,
    clearSelection,
  };
}