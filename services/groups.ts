import { API_BASE } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuthToken } from './auth';

// Set to false to use backend
const LOCAL_MODE = false;

export interface GroupRecord {
  id: string;
  name: string;
  description: string;
  members: string[];
  events?: any[];
  category?: string;
}

export async function getUserId(): Promise<string> {
  const id = await AsyncStorage.getItem('@pulse_user_id');
  if (!id) throw new Error('User not authenticated');
  return id;
}

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function listGroups(): Promise<GroupRecord[]> {
  if (!LOCAL_MODE) {
    try {
      const res = await fetch(`${API_BASE}/groups`, {
        headers: await getAuthHeaders(),
      });

      // If server responded but with error status, try to extract message
      if (!res.ok) {
        let body: any = null;
        try {
          body = await res.json();
        } catch (e) {
          // ignore
        }
        const msg = body?.error || body?.message || `Failed to list groups (${res.status})`;
        throw new Error(msg);
      }

      const data = await res.json();
      return data;
    } catch (err: any) {
      // Network-level failures (DNS, ECONNREFUSED, CORS in web, etc.)
      console.warn('Network error listing groups:', err?.message || err);

      // Fallback to local cache if available
      try {
        const raw = await AsyncStorage.getItem('groups');
        const list: GroupRecord[] = raw ? JSON.parse(raw) : [];
        if (list && list.length > 0) {
          console.warn('Falling back to cached groups from AsyncStorage');
          const migrated = list.map(g => ({ ...g, category: g.category || 'Other' }));
          return migrated;
        }
      } catch (cacheErr) {
        console.warn('Failed to read cached groups:', cacheErr);
      }

      // Nothing to fall back to, rethrow a friendly message
      throw new Error(`Network request failed: ${err?.message || err}`);
    }
  }

  // LOCAL_MODE: return local groups stored in AsyncStorage
  const raw = await AsyncStorage.getItem('groups');
  const list: GroupRecord[] = raw ? JSON.parse(raw) : [];
  const migrated = list.map(g => ({ ...g, category: g.category || 'Other' }));
  if (JSON.stringify(list) !== JSON.stringify(migrated)) {
    await AsyncStorage.setItem('groups', JSON.stringify(migrated));
  }
  return migrated;
}

export async function createGroup(name: string, description: string, category: string = 'Other'): Promise<string> {
  if (!LOCAL_MODE) {
    const res = await fetch(`${API_BASE}/groups`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ name, description, category }),
    });
    if (!res.ok) {
      let msg = 'Failed to create group';
      try { const err = await res.json(); msg = err.error || err.message || msg; } catch {};
      throw new Error(msg);
    }
    const data = await res.json();
    return data.groupId;
  }
  const groups = await listGroups();
  const id = 'g_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 6);
  const newGroup: GroupRecord = { id, name, description, members: [], events: [], category: category || 'Other' };
  const updated = [...groups, newGroup];
  await AsyncStorage.setItem('groups', JSON.stringify(updated));
  return id;
}

export async function joinGroup(groupId: string, userId: string): Promise<void> {
  if (!LOCAL_MODE) {
    const res = await fetch(`${API_BASE}/groups/${groupId}/join`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error('Failed to join group');
    return;
  }
  const groups = await listGroups();
  const updated = groups.map(g => {
    if (g.id === groupId) {
      if (!g.members.includes(userId)) g.members.push(userId);
    }
    return g;
  });
  await AsyncStorage.setItem('groups', JSON.stringify(updated));
}

export async function listUserGroups(userId: string): Promise<GroupRecord[]> {
  const groups = await listGroups();
  return groups.filter(g => g.members.includes(userId));
}

export async function leaveGroup(groupId: string, userId: string): Promise<void> {
  if (!LOCAL_MODE) {
    // Call backend to leave; user determined from auth token
    const res = await fetch(`${API_BASE}/groups/${groupId}/leave`, {
      method: 'POST',
      headers: await getAuthHeaders(),
    });
    if (!res.ok) {
      let msg = 'Failed to leave group';
      try { const err = await res.json(); msg = err.error || msg; } catch {}
      throw new Error(msg);
    }
    return;
  }
  const groups = await listGroups();
  const updated = groups.map(g => {
    if (g.id === groupId) {
      g.members = g.members.filter(m => m !== userId);
    }
    return g;
  });
  await AsyncStorage.setItem('groups', JSON.stringify(updated));
}
