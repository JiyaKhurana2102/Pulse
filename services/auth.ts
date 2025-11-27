import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

const USERS_KEY = '@pulse_users';
const CURRENT_USER_KEY = '@pulse_current_user';

async function loadUsers(): Promise<User[]> {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveUsers(users: User[]): Promise<void> {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const raw = await AsyncStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function setCurrentUser(user: User | null): Promise<void> {
  if (user) {
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  }
}

export async function login(email: string, password: string): Promise<User | null> {
  const users = await loadUsers();
  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    await setCurrentUser(user);
    // Set the user ID for other services
    await AsyncStorage.setItem('@pulse_user_id', user.id);
    return user;
  }
  return null;
}

export async function signup(name: string, email: string, password: string): Promise<User | null> {
  const users = await loadUsers();
  
  // Check if email already exists
  if (users.find(u => u.email === email)) {
    return null;
  }
  
  const newUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  await saveUsers(users);
  await setCurrentUser(newUser);
  await AsyncStorage.setItem('@pulse_user_id', newUser.id);
  
  // Set profile name
  await AsyncStorage.setItem('@pulse_profile', JSON.stringify({ name }));
  
  return newUser;
}

export async function logout(): Promise<void> {
  await setCurrentUser(null);
}

export async function isLoggedIn(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

// Seed the default test user if no users exist
export async function seedDefaultUser(): Promise<void> {
  const users = await loadUsers();
  if (users.length === 0) {
    const testUser: User = {
      id: 'user_test_default',
      name: 'Student',
      email: 'test@email.com',
      password: 'Om123',
      createdAt: new Date().toISOString(),
    };
    users.push(testUser);
    await saveUsers(users);
  }
}
