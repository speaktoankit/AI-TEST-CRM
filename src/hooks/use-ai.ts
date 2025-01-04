import { useState, useCallback } from 'react';
import {
  generateEmailDraft,
  analyzeEmail,
  suggestReply,
  summarizeEmails,
  type GrokResponse,
} from '../lib/services/grok';

interface UseAIState {
  loading: boolean;
  error: Error | null;
}

export function useAI() {
  const [state, setState] = useState<UseAIState>({
    loading: false,
    error: null,
  });

  const generateDraft = useCallback(async (prompt: string): Promise<string> => {
    setState({ loading: true, error: null });
    try {
      const draft = await generateEmailDraft(prompt);
      return draft;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to generate draft');
      setState(prev => ({ ...prev, error }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const analyze = useCallback(async (content: string): Promise<GrokResponse> => {
    setState({ loading: true, error: null });
    try {
      const analysis = await analyzeEmail(content);
      return analysis;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to analyze email');
      setState(prev => ({ ...prev, error }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const suggest = useCallback(async (emailContent: string): Promise<string> => {
    setState({ loading: true, error: null });
    try {
      const suggestion = await suggestReply(emailContent);
      return suggestion;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to suggest reply');
      setState(prev => ({ ...prev, error }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const summarize = useCallback(async (emails: string[]): Promise<string> => {
    setState({ loading: true, error: null });
    try {
      const summary = await summarizeEmails(emails);
      return summary;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to summarize emails');
      setState(prev => ({ ...prev, error }));
      throw error;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  return {
    ...state,
    generateDraft,
    analyze,
    suggest,
    summarize,
  };
}
