import { auth } from './firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import type { Email } from './types';

// Create provider with additional scopes
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/gmail.readonly');
provider.addScope('https://www.googleapis.com/auth/gmail.send');
provider.addScope('https://www.googleapis.com/auth/gmail.modify');
provider.addScope('https://www.googleapis.com/auth/calendar.readonly');
provider.addScope('https://www.googleapis.com/auth/calendar.events');

// Configure auth to minimize popup blocks
provider.setCustomParameters({ 
  prompt: 'select_account',
  access_type: 'offline'
});

export async function signInWithGmail() {
  try {
    // Clear any existing tokens first
    localStorage.removeItem('gmail_token');
    localStorage.removeItem('gmail_email');
    
    const result = await signInWithPopup(auth, provider);
    
    if (!result?.user) {
      return { success: false, error: 'Authentication failed - No user data received' };
    }

    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      return {
        success: false,
        error: 'Failed to get access token - Please try again'
      };
    }

    // Store auth data in localStorage for persistence
    localStorage.setItem('gmail_token', credential.accessToken);
    localStorage.setItem('gmail_email', result.user.email || '');
    
    return { 
      success: true, 
      token: credential.accessToken,
      email: result.user.email 
    };
  } catch (error: any) {
    console.error('Gmail sign in error:', error);
    localStorage.removeItem('gmail_token');
    localStorage.removeItem('gmail_email');

    if (error.code === 'auth/unauthorized-domain') {
      return {
        success: false,
        error: 'This domain is not authorized. Please add localhost:5173 to authorized domains in Google Cloud Console.'
      };
    }

    if (error.code === 'auth/popup-blocked') {
      return {
        success: false,
        error: 'Popup was blocked. Please allow popups for this site and try again.'
      };
    }

    if (error.code === 'auth/cancelled-popup-request') {
      return {
        success: false,
        error: 'Authentication was cancelled. Please try again.'
      };
    }

    return {
      success: false,
      error: error.message || 'Failed to connect to Gmail. Please try again.'
    };
  }
}

export async function checkGmailAuth() {
  try {
    const token = localStorage.getItem('gmail_token');
    if (!token) {
      return false;
    }

    // Verify token is still valid
    const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/profile', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.status === 401) {
      localStorage.removeItem('gmail_token');
      localStorage.removeItem('gmail_email');
      return false;
    }

    return response.ok;
  } catch (error) {
    console.error('Error checking Gmail auth:', error);
    localStorage.removeItem('gmail_token');
    localStorage.removeItem('gmail_email');
    return false;
  }
}

export async function signOut() {
  localStorage.removeItem('gmail_token');
  localStorage.removeItem('gmail_email');
  await auth.signOut();
}

export async function fetchEmails(): Promise<Email[]> {
  const token = localStorage.getItem('gmail_token');
  if (!token) {
    console.log('No Gmail token found');
    return [];
  }

  try {
    // Fetch last 20 emails
    const response = await fetch(
      'https://www.googleapis.com/gmail/v1/users/me/messages?maxResults=20&labelIds=INBOX',
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('gmail_token');
        localStorage.removeItem('gmail_email');
        return [];
      }
      console.error('Failed to fetch emails:', response.statusText);
      return [];
    }

    const data = await response.json();
    if (!data.messages) {
      return [];
    }
    
    // Fetch full message details
    const emails = await Promise.all(
      data.messages.map(async (msg: any) => {
        const msgResponse = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=full`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        if (!msgResponse.ok) {
          console.error('Failed to fetch message:', msg.id);
          return null;
        }

        const msgData = await msgResponse.json();
        return parseGmailMessage(msgData);
      })
    ).then(emails => emails.filter((email): email is Email => email !== null));

    return emails;
  } catch (error) {
    console.error('Error fetching emails:', error);
    return [];
  }
}

function parseGmailMessage(msg: any): Email {
  const headers = msg.payload.headers;
  const getHeader = (name: string) => headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())?.value || '';
  
  const subject = getHeader('Subject') || '(no subject)';
  const from = getHeader('From');
  const to = getHeader('To').split(',').map((email: string) => email.trim()).filter(Boolean);
  
  // Parse email body
  let body = '';
  try {
    if (msg.payload.parts) {
      // Prefer plain text over HTML
      const textPart = msg.payload.parts.find((part: any) => part.mimeType === 'text/plain') ||
                      msg.payload.parts.find((part: any) => part.mimeType === 'text/html');

      if (textPart?.body?.data) {
        body = Buffer.from(textPart.body.data, 'base64').toString();
        if (textPart.mimeType === 'text/html') {
          // Strip HTML tags for display
          body = body.replace(/<[^>]*>/g, '');
        }
      }
    } else if (msg.payload.body?.data) {
      body = Buffer.from(msg.payload.body.data, 'base64').toString();
    }
  } catch (error) {
    console.error('Error parsing email body:', error);
    body = '(Error loading email content)';
  }

  // Clean up body text
  body = body.trim().replace(/\n{3,}/g, '\n\n');
  return {
    id: msg.id,
    subject,
    from,
    to,
    body,
    status: msg.labelIds.includes('UNREAD') ? 'unread' : 'read',
    labels: msg.labelIds || [],
    created_at: new Date(parseInt(msg.internalDate)).toISOString(),
    updated_at: new Date(parseInt(msg.internalDate)).toISOString(),
  };
}