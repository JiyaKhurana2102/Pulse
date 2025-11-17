import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BACKGROUND_COLOR = '#F0FFF0'; 
const TEXT_COLOR = '#1A1A1A';

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Notifications Settings Content</Text>
      <Text style={styles.subText}>You can customize your alerts here!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: TEXT_COLOR,
    marginBottom: 10,
  },
  subText: {
    fontSize: 16,
    color: TEXT_COLOR,
  },
});