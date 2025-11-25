// components/LoadingScreen.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const PULSE_COLOR = '#FED7AA';

type LoadingScreenProps = {
  onFinish?: () => void;
};

export default function LoadingScreen({ onFinish }: LoadingScreenProps) {
  const [rings, setRings] = useState<Array<{ id: number; scale: Animated.Value }>>([]);
  const wave2Scale = useRef(new Animated.Value(1)).current;
  const wave2Opacity = useRef(new Animated.Value(1)).current;
  const wave3Scale = useRef(new Animated.Value(1)).current;
  const wave3Opacity = useRef(new Animated.Value(1)).current;
  const nextRingId = useRef(1);

  useEffect(() => {
    const finalScale = 3.0;
    const duration = 2000;
    const gap = 3000;
    const maxRings = 6;
    let mounted = true;

    const spawnRing = () => {
      const id = nextRingId.current++;
      const scale = new Animated.Value(1);

      setRings(prev => {
        const next = [...prev, { id, scale }];
        if (next.length > maxRings) next.shift();
        return next;
      });

      Animated.timing(scale, {
        toValue: finalScale,
        duration,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }).start();
    };

    spawnRing();
    const interval = setInterval(() => {
      if (!mounted) return;
      spawnRing();
    }, gap);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handlePress = () => {
    onFinish?.();
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View style={styles.container}>
        {rings.map(r => (
          <Animated.View
            key={r.id}
            style={[
              styles.waveWrapper,
              { transform: [{ scale: r.scale }], opacity: 0.75 },
            ]}>
            <Animated.View
              style={[
                styles.ring,
                styles.ringLarge,
                { borderColor: '#FED7AA' }, // peach outer ring
              ]}
            />
          </Animated.View>
        ))}

        {/* middle ring */}
        <View style={styles.waveWrapper} pointerEvents="none">
          <View
            style={[
              styles.ring,
              styles.ringMid,
              { borderColor: '#ECFEFF' }, // icy blue
            ]}
          />
        </View>

        {/* inner small ring */}
        <View style={styles.waveWrapper} pointerEvents="none">
          <View
            style={[
              styles.ring,
              styles.ringSmall,
              { borderColor: '#FFF7ED' }, // warm cream
            ]}
          />
        </View>

        {/* inner filled circle */}
        <View
          style={[
            styles.innerCircle,
            { backgroundColor: '#FFFFFF', borderColor: '#FFF7ED' },
          ]}>
          <Text style={styles.logoText}>PULSE</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D1FAE5', // mint green
    justifyContent: 'center',
    alignItems: 'center',
  },

  waveWrapper: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },

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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 2,
  },

  // components/LoadingScreen.tsx

logoText: {
  fontSize: 50,
  justifyContent: 'center',
  fontWeight: '900',
  letterSpacing: 3,
  color: '#064E3B',
  fontFamily: 'Inter_700Bold',   // switched to Inter
},

});
