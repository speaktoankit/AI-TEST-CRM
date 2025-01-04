import { useEffect } from 'react';
import { useQueuesStore } from '../lib/store/queues';
import type { Queue } from '../lib/types';

export function useQueues() {
  const { setQueues, setLoading, setError } = useQueuesStore();

  async function fetchQueues() {
    try {
      setLoading(true);
      setError(null);

      // Mock data for development
      const mockQueues: Queue[] = [
        {
          id: '1',
          name: 'Follow-up Calls',
          taskCount: 5,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          name: 'Urgent Tasks',
          taskCount: 3,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '3',
          name: 'Client Meetings',
          taskCount: 2,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ];

      setQueues(mockQueues);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchQueues();
  }, []);

  return {
    refetch: fetchQueues,
  };
}