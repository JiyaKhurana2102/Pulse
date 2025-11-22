import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';

export default function CampusMapScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      
      {/* Top header with back button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Campus Map</Text>
      </View>

      {/* In-app browser loading UTD Map */}
      <WebView 
        source={{ uri: 'https://map.utdallas.edu/' }} 
        style={{ flex: 1 }} 
      />
    </View>
  );
}

// ---- Styles ----
const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#CCF5FF', // matches your light blue blocks
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 10,
    gap: 10,
  },
  backButton: {
    fontSize: 18,
    fontFamily: 'Lora',
    color: '#1E1E1E',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: 'Lora',
    color: '#1E1E1E',
    fontWeight: '700',
  },
});
