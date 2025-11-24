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
      // match settings screen: soft multi-stop warm gradient
      colors={['#FFFFFF', '#FFF7ED', '#FED7AA', '#D1FAE5', '#ECFEFF', '#FFFFFF']}
      locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <GlobalText style={styles.welcomeTitle}>Pulse</GlobalText>
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
                <View style={styles.cardInnerGlass}>
                  <GlobalText style={styles.cardText}>Find an Event</GlobalText>
                </View>
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
                <View style={styles.cardInnerGlass}>
                  <GlobalText style={styles.cardText}>Campus Map</GlobalText>
                </View>
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
                <View style={styles.cardInnerGlass}>
                  <GlobalText style={styles.cardText}>Join a group</GlobalText>
                </View>
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
                <View style={styles.cardInnerGlass}>
                  <GlobalText style={styles.cardText}>
                    Reserve a study room
                  </GlobalText>
                </View>
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
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'Lora_700Bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
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
    borderColor: 'rgba(255, 255, 255, 0.75)',
    position: 'relative',
    overflow: 'hidden',
    paddingTop: 12,
  },
  cardAccent: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 12,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  
  cardPressed: {
    transform: [{ scale: 0.97 }],
  },
  cardText: {
    fontSize: 16,
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
    fontSize: 18,
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
    fontSize: 15,
    color: '#4B5563',
    marginTop: 2,
  },
  cardInnerGlass: {
    flex: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    overflow: 'hidden',
    padding: 0,
  },
});
