import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';

// Get screen width for responsive layout
const { width } = Dimensions.get('window');
const SPACING = 15; // Standard padding/margin

// Define the shape for our button data
interface ButtonData {
  id: number;
  label: string;
  action: () => void; // Function to run when pressed (e.g., navigate)
}

// Dummy actions for the buttons
const handlePress = (label: string) => {
  console.log(`${label} button pressed!`);
  // In a real app, this would be a navigation call (e.g., navigation.navigate('EventScreen'))
};

// Data for the main buttons
const mainButtons: ButtonData[] = [
  { id: 1, label: 'Find an Event', action: () => handlePress('Find an Event') },
  { id: 2, label: 'Campus Map', action: () => handlePress('Campus Map') },
  { id: 3, label: 'Join a group', action: () => handlePress('Join a group') },
  { id: 4, label: 'Reserve a study room', action: () => handlePress('Reserve a study room') },
];

// Reusable component for the main blue-box buttons
const HomeButton: React.FC<ButtonData> = ({ label, action }) => (
  <TouchableOpacity style={styles.button} onPress={action}>
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

// --- Main Component ---
const HomeScreen: React.FC = () => {
  return (
    // SafeAreaView ensures content doesn't overlap status bars (for iOS)
    <SafeAreaView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.tagline}>
          Your campus. Your guide. Your Pulse.
        </Text>
      </View>

      {/* Button Grid Section */}
      <View style={styles.buttonGrid}>
        {mainButtons.map(button => (
          <HomeButton key={button.id} {...button} />
        ))}
      </View>

      {/* Today's Events Box */}
      <View style={styles.eventsBox}>
        <Text style={styles.eventsHeaderText}>Today's events:</Text>
        {/* Placeholder for event list items */}
        <Text style={styles.eventListItem}>• No major events scheduled.</Text> 
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNav}>
        {/*
          Placeholder for actual icon components (e.g., from 'react-native-vector-icons').
          Using dummy views/text for now as requested.
        */}
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>➕</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>⚙️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Text style={styles.navIcon}>💬</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- Stylesheet ---
const styles = StyleSheet.create({
  // General layout
  container: {
    flex: 1,
    backgroundColor: '#D9F2D9', // Light green background from the image
    paddingHorizontal: SPACING,
  },
  
  // Header styles
  header: {
    alignItems: 'center',
    paddingTop: 40, // Increased top padding for better spacing
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 48, // Larger font size for the "Welcome" text
    fontFamily: 'serif', // Placeholder for a custom font like the image
    color: '#000',
  },
  tagline: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },

  // Button Grid styles (2x2 layout)
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  button: {
    width: (width - SPACING * 3) / 2, // Calculate width for 2 buttons with space
    height: 100,
    backgroundColor: '#A8DDEB', // Light blue background
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING,
    padding: 10,
    // Basic shadow for depth (iOS and Android different properties)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, 
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'serif', // Placeholder for custom font
    color: '#1a1a1a',
  },

  // Events Box styles
  eventsBox: {
    flex: 1, // Takes up remaining vertical space
    backgroundColor: '#A8DDEB', // Light blue background
    borderRadius: 10,
    padding: SPACING,
    marginBottom: SPACING * 1.5,
  },
  eventsHeaderText: {
    fontSize: 18,
    fontFamily: 'serif',
    marginBottom: 5,
    color: '#1a1a1a',
  },
  eventListItem: {
      fontSize: 16,
      color: '#333',
  },

  // Bottom Navigation styles
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60, // Fixed height for the nav bar
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    backgroundColor: 'white', // White background for the nav bar
    marginHorizontal: -SPACING, // Extend to screen edges
    paddingHorizontal: SPACING / 2,
    position: 'absolute', // Fixes it to the bottom
    bottom: 0,
    width: width,
  },
  navItem: {
    padding: 5,
  },
  navIcon: {
    fontSize: 24, // Size of the placeholder emoji icons
  },
});

export default HomeScreen;