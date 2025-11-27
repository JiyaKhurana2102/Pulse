import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function WebViewScreen() {
  const { url = '', title = '' } = useLocalSearchParams<{ url?: string; title?: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  if (!url) {
    return (
      <View style={styles.center}>
        <Text style={styles.msg}>No URL provided</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}> 
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text numberOfLines={1} style={styles.title}>{decodeURIComponent((title as string) || '') || 'Browser'}</Text>
      </View>

      <WebView
        source={{ uri: decodeURIComponent(url as string) }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        startInLoadingState
        style={styles.webview}
      />

      {loading && (
        <View style={styles.loadingOverlay} pointerEvents="none">
          <ActivityIndicator size="large" color="#5cc4a4" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 68,
    paddingTop: 20,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    backgroundColor: '#fff',
  },
  backBtn: {
    padding: 8,
  },
  backText: { color: '#5cc4a4', fontWeight: '700' },
  title: { flex: 1, textAlign: 'center', fontWeight: '700', marginRight: 40 },
  webview: { flex: 1 },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 68,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)'
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  msg: { marginBottom: 12 }
});
