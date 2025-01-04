import { Configuration, OpenAIApi } from 'openai';

const GROK_API_KEY = import.meta.env.VITE_GROK_API_KEY;

interface GrokResponse {
  choices: Array<{
    text: string;
    index: number;
    finish_reason: string;
  }>;
}

async function grokComplete(prompt: string): Promise<string> {
  const response = await fetch('https://api.grok.ai/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROK_API_KEY}`
    },
    body: JSON.stringify({
      prompt,
      max_tokens: 1000,
      temperature: 0.7
    })
  });

  const data: GrokResponse = await response.json();
  return data.choices[0].text;
}

export async function generateEmailReply(originalEmail: string): Promise<string> {
  const prompt = `Generate a professional email reply to the following email:\n\n${originalEmail}`;
  return grokComplete(prompt);
}

export async function generateEmailSummary(emailContent: string): Promise<string> {
  const prompt = `Summarize the following email content in a few key points:\n\n${emailContent}`;
  return grokComplete(prompt);
}

export async function suggestTasks(emailContent: string): Promise<string[]> {
  const prompt = `Extract potential tasks or follow-up actions from this email:\n\n${emailContent}`;
  const response = await grokComplete(prompt);
  return response.split('\n').filter(task => task.trim());
}

export async function generateBulkEmail(template: string, customizations: Record<string, string>[]): Promise<string[]> {
  const emails = await Promise.all(
    customizations.map(async (custom) => {
      let emailContent = template;
      for (const [key, value] of Object.entries(custom)) {
        emailContent = emailContent.replace(`{{${key}}}`, value);
      }
      return grokComplete(`Personalize this email:\n\n${emailContent}`);
    })
  );
  return emails;
}