import { API_BASE } from '@/constants/api';
import { getAuthToken } from './auth';

export type ChatMessage = {
  id: string;
  groupId: string;
  userId: string;
  senderName: string;
  text: string;
  createdAt: number;
  type?: 'system' | 'user';
};

export async function sendMessage(groupId: string, text: string): Promise<ChatMessage> {
  const token = await getAuthToken();
  const response = await fetch(`${API_BASE}/groups/${groupId}/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to send message');
  }

  return response.json();
}

export async function getMessages(groupId: string): Promise<ChatMessage[]> {
  const token = await getAuthToken();
  if (!token) {
    // Signal to caller no auth; do not attempt fetch to avoid spam
    throw new Error('NO_AUTH');
  }
  const response = await fetch(`${API_BASE}/groups/${groupId}/messages`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    let errMsg = 'Failed to fetch messages';
    try {
      const err = await response.json();
      errMsg = err.error || errMsg;
    } catch {}
    if (response.status === 403) {
      throw new Error('FORBIDDEN');
    }
    throw new Error(errMsg);
  }

  const data = await response.json();
  return data.messages || [];
}
