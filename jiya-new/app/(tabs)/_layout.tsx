import { Tabs } from 'expo-router';
import React from 'react';
import { Pressable, type GestureResponderEvent } from 'react-native';
import  * as Haptics from 'expo-haptics';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const HapticTab = (props: any) => {
  const { onPress, ...rest } = props;
  const handlePress = (event: GestureResponderEvent) => {
    // Voids the promise if Haptics is not available or if the call fails
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (typeof onPress === 'function') onPress(event);
  };
  return <Pressable {...rest} onPress={handlePress} />;
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
            // Added styling for better appearance and touch size
            paddingVertical: 5,
            height: 60,
        },
      }}>

      {/* 1. Home Tab (index) */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />

      {/* 2. Search Tab (renamed from 'explore' to match typical search function) */}
      <Tabs.Screen
        name="search" // You will need a file named 'search.tsx' in the (tabs) directory
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="magnifyingglass" color={color} />,
        }}
      />

      {/* 3. Create/Add Tab (New Tab) */}
      <Tabs.Screen
        name="create" // You will need a file named 'create.tsx'
        options={{
          title: 'Add',
          // Using a larger, filled circle plus icon to match the wireframe's central icon
          tabBarIcon: ({ color }) => <IconSymbol size={32} name="plus.circle.fill" color={color} />,
        }}
      />

      {/* 4. Settings Tab (New Tab) */}
      <Tabs.Screen
        name="settings" // You will need a file named 'settings.tsx'
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="gearshape.fill" color={color} />,
        }}
      />
      
      {/* 5. Messages Tab (New Tab) */}
      <Tabs.Screen
        name="messages" // You will need a file named 'messages.tsx'
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="message.fill" color={color} />,
        }}
      />

    </Tabs>
  );
}