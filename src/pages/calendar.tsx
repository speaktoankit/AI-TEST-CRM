import React, { useState } from 'react';
import { CalendarHeader } from '../components/calendar/calendar-header';
import { CalendarGrid } from '../components/calendar/calendar-grid';
import { EventModal } from '../components/calendar/event-modal';
import type { CalendarEvent } from '../lib/types';

// Mock events for development
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Meeting',
    start_time: new Date().toISOString(),
    end_time: new Date(Date.now() + 3600000).toISOString(),
    description: 'Weekly team sync',
    organizer_user_id: '1',
    all_day: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Client Call',
    start_time: new Date(Date.now() + 86400000).toISOString(),
    end_time: new Date(Date.now() + 90000000).toISOString(),
    description: 'Discuss project requirements',
    organizer_user_id: '1',
    all_day: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();
  const [events] = useState<CalendarEvent[]>(mockEvents);

  const handleCreateEvent = () => {
    setSelectedEvent(undefined);
    setShowEventModal(true);
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventModal(true);
  };

  const handleSaveEvent = (eventData: Partial<CalendarEvent>) => {
    // TODO: Implement event creation/update
    console.log('Save event:', eventData);
    setShowEventModal(false);
  };

  return (
    <div className="space-y-6">
      <CalendarHeader
        currentDate={currentDate}
        view={view}
        onViewChange={setView}
        onDateChange={setCurrentDate}
        onCreateEvent={handleCreateEvent}
      />

      <CalendarGrid
        currentDate={currentDate}
        view={view}
        events={events}
        onEventClick={handleEventClick}
      />

      {showEventModal && (
        <EventModal
          event={selectedEvent}
          onClose={() => setShowEventModal(false)}
          onSave={handleSaveEvent}
        />
      )}
    </div>
  );
}