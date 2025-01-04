export interface Email {
  id: string;
  googleMessageId: string;
  threadId: string;
  subject: string;
  from: string;
  to: string[];
  body: string;
  bodyText?: string;
  bodyHtml?: string;
  receivedAt: Date;
  isRead: boolean;
  isArchived: boolean;
  isStarred: boolean;
  labels: string[];
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  isAllDay: boolean;
  location?: string;
  attendees?: string[];
  googleEventId?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface Integration {
  id: string;
  type: 'gmail' | 'google_calendar' | 'google_contacts' | 'whatsapp';
  status: 'connected' | 'disconnected';
  created_at: string;
  updated_at: string;
  subject?: string;
  suggested_reply?: string;
}

export type EmailView = 'inbox' | 'sent' | 'drafts' | 'trash' | 'spam' | 'starred' | 'important' | 'calendar';
export type CalendarView = 'day' | 'week' | 'month';
