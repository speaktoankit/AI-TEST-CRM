export type TriggerType = 'time' | 'record' | 'email';
export type TriggerConditionType = 'no_reply' | 'lead_score' | 'deal_stage' | 'email_received';
export type ActionType = 'create_task' | 'send_email' | 'update_deal' | 'assign_user';
export type WorkflowStatus = 'active' | 'paused' | 'draft';

export interface TriggerCondition {
  type: TriggerConditionType;
  value: string | number;
  operator?: 'equals' | 'greater_than' | 'less_than' | 'contains';
}

export interface WorkflowAction {
  type: ActionType;
  config: Record<string, any>;
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  triggerType: TriggerType;
  triggerConditions: TriggerCondition[];
  actions: WorkflowAction[];
  status: WorkflowStatus;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  lastRunAt?: string;
}

export interface WorkflowLog {
  id: string;
  workflowId: string;
  firedAt: string;
  affectedRecordIds: string[];
  status: 'success' | 'error';
  errorMessage?: string;
}
