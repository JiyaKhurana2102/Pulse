import { Stack } from 'expo-router';
import React from 'react';

const BACKGROUND_COLOR = '#ffffffff';
const TEXT_COLOR = '#1A1A1A';

export default function SettingsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Stack.Screen name="index" />

      <Stack.Screen 
        name="appearance" 
        options={{
          title: 'Appearance',
        }} 
      /> 

      <Stack.Screen 
        name="notifications" 
        options={{
          title: 'Notifications',
        }}
      />

      <Stack.Screen 
        name="my-events" 
        options={{
          title: 'My Events',
        }}
      />

      <Stack.Screen 
        name="my-groups" 
        options={{
          title: 'My Groups',
        }}
      />

      <Stack.Screen 
        name="profile" 
        options={{
          title: 'Profile',
        }}
      />
    </Stack>
  );
}
