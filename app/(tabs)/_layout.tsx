import { Tabs } from 'expo-router';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

const ACCENT_COLOR = '#4DB6AC'; 
const TAB_ICON_SIZE = 24;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ACCENT_COLOR,
        // The header is usually hidden here because the nested stack handles it
        headerShown: false, 
      }}
    >
      <Tabs.Screen
        name="index" // Assuming this is your Home screen, matching your screenshot
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={TAB_ICON_SIZE} color={color} />,
        }}
      />
      
      {/* This is the CRITICAL part. It must point to the 'settings' folder.
        The router will automatically look inside this folder for a file named '_layout.tsx' 
        to handle the stack navigation.
      */}
      <Tabs.Screen
        name="settings" 
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Ionicons name="settings-outline" size={TAB_ICON_SIZE} color={color} />,
        }}
      />
      
      {/* Add other screens as needed based on your file structure */}
      <Tabs.Screen
        name="create" 
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => <Ionicons name="add-circle-outline" size={TAB_ICON_SIZE} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search" 
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Ionicons name="search-outline" size={TAB_ICON_SIZE} color={color} />,
        }}
      />
      <Tabs.Screen
        name="messages" 
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <Ionicons name="chatbox-outline" size={TAB_ICON_SIZE} color={color} />,
        }}
      />
      
      {/* We exclude any other files like modal.tsx or _layout.tsx itself */}
      <Tabs.Screen name="modal" options={{ headerShown: false, href: null }} />

      {/* Any other routes like the placeholders you made must be excluded or linked: */}
      {/* <Tabs.Screen name="notifications" options={{ href: null }} /> */}

    </Tabs>
  );
}