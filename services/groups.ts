import { API_BASE } from '@/constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Set to true to use purely local AsyncStorage persistence (no backend required)
const LOCAL_MODE = true;

export interface GroupRecord {
  id: string;
  name: string;
  description: string;
  members: string[];
  events?: any[];
  category?: string;
}

const USER_ID_KEY = 'userId';

export async function getUserId(): Promise<string> {
  let id = await AsyncStorage.getItem(USER_ID_KEY);
  if (!id) {
    id = 'u_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    await AsyncStorage.setItem(USER_ID_KEY, id);
  }
  return id;
}

export async function listGroups(): Promise<GroupRecord[]> {
  if (!LOCAL_MODE) {
    const res = await fetch(`${API_BASE}/groups`);
    if (!res.ok) throw new Error('Failed to list groups');
    return res.json();
  }
  const raw = await AsyncStorage.getItem('groups');
  const list: GroupRecord[] = raw ? JSON.parse(raw) : [];
  // migrate missing category to 'Other'
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, category }),
    });
    if (!res.ok) throw new Error('Failed to create group');
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
      headers: { 'Content-Type': 'application/json' },
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

// Utility to get only groups the user has joined (local mode helper)
export async function listUserGroups(userId: string): Promise<GroupRecord[]> {
  const groups = await listGroups();
  return groups.filter(g => g.members.includes(userId));
}

export async function leaveGroup(groupId: string, userId: string): Promise<void> {
  if (!LOCAL_MODE) {
    // For future backend mode, implement DELETE or POST /leave
    const groups = await listGroups();
    // no-op server call placeholder
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
