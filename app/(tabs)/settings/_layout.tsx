import { Stack } from 'expo-router';
import React from 'react';
import GlobalText from '@/components/GlobalText';
const BACKGROUND_COLOR = '#F0FFF0';
const TEXT_COLOR = '#1A1A1A';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: BACKGROUND_COLOR, 
        },
        contentStyle: {
          backgroundColor: BACKGROUND_COLOR,
        },
        headerTintColor: TEXT_COLOR,
      }}
    >
      <Stack.Screen 
        name="index" 
        options={{
          title: 'Your Settings',
          headerTitleStyle: { fontSize: 32 },
        }} 
      />
      <Stack.Screen 
        name="appearance" 
        options={{
          title: 'Appearance',
          headerTitleStyle: { fontSize: 32 },
        }} 
      /> 
      <Stack.Screen name="notifications" options={{ title: 'Notifications' }} />
      <Stack.Screen name="my-events" options={{ title: 'My Events' }} />
      <Stack.Screen name="my-groups" options={{ title: 'My Groups' }} />
      <Stack.Screen name="profile" options={{ title: 'Profile' }} />
    </Stack>
  );
}
