import { EventRecord, getUserId, listEvents, saveEvent, unsaveEvent } from '@/services/events';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
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
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EventRecord[]>([]);
  const [userId, setUserId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const uid = await getUserId();
      setUserId(uid);
      const data = await listEvents();
      setEvents(data);
      setFilteredEvents(data);
    } catch (e: any) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredEvents(events);
    } else {
      const lower = query.toLowerCase();
      setFilteredEvents(
        events.filter(
          e =>
            e.name.toLowerCase().includes(lower) ||
            e.description.toLowerCase().includes(lower) ||
            e.groupName?.toLowerCase().includes(lower)
        )
      );
    }
  };

  const handleToggleSave = async (event: EventRecord) => {
    const isSaved = event.savedBy.includes(userId);
    if (isSaved) {
      Alert.alert('Unsave Event', `Remove "${event.name}" from My Events?`, [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unsave',
          style: 'destructive',
          onPress: async () => {
            await unsaveEvent(event.id, userId);
            await loadEvents();
          },
        },
      ]);
    } else {
      await saveEvent(event.id, userId);
      await loadEvents();
    }
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#FFF7ED', '#FED7AA', '#D1FAE5', '#ECFEFF', '#FFFFFF']}
      locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ ...styles.safe, backgroundColor: 'transparent' }}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.pageTitle}>Find an Event</Text>

          {/* Search bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={18} color="#fff" style={styles.searchIcon} />
            <TextInput
              placeholder="Search events"
              placeholderTextColor="rgba(255,255,255,0.7)"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>

          {loading && <Text style={styles.message}>Loading...</Text>}

          {!loading && filteredEvents.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No events yet.</Text>
              <Text style={styles.emptySubtext}>Create one from the Create tab!</Text>
            </View>
          )}

          {!loading &&
            filteredEvents.map(event => {
              const isSaved = event.savedBy.includes(userId);
              const eventDate = new Date(event.date);
              return (
                <View key={event.id} style={styles.eventCard}>
                  <View style={styles.eventHeader}>
                    <Text style={styles.eventName}>{event.name}</Text>
                    <TouchableOpacity
                      onPress={() => handleToggleSave(event)}
                      style={[
                        styles.saveButton,
                        isSaved && styles.saveButtonActive,
                      ]}
                    >
                      <Ionicons
                        name={isSaved ? 'bookmark' : 'bookmark-outline'}
                        size={20}
                        color={isSaved ? '#fff' : '#5cc4a4'}
                      />
                      <Text
                        style={[
                          styles.saveButtonText,
                          isSaved && styles.saveButtonTextActive,
                        ]}
                      >
                        {isSaved ? 'Saved' : 'Save'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  {event.description ? (
                    <Text style={styles.eventDescription}>{event.description}</Text>
                  ) : null}
                  <View style={styles.eventMeta}>
                    <Ionicons name="calendar-outline" size={14} color="#7A9A8A" />
                    <Text style={styles.eventMetaText}>
                      {eventDate.toLocaleDateString()} at {event.time}
                    </Text>
                  </View>
                  {event.groupName ? (
                    <View style={styles.eventMeta}>
                      <Ionicons name="people-outline" size={14} color="#7A9A8A" />
                      <Text style={styles.eventMetaText}>{event.groupName}</Text>
                    </View>
                  ) : null}
                  <View style={styles.eventMeta}>
                    <Ionicons name="person-outline" size={14} color="#7A9A8A" />
                    <Text style={styles.eventMetaText}>
                      {event.savedBy.length} saved
                    </Text>
                  </View>
                </View>
              );
            })}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 20,
    paddingTop: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#5cc4a4',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 4,
    fontSize: 16,
    color: '#fff',
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    color: '#1A1A1A',
    marginBottom: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#7A9A8A',
    textAlign: 'center',
    marginTop: 20,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2D4A3A',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#7A9A8A',
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    color: '#1A1A1A',
    flex: 1,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#5cc4a4',
    backgroundColor: 'transparent',
  },
  saveButtonActive: {
    backgroundColor: '#5cc4a4',
    borderColor: '#5cc4a4',
  },
  saveButtonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#5cc4a4',
  },
  saveButtonTextActive: {
    color: '#fff',
  },
  eventDescription: {
    fontSize: 14,
    color: '#4A5568',
    marginBottom: 8,
    lineHeight: 20,
  },
  eventMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  eventMetaText: {
    fontSize: 13,
    color: '#7A9A8A',
    marginLeft: 6,
  },
});

export default EventsScreen;
