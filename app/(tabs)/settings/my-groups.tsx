import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// --- STYLES & CONSTANTS ---
const BACKGROUND_COLOR = 'transparent';

// --- MAIN COMPONENT ---
export default function MyGroupsScreen() {
  return (
    <LinearGradient
      colors={['#FFFFFF', '#FFF7ED', '#FED7AA', '#D1FAE5', '#ECFEFF', '#FFFFFF']}
      locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
      <Text style={styles.title}>Your Groups</Text>
      
      <View style={styles.contentContainer}>
        <Text style={styles.message}>
          This is where you'll manage your groups.
        </Text>
        <Text style={styles.message}>
          You will see a list of groups you own and groups you are a member of.
        </Text>
        <Text style={styles.todo}>
          TODO: Implement Firebase fetching logic to display groups here.
        </Text>
      </View>
      </View>
    </LinearGradient>
  );
}

// --- STYLING ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    color: '#1A1A1A',
    marginBottom: 20,
  },
  contentContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  message: {
    fontSize: 16,
    color: '#4A4A4A',
    marginBottom: 10,
    lineHeight: 22,
  },
  todo: {
    fontSize: 14,
    color: '#C0392B', // A reddish color for warnings/todos
    marginTop: 15,
    fontStyle: 'italic',
  }
});