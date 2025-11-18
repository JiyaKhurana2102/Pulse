import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

const BACKGROUND_COLOR = '#F0FFF0'; // Light minty background
const TEXT_COLOR = '#1A1A1A';

// This layout file configures the nested stack navigator for the "Settings" tab.
export default function SettingsLayout() {
  return (
    // Use an enclosing View to set the consistent background color across all settings pages
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: BACKGROUND_COLOR, // Ensure header background matches the body
          },
          // FIX: Removing headerShadowVisible as it can cause conflicts; stack usually handles this fine
          headerTintColor: TEXT_COLOR, // Color for the back button and icons
          // Set common header defaults here
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{
            title: 'Your Settings',
            headerTitleStyle: {
              // Ensure consistent font sizing
              fontSize: 32,
            },
            // The index screen in a stack is the root, so it won't have a back button.
          }} 
        />
        <Stack.Screen 
          name="appearance" 
          options={{
            title: 'Appearance',
            headerTitleStyle: {
              fontSize: 32,
            },
            // The back button is automatic when navigating from index to appearance
          }} 
        />
        {/* Placeholder screens for other sections */}
        <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
        <Stack.Screen name="my-events" options={{ title: 'My Events' }} />
        {/* --- ADDED: My Groups Screen Registration --- */}
        <Stack.Screen name="my-groups" options={{ title: 'My Groups' }} />
        <Stack.Screen name="profile" options={{ title: 'Profile' }} />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
});