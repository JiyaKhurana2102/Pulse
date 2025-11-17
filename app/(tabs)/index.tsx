import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router'; // Enables navigation

// Get screen width for responsive layout
const { width } = Dimensions.get('window');
const SPACING = 15; // Standard padding/margin

// Define the shape for our button data
interface ButtonData {
  id: number;
  label: string;
  route?: string; // Holds the destination route (optional for buttons without navigation)
}

// Reusable component for the main blue-box buttons
interface HomeButtonProps extends ButtonData {
    onPress: (route?: string) => void;
}

const HomeButton: React.FC<HomeButtonProps> = ({ label, route, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={() => onPress(route)}>
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);


// --- Main Component ---
const HomeScreen: React.FC = () => {
    // Get the router instance
    const router = useRouter(); 
    
    // Function to handle all button presses
    const handleButtonPress = (route?: string) => {
        if (route && route.length > 0) {
            // expo-router has strict route types; cast to any for dynamic routes
            router.push(route as unknown as any);
        } else {
            console.log(`Button for route ${route} pressed! (No navigation defined)`);
        }
    };

    // Data for the main buttons
    const mainButtons: ButtonData[] = [
      // Placeholder route for the new screen
      { id: 1, label: 'Find an Event', route: '/events' }, 
      { id: 2, label: 'Campus Map', route: undefined }, 
      { id: 3, label: 'Join a group', route: undefined }, 
      { id: 4, label: 'Reserve a study room', route: undefined },
    ];


  return (
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
          <HomeButton 
            key={button.id} 
            {...button} 
            onPress={handleButtonPress} // Pass the navigation handler
          />
        ))}
      </View>

      {/* Today's Events Box */}
      <View style={styles.eventsBox}>
        <Text style={styles.eventsHeaderText}>Today's events:</Text>
        {/* Placeholder for event list items */}
        <Text style={styles.eventListItem}>• No major events scheduled.</Text> 
      </View>
      
      {/* THE REDUNDANT BOTTOM NAVIGATION BAR CODE WAS REMOVED FROM HERE */}
    </SafeAreaView>
  );
};

// --- Stylesheet (Cleaned up) ---
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
});

export default HomeScreen;