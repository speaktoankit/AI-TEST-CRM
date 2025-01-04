import React from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface CalendarHeaderProps {
  currentDate: Date;
  view: 'day' | 'week' | 'month';
  onViewChange: (view: 'day' | 'week' | 'month') => void;
  onDateChange: (date: Date) => void;
  onCreateEvent: () => void;
}

const views = [
  { id: 'day', label: 'Day' },
  { id: 'week', label: 'Week' },
  { id: 'month', label: 'Month' },
] as const;

export function CalendarHeader({
  currentDate,
  view,
  onViewChange,
  onDateChange,
  onCreateEvent,
}: CalendarHeaderProps) {
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
    onDateChange(newDate);
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
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
        
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
          {views.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => onViewChange(id)}
              className={`px-3 py-1.5 text-sm font-medium ${
                view === id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={onCreateEvent}
        className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
      >
        <Plus className="h-4 w-4 mr-2" />
        New Event
      </button>
    </div>
  );
}