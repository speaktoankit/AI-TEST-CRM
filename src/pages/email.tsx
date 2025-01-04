import { useState } from 'react';
import { useEmailStore } from '../lib/store/email';
import { useCalendar } from '../hooks/use-calendar';
import { EmailHeader } from '../components/email/email-header';
import { EmailList } from '../components/email/email-list';
import { CalendarView } from '../components/email/calendar-view';
import { ComposeModal } from '../components/email/compose-modal';
import type { CalendarEvent } from '../lib/types/email';
import { signInWithGmail } from '../lib/services/gmail';

export default function EmailPage() {
  const {
    emails,
    loading,
    hasMore,
    loadMore,
    selectedEmails,
    view,
    setView,
    selectEmail,
    selectAll,
    markAsRead,
    moveToTrash
  } = useEmailStore();

  const {
    events,
    loading: calendarLoading,
    view: calendarView,
    selectedDate,
    setSelectedDate,
    addEvent
  } = useCalendar();

  const [showCompose, setShowCompose] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isGmailConnected, setIsGmailConnected] = useState(false);

  const handleConnectGmail = async () => {
    setIsConnecting(true);
    try {
      const { success, token } = await signInWithGmail();
      if (success && token) {
        setIsGmailConnected(true);
        return { success: true };
      }
      return { success: false, error: 'Failed to get Gmail token' };
    } catch (error) {
      console.error('Gmail connection error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Failed to connect to Gmail' };
    } finally {
      setIsConnecting(false);
    }
  };

  const handleCreateEvent = async (event: Omit<CalendarEvent, 'id' | 'createdAt' | 'updatedAt' | 'googleEventId' | 'createdBy'>) => {
    try {
      await addEvent(event);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <EmailHeader
        view={view}
        onViewChange={setView}
        onCompose={() => setShowCompose(true)}
        onConnectGmail={handleConnectGmail}
        isConnecting={isConnecting}
        isGmailConnected={isGmailConnected}
        unreadCount={emails.filter(e => !e.isRead).length}
      />

      <div className="flex-1 overflow-hidden">
        {view !== 'calendar' ? (
          <EmailList
            emails={emails}
            loading={loading}
            hasMore={hasMore}
            onLoadMore={loadMore}
            selectedEmails={selectedEmails}
            onSelectEmail={selectEmail}
            onSelectAll={selectAll}
            onMarkRead={markAsRead}
            onDelete={moveToTrash}
          />
        ) : (
          <CalendarView
            events={events}
            view={calendarView}
            loading={calendarLoading}
            error={null}
            selectedDate={selectedDate}
            onDateChange={setSelectedDate}
            onEventClick={() => {}} // TODO: Implement event click handler
            onCreateEvent={handleCreateEvent}
          />
        )}
      </div>

      {showCompose && (
        <ComposeModal
          onClose={() => setShowCompose(false)}
          onSend={async (email) => {
            // TODO: Implement email sending
            console.log('Sending email:', email);
            setShowCompose(false);
          }}
        />
      )}
    </div>
  );
}