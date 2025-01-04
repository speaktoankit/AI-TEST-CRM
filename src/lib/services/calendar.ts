import { auth } from '../firebase';
import type { CalendarEvent } from '../types/email';

const CALENDAR_BASE_URL = 'https://www.googleapis.com/calendar/v3';

export async function getCalendarToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  
  const token = await user.getIdToken();
  return token;
}

export async function listEvents(
  timeMin: string,
  timeMax: string,
  maxResults: number = 50
): Promise<CalendarEvent[]> {
  const token = await getCalendarToken();
  
  const params = new URLSearchParams({
    timeMin: new Date(timeMin).toISOString(),
    timeMax: new Date(timeMax).toISOString(),
    maxResults: maxResults.toString(),
    singleEvents: 'true',
    orderBy: 'startTime',
  });

  const response = await fetch(
    `${CALENDAR_BASE_URL}/calendars/primary/events?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch calendar events');
  }

  const data = await response.json();
  
  return data.items.map((item: any) => ({
    id: item.id,
    googleEventId: item.id,
    title: item.summary,
    startTime: item.start.dateTime || item.start.date,
    endTime: item.end.dateTime || item.end.date,
    isAllDay: Boolean(item.start.date),
    attendees: item.attendees?.map((attendee: any) => ({
      email: attendee.email,
      name: attendee.displayName,
      responseStatus: attendee.responseStatus,
    })) || [],
    location: item.location,
    description: item.description,
    createdBy: item.creator.email,
    createdAt: item.created,
    updatedAt: item.updated,
  }));
}

export async function createEvent(event: Omit<CalendarEvent, 'id' | 'googleEventId' | 'createdBy' | 'createdAt' | 'updatedAt'>): Promise<CalendarEvent> {
  const token = await getCalendarToken();
  
  const response = await fetch(
    `${CALENDAR_BASE_URL}/calendars/primary/events`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: event.title,
        start: {
          dateTime: event.isAllDay ? undefined : event.startTime,
          date: event.isAllDay ? event.startTime.split('T')[0] : undefined,
        },
        end: {
          dateTime: event.isAllDay ? undefined : event.endTime,
          date: event.isAllDay ? event.endTime.split('T')[0] : undefined,
        },
        attendees: event.attendees?.map(({ email }) => ({ email })),
        location: event.location,
        description: event.description,
      }),
    }
  );

  if (!response.ok) {
    throw new Error('Failed to create calendar event');
  }

  const data = await response.json();
  return {
    id: data.id,
    googleEventId: data.id,
    title: data.summary,
    startTime: data.start.dateTime || data.start.date,
    endTime: data.end.dateTime || data.end.date,
    isAllDay: Boolean(data.start.date),
    attendees: data.attendees?.map((attendee: any) => ({
      email: attendee.email,
      name: attendee.displayName,
      responseStatus: attendee.responseStatus,
    })) || [],
    location: data.location,
    description: data.description,
    createdBy: data.creator.email,
    createdAt: data.created,
    updatedAt: data.updated,
  };
}

export async function updateEvent(
  eventId: string,
  updates: Partial<Omit<CalendarEvent, 'id' | 'googleEventId' | 'createdBy' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  const token = await getCalendarToken();
  
  await fetch(
    `${CALENDAR_BASE_URL}/calendars/primary/events/${eventId}`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        summary: updates.title,
        start: updates.startTime && {
          dateTime: updates.isAllDay ? undefined : updates.startTime,
          date: updates.isAllDay ? updates.startTime.split('T')[0] : undefined,
        },
        end: updates.endTime && {
          dateTime: updates.isAllDay ? undefined : updates.endTime,
          date: updates.isAllDay ? updates.endTime.split('T')[0] : undefined,
        },
        attendees: updates.attendees?.map(({ email }) => ({ email })),
        location: updates.location,
        description: updates.description,
      }),
    }
  );
}

export async function deleteEvent(eventId: string): Promise<void> {
  const token = await getCalendarToken();
  
  await fetch(
    `${CALENDAR_BASE_URL}/calendars/primary/events/${eventId}`,
    {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}
