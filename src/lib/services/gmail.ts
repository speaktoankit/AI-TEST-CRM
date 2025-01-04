import { auth } from '../firebase';
import type { Email } from '../types/email';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { firebase } from '../firebase';

const GMAIL_BASE_URL = 'https://gmail.googleapis.com/gmail/v1/users/me';

export interface GmailAPIResponse {
  messages: Array<{
    id: string;
    threadId: string;
  }>;
  nextPageToken?: string;
}

interface MessagePart {
  mimeType: string;
  headers?: Array<{
    name: string;
    value: string;
  }>;
  body: {
    data?: string;
    attachmentId?: string;
  };
  parts?: MessagePart[];
}

interface GmailMessageResponse {
  id: string;
  threadId: string;
  labelIds: string[];
  snippet: string;
  payload: MessagePart;
}

export interface GmailResponse {
  success: boolean;
  error?: string;
  token?: string | null;
}

export async function signInWithGmail(): Promise<void> {
  try {
    const provider = new GoogleAuthProvider();
    
    // Add required Gmail scopes
    provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
    provider.addScope('https://www.googleapis.com/auth/gmail.send');
    provider.addScope('https://www.googleapis.com/auth/gmail.modify');
    provider.addScope('https://www.googleapis.com/auth/gmail.compose');
    
    // Set custom parameters
    provider.setCustomParameters({
      prompt: 'consent',
      access_type: 'offline'
    });

    await signInWithRedirect(auth, provider);
  } catch (error) {
    console.error('Error initiating Gmail sign-in:', error);
    throw error;
  }
}

export async function handleGmailRedirect(): Promise<GmailResponse> {
  try {
    console.log('Handling Gmail redirect...');
    const result = await getRedirectResult(auth);
    console.log('Redirect result:', result);
    
    if (!result) {
      console.log('No redirect result found');
      return { success: false, error: 'No redirect result' };
    }

    const credential = GoogleAuthProvider.credentialFromResult(result);
    console.log('Credential:', credential);
    
    if (!credential) {
      console.log('No credential found');
      return { success: false, error: 'No credentials returned' };
    }

    const token = credential.accessToken;
    console.log('Access token:', token ? 'Present' : 'Missing');
    
    if (!token) {
      return { success: false, error: 'No access token returned' };
    }

    return { success: true, token };
  } catch (error) {
    console.error('Error handling Gmail redirect:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to complete Gmail sign-in' 
    };
  }
}

export async function checkGmailAuth(): Promise<boolean> {
  try {
    const user = auth.currentUser;
    if (!user) return false;

    const token = await user.getIdToken(true);
    const response = await fetch(`${GMAIL_BASE_URL}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error checking Gmail auth:', error);
    return false;
  }
}

export async function signOut(): Promise<void> {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function getGmailToken(): Promise<string> {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  
  try {
    // Get the current ID token
    const token = await user.getIdToken(true);
    return token;
  } catch (error) {
    console.error('Error getting Gmail token:', error);
    throw new Error('Failed to get Gmail token');
  }
}

export async function listEmails(
  view: string = 'inbox',
  pageToken?: string,
  maxResults: number = 20
): Promise<{ emails: Email[]; nextPageToken?: string }> {
  const token = await getGmailToken();
  
  let query = '';
  switch (view.toLowerCase()) {
    case 'inbox':
      query = 'in:inbox';
      break;
    case 'sent':
      query = 'in:sent';
      break;
    case 'drafts':
      query = 'in:drafts';
      break;
    case 'starred':
      query = 'is:starred';
      break;
    case 'spam':
      query = 'in:spam';
      break;
    case 'trash':
      query = 'in:trash';
      break;
    default:
      query = 'in:inbox';
  }

  const params = new URLSearchParams({
    q: query,
    maxResults: maxResults.toString(),
    ...(pageToken && { pageToken }),
  });

  const response = await fetch(
    `${GMAIL_BASE_URL}/messages?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch emails');
  }

  const data: GmailAPIResponse = await response.json();
  const emails: Email[] = [];

  // Fetch full message details for each email
  for (const message of data.messages) {
    const messageResponse = await fetch(
      `${GMAIL_BASE_URL}/messages/${message.id}?format=full`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (messageResponse.ok) {
      const messageData: GmailMessageResponse = await messageResponse.json();
      
      let bodyText = '';
      let bodyHtml = '';

      const processBody = (part: MessagePart) => {
        if (part.mimeType === 'text/plain' && part.body?.data) {
          bodyText = Buffer.from(part.body.data, 'base64').toString();
        } else if (part.mimeType === 'text/html' && part.body?.data) {
          bodyHtml = Buffer.from(part.body.data, 'base64').toString();
        }

        if (part.parts) {
          part.parts.forEach(processBody);
        }
      };

      processBody(messageData.payload);

      const headers = messageData.payload.headers || [];
      const getHeader = (name: string) => headers.find(h => h.name.toLowerCase() === name.toLowerCase())?.value;

      emails.push({
        id: messageData.id,
        googleMessageId: messageData.id,
        threadId: messageData.threadId,
        subject: getHeader('subject') || 'No Subject',
        from: getHeader('from') || '',
        to: (getHeader('to') || '').split(',').map(email => email.trim()),
        body: bodyText || bodyHtml,
        receivedAt: new Date(getHeader('date') || Date.now()),
        isRead: !messageData.labelIds.includes('UNREAD'),
        isArchived: !messageData.labelIds.includes('INBOX'),
        isStarred: messageData.labelIds.includes('STARRED'),
        labels: messageData.labelIds
      });
    }
  }

  return {
    emails,
    nextPageToken: data.nextPageToken,
  };
}

export async function markEmailAsRead(messageId: string): Promise<void> {
  const token = await getGmailToken();
  
  await fetch(`${GMAIL_BASE_URL}/messages/${messageId}/modify`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      removeLabelIds: ['UNREAD'],
    }),
  });
}

export async function moveEmailToTrash(messageId: string): Promise<void> {
  const token = await getGmailToken();
  
  await fetch(`${GMAIL_BASE_URL}/messages/${messageId}/trash`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function sendEmail(
  to: string[],
  subject: string,
  body: string,
  cc?: string[],
  bcc?: string[]
): Promise<void> {
  const token = await getGmailToken();
  
  const email = [
    `From: ${auth.currentUser?.email}`,
    `To: ${to.join(', ')}`,
    cc?.length ? `Cc: ${cc.join(', ')}` : '',
    bcc?.length ? `Bcc: ${bcc.join(', ')}` : '',
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: ${subject}`,
    '',
    body,
  ].filter(Boolean).join('\r\n');

  const encodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');

  await fetch(`${GMAIL_BASE_URL}/messages/send`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      raw: encodedEmail,
    }),
  });
}
