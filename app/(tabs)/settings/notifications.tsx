import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

// --- Color Palette ---
const colors = {
  softMintBackground: '#D4EDE7', 
  darkTealAccent: '#008080', 
  mediumAccentGreen: '#66B2B2', 
  white: '#FFFFFF',
  lightGray: '#A0AEC0',
  darkText: '#1F2937',
  offWhite: '#F7FCFA', 
  toggleActive: '#008080',
};

// --- SVG Icon Components ---
const ChevronLeftIcon = ({ size = 24, color = colors.darkTealAccent }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 18L9 12L15 6" />
  </Svg>
);

const UserIcon = ({ size = 24, color = colors.darkTealAccent }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <Circle cx={12} cy={7} r={4} />
  </Svg>
);

// --- Toggle Switch Component ---
const ToggleSwitch = ({ isActive, onToggle }: { isActive: boolean; onToggle: () => void }) => (
  <TouchableOpacity
    onPress={onToggle}
    style={[
      styles.toggleTrack,
      { backgroundColor: isActive ? colors.toggleActive : colors.lightGray },
    ]}
  >
    <View
      style={[
        styles.toggleThumb,
        { transform: [{ translateX: isActive ? 20 : 0 }] },
      ]}
    />
  </TouchableOpacity>
);

// --- Notification Setting Row ---
const SettingRow = ({
  label,
  isActive,
  onToggle,
}: {
  label: string;
  isActive: boolean;
  onToggle: () => void;
}) => (
  <View style={styles.settingItem}>
    <Text style={styles.settingText}>{label}</Text>
    <ToggleSwitch isActive={isActive} onToggle={onToggle} />
  </View>
);

// --- Main Component ---
const NotificationSettings: React.FC = () => {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [eventRemindersEnabled, setEventRemindersEnabled] = useState(true);
  const [soundsEnabled, setSoundsEnabled] = useState(true);

  return (
    <ScrollView style={styles.safeArea} contentContainerStyle={styles.container}>
      {/* Top Navigation Header */}
      <View style={styles.navHeader}>
        <TouchableOpacity onPress={() => console.log('Go back')} style={styles.backButton}>
          <ChevronLeftIcon />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Notifications</Text>
        <UserIcon />
      </View>

      {/* Manage Alerts Bar */}
      <View style={styles.alertsBar}>
        <ChevronLeftIcon size={18} />
        <Text style={styles.alertsText}>Manage how you receive alerts</Text>
      </View>

      {/* Settings List */}
      <View style={styles.settingsList}>
        <SettingRow label="Push Notifications" isActive={pushEnabled} onToggle={() => setPushEnabled(!pushEnabled)} />
        <SettingRow label="Email Updates" isActive={emailEnabled} onToggle={() => setEmailEnabled(!emailEnabled)} />
        <SettingRow label="Event Reminders" isActive={eventRemindersEnabled} onToggle={() => setEventRemindersEnabled(!eventRemindersEnabled)} />
        <SettingRow label="Sounds/Vibrations" isActive={soundsEnabled} onToggle={() => setSoundsEnabled(!soundsEnabled)} />
      </View>
    </ScrollView>
  );
};

export default NotificationSettings;

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.softMintBackground,
  },
  container: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  navHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    width: '100%',
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.darkTealAccent,
  },
  backButton: {
    padding: 5,
  },
  alertsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.offWhite,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 30,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  alertsText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.darkTealAccent,
    marginLeft: 10,
  },
  settingsList: {
    width: '100%',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    marginBottom: 10,
    minHeight: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  settingText: {
    fontSize: 18,
    color: colors.darkText,
    fontWeight: '400',
    flex: 1,
  },
  toggleTrack: {
    width: 50,
    height: 30,
    borderRadius: 15,
    padding: 3,
    justifyContent: 'center',
    borderWidth: 1,
  },
  toggleThumb: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});
