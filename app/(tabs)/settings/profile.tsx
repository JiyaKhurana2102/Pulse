import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const BACKGROUND_COLOR = '#F0FFF0'; 
const TEXT_COLOR = '#1A1A1A';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Profile Screen Content</Text>
      <Text style={styles.subText}>View and edit your personal information.</Text>
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