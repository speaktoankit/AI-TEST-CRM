const GROK_API_URL = 'https://api.grok.ai/v1';

export interface GrokResponse {
  text: string;
  context?: {
    source: string;
    relevance: number;
  }[];
}

export async function generateEmailDraft(prompt: string): Promise<string> {
  const response = await fetch(`${GROK_API_URL}/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROK_API_KEY}`,
    },
    body: JSON.stringify({
      prompt: `Write a professional email: ${prompt}`,
      max_tokens: 500,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate email draft');
  }

  const data = await response.json();
  return data.text;
}

export async function analyzeEmail(content: string): Promise<GrokResponse> {
  const response = await fetch(`${GROK_API_URL}/analyze`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROK_API_KEY}`,
    },
    body: JSON.stringify({
      text: content,
      analysis_type: 'email',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to analyze email');
  }

  return response.json();
}

export async function suggestReply(emailContent: string): Promise<string> {
  const response = await fetch(`${GROK_API_URL}/suggest-reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROK_API_KEY}`,
    },
    body: JSON.stringify({
      email_content: emailContent,
      max_tokens: 300,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to generate reply suggestion');
  }

  const data = await response.json();
  return data.text;
}

export async function summarizeEmails(emails: string[]): Promise<string> {
  const response = await fetch(`${GROK_API_URL}/summarize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_GROK_API_KEY}`,
    },
    body: JSON.stringify({
      texts: emails,
      max_tokens: 200,
      temperature: 0.3,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to summarize emails');
  }

  const data = await response.json();
  return data.text;
}
