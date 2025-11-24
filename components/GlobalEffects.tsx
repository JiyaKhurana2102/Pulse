import { usePreferences } from '@/hooks/PreferencesContext';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

export const GlobalEffects: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { brightness, zoom } = usePreferences();

  // Animated style for zoom
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: zoom }],
  }), [zoom]);

  return (
    <Animated.View style={[styles.flex, animatedStyle]}>
      {children}
      {/* Brightness overlay (darker = lower brightness) */}
      <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: 'black', opacity: 1 - brightness }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
