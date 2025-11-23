import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const EventsScreen: React.FC = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#2D4A3A" />
        </TouchableOpacity>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={18}
            color="#7A9A8A"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#7A9A8A"
            style={styles.searchInput}
          />
          <Ionicons
            name="mic-outline"
            size={18}
            color="#7A9A8A"
            style={styles.micIcon}
          />
        </View>

        {/* This week on campus */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This week on campus..</Text>
          <View style={styles.cardList}>
            <View style={styles.card} />
            <View style={styles.card} />
            <View style={styles.card} />
          </View>
          <TouchableOpacity style={styles.showMoreBtn}>
            <Text style={styles.showMoreText}>
              show more <Text style={styles.arrow}>▾</Text>
            </Text>
          </TouchableOpacity>
        </View>

        {/* Find your group */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Find your group</Text>
          <View style={styles.cardList}>
            <View style={styles.card} />
            <View style={styles.card} />
            <View style={styles.card} />
          </View>
          <TouchableOpacity style={styles.showMoreBtn}>
            <Text style={styles.showMoreText}>
              show more <Text style={styles.arrow}>▾</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#D4E9DB', // light background only
  },
  content: {
    padding: 16,
    paddingTop: 20,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#9BD9C3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B5D4C5',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  micIcon: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 4,
    fontSize: 16,
    color: '#2D4A3A',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#2D4A3A',
    marginBottom: 12,
    fontWeight: '600',
  },
  cardList: {
    gap: 10,
  },
  card: {
    height: 48,
    borderRadius: 18,
    backgroundColor: '#9BD9C3',
  },
  showMoreBtn: {
    marginTop: 10,
    alignItems: 'center',
  },
  showMoreText: {
    color: '#7A9A8A',
    fontSize: 14,
  },
  arrow: {
    fontSize: 14,
  },
});

export default EventsScreen;
