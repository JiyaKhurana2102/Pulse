import { Stack } from 'expo-router';
import React from 'react';

const BACKGROUND_COLOR = '#F0FFF0'; // Light minty background
const TEXT_COLOR = '#1A1A1A';

// This layout file configures the nested stack navigator for the "Settings" tab.
export default function SettingsLayout() {
  return (
    // FIX: Removed the outer View component. 
    // The Stack Navigator usually occupies the full space given to the layout.
    <Stack
      screenOptions={{
        // Apply the common background color to the header
        headerStyle: {
          backgroundColor: BACKGROUND_COLOR, 
        },
        // Apply the same background color to the main view content to prevent flashes
        contentStyle: {
            backgroundColor: BACKGROUND_COLOR,
        },
        headerTintColor: TEXT_COLOR, // Color for the back button and icons
        // Standard Stack navigator settings
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: 'Your Settings',
          headerTitleStyle: {
            fontSize: 32,
          },
          // The index screen in a stack is the root, so it won't have a back button.
        }} 
      />
      
      {/* All sub-screens */}
      <Stack.Screen 
        name="appearance" 
        options={{
          title: 'Appearance',
          headerTitleStyle: {
            fontSize: 32, // Keep consistent large title
          },
        }} 
      />
      <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Stack.Screen name="my-events" options={{ title: 'My Events' }} />
      <Stack.Screen name="my-groups" options={{ title: 'My Groups' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
    </Stack>
  );
}
// FIX: Removed the styles object since the container View was removed.