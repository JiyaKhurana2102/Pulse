// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Text, TextInput } from 'react-native';
import 'react-native-reanimated';

import { GlobalEffects } from '@/components/GlobalEffects';
import LoadingScreen from '@/components/LoadingScreen';
import { PreferencesProvider } from '@/hooks/PreferencesContext';
import { useColorScheme } from '@/hooks/use-color-scheme';

// ✅ Import Lora fonts
import {
  Lora_400Regular,
  Lora_700Bold,
  useFonts,
} from '@expo-google-fonts/lora';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [splashDismissed, setSplashDismissed] = useState(false);

  // ✅ Load fonts BEFORE ANY UI shows
  const [fontsLoaded] = useFonts({
    Lora_400Regular,
    Lora_700Bold,
  });

  // 🚨 Prevent rendering UNTIL fonts load (important!)
  if (!fontsLoaded) {
    return null;
  }

  // Apply Lora as the default font for all Text/TextInput across the app
  // use `any` to avoid TypeScript complaints about defaultProps types
  (Text as any).defaultProps = (Text as any).defaultProps || {};
  (Text as any).defaultProps.style = [
    (Text as any).defaultProps.style,
    { fontFamily: 'Lora_400Regular' },
  ];

  (TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
  (TextInput as any).defaultProps.style = [
    (TextInput as any).defaultProps.style,
    { fontFamily: 'Lora_400Regular' },
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
