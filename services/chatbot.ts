import { API_BASE } from '@/constants/api';

export interface BotMessage {
  id: string;
  text: string;
  from: 'user' | 'bot';
  createdAt: number;
}

export async function sendChatbotMessage(message: string, sessionId?: string): Promise<{ reply: string; suggestions: string[]; intent?: string; }> {
  const res = await fetch(`${API_BASE}/chatbot`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(sessionId ? { 'X-Session-Id': sessionId } : {}) },
    body: JSON.stringify({ message })
  });
  if (!res.ok) {
    try {
      const err = await res.json();
      throw new Error(err.error || 'Failed to reach chatbot');
    } catch {
      throw new Error('Failed to reach chatbot');
    }
  }
  const data = await res.json();
  return { reply: data.reply || 'No reply available.', suggestions: data.suggestions || [], intent: data.intent };
}