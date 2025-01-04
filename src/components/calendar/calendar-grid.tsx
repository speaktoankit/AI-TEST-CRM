import React from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import type { CalendarEvent } from '../../lib/types';

interface CalendarGridProps {
  currentDate: Date;
  view: 'day' | 'week' | 'month';
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function CalendarGrid({
  currentDate,
  view,
  events,
  onEventClick,
}: CalendarGridProps) {
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const startDate = startOfWeek(currentDate);

  if (view === 'week') {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-7 border-b">
          {weekDays.map((day, index) => {
            const date = addDays(startDate, index);
            const isToday = isSameDay(date, new Date());
            
            return (
              <div
                key={day}
                className={`px-4 py-3 text-center border-r last:border-r-0 ${
                  isToday ? 'bg-indigo-50' : ''
                }`}
              >
                <div className="text-sm font-medium text-gray-900">{day}</div>
                <div className={`text-sm ${isToday ? 'text-indigo-600 font-semibold' : 'text-gray-500'}`}>
                  {format(date, 'd')}
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-7 divide-x h-screen min-h-[600px] overflow-y-auto">
          {weekDays.map((_, index) => {
            const date = addDays(startDate, index);
            const dayEvents = events.filter(event => 
              isSameDay(new Date(event.start_time), date)
            );

            return (
              <div key={index} className="relative">
                {dayEvents.map(event => (
                  <div
                    key={event.id}
                    onClick={() => onEventClick(event)}
                    className="absolute left-1 right-1 px-2 py-1 mt-1 text-sm bg-indigo-100 text-indigo-700 rounded cursor-pointer hover:bg-indigo-200"
                    style={{
                      top: '2rem',
                    }}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Placeholder for day and month views
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-gray-500">
        {view === 'day' ? 'Day view' : 'Month view'} coming soon...
      </p>
    </div>
  );
}