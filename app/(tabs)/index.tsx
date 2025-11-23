// app/index.tsx
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import GlobalText from '@/components/GlobalText';

export const options = {
  headerShown: false,
};

export default function HomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={['#99F6E4', '#D8B4FE', '#6EE7B7']} // background gradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <GlobalText style={styles.welcomeTitle}>Welcome</GlobalText>
            <GlobalText style={styles.subtitle}>
              Your campus. Your guide. Your Pulse.
            </GlobalText>
          </View>

          {/* Action cards grid */}
          <View style={styles.cardRow}>
            {/* Find an Event */}
            <Pressable
              style={({ pressed }) => [
                styles.cardWrapper,
                pressed && styles.cardPressed,
              ]}
              onPress={() => router.push('/events')}
            >
              <BlurView intensity={40} tint="light" style={styles.cardBlur}>
                <LinearGradient
                  colors={['#a5f3fc', '#eef2ff', '#f5d0fe']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardInner}
                >
                  <GlobalText style={styles.cardText}>Find an Event</GlobalText>
                </LinearGradient>
              </BlurView>
            </Pressable>

            {/* Campus Map */}
            <Pressable
              style={({ pressed }) => [
                styles.cardWrapper,
                pressed && styles.cardPressed,
              ]}
              onPress={() => router.push('/campus-map')}
            >
              <BlurView intensity={40} tint="light" style={styles.cardBlur}>
                <LinearGradient
                  colors={['#6ee7b7', '#a5f3fc', '#e9d5ff']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardInner}
                >
                  <GlobalText style={styles.cardText}>Campus Map</GlobalText>
                </LinearGradient>
              </BlurView>
            </Pressable>
          </View>

          <View style={styles.cardRow}>
            {/* Join a group */}
            <Pressable
              style={({ pressed }) => [
                styles.cardWrapper,
                pressed && styles.cardPressed,
              ]}
              onPress={() => router.push('/groups')}
            >
              <BlurView intensity={40} tint="light" style={styles.cardBlur}>
                <LinearGradient
                  colors={['#bfdbfe', '#e9d5ff', '#fee2e2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardInner}
                >
                  <GlobalText style={styles.cardText}>Join a group</GlobalText>
                </LinearGradient>
              </BlurView>
            </Pressable>

            {/* Reserve a study room */}
            <Pressable
              style={({ pressed }) => [
                styles.cardWrapper,
                pressed && styles.cardPressed,
              ]}
              onPress={() => router.push('/studyrooms')}
            >
              <BlurView intensity={40} tint="light" style={styles.cardBlur}>
                <LinearGradient
                  colors={['#e5e7eb', '#a5f3fc', '#7dd3fc']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardInner}
                >
                  <GlobalText style={styles.cardText}>
                    Reserve a study room
                  </GlobalText>
                </LinearGradient>
              </BlurView>
            </Pressable>
          </View>

          {/* Today's events – also glassy */}
          <BlurView intensity={40} tint="light" style={styles.todayBlur}>
            <View style={styles.todayCard}>
              <GlobalText style={styles.todayTitle}>Today's events:</GlobalText>

              <View style={styles.eventItem}>
                <View style={styles.eventBullet} />
                <View style={styles.eventTextBlock}>
                  <GlobalText style={styles.eventTitle}>
                    Fraternity Meeting
                  </GlobalText>
                  <GlobalText style={styles.eventTime}>6:00 PM</GlobalText>
                </View>
              </View>

              <View style={styles.eventItem}>
                <View style={styles.eventBullet} />
                <View style={styles.eventTextBlock}>
                  <GlobalText style={styles.eventTitle}>
                    CS 101 Study Group
                  </GlobalText>
                  <GlobalText style={styles.eventTime}>2:00 PM</GlobalText>
                </View>
              </View>
            </View>
          </BlurView>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },

  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 22,
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#1F2933',
  },

  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 16,
  },
  cardWrapper: {
    flex: 1,
    height: 130,
    borderRadius: 32,
    overflow: 'hidden', // important so blur/gradient stay rounded
  },
  cardBlur: {
    flex: 1,
  },
  cardInner: {
    flex: 1,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.8)',
  },
  cardPressed: {
    transform: [{ scale: 0.97 }],
  },
  cardText: {
    fontSize: 14,
    color: '#111827',
    textAlign: 'center',
  },

  todayBlur: {
    marginTop: 24,
    borderRadius: 32,
    overflow: 'hidden',
  },
  todayCard: {
    padding: 20,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  todayTitle: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 16,
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  eventBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 8,
    backgroundColor: '#0F766E',
  },
  eventTextBlock: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    color: '#111827',
  },
  eventTime: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 2,
  },
});
