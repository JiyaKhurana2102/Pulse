import { Tabs } from 'expo-router';
import React from 'react'; // Removed useState and useEffect
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text as RNText } from 'react-native'; // Removed View, ActivityIndicator, * as Font

// --- Constants ---
const ACCENT_COLOR = '#4DB6AC';
const TAB_ICON_SIZE = 24;

// --- Optional: override Text globally ---
// NOTE: Since the font is loaded in RootLayout, this CustomText will now work.
const CustomText = (props: any) => <RNText {...props} style={[{ fontFamily: 'Lora' }, props.style]} />;

export default function TabLayout() {
  // ❌ REMOVED: const [fontsLoaded, setFontsLoaded] = useState(false);
  
  // ❌ REMOVED: useEffect to load fonts. The font is loaded by the RootLayout.
  /*
  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Lora: require('../../assets/fonts/Lora-Regular.ttf'), 
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);
  */

  // ❌ REMOVED: The loading screen logic. The RootLayout handles the loading screen.
  /*
  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  */

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: ACCENT_COLOR,
        headerShown: false,
        tabBarLabelStyle: { fontFamily: 'Lora', fontSize: 12 }, // Tab labels now use Lora
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Add',
          tabBarIcon: ({ color }) => (
            <Ionicons name="add-circle-outline" size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => (
            <Ionicons name="search-outline" size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbox-outline" size={TAB_ICON_SIZE} color={color} />
          ),
        }}
      />
      <Tabs.Screen name="modal" options={{ headerShown: false, href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});