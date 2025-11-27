import AsyncStorage from '@react-native-async-storage/async-storage';

const LOCAL_MODE = true; // Set to true for local AsyncStorage-only mode

export interface EventRecord {
  id: string;
  name: string;
  description: string;
  date: string; // ISO date string
  time: string;
  groupName?: string;
  location?: string;
  savedBy: string[]; // Array of user IDs who saved this event
  createdBy: string;
  category?: string;
}

const EVENTS_KEY = '@pulse_events';
const USER_ID_KEY = '@pulse_user_id';

// --- LOCAL STORAGE HELPERS ---

async function loadEvents(): Promise<EventRecord[]> {
  try {
    const raw = await AsyncStorage.getItem(EVENTS_KEY);
    if (!raw) return [];
    const events: EventRecord[] = JSON.parse(raw);
    // Migration: ensure savedBy exists
    return events.map(e => ({ ...e, savedBy: e.savedBy || [] }));
  } catch {
    return [];
  }
}

async function saveEvents(events: EventRecord[]): Promise<void> {
  await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

export async function getUserId(): Promise<string> {
  let uid = await AsyncStorage.getItem(USER_ID_KEY);
  if (!uid) {
    uid = `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    await AsyncStorage.setItem(USER_ID_KEY, uid);
  }
  return uid;
}

// --- EVENT OPERATIONS ---

export async function listEvents(): Promise<EventRecord[]> {
  if (LOCAL_MODE) {
    return await loadEvents();
  }
  // Backend fetch would go here
  return [];
}

export async function createEvent(
  name: string,
  description: string,
  date: Date,
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
  // Backend POST would go here
  return '';
}

export async function saveEvent(eventId: string, userId: string): Promise<void> {
  if (LOCAL_MODE) {
    const events = await loadEvents();
    const event = events.find(e => e.id === eventId);
    if (event && !event.savedBy.includes(userId)) {
      event.savedBy.push(userId);
      await saveEvents(events);
    }
  }
  // Backend PUT would go here
}

export async function unsaveEvent(eventId: string, userId: string): Promise<void> {
  if (LOCAL_MODE) {
    const events = await loadEvents();
    const event = events.find(e => e.id === eventId);
    if (event) {
      event.savedBy = event.savedBy.filter(uid => uid !== userId);
      await saveEvents(events);
    }
  }
  // Backend DELETE would go here
}

export async function listUserEvents(userId: string): Promise<EventRecord[]> {
  const all = await listEvents();
  return all.filter(e => e.savedBy.includes(userId));
}
