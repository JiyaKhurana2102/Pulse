import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Alert,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// --- COLORS ---
const ACCENT_COLOR = '#4DB6AC';
const TRACK_COLOR = '#B2DFDB';
const TEXT_COLOR = '#1A1A1A';
const BACKGROUND_COLOR = '#F0FFF0';

export default function AppearanceScreen() {
  const [brightness, setBrightness] = useState(1);      // 0 = darkest, 1 = normal
  const [zoom, setZoom] = useState(1);                  // 1 = normal scale
  const [isDarkMode, setIsDarkMode] = useState(false);

  const scaleAnim = new Animated.Value(zoom);

  const toggleDarkMode = (value: boolean) => {
    setIsDarkMode(value);
    Alert.alert('Theme Change', `Dark Mode is now ${value ? 'ON' : 'OFF'}`);
  };

  return (
    // ⭐ IMPORTANT FIX — enables overlay brightness effect  
    <View style={{ flex: 1, position: 'relative' }}>
      <Animated.View style={{ flex: 1, transform: [{ scale: zoom }] }}>
        <View style={styles.container}>

          {/* BRIGHTNESS SECTION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Brightness</Text>

            <View style={styles.sliderContainer}>
              <Ionicons name="moon-outline" size={24} color={TEXT_COLOR} />

              <View style={styles.slider}>
                <Ionicons
                  name="ellipse"
                  size={22}
                  color={ACCENT_COLOR}
                  style={{ left: brightness * 110 }}
                />
              </View>

              <Ionicons name="sunny-outline" size={24} color={TEXT_COLOR} />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={() => setBrightness(Math.max(0, brightness - 0.1))}>
                <Text style={styles.sliderButton}>-</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setBrightness(Math.min(1, brightness + 0.1))}>
                <Text style={styles.sliderButton}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ZOOM SECTION */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Zoom</Text>

            <View style={styles.sliderContainer}>
              <Ionicons name="remove-circle-outline" size={24} color={TEXT_COLOR} />

              <View style={styles.slider}>
                <Ionicons
                  name="ellipse"
                  size={22}
                  color={ACCENT_COLOR}
                  style={{ left: (zoom - 0.5) * 200 }}
                />
              </View>

              <Ionicons name="add-circle-outline" size={24} color={TEXT_COLOR} />
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={() => setZoom(Math.max(0.5, zoom - 0.1))}>
                <Text style={styles.sliderButton}>-</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setZoom(Math.min(2, zoom + 0.1))}>
                <Text style={styles.sliderButton}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* DARK MODE */}
          <View style={styles.toggleSection}>
            <Text style={styles.toggleText}>Dark Mode</Text>
            <Switch
              trackColor={{ false: TRACK_COLOR, true: ACCENT_COLOR }}
              thumbColor={BACKGROUND_COLOR}
              onValueChange={toggleDarkMode}
              value={isDarkMode}
            />
          </View>

          {/* BACK BUTTON */}
          <TouchableOpacity
            onPress={() => Alert.alert('Navigation', 'Back button pressed')}
            style={styles.floatingBackButton}
          >
            <Ionicons name="arrow-back-outline" size={30} color="white" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ⭐ Brightness Overlay — NOW WORKS */}
      <View
        pointerEvents="none"
        style={{
          ...StyleSheet.absoluteFillObject,
          backgroundColor: 'black',
          opacity: 1 - brightness,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 40,
    marginBottom: 20,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: TEXT_COLOR,
    marginBottom: 10,
    textAlign: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
    justifyContent: 'center',
    backgroundColor: '#E0F2F1',
    borderRadius: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  sliderButton: {
    fontSize: 22,
    color: ACCENT_COLOR,
    fontWeight: '700',
  },
  toggleSection: {
    marginTop: 50,
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 15,
    backgroundColor: TRACK_COLOR,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleText: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_COLOR,
  },
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
  },
});
