// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import 'react-native-reanimated';

import { GlobalEffects } from '@/components/GlobalEffects';
import LoadingScreen from '@/components/LoadingScreen';
import { PreferencesProvider } from '@/hooks/PreferencesContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

const HEADER_COLOR = '#FFFFFF';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [splashDismissed, setSplashDismissed] = useState(false);

  // Show ONLY the splash until user taps it

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
            // settings multi-stop warm gradient (applies app-wide)
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
                // make header transparent so the white bar is not visible
                headerStyle: { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 },
                headerTransparent: true,
                headerTintColor: '#000000',
                headerTitle: '',
                headerShadowVisible: false,
                contentStyle: { backgroundColor: 'transparent' },
              }}
            >
              {/* (tabs) group has your fancy bottom bar */}
              <Stack.Screen name="(tabs)" options={{ headerShown: true }} />
              <Stack.Screen
                name="modal"
                options={{ presentation: 'modal', title: 'Modal' }}
              />
            </Stack>
            <StatusBar style="dark" />
          </LinearGradient>
        </GlobalEffects>
      </ThemeProvider>
    </PreferencesProvider>
  );
}
