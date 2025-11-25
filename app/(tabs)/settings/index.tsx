// app/settings/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ACCENT_COLOR = '#46e0e0ff';
const BACKGROUND_COLOR = '#ffffffff';

// --- Route Enum ---
const SettingsRoutes = {
  APPEARANCE: '/settings/appearance',
  NOTIFICATIONS: '/settings/notifications',
  MY_EVENTS: '/settings/my-events',
  MY_GROUPS: '/settings/my-groups',
  PROFILE: '/settings/profile',
} as const;

type SettingsRoute = (typeof SettingsRoutes)[keyof typeof SettingsRoutes];

// --- Props ---
interface SettingsButtonProps {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  href: SettingsRoute;
}

// --- Button Component ---
const SettingsButton: React.FC<SettingsButtonProps> = ({ iconName, label, href }) => (
  <Link href={href} asChild>
    <TouchableOpacity style={styles.buttonContainer}>
      <Ionicons name={iconName} size={28} color={ACCENT_COLOR} style={styles.icon} />
      <View style={styles.buttonTextWrapper}>
        <Text style={styles.buttonText}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={24} color="white" />
    </TouchableOpacity>
  </Link>
);

// --- Screen ---
export default function SettingsScreen() {
  return (
    <LinearGradient
      // soft orange core + light green/teal glow + white edges
      colors={[
        '#FFFFFF',   // very top
        '#FFF7ED',   // faint peach
        '#FED7AA',   // soft orange glow
        '#D1FAE5',   // light mint / green aura
        '#ECFEFF',   // very pale teal
        '#FFFFFF',   // very bottom
      ]}
      locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <SettingsButton iconName="sunny-outline" label="Appearance" href={SettingsRoutes.APPEARANCE} />
      <SettingsButton iconName="notifications-outline" label="Notifications" href={SettingsRoutes.NOTIFICATIONS} />
      <SettingsButton iconName="calendar-outline" label="My Events" href={SettingsRoutes.MY_EVENTS} />
      <SettingsButton iconName="people-outline" label="My Groups" href={SettingsRoutes.MY_GROUPS} />
      <SettingsButton iconName="person-outline" label="Profile" href={SettingsRoutes.PROFILE} />
    </LinearGradient>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: 100,
    paddingHorizontal: 20,
    paddingBottom: 150,   // your chosen vertical offset
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '90%',
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  icon: {
    marginRight: 15,
    backgroundColor: 'rgba(0,0,0,0.06)',
    padding: 5,
    borderRadius: 50,
  },
  buttonTextWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 15,
  },
  buttonText: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter_400Regular',
  },
});
