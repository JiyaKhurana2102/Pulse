import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentUser } from './auth';

export type Profile = {
  name: string;
};

const KEY = '@pulse_profile';

export async function getProfile(): Promise<Profile> {
  // Try to get from current logged-in user first
  const user = await getCurrentUser();
  if (user) {
    return { name: user.name };
  }
  
  // Fallback to old storage
  const raw = await AsyncStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
  
  const defaultProfile: Profile = { name: 'Student' };
  await AsyncStorage.setItem(KEY, JSON.stringify(defaultProfile));
  return defaultProfile;
}

export async function setProfile(p: Profile): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(p));
  
  // Also update the user record
  const user = await getCurrentUser();
  if (user) {
    user.name = p.name;
    await AsyncStorage.setItem('@pulse_current_user', JSON.stringify(user));
    
    // Update in users list
    const usersRaw = await AsyncStorage.getItem('@pulse_users');
    if (usersRaw) {
      const users = JSON.parse(usersRaw);
      const index = users.findIndex((u: any) => u.id === user.id);
      if (index >= 0) {
        users[index] = user;
        await AsyncStorage.setItem('@pulse_users', JSON.stringify(users));
      }
    }
  }
}

