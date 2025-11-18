import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Platform,
  Alert,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
  DimensionValue,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- STYLES & CONSTANTS ---
const ACCENT_COLOR = '#4DB6AC';
const TRACK_COLOR = '#B2DFDB'; // Lighter accent for the slider track
const TEXT_COLOR = '#1A1A1A';
const BACKGROUND_COLOR = '#F0FFF0';

// A simple View-based placeholder for the Slider to resolve all compilation errors.
const SliderPlaceholder = ({ value, style }: { value: number; style?: StyleProp<ViewStyle> }) => {
  // Calculates the width of the colored track based on the value (0 to 1)
  const trackWidth = `${value * 100}%` as DimensionValue;

  // We cast sliderPlaceholderBase to ViewStyle here to make compose's generic expectations satisfied.
  return (
    <View style={StyleSheet.compose(styles.sliderPlaceholderBase as ViewStyle, style)}>
      {/* Active Track (Simulates minimumTrackTintColor) */}
      <View style={[styles.sliderActiveTrack, { width: trackWidth }]} />
      {/* Thumb (Simulates the draggable dot) */}
      <View style={[styles.sliderThumb, { left: trackWidth }]} />
    </View>
  );
};

// --- MAIN COMPONENT ---
export default function AppearanceScreen() {
  const [brightness, setBrightness] = useState(0.5);
  const [zoom, setZoom] = useState(0.5);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Helper function to show a custom message instead of Alert
  const showMessage = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const toggleDarkMode = (value: boolean) => {
    setIsDarkMode(value);
    showMessage('Theme Change', `Dark Mode is now ${value ? 'ON' : 'OFF'}`);
  };

  return (
    <View style={styles.container}>
      {/* Brightness Control Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Brightness</Text>
        <View style={styles.sliderContainer}>
          <Ionicons name="moon-outline" size={24} color={TEXT_COLOR} style={styles.sliderIcon} />

          <SliderPlaceholder value={brightness} style={styles.slider} />

          <Ionicons name="sunny-outline" size={24} color={TEXT_COLOR} style={styles.sliderIcon} />
        </View>
      </View>

      {/* Zoom Control Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Zoom</Text>
        <View style={styles.sliderContainer}>
          <Ionicons name="remove-circle-outline" size={24} color={TEXT_COLOR} style={styles.sliderIcon} />

          <SliderPlaceholder value={zoom} style={styles.slider} />

          <Ionicons name="add-circle-outline" size={24} color={TEXT_COLOR} style={styles.sliderIcon} />
        </View>
      </View>

      {/* Dark Mode Toggle Section */}
      <View style={styles.toggleSection}>
        <View style={styles.toggleButtonLabel}>
          <Text style={styles.toggleText}>Dark Mode</Text>
        </View>
        <Switch
          trackColor={{ false: TRACK_COLOR, true: ACCENT_COLOR }}
          thumbColor={BACKGROUND_COLOR}
          onValueChange={toggleDarkMode}
          value={isDarkMode}
          style={styles.switchControl}
        />
      </View>

      {/* Back button shown at the bottom right */}
      <TouchableOpacity
        onPress={() => Alert.alert('Navigate', 'This would navigate back in the stack.')}
        style={styles.floatingBackButton}
      >
        <Ionicons name="arrow-back-outline" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

/**
 * NOTE:
 * Using Record<string, any> below avoids the cross-platform type inference problems
 * that cause 'TextStyle' to be inferred where 'ViewStyle' is expected (cursor/userSelect mismatches).
 * This keeps your visual layout identical while removing the long chains of type errors.
 */
const styles = StyleSheet.create<Record<string, any>>({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    paddingHorizontal: 20,
  } as ViewStyle,
  section: {
    marginTop: 40,
    marginBottom: 20,
    width: '100%',
  } as ViewStyle,
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: TEXT_COLOR,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'serif' : 'serif',
  } as TextStyle,
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  } as ViewStyle,
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  } as ViewStyle,
  // --- Slider placeholder styles ---
  sliderPlaceholderBase: {
    height: 6,
    borderRadius: 3,
    backgroundColor: TRACK_COLOR,
    justifyContent: 'center',
  } as ViewStyle,
  sliderActiveTrack: {
    position: 'absolute',
    height: 6,
    borderRadius: 3,
    backgroundColor: ACCENT_COLOR,
  } as ViewStyle,
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: ACCENT_COLOR,
    borderColor: BACKGROUND_COLOR,
    borderWidth: 3,
    top: -7,
    marginLeft: -10,
  } as ViewStyle,
  sliderIcon: {
    opacity: 0.7,
  } as ViewStyle,
  toggleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 60,
    width: '90%',
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: TRACK_COLOR,
  } as ViewStyle,
  toggleButtonLabel: {
    paddingHorizontal: 10,
  } as ViewStyle,
  toggleText: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_COLOR,
  } as TextStyle,
  switchControl: {
    transform: Platform.OS === 'ios' ? [{ scaleX: 1.1 }, { scaleY: 1.1 }] : undefined,
  } as ViewStyle,
  floatingBackButton: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: ACCENT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  } as ViewStyle,
});
