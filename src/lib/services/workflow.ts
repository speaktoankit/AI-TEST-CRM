import { auth } from '../firebase';
import type { Workflow, WorkflowLog } from '../types/workflow';

const API_BASE_URL = '/api/workflows';

export async function createWorkflow(workflow: Omit<Workflow, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workflow> {
  const token = await auth.currentUser?.getIdToken();
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(workflow),
  });

  if (!response.ok) {
    throw new Error('Failed to create workflow');
  }

  return response.json();
}

export async function updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow> {
  const token = await auth.currentUser?.getIdToken();
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(workflow),
  });

  if (!response.ok) {
    throw new Error('Failed to update workflow');
  }

  return response.json();
}

export async function deleteWorkflow(id: string): Promise<void> {
  const token = await auth.currentUser?.getIdToken();
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete workflow');
  }
}

export async function listWorkflows(): Promise<Workflow[]> {
  const token = await auth.currentUser?.getIdToken();
  const response = await fetch(API_BASE_URL, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to list workflows');
  }

  return response.json();
}

export async function getWorkflowLogs(workflowId: string): Promise<WorkflowLog[]> {
  const token = await auth.currentUser?.getIdToken();
  const response = await fetch(`${API_BASE_URL}/${workflowId}/logs`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to get workflow logs');
  }

  return response.json();
}

export async function toggleWorkflow(id: string, active: boolean): Promise<Workflow> {
  return updateWorkflow(id, {
    status: active ? 'active' : 'paused',
  });
}
