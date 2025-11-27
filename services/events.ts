import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../constants/api';
import { getAuthToken } from './auth';

const LOCAL_MODE = false; // Set to false to use backend

export interface EventRecord {
  id: string;
  name: string;
  description: string;
  date: string; // ISO date string
  time: string;
  group?: string; // Group ID (backend requirement)
  groupName?: string; // Display name
  location?: string;
  savedBy?: string[]; // Array of user IDs (local mode)
  attendees?: string[]; // Array of user IDs who RSVP'd (backend mode)
  createdBy: string;
  category?: string;
}

const EVENTS_KEY = '@pulse_events';
const USER_ID_KEY = '@pulse_user_id';

async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
}

// --- LOCAL STORAGE HELPERS ---

async function loadEvents(): Promise<EventRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(EVENTS_KEY);
    if (!raw) return [];
    const events: EventRecord[] = JSON.parse(raw);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const currentEvents = events.filter(e => {
      const eventDate = new Date(e.date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    }).map(e => ({ ...e, savedBy: e.savedBy || [] }));
    
    if (currentEvents.length !== events.length) {
      await saveEvents(currentEvents);
    }
    
    return currentEvents;
  } catch {
    return [];
  }
}

async function saveEvents(events: EventRecord[]): Promise<void> {
  await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export async function getUserId(): Promise<string> {
  let uid = await AsyncStorage.getItem(USER_ID_KEY);
  if (!uid) throw new Error('User not authenticated');
  return uid;
}

// --- EVENT OPERATIONS ---

export async function listEvents(): Promise<EventRecord[]> {
  if (LOCAL_MODE) {
    return await loadEvents();
  }
  // Backend: Get all events across all groups the user can see
  // For now, we'll fetch from all groups since backend doesn't have a global events endpoint
  try {
    const groupsRes = await fetch(`${API_BASE}/groups`, {
      headers: await getAuthHeaders(),
    });
    if (!groupsRes.ok) return [];
    const groups = await groupsRes.json();
    
    const allEvents: EventRecord[] = [];
    for (const group of groups) {
      const eventsRes = await fetch(`${API_BASE}/events/group/${group.id}`, {
        headers: await getAuthHeaders(),
      });
      if (eventsRes.ok) {
        const groupEvents = await eventsRes.json();
        allEvents.push(...groupEvents.map((e: any) => ({
          ...e,
          groupName: group.name,
        })));
      }
    }
    return allEvents;
  } catch (error) {
    console.error('Failed to list events:', error);
    return [];
  }
}

export async function createEvent(
  name: string,
  description: string,
  date: Date,
  groupId: string, // Now required for backend
  groupName?: string,
  location?: string,
  category?: string
): Promise<string> {
  if (LOCAL_MODE) {
    const events = await loadEvents();
    const userId = await getUserId();
    const id = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    const newEvent: EventRecord = {
      id,
      name,
      description,
      date: date.toISOString(),
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      groupName,
      location,
      savedBy: [],
      createdBy: userId,
      category: category || 'Other',
    };
    events.push(newEvent);
    await saveEvents(events);
    return id;
  }
  
  // Backend: POST /events
  try {
    const userId = await getUserId();
    const res = await fetch(`${API_BASE}/events`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({
        name,
        description,
        date: date.toISOString(),
        time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        group: groupId,
        location,
        category: category || 'Other',
        userId, // Send userId to auto-join group
      }),
    });
    if (!res.ok) throw new Error('Failed to create event');
    const data = await res.json();
    return data.eventId;
  } catch (error) {
    console.error('Create event error:', error);
    throw error;
  }
}

export async function saveEvent(eventId: string, userId: string): Promise<void> {
  if (LOCAL_MODE) {
    const events = await loadEvents();
    const event = events.find(e => e.id === eventId);
    if (event && !event.savedBy?.includes(userId)) {
      event.savedBy = [...(event.savedBy || []), userId];
      await saveEvents(events);
    }
    return;
  }
  
  // Backend: POST /events/:id/rsvp
  try {
    const res = await fetch(`${API_BASE}/events/${eventId}/rsvp`, {
      method: 'POST',
      headers: await getAuthHeaders(),
      body: JSON.stringify({ userId }),
    });
    if (!res.ok) throw new Error('Failed to RSVP to event');
  } catch (error) {
    console.error('RSVP error:', error);
    throw error;
  }
}

export async function unsaveEvent(eventId: string, userId: string): Promise<void> {
  if (LOCAL_MODE) {
    const events = await loadEvents();
    const event = events.find(e => e.id === eventId);
    if (event) {
      event.savedBy = event.savedBy?.filter(uid => uid !== userId) || [];
      await saveEvents(events);
    }
    return;
  }
  
  // Backend: No un-RSVP endpoint currently, would need to add one
  console.warn('Un-RSVP not yet implemented in backend');
}

export async function listUserEvents(userId: string): Promise<EventRecord[]> {
  const all = await listEvents();
  if (LOCAL_MODE) {
    return all.filter(e => e.savedBy?.includes(userId));
  }
  // Backend mode: filter by attendees array
  return all.filter(e => e.attendees?.includes(userId));
}
