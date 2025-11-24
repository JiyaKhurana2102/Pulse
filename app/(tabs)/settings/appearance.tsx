import { usePreferences } from '@/hooks/PreferencesContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Alert,
  Animated,
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

// --- COLORS ---
const ACCENT_COLOR = '#4DB6AC';
const TRACK_COLOR = '#B2DFDB';
const TEXT_COLOR = '#1A1A1A';

// limits so it never becomes pure black or pure white
const BRIGHTNESS_MIN = 0.25;
const BRIGHTNESS_MAX = 0.9;

// zoom limits so it never goes too tiny or huge
const ZOOM_MIN = 0.85;
const ZOOM_MAX = 1.15;

const THUMB_SIZE = 22;

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));


export default function AppearanceScreen() {
  const { brightness, setBrightness, zoom, setZoom } = usePreferences();
  const [brightnessSliderWidth, setBrightnessSliderWidth] = React.useState(0);
  const [zoomSliderWidth, setZoomSliderWidth] = React.useState(0);

  // map brightness [MIN, MAX] -> [0, 1]
  const brightnessNormalized = clamp(
    (clamp(brightness, BRIGHTNESS_MIN, BRIGHTNESS_MAX) - BRIGHTNESS_MIN) /
      (BRIGHTNESS_MAX - BRIGHTNESS_MIN),
    0,
    1
  );
  const zoomNormalized = clamp(
    (clamp(zoom, ZOOM_MIN, ZOOM_MAX) - ZOOM_MIN) / (ZOOM_MAX - ZOOM_MIN),
    0,
    1
  );

  const knobOffset = (width: number, normalized: number) => {
    if (width <= 0) return 0;
    const travel = width - THUMB_SIZE;
    return normalized * travel;
  };

  const handleBrightnessLayout = (e: LayoutChangeEvent) => {
    setBrightnessSliderWidth(e.nativeEvent.layout.width);
  };

  const handleZoomLayout = (e: LayoutChangeEvent) => {
    setZoomSliderWidth(e.nativeEvent.layout.width);
  };

  const updateBrightnessFromX = (x: number) => {
    if (brightnessSliderWidth <= 0) return;
    const ratio = clamp(x / brightnessSliderWidth, 0, 1);
    const value =
      BRIGHTNESS_MIN + ratio * (BRIGHTNESS_MAX - BRIGHTNESS_MIN);
    setBrightness(value);
  };

  const updateZoomFromX = (x: number) => {
    if (zoomSliderWidth <= 0) return;
    const ratio = clamp(x / zoomSliderWidth, 0, 1);
    const value = ZOOM_MIN + ratio * (ZOOM_MAX - ZOOM_MIN);
    setZoom(value);
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#FFF7ED', '#FED7AA', '#D1FAE5', '#ECFEFF', '#FFFFFF']}
      locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      {/* wrapper so brightness overlay can sit on top */}
      <View style={{ flex: 1, position: 'relative' }}>
        <Animated.View style={{ flex: 1, transform: [{ scale: zoom }] }}>
          <View style={styles.container}>
            {/* BRIGHTNESS SECTION */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Brightness</Text>

              <View style={styles.sliderContainer}>
                {/* tap moon to go darker */}
                <TouchableOpacity
                  onPress={() =>
                    setBrightness(clamp(brightness - 0.05, BRIGHTNESS_MIN, BRIGHTNESS_MAX))
                  }
                >
                  <Ionicons name="moon-outline" size={24} color={TEXT_COLOR} />
                </TouchableOpacity>

                <View
                  style={styles.slider}
                  onLayout={handleBrightnessLayout}
                  onStartShouldSetResponder={() => true}
                  onResponderGrant={e =>
                    updateBrightnessFromX(e.nativeEvent.locationX)
                  }
                  onResponderMove={e =>
                    updateBrightnessFromX(e.nativeEvent.locationX)
                  }
                >
                  <Ionicons
                    name="ellipse"
                    size={THUMB_SIZE}
                    color={ACCENT_COLOR}
                    style={[
                      styles.sliderThumb,
                      {
                        left: knobOffset(
                          brightnessSliderWidth,
                          brightnessNormalized
                        ),
                      },
                    ]}
                  />
                </View>

                {/* tap sun to go brighter */}
                <TouchableOpacity
                  onPress={() =>
                    setBrightness(clamp(brightness + 0.05, BRIGHTNESS_MIN, BRIGHTNESS_MAX))
                  }
                >
                  <Ionicons name="sunny-outline" size={24} color={TEXT_COLOR} />
                </TouchableOpacity>
              </View>
            </View>

            {/* ZOOM SECTION */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Zoom</Text>

              <View style={styles.sliderContainer}>
                {/* tap to zoom out */}
                <TouchableOpacity
                  onPress={() =>
                    setZoom(clamp(zoom - 0.05, ZOOM_MIN, ZOOM_MAX))
                  }
                >
                  <Ionicons
                    name="remove-circle-outline"
                    size={24}
                    color={TEXT_COLOR}
                  />
                </TouchableOpacity>

                <View
                  style={styles.slider}
                  onLayout={handleZoomLayout}
                  onStartShouldSetResponder={() => true}
                  onResponderGrant={e =>
                    updateZoomFromX(e.nativeEvent.locationX)
                  }
                  onResponderMove={e =>
                    updateZoomFromX(e.nativeEvent.locationX)
                  }
                >
                  <Ionicons
                    name="ellipse"
                    size={THUMB_SIZE}
                    color={ACCENT_COLOR}
                    style={[
                      styles.sliderThumb,
                      {
                        left: knobOffset(
                          zoomSliderWidth,
                          zoomNormalized
                        ),
                      },
                    ]}
                  />
                </View>

                {/* tap to zoom in */}
                <TouchableOpacity
                  onPress={() =>
                    setZoom(clamp(zoom + 0.05, ZOOM_MIN, ZOOM_MAX))
                  }
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color={TEXT_COLOR}
                  />
                </TouchableOpacity>
              </View>
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

        {/* Brightness overlay removed: now handled globally for consistency */}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingBottom: 200, // your chosen padding
    alignItems: 'center',
    justifyContent: 'center',
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
    position: 'relative',
  },
  sliderThumb: {
    position: 'absolute',
    top: 9, // roughly center vertically in 40px track
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
