// app/settings/index.tsx
import { logout } from '@/services/auth';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Link, useRouter } from 'expo-router';
import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const ACCENT_COLOR = '#46e0e0ff';
const BACKGROUND_COLOR = '#ffffffff';
const iconColors = ['#ff9966', '#b8e6b8', '#5cc4a4', '#f6a278'];

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
  iconColor: string;
}

// --- Button Component ---
const SettingsButton: React.FC<SettingsButtonProps> = ({ iconName, label, href, iconColor }) => (
  <Link href={href} asChild>
    <TouchableOpacity style={styles.buttonContainer}>
      <Ionicons name={iconName} size={28} color={iconColor} style={styles.icon} />
      <View style={styles.buttonTextWrapper}>
        <Text style={styles.buttonText}>{label}</Text>
      </View>
      <Ionicons name="chevron-forward-outline" size={24} color="white" />
    </TouchableOpacity>
  </Link>
);

// --- Screen ---
export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/login');
        },
      },
    ]);
  };

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
      <SettingsButton iconName="sunny" label="Appearance" href={SettingsRoutes.APPEARANCE} iconColor={iconColors[0]} />
      <SettingsButton iconName="notifications" label="Notifications" href={SettingsRoutes.NOTIFICATIONS} iconColor={iconColors[1]} />
      <SettingsButton iconName="calendar" label="My Events" href={SettingsRoutes.MY_EVENTS} iconColor={iconColors[2]} />
      <SettingsButton iconName="people" label="My Groups" href={SettingsRoutes.MY_GROUPS} iconColor={iconColors[3]} />
      <SettingsButton iconName="person" label="Profile" href={SettingsRoutes.PROFILE} iconColor={iconColors[0]} />
      
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="#fff" style={styles.icon} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
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
    backgroundColor: 'rgba(248, 248, 248, 0.75)',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  icon: {
    marginRight: 15,
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '90%',
    marginTop: 30,
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: '#ff6b6b',
    borderRadius: 15,
    shadowColor: '#ff6b6b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    marginLeft: 8,
  },
});
