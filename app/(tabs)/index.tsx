import { useRouter } from 'expo-router';
import React from 'react';
import GlobalText from '@/components/GlobalText';
import {
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const SPACING = 15;

interface ButtonData {
  id: number;
  label: string;
  route?: string;
}

interface HomeButtonProps extends ButtonData {
  onPress: (route?: string) => void;
}

const HomeButton: React.FC<HomeButtonProps> = ({ label, route, onPress }) => (
  <TouchableOpacity style={styles.button} onPress={() => onPress(route)}>
    <Text style={styles.buttonText}>{label}</Text>
  </TouchableOpacity>
);

const HomeScreen: React.FC = () => {
  const router = useRouter();

  const handleButtonPress = (route?: string) => {
    if (route && route.length > 0) {
      router.push(route as any);
    } else {
      console.log(`Button pressed for route: ${route}`);
    }
  };

  const mainButtons: ButtonData[] = [
    { id: 1, label: 'Find an Event', route: '/events' },
    { id: 2, label: 'Campus Map', route: '/campus-map' },
    { id: 3, label: 'Join a group', route: '/groups' },
    { id: 4, label: 'Reserve a study room', route: '/studyrooms' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome</Text>
        <Text style={styles.tagline}>Your campus. Your guide. Your Pulse.</Text>
      </View>

      {/* Button Grid */}
      <View style={styles.buttonGrid}>
        {mainButtons.map(button => (
          <HomeButton key={button.id} {...button} onPress={handleButtonPress} />
        ))}
      </View>

      {/* Events Box */}
      <View style={styles.eventsBox}>
        <Text style={styles.eventsHeaderText}>Today's events:</Text>

        <Text style={styles.eventListItem}>• Fraternity Meeting</Text>
        <Text style={styles.eventTime}>6:00 PM</Text>

        <Text style={styles.eventListItem}>• CS 101 Study Group</Text>
        <Text style={styles.eventTime}>2:00 PM</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  // main container
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: SPACING,
  },

  // centered header
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    marginBottom: 30,
  },

  welcomeText: {
    fontSize: 40,
    fontFamily: 'Lora',
    color: '#1E1E1E',
    fontWeight: 'bold',
    textAlign: 'center',
  },

  tagline: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
    fontFamily: 'Lora',
    textAlign: 'center',
  },

  // button grid
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 30,
  },

  button: {
    width: (width - SPACING * 3) / 2,
    height: 100,
    backgroundColor: '#CCF5FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  buttonText: {
    fontSize: 16,
    fontFamily: 'Lora',
    textAlign: 'center',
    color: '#1E1E1E',
    fontWeight: '600',
  },

  // events box
  eventsBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: SPACING,
    borderWidth: 1,
    borderColor: '#DDF8FF',
    shadowColor: '#B9F1FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },

  eventsHeaderText: {
    fontSize: 18,
    fontFamily: 'Lora',
    marginBottom: 10,
    color: '#1E1E1E',
    fontWeight: 'bold',
  },

  eventListItem: {
    fontSize: 16,
    color: '#1E1E1E',
    fontWeight: '600',
    fontFamily: 'Lora',
    marginBottom: 0,
  },

  eventTime: {
    fontSize: 14,
    color: '#555',
    marginLeft: 15,
    marginBottom: 10,
    fontFamily: 'Lora',
  },
});

export default HomeScreen;
