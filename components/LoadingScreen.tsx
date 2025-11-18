import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

export default function LoadingScreen() {
  const outerScale = useRef(new Animated.Value(1)).current;
  const outerOpacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loopAnim = Animated.loop(
      Animated.sequence([
        // grow + fade out
        Animated.parallel([
          Animated.timing(outerScale, {
            toValue: 2.2,
            duration: 1200,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(outerOpacity, {
            toValue: 0,
            duration: 1200,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
        ]),
        // snap back to start
        Animated.parallel([
          Animated.timing(outerScale, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
          Animated.timing(outerOpacity, {
            toValue: 0.4,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    );

    loopAnim.start();
    return () => loopAnim.stop();
  }, [outerScale, outerOpacity]);

  return (
    <View style={styles.container}>
      {/* Outer animated ring */}
      <Animated.View
        style={[
          styles.outerRing,
          {
            transform: [{ scale: outerScale }],
            opacity: outerOpacity,
          },
        ]}
      />

      {/* Static middle ring */}
      <View style={styles.middleRing} />

      {/* Inner logo circle */}
      <View style={styles.innerCircle}>
        <Text style={styles.logoText}>PULSE</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // white like your mockup
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Big ring that “vibrates away”
  outerRing: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 3,
    borderColor: 'rgba(0, 200, 170, 0.15)',
  },

  // Middle static ring
  middleRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0f4ff',
  },

  // Inner solid circle
  innerCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#00a79d',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoText: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#000000',
  },
});
