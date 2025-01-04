import { useState, useCallback, useEffect } from 'react';
import { listEvents, createEvent, updateEvent, deleteEvent } from '../lib/services/calendar';
import type { CalendarEvent } from '../lib/types/email';

export function useCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [view, setView] = useState<'day' | 'week' | 'month'>('month');
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getTimeRange = useCallback(() => {
    const start = new Date(selectedDate);
    const end = new Date(selectedDate);

    switch (view) {
      case 'day':
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);
        break;
      case 'week':
        start.setDate(start.getDate() - start.getDay());
        end.setDate(end.getDate() + (6 - end.getDay()));
        end.setHours(23, 59, 59, 999);
        break;
      case 'month':
        start.setDate(1);
        end.setMonth(end.getMonth() + 1);
        end.setDate(0);
        end.setHours(23, 59, 59, 999);
        break;
    }

    return { start, end };
  }, [view, selectedDate]);

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { start, end } = getTimeRange();
      const fetchedEvents = await listEvents(start.toISOString(), end.toISOString());
      setEvents(fetchedEvents);
    } catch (err) {
      console.error('Error fetching calendar events:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch calendar events'));
    } finally {
      setLoading(false);
    }
  }, [getTimeRange]);

  const refresh = useCallback(() => {
    fetchEvents();
  }, [fetchEvents]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const addEvent = useCallback(async (eventData: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt' | 'googleEventId' | 'createdBy'>) => {
    try {
      setLoading(true);
      await createEvent(eventData);
      await fetchEvents();
    } catch (err) {
      console.error('Error creating event:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchEvents]);

  const editEvent = useCallback(async (eventId: string, updates: Partial<Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt' | 'googleEventId' | 'createdBy'>>) => {
    try {
      setLoading(true);
      await updateEvent(eventId, updates);
      await fetchEvents();
    } catch (err) {
      console.error('Error updating event:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchEvents]);

  const removeEvent = useCallback(async (eventId: string) => {
    try {
      setLoading(true);
      await deleteEvent(eventId);
      await fetchEvents();
    } catch (err) {
      console.error('Error deleting event:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchEvents]);

  return {
    events,
    loading,
    error,
    view,
    selectedDate,
    setView,
    setSelectedDate,
    addEvent,
    editEvent,
    removeEvent,
    refresh
  };
}
