import React, { useState } from 'react';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalendarEvent } from '../../lib/types';

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('week');
  const [events] = useState<CalendarEvent[]>([]);
  const [showEventModal, setShowEventModal] = useState(false);

  const startDate = startOfWeek(currentDate);

  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() - 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() - 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'day':
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + 7);
        break;
      case 'month':
        newDate.setMonth(newDate.getMonth() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevious}
              className="p-1 text-gray-400 hover:text-gray-500"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              className="p-1 text-gray-400 hover:text-gray-500"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-md"
            >
              Today
            </button>
          </div>

          <div className="flex border rounded-md">
            <button
              onClick={() => setView('day')}
              className={`px-3 py-1.5 text-sm font-medium ${
                view === 'day'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Day
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3 py-1.5 text-sm font-medium ${
                view === 'week'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView('month')}
              className={`px-3 py-1.5 text-sm font-medium ${
                view === 'month'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Month
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowEventModal(true)}
          className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </button>
      </div>

      {/* Calendar Grid */}
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
    </div>
  );
}