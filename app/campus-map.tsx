import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function CampusMapScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
      {/* Top header (back button removed - was a fake control) */}
      <View style={{ ...styles.header, backgroundColor: 'transparent' }}>
        <Text style={styles.headerTitle}>Campus Map</Text>
      </View>

      {/* In-app browser loading UTD Map */}
      <WebView 
        source={{ uri: 'https://map.utdallas.edu/' }} 
        style={{ flex: 1 }} 
      />
    </SafeAreaView>
  );
}

// ---- Styles ----
const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#CCF5FF', // matches your light blue blocks
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    gap: 10,
  },
  backButton: {
    fontSize: 18,
    fontFamily: 'Lora_400Regular',
    color: '#1E1E1E',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Lora_700Bold',
    color: '#1E1E1E',
    fontWeight: '700',
  },
});
