import { useState, useCallback, useEffect } from 'react';
import {
  createWorkflow,
  updateWorkflow,
  deleteWorkflow,
  listWorkflows,
  toggleWorkflow,
  getWorkflowLogs,
} from '../lib/services/workflow';
import type { Workflow, WorkflowLog } from '../lib/types/workflow';

interface UseWorkflowsState {
  workflows: Workflow[];
  loading: boolean;
  error: string | null;
}

export function useWorkflows() {
  const [state, setState] = useState<UseWorkflowsState>({
    workflows: [],
    loading: false,
    error: null,
  });

  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);
  const [logs, setLogs] = useState<WorkflowLog[]>([]);

  const loadWorkflows = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const workflows = await listWorkflows();
      setState(prev => ({ ...prev, workflows }));
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to load workflows',
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const loadLogs = useCallback(async (workflowId: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const workflowLogs = await getWorkflowLogs(workflowId);
      setLogs(workflowLogs);
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to load workflow logs',
      }));
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const create = useCallback(async (workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const newWorkflow = await createWorkflow(workflow);
      setState(prev => ({
        ...prev,
        workflows: [...prev.workflows, newWorkflow],
      }));
      return newWorkflow;
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to create workflow',
      }));
      throw err;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, []);

  const update = useCallback(async (id: string, workflow: Partial<Workflow>) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const updatedWorkflow = await updateWorkflow(id, workflow);
      setState(prev => ({
        ...prev,
        workflows: prev.workflows.map(w => (w.id === id ? updatedWorkflow : w)),
      }));
      if (selectedWorkflow?.id === id) {
        setSelectedWorkflow(updatedWorkflow);
      }
      return updatedWorkflow;
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to update workflow',
      }));
      throw err;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [selectedWorkflow?.id]);

  const remove = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      await deleteWorkflow(id);
      setState(prev => ({
        ...prev,
        workflows: prev.workflows.filter(w => w.id !== id),
      }));
      if (selectedWorkflow?.id === id) {
        setSelectedWorkflow(null);
      }
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to delete workflow',
      }));
      throw err;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [selectedWorkflow?.id]);

  const toggle = useCallback(async (id: string, active: boolean) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const updatedWorkflow = await toggleWorkflow(id, active);
      setState(prev => ({
        ...prev,
        workflows: prev.workflows.map(w => (w.id === id ? updatedWorkflow : w)),
      }));
      if (selectedWorkflow?.id === id) {
        setSelectedWorkflow(updatedWorkflow);
      }
      return updatedWorkflow;
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Failed to toggle workflow',
      }));
      throw err;
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [selectedWorkflow?.id]);

  useEffect(() => {
    loadWorkflows();
  }, [loadWorkflows]);

  return {
    ...state,
    selectedWorkflow,
    logs,
    setSelectedWorkflow,
    loadWorkflows,
    loadLogs,
    create,
    update,
    remove,
    toggle,
  };
}
