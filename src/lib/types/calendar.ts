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

export type CalendarView = 'day' | 'week' | 'month' | 'agenda';
