import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

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

// --- Toggle Switch Component ---
const ToggleSwitch = ({
  isActive,
  onToggle,
}: {
  isActive: boolean;
  onToggle: () => void;
}) => (
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
    <LinearGradient
      colors={['#FFFFFF', '#FFF7ED', '#FED7AA', '#D1FAE5', '#ECFEFF', '#FFFFFF']}
      locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.safeArea}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainBlock}>
          {/* Title only (no back/profile icons) */}
          <View style={styles.navHeader}>
            <Text style={styles.navTitle}>Notifications</Text>
          </View>

          {/* Settings List */}
          <View style={styles.settingsList}>
            <SettingRow
              label="Push Notifications"
              isActive={pushEnabled}
              onToggle={() => setPushEnabled(!pushEnabled)}
            />
            <SettingRow
              label="Email Updates"
              isActive={emailEnabled}
              onToggle={() => setEmailEnabled(!emailEnabled)}
            />
            <SettingRow
              label="Event Reminders"
              isActive={eventRemindersEnabled}
              onToggle={() =>
                setEventRemindersEnabled(!eventRemindersEnabled)
              }
            />
            <SettingRow
              label="Sounds/Vibrations"
              isActive={soundsEnabled}
              onToggle={() => setSoundsEnabled(!soundsEnabled)}
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

export default NotificationSettings;

// --- Styles ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 200,
    alignItems: 'center',
    justifyContent: 'center', // centers the whole block vertically
  },
  mainBlock: {
    width: '100%',
    alignItems: 'center',
  },
  navHeader: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.darkTealAccent,
    fontFamily: 'Inter_400Regular', // match settings font
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
    fontFamily: 'Inter_400Regular', // match settings font
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
