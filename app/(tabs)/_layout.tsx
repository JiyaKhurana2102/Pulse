import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React from 'react';
import { Text as RNText, StyleSheet, View } from 'react-native';

// --- Constants ---
const ACCENT_COLOR = '#0F766E';
const TAB_ICON_SIZE = 26;
const TAB_GRADIENT = ['#99EAEA', '#D8B4FE', '#2DD4BF'] as const;
const TAB_ACTIVE_COLOR = '#FFFFFF';
const TAB_INACTIVE_COLOR = 'rgba(255,255,255,0.75)';


const CustomText = (props: any) => <RNText {...props} style={[{ fontFamily: 'Lora' }, props.style]} />;

export default function TabLayout() {


  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: TAB_ACTIVE_COLOR,
        tabBarInactiveTintColor: TAB_INACTIVE_COLOR,
        tabBarShowLabel: false, // hide text labels under icons

        tabBarStyle: {
          position: 'absolute',
          left: 5,
          right: 5,
          bottom: 30,
          height: 40,
          borderRadius: 24,
          borderTopWidth: 0,
          backgroundColor: 'transparent',
          elevation: 12,
          shadowColor: '#000',
          shadowOpacity: 0.18,
          shadowRadius: 14,
          shadowOffset: { width: 0, height: 8 },
        },

        tabBarBackground: () => (
          <LinearGradient
            colors={TAB_GRADIENT}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[StyleSheet.absoluteFill, { borderRadius: 24 }]}
          >
            <View style={styles.pillOverlay} pointerEvents="none" />
          </LinearGradient>
        ),

        tabBarIcon: ({ focused }) => {
          let name: keyof typeof Ionicons.glyphMap = 'ellipse-outline';
          switch (route.name) {
            case 'index':
              name = focused ? 'home' : 'home-outline';
              break;
            case 'settings':
              name = focused ? 'settings' : 'settings-outline';
              break;
            case 'create':
              name = focused ? 'add-circle' : 'add-circle-outline';
              break;
            case 'search':
              name = focused ? 'search' : 'search-outline';
              break;
            case 'messages':
              name = focused ? 'chatbubble-ellipses' : 'chatbubble-ellipses-outline';
              break;
            default:
              name = 'ellipse-outline';
          }

          return (
            <View style={styles.iconContainer}>
              {focused ? (
                <View style={styles.outerRing}>
                  <View style={styles.innerCircle} />
                </View>
              ) : null}
              <Ionicons
                name={name}
                size={TAB_ICON_SIZE}
                color={focused ? ACCENT_COLOR : ACCENT_COLOR}
                style={{ zIndex: 3 }}
              />
              {/* removed active dot — the white inner circle is sufficient */}
            </View>
          );
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
      <Tabs.Screen name="create" options={{ title: 'Add' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="messages" options={{ title: 'Chatbox' }} />
      {/* modal is provided by root Stack at app/_layout.tsx; remove from tabs to avoid duplicate route warnings */}
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pillOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 24,
    borderWidth: 1.25,
    borderColor: 'rgba(255,255,255,0.45)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: 0,
  },
  iconContainer: {
    width: 64,
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    width: 32,
    height: 32,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.6,
    borderColor: 'rgba(255,255,255,0.95)',
    backgroundColor: 'transparent',
    position: 'absolute',
    zIndex: 1,
  },
  innerCircle: {
    width: 28,
    height: 28,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});