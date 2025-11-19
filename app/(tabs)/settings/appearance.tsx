import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const ACCENT_COLOR = '#4DB6AC';
const TRACK_COLOR = '#B2DFDB';
const TEXT_COLOR = '#1A1A1A';
const BACKGROUND_COLOR = '#F0FFF0';

interface SliderProps {
  value: number;
  onValueChange: (val: number) => void;
  min?: number;
  max?: number;
  width?: number;
}

const CustomSlider = ({ value, onValueChange, min = 0, max = 1, width = 250 }: SliderProps) => {
  const [sliderWidth, setSliderWidth] = useState(width);
  const pan = useRef(new Animated.Value(value)).current;

  useEffect(() => {
    pan.setValue(value);
  }, [value]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        let newVal = value + gestureState.dx / sliderWidth;
        if (newVal < 0) newVal = 0;
        if (newVal > 1) newVal = 1;
        pan.setValue(newVal);
        onValueChange(min + newVal * (max - min));
      },
      onPanResponderRelease: () => {},
    })
  ).current;

  return (
    <View
      style={[sliderStyles.track]}
      onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
    >
      <Animated.View
        style={[
          sliderStyles.fill,
          {
            width: pan.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          sliderStyles.thumb,
          {
            transform: [
              {
                translateX: pan.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, sliderWidth - 20], // 20 = thumb size
                }),
              },
            ],
          },
        ]}
      />
    </View>
  );
};

export default function AppearanceScreen() {
  const [brightness, setBrightness] = useState(0.5);
  const [zoom, setZoom] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Brightness</Text>
        <View style={styles.sliderRow}>
          <Ionicons name="moon-outline" size={24} color={TEXT_COLOR} />
          <CustomSlider value={brightness} onValueChange={setBrightness} />
          <Ionicons name="sunny-outline" size={24} color={TEXT_COLOR} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Zoom</Text>
        <View style={styles.sliderRow}>
          <Ionicons name="remove-circle-outline" size={24} color={TEXT_COLOR} />
          <CustomSlider value={zoom} onValueChange={setZoom} min={0.5} max={2} />
          <Ionicons name="add-circle-outline" size={24} color={TEXT_COLOR} />
        </View>
      </View>

      <View style={styles.toggleSection}>
        <Text style={styles.toggleText}>Dark Mode</Text>
        <Switch
          trackColor={{ false: TRACK_COLOR, true: ACCENT_COLOR }}
          thumbColor={BACKGROUND_COLOR}
          onValueChange={setIsDarkMode}
          value={isDarkMode}
          style={Platform.OS === 'ios' ? { transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }] } : {}}
        />
      </View>

      <TouchableOpacity style={styles.floatingBackButton} onPress={() => console.log('Go Back')}>
        <Ionicons name="arrow-back-outline" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const sliderStyles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: 3,
    backgroundColor: TRACK_COLOR,
    position: 'relative',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 10,
  },
  fill: {
    height: 6,
    borderRadius: 3,
    backgroundColor: ACCENT_COLOR,
    position: 'absolute',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: ACCENT_COLOR,
    position: 'absolute',
    top: -7,
    borderWidth: 3,
    borderColor: BACKGROUND_COLOR,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BACKGROUND_COLOR, paddingHorizontal: 20, paddingTop: 40 },
  section: { marginTop: 30 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: TEXT_COLOR, textAlign: 'center', marginBottom: 12 },
  sliderRow: { flexDirection: 'row', alignItems: 'center' },
  toggleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 15,
    backgroundColor: TRACK_COLOR,
  },
  toggleText: { fontSize: 18, fontWeight: '600', color: TEXT_COLOR },
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
  },
});
