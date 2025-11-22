// app/_layout.tsx
import React, { useState, useEffect } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';

import LoadingScreen from '@/components/LoadingScreen';
import GlobalText from '@/components/GlobalText';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Define the custom light green color from the wireframe
const HEADER_COLOR = '#FFFFFF'; 

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const colorScheme = useColorScheme();
  
  // Choose the theme object based on the color scheme
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  useEffect(() => {
    async function loadFonts() {
      // Final, clean path: Now that the folder is correctly structured as app/assets/fonts/
      await Font.loadAsync({
        Lora: require('./assets/fonts/myfont.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return <LoadingScreen />;
  }

  return (
    // Use the ThemeProvider with the 'value' prop for the theme object
    <ThemeProvider value={theme}> 
      <Stack
        screenOptions={{
          // Set header background to the pale mint green
          headerStyle: { backgroundColor: HEADER_COLOR }, 
          // Set text and icon color in the header to dark for contrast against the light background
          headerTintColor: '#000000', 
          headerTitle: () => <GlobalText style={{ fontSize: 20, color: '#000000' }}>Pulse</GlobalText>,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      />
      {/* Set status bar style to dark since the header background is light */}
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}