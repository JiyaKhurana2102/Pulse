import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text } from 'react-native';

export default function MessagesScreen() {
  return (
    <LinearGradient
      colors={['#FFFFFF', '#FFF7ED', '#FED7AA', '#D1FAE5', '#ECFEFF', '#FFFFFF']}
      locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <Text style={styles.text}>Messages/Chat Screen Content</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      backgroundColor: 'transparent',
    },
    text: {
        fontSize: 24,
      fontWeight: '700',
      fontFamily: 'Lora_700Bold',
    },
});