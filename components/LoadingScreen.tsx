// components/LoadingScreen.tsx
import { Brand } from '@/constants/theme';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const PULSE_COLOR = '#ec2828d5';

type LoadingScreenProps = {
  onFinish?: () => void;
};

export default function LoadingScreen({ onFinish }: LoadingScreenProps) {
  // persistent rings state: each ring has an Animated.Value for scale
  const [rings, setRings] = useState<Array<{ id: number; scale: Animated.Value }>>([]);
  // inner rings remain static
  const wave2Scale = useRef(new Animated.Value(1)).current;
  const wave2Opacity = useRef(new Animated.Value(1)).current;
  const wave3Scale = useRef(new Animated.Value(1)).current;
  const wave3Opacity = useRef(new Animated.Value(1)).current;
  const nextRingId = useRef(1);

  useEffect(() => {
    // Spawn a new persistent outer ring every interval. Each ring animates out to finalScale and stays.
    const finalScale = 3.0;
    const duration = 2000; // ms
    const gap = 3000; // ms between spawns
    const maxRings = 6; // cap to avoid unbounded growth

    let mounted = true;

    const spawnRing = () => {
      const id = nextRingId.current++;
      const scale = new Animated.Value(1);

      // add ring to state
      setRings(prev => {
        const next = [...prev, { id, scale }];
        if (next.length > maxRings) next.shift();
        return next;
      });

      // animate to final size and leave it
      Animated.timing(scale, { toValue: finalScale, duration, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
    };

    // initial spawn
    spawnRing();
    const interval = setInterval(() => {
      if (!mounted) return;
      spawnRing();
    }, gap);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [wave2Scale, wave2Opacity, wave3Scale, wave3Opacity]);

  // tap handler to dismiss the loading screen
  const handlePress = () => {
    onFinish?.();
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        {/* persistent outer rings (spawned each pulse) */}
        {rings.map(r => (
          <Animated.View key={r.id} style={[styles.waveWrapper, { transform: [{ scale: r.scale }], opacity: 0.75 }]}>
            <Animated.View style={[styles.ring, styles.ringLarge, { borderColor: Brand.orange }]} />
          </Animated.View>
        ))}

        {/* static middle and inner rings */}
        <View style={styles.waveWrapper} pointerEvents="none">
          <View style={[styles.ring, styles.ringMid, { borderColor: '#ff753eff' }]} />
        </View>

        <View style={styles.waveWrapper} pointerEvents="none">
          <View style={[styles.ring, styles.ringSmall, { borderColor: '#ec2828d5' }]} />
        </View>

        {/* inner filled circle (lightest orange) */}
        <View style={[styles.innerCircle, { borderColor: '#000000ff' }]}>
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
    backgroundColor: '#cdebd0ff',
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

  /* rings */
  ring: {
    position: 'absolute',
    borderRadius: 9999,
    backgroundColor: 'transparent',
    zIndex: 0,
  },
  ringLarge: {
    width: 420,
    height: 420,
    borderWidth: 28,
  },
  ringMid: {
    width: 364,
    height: 364,
    borderWidth: 24,
  },
  ringSmall: {
    width: 316,
    height: 316,
    borderWidth: 20,
  },

  innerCircle: {
    width: 276,
    height: 276,
    borderRadius: 138,
    backgroundColor: '#FFF3E6',
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
    fontSize: 50,
    justifyContent: 'center',
    fontWeight: '900',
    letterSpacing: 3,
    color: '#0d440bff',
  },
});
