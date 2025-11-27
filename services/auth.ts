import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE } from '../constants/api';

export interface User {
  uid: string;
  name: string;
  email: string;
  createdAt?: string;
}

interface AuthResponse {
  user: User;
  idToken: string;
  refreshToken: string;
}

const CURRENT_USER_KEY = '@pulse_current_user';
const AUTH_TOKEN_KEY = '@pulse_auth_token';
const REFRESH_TOKEN_KEY = '@pulse_refresh_token';

export async function getCurrentUser(): Promise<User | null> {
  try {
    const raw = await AsyncStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function getAuthToken(): Promise<string | null> {
  const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
  if (!token) return null;

  // Check if token is expired (tokens expire after 1 hour)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    
    // If token expires in less than 5 minutes, refresh it
    if (expirationTime - currentTime < 5 * 60 * 1000) {
      console.log('Token expiring soon, refreshing...');
      const refreshed = await refreshAuthToken();
      if (refreshed) return refreshed;
    }
  } catch (error) {
    console.log('Token check error, will try to use existing token:', error);
  }

  return token;
}

async function refreshAuthToken(): Promise<string | null> {
  try {
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
    if (!refreshToken) {
      console.log('No refresh token available');
      return null;
    }

   const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
    const response = await fetch(
      `https://securetoken.googleapis.com/v1/token?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Token refresh failed:', errorData);
      return null;
    }

    const data = await response.json();
    await AsyncStorage.setItem(AUTH_TOKEN_KEY, data.id_token);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
    
    console.log('Token refreshed successfully');
    return data.id_token;
  } catch (error) {
    console.error('Token refresh error:', error);
    return null;
  }
}

async function setAuthData(user: User, idToken: string, refreshToken: string): Promise<void> {
  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, idToken);
  await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  await AsyncStorage.setItem('@pulse_user_id', user.uid);
}

async function clearAuthData(): Promise<void> {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  await AsyncStorage.removeItem(REFRESH_TOKEN_KEY);
  await AsyncStorage.removeItem('@pulse_user_id');
}

export async function login(email: string, password: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      return null;
    }

    const data: AuthResponse = await response.json();
    await setAuthData(data.user, data.idToken, data.refreshToken);
    return data.user;
  } catch (error) {
    console.error('Login error:', error);
    return null;
  }
}

export async function signup(name: string, email: string, password: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      return null;
    }

    const data: AuthResponse = await response.json();
    await setAuthData(data.user, data.idToken, data.refreshToken);
    
    // Set profile name
    await AsyncStorage.setItem('@pulse_profile', JSON.stringify({ name }));
    
    return data.user;
  } catch (error) {
    console.error('Signup error:', error);
    return null;
  }
}

export async function logout(): Promise<void> {
  await clearAuthData();
}

export async function isLoggedIn(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

// No longer needed with backend
export async function seedDefaultUser(): Promise<void> {
  // Backend handles user creation
}
