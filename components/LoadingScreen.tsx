// components/LoadingScreen.tsx
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const PULSE_COLOR = '#00A79D';

type LoadingScreenProps = {
  onFinish?: () => void;
};

export default function LoadingScreen({ onFinish }: LoadingScreenProps) {
  // three uniform waves
  const wave1Scale = useRef(new Animated.Value(1)).current;
  const wave1Opacity = useRef(new Animated.Value(0.4)).current;

  const wave2Scale = useRef(new Animated.Value(1)).current;
  const wave2Opacity = useRef(new Animated.Value(0.35)).current;

  const wave3Scale = useRef(new Animated.Value(1)).current;
  const wave3Opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Single sequential loop: wave1 -> wave2 -> wave3, then repeat.
    const toScale = 3.0;
    const duration = 2000; // slow pulse (ms)
    const gap = 450; // delay between waves (ms)

    const waveAnim = Animated.sequence([
      // wave 1
      Animated.parallel([
        Animated.timing(wave1Scale, { toValue: toScale, duration, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(wave1Opacity, { toValue: 0, duration, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(wave1Scale, { toValue: 1, duration: 0, useNativeDriver: true }),
        Animated.timing(wave1Opacity, { toValue: 0.5, duration: 0, useNativeDriver: true }),
      ]),
      Animated.delay(gap),

      // wave 2
      Animated.parallel([
        Animated.timing(wave2Scale, { toValue: toScale, duration, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(wave2Opacity, { toValue: 0, duration, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(wave2Scale, { toValue: 1, duration: 0, useNativeDriver: true }),
        Animated.timing(wave2Opacity, { toValue: 0.4, duration: 0, useNativeDriver: true }),
      ]),
      Animated.delay(gap),

      // wave 3
      Animated.parallel([
        Animated.timing(wave3Scale, { toValue: toScale, duration, easing: Easing.out(Easing.quad), useNativeDriver: true }),
        Animated.timing(wave3Opacity, { toValue: 0, duration, easing: Easing.out(Easing.quad), useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(wave3Scale, { toValue: 1, duration: 0, useNativeDriver: true }),
        Animated.timing(wave3Opacity, { toValue: 0.3, duration: 0, useNativeDriver: true }),
      ]),
      Animated.delay(gap),
    ]);

    const loop = Animated.loop(waveAnim);
    loop.start();

    return () => loop.stop();
  }, [wave1Scale, wave1Opacity, wave2Scale, wave2Opacity, wave3Scale, wave3Opacity]);

  // tap handler to dismiss the loading screen
  const handlePress = () => {
    onFinish?.();
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>

        {/* uniform, slow waves: animate wrapper Views (supported on iOS) and put static LinearGradient inside */}
        <Animated.View style={[styles.waveWrapper, { transform: [{ scale: wave1Scale }], opacity: wave1Opacity }]}> 
          <LinearGradient colors={["#99F6E4", "#D8B4FE", "#6EE7B7"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.waveBase, styles.waveSize]} />
        </Animated.View>

        <Animated.View style={[styles.waveWrapper, { transform: [{ scale: wave2Scale }], opacity: wave2Opacity }]}> 
          <LinearGradient colors={["#99F6E4", "#D8B4FE", "#6EE7B7"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.waveBase, styles.waveSize]} />
        </Animated.View>

        <Animated.View style={[styles.waveWrapper, { transform: [{ scale: wave3Scale }], opacity: wave3Opacity }]}> 
          <LinearGradient colors={["#99F6E4", "#D8B4FE", "#6EE7B7"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={[styles.waveBase, styles.waveSize]} />
        </Animated.View>

        {/* soft halo (gradient) */}
        <LinearGradient
          colors={["rgba(153,246,228,0.28)", "rgba(216,180,254,0.16)"]}
          style={styles.middleRing}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        {/* logo circle (solid white) — only the outer halo is gradient */}
        <View style={styles.innerCircle}>
          <Text style={styles.logoText}>PULSE</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  // full-screen splash
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

    background: {
      ...StyleSheet.absoluteFillObject,
    },

    waveWrapper: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 0,
    },

  waveBase: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: 'transparent',
    zIndex: 0,
  },
  waveSize: {
    width: 220,
    height: 220,
  },

  middleRing: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'transparent',
    zIndex: 1,
  },

  innerCircle: {
    width: 150,
    height: 160,
    borderRadius: 80,
    backgroundColor: '#b3faffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 2,
  },

  logoText: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: 2,
    color: '#000000ff',
  },
});
