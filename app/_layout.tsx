// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import 'react-native-reanimated';

import LoadingScreen from '@/components/LoadingScreen';
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
    <ThemeProvider value={theme}>
      <Stack
        screenOptions={{
          // make header transparent so the white bar is not visible
          headerStyle: { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 },
          headerTransparent: true,
          headerTintColor: '#000000',
          headerTitle: '',
          headerShadowVisible: false,
          contentStyle: { backgroundColor: theme.colors.background },
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
    </ThemeProvider>
  );
}
