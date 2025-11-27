// app/index.tsx
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import GlobalText from '@/components/GlobalText';

// Experimental trial colors for homepage action cards.
// KEEP existing styling; these can be toggled off by setting USE_EXPERIMENTAL_CARD_COLORS = false.
const USE_EXPERIMENTAL_CARD_COLORS = true;
const experimentalCardColors = ['#ff9966', '#b8e6b8', '#5cc4a4', '#f6a278'];

export const options = {
  headerShown: false,
};

export default function HomeScreen() {
  const router = useRouter();

  return (
    <LinearGradient
      // match settings screen: soft multi-stop warm gradient
      colors={['#FFFFFF', '#FFF7ED', '#FED7AA', '#D1FAE5', '#ECFEFF', '#FFFFFF']}
      locations={[0, 0.1, 0.35, 0.55, 0.75, 1]}
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
            <GlobalText style={styles.welcomeTitle}>Welcome</GlobalText>
            <GlobalText style={styles.subtitle}>
              Your campus. Your guide. Your Pulse.
            </GlobalText>
          </View>

          {/* Today's events – move to top */}
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

          {/* Action cards - full width buttons */}
          {/* My Groups & My Events - Half Width Row */}
          <View style={styles.cardRow}>
            <Pressable
              style={({ pressed }) => [styles.cardWrapperHalf, pressed && styles.cardPressed]}
              onPress={() => router.push('/my-groups')}
            >
              <View
                style={[
                  styles.cardInnerGlass,
                  USE_EXPERIMENTAL_CARD_COLORS && { backgroundColor: experimentalCardColors[2] },
                ]}
              >
                <GlobalText style={styles.cardTitleHalf}>My Groups</GlobalText>
              </View>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.cardWrapperHalf, pressed && styles.cardPressed]}
              onPress={() => router.push('/my-events')}
            >
              <View
                style={[
                  styles.cardInnerGlass,
                  USE_EXPERIMENTAL_CARD_COLORS && { backgroundColor: experimentalCardColors[0] },
                ]}
              >
                <GlobalText style={styles.cardTitleHalf}>My Events</GlobalText>
              </View>
            </Pressable>
          </View>
          {/* Find an Event - Medium */}
          <Pressable
            style={({ pressed }) => [
              styles.cardWrapperMedium,
              pressed && styles.cardPressed,
            ]}
            onPress={() => router.push('/events')}
          >
            <View
              style={[
                styles.cardInnerGlass,
                USE_EXPERIMENTAL_CARD_COLORS && {
                  backgroundColor: experimentalCardColors[0],
                },
              ]}
            >
              <GlobalText style={styles.cardTitle}>Find an Event</GlobalText>
              <GlobalText style={styles.cardDescription}>
                Discover campus events and activities.
              </GlobalText>
            </View>
          </Pressable>

          {/* Campus Map - Medium */}
          <Pressable
            style={({ pressed }) => [
              styles.cardWrapperMedium,
              pressed && styles.cardPressed,
            ]}
            onPress={() => router.push('/campus-map')}
          >
            <View
              style={[
                styles.cardInnerGlass,
                USE_EXPERIMENTAL_CARD_COLORS && {
                  backgroundColor: experimentalCardColors[1],
                },
              ]}
            >
              <GlobalText style={styles.cardTitle}>Campus Map</GlobalText>
              <GlobalText style={styles.cardDescription}>
                Navigate buildings and facilities.
              </GlobalText>
            </View>
          </Pressable>

          {/* Join a group - Medium */}
          <Pressable
            style={({ pressed }) => [
              styles.cardWrapperMedium,
              pressed && styles.cardPressed,
            ]}
            onPress={() => router.push('/groups')}
          >
            <View
              style={[
                styles.cardInnerGlass,
                USE_EXPERIMENTAL_CARD_COLORS && {
                  backgroundColor: experimentalCardColors[2],
                },
              ]}
            >
              <GlobalText style={styles.cardTitle}>Join a Group</GlobalText>
              <GlobalText style={styles.cardDescription}>
                Connect with student organizations.
              </GlobalText>
            </View>
          </Pressable>

          {/* Reserve a study room - Medium */}
          <Pressable
            style={({ pressed }) => [
              styles.cardWrapperMedium,
              pressed && styles.cardPressed,
            ]}
            onPress={() => router.push('/studyrooms')}
          >
            <View
              style={[
                styles.cardInnerGlass,
                USE_EXPERIMENTAL_CARD_COLORS && {
                  backgroundColor: experimentalCardColors[3],
                },
              ]}
            >
              <GlobalText style={styles.cardTitle}>Study Rooms</GlobalText>
              <GlobalText style={styles.cardDescription}>
                Reserve spaces for studying.
              </GlobalText>
            </View>
          </Pressable>

          {/* Today's events moved above */}
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
    paddingTop: 30,
    paddingBottom: 24,
  },

  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
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
  cardWrapperHalf: {
    flex: 1,
    height: 100,
    borderRadius: 32,
    overflow: 'hidden',
  },
  cardWrapperFull: {
    width: '100%',
    height: 120,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardWrapperMedium: {
    width: '100%',
    height: 100,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 16,
  },
  cardWrapperShort: {
    width: '100%',
    height: 60,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 16,
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
  cardTextWhite: {
    fontSize: 18,
    fontWeight: '900',
    color: '#000000ff',
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  cardTitleHalf: {
    fontSize: 21,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 0,
  },
  cardDescription: {
    fontSize: 15,
    fontWeight: '400',
    color: '#ffffffff',
    opacity: 0.9,
  },

  todayBlur: {
    marginBottom: 16,
    borderRadius: 32,
    overflow: 'hidden',
  },
  todayCard: {
    padding: 20,
    borderRadius: 32,
    backgroundColor: 'rgba(84, 169, 32, 0.54)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.85)',
  },
  todayTitle: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    color: '#ffffffff',
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
    backgroundColor: '#af7a4eff',
  },
  eventTextBlock: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    color: '#ffffffff',
  },
  eventTime: {
    fontSize: 15,
    color: '#ffffffff',
    marginTop: 2,
  },
  cardInnerGlass: {
    flex: 1,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
    overflow: 'hidden',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  // Temporary experimental accent strip for trial colors
  cardAccentTrial: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 14,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    opacity: 0.9,
  },
});
