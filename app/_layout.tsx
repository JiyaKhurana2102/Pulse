import 'react-native-gesture-handler';
// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Text, TextInput } from 'react-native';
import 'react-native-reanimated';

import { GlobalEffects } from '@/components/GlobalEffects';
import LoadingScreen from '@/components/LoadingScreen';
import { PreferencesProvider } from '@/hooks/PreferencesContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { isLoggedIn } from '@/services/auth';


import {
  Inter_400Regular,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [splashDismissed, setSplashDismissed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  // ✅ Load fonts BEFORE ANY UI shows
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  // Check authentication after splash
  useEffect(() => {
    if (!splashDismissed || !fontsLoaded) return;

    const checkAuth = async () => {
      const loggedIn = await isLoggedIn();
      setAuthChecked(true);

      const inAuthGroup = segments[0] === 'login';

      if (!loggedIn && !inAuthGroup) {
        router.replace('/login');
      } else if (loggedIn && inAuthGroup) {
        router.replace('/(tabs)');
      }
    };

    checkAuth();
  }, [splashDismissed, fontsLoaded]);

  // 🚨 Prevent rendering UNTIL fonts load (important!)
  if (!fontsLoaded) {
    return null;
  }

  // Apply Lora as the default font for all Text/TextInput across the app
  // use `any` to avoid TypeScript complaints about defaultProps types
  (Text as any).defaultProps = (Text as any).defaultProps || {};
  (Text as any).defaultProps.style = [
    (Text as any).defaultProps.style,
    { fontFamily: 'Inter_400Regular' },
  ];

  (TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
  (TextInput as any).defaultProps.style = [
    (TextInput as any).defaultProps.style,
    { fontFamily: 'Inter_400Regular' },
  ];

  // Show ONLY your custom loading screen until user taps it
  if (!splashDismissed) {
    return (
      <>
        <StatusBar style="light" />
        <LoadingScreen onFinish={() => setSplashDismissed(true)} />
      </>
    );
  }

  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <PreferencesProvider>
      <ThemeProvider value={theme}>
        <GlobalEffects>
          <LinearGradient
            colors={[
              '#FFFFFF',
              '#FFF7ED',
              '#FED7AA',
              '#D1FAE5',
              '#ECFEFF',
              '#FFFFFF',
            ]}
            locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ flex: 1 }}
          >
            <Stack
              screenOptions={{
                headerStyle: { 
                backgroundColor: 'transparent',
              },
                headerShadowVisible: false,

                headerTransparent: true,
                headerTintColor: '#000000',
                headerTitle: '',
                
                contentStyle: { backgroundColor: 'transparent' },
              }}
            >
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
            <StatusBar style="dark" />
          </LinearGradient>
        </GlobalEffects>
      </ThemeProvider>
    </PreferencesProvider>
  );
}
