import { useState } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  addHours,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import type { CalendarEvent } from '../../lib/types/email';

interface CalendarViewProps {
  view: 'day' | 'week' | 'month';
  events: CalendarEvent[];
  loading: boolean;
  error: Error | null;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
  onCreateEvent: (event: Omit<CalendarEvent, 'id' | 'googleEventId' | 'createdBy' | 'createdAt' | 'updatedAt'>) => void;
}

export function CalendarView({
  view,
  events,
  loading,
  error,
  selectedDate,
  onDateChange,
  onEventClick,
  onCreateEvent,
}: CalendarViewProps) {
  const [showEventModal, setShowEventModal] = useState(false);

  const navigate = (direction: 'prev' | 'next') => {
    switch (view) {
      case 'day':
        onDateChange(direction === 'prev' ? subDays(selectedDate, 1) : addDays(selectedDate, 1));
        break;
      case 'week':
        onDateChange(direction === 'prev' ? subWeeks(selectedDate, 1) : addWeeks(selectedDate, 1));
        break;
      case 'month':
        onDateChange(direction === 'prev' ? subMonths(selectedDate, 1) : addMonths(selectedDate, 1));
        break;
    }
  };

  const renderDayView = () => {
    const dayEvents = events.filter(event => 
      isSameDay(new Date(event.startTime), selectedDate)
    );

    return (
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 gap-4 p-4">
          {dayEvents.map(event => (
            <button
              key={event.id}
              onClick={() => onEventClick(event)}
              className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="font-medium">{event.title}</div>
              <div className="text-sm text-gray-500">
                {format(new Date(event.startTime), 'h:mm a')} - 
                {format(new Date(event.endTime), 'h:mm a')}
              </div>
              {event.location && (
                <div className="text-sm text-gray-500 mt-1">
                  📍 {event.location}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const start = startOfWeek(selectedDate);
    const end = endOfWeek(selectedDate);
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map(day => {
            const dayEvents = events.filter(event => 
              isSameDay(new Date(event.startTime), day)
            );

            return (
              <div
                key={day.toISOString()}
                className={`min-h-[200px] bg-white p-2 ${
                  isSameMonth(day, selectedDate) ? '' : 'text-gray-400'
                }`}
              >
                <div className="font-medium mb-2">
                  {format(day, 'EEE d')}
                </div>
                <div className="space-y-1">
                  {dayEvents.map(event => (
                    <button
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className="w-full text-left p-2 text-sm rounded bg-blue-50 hover:bg-blue-100"
                    >
                      {format(new Date(event.startTime), 'h:mm a')} - {event.title}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);
    const days = eachDayOfInterval({ start, end });

    return (
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="bg-gray-50 p-2 text-center font-medium">
              {day}
            </div>
          ))}
          {days.map(day => {
            const dayEvents = events.filter(event => 
              isSameDay(new Date(event.startTime), day)
            );

            return (
              <div
                key={day.toISOString()}
                className={`min-h-[100px] bg-white p-2 ${
                  isSameMonth(day, selectedDate) ? '' : 'text-gray-400'
                }`}
              >
                <div className="font-medium mb-1">
                  {format(day, 'd')}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map(event => (
                    <button
                      key={event.id}
                      onClick={() => onEventClick(event)}
                      className="w-full text-left p-1 text-xs rounded bg-blue-50 hover:bg-blue-100 truncate"
                    >
                      {event.title}
                    </button>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-md">
        {error.message}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex items-center justify-between border-b">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('prev')}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => navigate('next')}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <h2 className="text-xl font-semibold">
            {format(selectedDate, view === 'month' ? 'MMMM yyyy' : 'MMMM d, yyyy')}
          </h2>
        </div>

        <button
          onClick={() => setShowEventModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </button>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <>
          {view === 'day' && renderDayView()}
          {view === 'week' && renderWeekView()}
          {view === 'month' && renderMonthView()}
        </>
      )}

      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-medium mb-4">Create New Event</h3>
            {/* Add event form here */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowEventModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onCreateEvent({
                    title: 'New Event',
                    startTime: selectedDate.toISOString(),
                    endTime: addHours(selectedDate, 1).toISOString(),
                    isAllDay: false,
                    attendees: [],
                  });
                  setShowEventModal(false);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
