import { Link } from 'expo-router';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- STYLES & CONSTANTS ---
const ACCENT_COLOR = '#4DB6AC'; // Teal/Mint Green button color
const TEXT_COLOR = '#1A1A1A'; // Dark gray for general text
const BACKGROUND_COLOR = '#F0FFF0';

interface SettingsButtonProps {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  href: string;
}

// Reusable component for the settings buttons
const SettingsButton: React.FC<SettingsButtonProps> = ({ iconName, label, href }) => (
  // We use Link with asChild to make the TouchableOpacity the actual pressable element
  <Link href={href as any} asChild>
    <TouchableOpacity style={styles.buttonContainer}>
      <Ionicons name={iconName} size={28} color={ACCENT_COLOR} style={styles.icon} />
      <View style={styles.buttonTextWrapper}>
        {/* FIX: Set text color to white for contrast on the ACCENT_COLOR background */}
        <Text style={styles.buttonText}>{label}</Text> 
      </View>
      <Ionicons name="chevron-forward-outline" size={24} color="white" />
    </TouchableOpacity>
  </Link>
);

// --- MAIN COMPONENT ---
export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      {/* The "Settings" header title is handled by the _layout.tsx file. 
        Tapping any button below will navigate to the correct sub-screen.
      */}
      <SettingsButton 
        iconName="sunny-outline" 
        label="Appearance" 
        // CRITICAL FIX: Changed to relative path './appearance'
        href="./appearance" 
      />
      <SettingsButton 
        iconName="notifications-outline" 
        label="Notifications" 
        // CRITICAL FIX: Changed to relative path './notifications'
        href="./notifications" 
      />
      <SettingsButton 
        iconName="calendar-outline" 
        label="My Events" 
        // CRITICAL FIX: Changed to relative path './my-events'
        href="./my-events" 
      />
      <SettingsButton 
        iconName="person-outline" // Changed icon to person-outline for Profile
        label="Profile" 
        // CRITICAL FIX: Changed to relative path './profile'
        href="./profile" 
      />
    </View>
  );
}

// --- STYLING ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    paddingTop: 30, // Add some vertical space below the header
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Distribute space
    width: '90%',
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: ACCENT_COLOR,
    borderRadius: 15, // Rounded corners for buttons
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  icon: {
    marginRight: 15,
    backgroundColor: 'white', // Creates the effect of a light circle behind the icon
    padding: 5,
    borderRadius: 50,
    overflow: 'hidden',
  },
  buttonTextWrapper: {
    flex: 1, // Allows the text to take up the middle space
    justifyContent: 'center',
    paddingRight: 15,
  },
  buttonText: {
    // CRITICAL: Text color changed to white for contrast
    color: 'white', 
    fontSize: 18,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'serif' : 'serif',
  },
});