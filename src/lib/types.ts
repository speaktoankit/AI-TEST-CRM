export interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  company: string;
  lead_score: number;
  google_contact_id: string | null;
  created_at: string;
  updated_at: string;
}

export type DealStage = 'prospect' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';

export interface Deal {
  id: string;
  contact_id: string;
  title: string;
  amount: number;
  stage: DealStage;
  close_date: string;
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: string;
  contact_id: string;
  title: string;
  description: string;
  due_date: string;
  status: string;
  type: 'general' | 'call' | 'email' | 'meeting';
  call_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Activity {
  id: string;
  contact_id: string;
  type: string;
  description: string;
  created_at: string;
}

export interface AIInsight {
  id: string;
  contact_id: string;
  type: string;
  content: string;
  status: string;
  created_at: string;
}

export interface Email {
  id: string;
  subject: string;
  from: string;
  to: string[];
  body: string;
  status: 'unread' | 'read';
  labels: string[];
  contact_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Queue {
  id: string;
  name: string;
  taskCount: number;
  created_at: string;
  updated_at: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location?: string;
  description?: string;
  organizer_user_id: string;
  google_event_id?: string;
  contact_id?: string;
  deal_id?: string;
  all_day: boolean;
  created_at: string;
  updated_at: string;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

export interface AIAction {
  type: 'create_task' | 'send_email' | 'update_deal' | 'approve_task' | 'dismiss_task';
  data: Record<string, any>;
  description: string;
  status?: 'pending' | 'approved' | 'dismissed';
}

export interface EmailSuggestion {
  id: string;
  email_id: string;
  thread_id?: string;
  subject: string;
  suggested_reply: string;
  due_date?: string;
  type: 'follow_up' | 'reply' | 'task';
  status: 'pending' | 'approved' | 'dismissed';
  created_at: string;
  task_approved?: boolean;
}

export interface UserRole {
  id: string;
  name: string;
  permissions: {
    contacts: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
    deals: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
    tasks: {
      create: boolean;
      read: boolean;
      update: boolean;
      delete: boolean;
    };
    settings: {
      access: boolean;
    };
  };
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
}

export interface Integration {
  id: string;
  type: 'gmail' | 'google_calendar' | 'google_contacts' | 'whatsapp';
  status: 'connected' | 'disconnected';
  config?: Record<string, any>;
  created_at: string;
  updated_at: string;
  thread_id?: string;
  subject: string;
  suggested_reply: string;
  due_date?: string;
  type: 'follow_up' | 'reply' | 'task';
  status: 'pending' | 'approved' | 'dismissed';
  created_at: string;
  task_approved?: boolean;
}

export interface EmailThread {
  id: string;
  contact_id: string;
  deal_id?: string;
  subject: string;
  last_message_at: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface EmailSuggestion {
  id: string;
  email_id: string;
}

export type CallType = 'inbound' | 'outbound';
export type CallStatus = 'scheduled' | 'completed' | 'missed' | 'no_show';
export type CallOutcome = 'connected' | 'voicemail' | 'busy' | 'no_answer' | 'wrong_number';

export interface Call {
  id: string;
  user_id: string;
  contact_id: string;
  deal_id?: string;
  task_id?: string;
  title: string;
  call_type: CallType;
  status: CallStatus;
  outcome?: CallOutcome;
  scheduled_at: string;
  duration?: number;
  notes?: string;
  recording_url?: string;
  created_at: string;
  updated_at: string;
}