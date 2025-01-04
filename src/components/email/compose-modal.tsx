import { useState } from 'react';
import type { Email } from '../../lib/types/email';
import { sendEmail } from '../../lib/services/gmail';
import { generateEmailDraft } from '../../lib/services/grok';

interface ComposeModalProps {
  onClose: () => void;
  onSend: (email: Pick<Email, 'to' | 'from' | 'subject' | 'body' | 'bodyText' | 'labels'>) => Promise<void>;
  replyTo?: Email | null;
}

export function ComposeModal({ onClose, onSend, replyTo }: ComposeModalProps) {
  const [to, setTo] = useState(replyTo ? replyTo.from : '');
  const [subject, setSubject] = useState(replyTo ? `Re: ${replyTo.subject}` : '');
  const [body, setBody] = useState(replyTo ? `\n\nOn ${replyTo.receivedAt}, ${replyTo.from} wrote:\n> ${replyTo.bodyText}` : '');
  const [sending, setSending] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !subject || !body) return;

    try {
      setSending(true);
      await onSend({
        to: to.split(',').map(email => email.trim()),
        from: '', // Will be set by the email service
        subject,
        body,
        bodyText: body,
        labels: []
      });
      onClose();
    } catch (error) {
      console.error('Failed to send email:', error);
    } finally {
      setSending(false);
    }
  };

  const handleAIDraft = async () => {
    try {
      setGenerating(true);
      setError(null);

      const prompt = replyTo
        ? `Generate a professional reply to this email. Original email: ${replyTo.subject}\n${replyTo.bodyText}`
        : 'Generate a professional email draft';

      const draftContent = await generateEmailDraft(prompt);
      setBody(draftContent);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate AI draft');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl">
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h3 className="text-lg font-medium">
            {replyTo ? 'Reply' : 'New Message'}
          </h3>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-500"
            disabled={sending || generating}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">To</label>
            <input
              type="email"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              disabled={sending || generating}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              disabled={sending || generating}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Message</label>
            <textarea
              rows={12}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              disabled={sending || generating}
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-between items-center pt-4 border-t">
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleAIDraft}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled={sending || generating}
              >
                <Bot className="h-4 w-4 mr-2" />
                {generating ? 'Generating...' : 'AI Draft'}
              </button>
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled={sending || generating}
              >
                <Paperclip className="h-4 w-4 mr-2" />
                Attach
              </button>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                disabled={sending || generating}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                disabled={sending || !to || !subject || !body}
              >
                {sending ? 'Sending...' : 'Send'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}