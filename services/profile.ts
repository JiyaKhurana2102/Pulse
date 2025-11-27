import AsyncStorage from '@react-native-async-storage/async-storage';

export type Profile = {
  name: string;
};

const KEY = 'user_profile';

export async function getProfile(): Promise<Profile> {
  const raw = await AsyncStorage.getItem(KEY);
  if (raw) return JSON.parse(raw);
  const defaultProfile: Profile = { name: 'Student' };
  await AsyncStorage.setItem(KEY, JSON.stringify(defaultProfile));
  return defaultProfile;
}

export async function setProfile(p: Profile): Promise<void> {
  await AsyncStorage.setItem(KEY, JSON.stringify(p));
}
