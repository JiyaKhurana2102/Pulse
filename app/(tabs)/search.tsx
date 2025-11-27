import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
  Alert, ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// 🔧 FIX: Type for each resource item so icon names are valid
type ResourceItem = {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  desc: string;
};

export default function SearchScreen() {
  const router = useRouter();
  const colors = ['#ff9966', '#b8e6b8', '#5cc4a4', '#f6a278'];

  const openWeb = (url: string, title: string) => {
    if (!url) {
      Alert.alert('Link unavailable');
      return;
    }
    // Open PDFs using the system in-app browser for reliability
    if (url.toLowerCase().endsWith('.pdf')) {
      WebBrowser.openBrowserAsync(url).catch(() => Alert.alert('Unable to open PDF'));
      return;
    }
    router.push({ pathname: '/webview', params: { url: encodeURIComponent(url), title: encodeURIComponent(title) } });
  };

  const openCalendar = () => {
    router.push({ pathname: '/calendar' });
  };

  const resources: ResourceItem[] = [
    {
      title: 'Online Food Delivery',
      icon: 'fast-food',
      desc: 'Order food online from nearby options.',
    },
    {
      title: 'Campus Dining',
      icon: 'restaurant',
      desc: 'Find dining halls, menus & hours.',
    },
    {
      title: 'Parking Map',
      icon: 'car',
      desc: 'Locate parking spots around campus.',
    },
    {
      title: 'Campus Services',
      icon: 'build',
      desc: 'Access all campus support offices.',
    },
    {
      title: 'Academic Calendar',
      icon: 'calendar',
      desc: 'View school dates and deadlines.',
    },
    {
      title: 'Bookstore',
      icon: 'book',
      desc: 'Buy textbooks, merch, and supplies.',
    },
    {
      title: 'Campus Directory',
      icon: 'list',
      desc: 'Find staff, departments, and contacts.',
    },
    {
      title: 'Career Center',
      icon: 'briefcase',
      desc: 'Internships, jobs, and career help.',
    },
    {
      title: 'Health Services',
      icon: 'medkit',
      desc: 'Medical appointments and wellness info.',
    },
    {
      title: 'IT Help Desk',
      icon: 'laptop',
      desc: 'Technical support for campus systems.',
    },
    {
      title: 'Emergency Info',
      icon: 'alert',
      desc: 'Emergency procedures & contacts.',
    },
    {
      title: 'Library',
      icon: 'library',
      desc: 'Books, study rooms, & research tools.',
    },
  ];

  const [query, setQuery] = useState('');

  const filtered = resources.filter((r) =>
    r.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <LinearGradient
      colors={['#FFFFFF', '#FFF7ED', '#FED7AA', '#D1FAE5', '#ECFEFF', '#FFFFFF']}
      locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* MAIN TITLE */}
        <Text style={styles.title}>Campus Resources</Text>
        <Text style={styles.subtitle}>Everything you need in one place</Text>

        {/* SEARCH BAR */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#888" style={{ marginRight: 6 }} />
          <TextInput
            placeholder="Search resources..."
            placeholderTextColor="#777"
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
          />
        </View>

        {/* RESOURCE BUTTONS */}
        {filtered.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.button, { backgroundColor: colors[i % colors.length] }]}
            onPress={() => {
              // route each resource to the appropriate link or screen
              switch (item.title) {
                case 'Online Food Delivery':
                  openWeb('https://boostapp.io/', item.title);
                  break;
                case 'Campus Dining':
                  openWeb('https://services.utdallas.edu/dining/', item.title);
                  break;
                case 'Parking Map':
                  openWeb('https://services.utdallas.edu/download/Parking_Map.pdf', item.title);
                  break;
                case 'Campus Services':
                  openWeb('https://www.utdallas.edu/campus-life/student-services-support/', item.title);
                  break;
                case 'Academic Calendar':
                  openCalendar();
                  break;
                case 'Bookstore':
                  openWeb('https://www.bkstr.com/texasatdallasstore/home', item.title);
                  break;
                case 'Campus Directory':
                  openWeb('https://www.utdallas.edu/directory/', item.title);
                  break;
                case 'Career Center':
                  openWeb('https://career.utdallas.edu/', item.title);
                  break;
                case 'Health Services':
                  openWeb('https://studenthealthcenter.utdallas.edu/', item.title);
                  break;
                case 'IT Help Desk':
                  openWeb('https://oit.utdallas.edu/servicedesk/', item.title);
                  break;
                case 'Emergency Info':
                  openWeb('https://www.utdallas.edu/emergency/', item.title);
                  break;
                case 'Library':
                  openWeb('https://library.utdallas.edu/', item.title);
                  break;
                default:
                  Alert.alert('Not implemented');
              }
            }}
          >
            <Ionicons name={item.icon} size={34} color="white" style={{ marginBottom: 8 }} />
            <Text style={styles.buttonTitle}>{item.title}</Text>
            <Text style={styles.buttonDesc}>{item.desc}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

// ---------------- STYLES ----------------

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 22,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  title: {
    fontSize: 26,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: 6,
    fontFamily: 'Inter_700Bold',
    color: '#111827',
  },

  subtitle: {
    fontSize: 16,
    color: '#444',
    marginBottom: 25,
    textAlign: 'center',
  },

  searchBox: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 22,
    elevation: 4, // Android
    shadowColor: '#000', // iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
  },

  button: {
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
  },

  buttonTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },

  buttonDesc: {
    color: 'white',
    marginTop: 4,
    fontSize: 14,
  },
});
