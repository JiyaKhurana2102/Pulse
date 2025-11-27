import { Asset } from 'expo-asset';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CalendarScreen() {
  const router = useRouter();

  const openLocalPdf = async (assetPath: string) => {
    try {
      // Resolve the correct asset from app/assets and open it via webview route
      const assetModule =
        assetPath === 'spring'
          ? require('./assets/Academic_Calendar_Spring_2026.pdf')
          : require('./assets/Academic Calendar Fall 2026.pdf');
      const asset = Asset.fromModule(assetModule);
      await asset.downloadAsync();
      const localUri = asset.localUri || asset.uri;
      // encode as a safe URI (preserves file:// but escapes spaces/special chars)
      const safeUri = encodeURI(localUri);
      // Use Expo WebBrowser to open PDFs in-app (reliable across platforms)
      await WebBrowser.openBrowserAsync(safeUri);
    } catch (err) {
      console.error('Open PDF error', err);
      alert('Unable to open file');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Academic Calendar</Text>
      </View>

      <View style={styles.list}>
        <TouchableOpacity style={[styles.item, styles.springItem]} onPress={() => openLocalPdf('spring')}>
          <Text style={[styles.itemTitle, styles.itemTitleLight]}>Spring 2026</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.item, styles.fallItem]} onPress={() => openLocalPdf('fall')}>
          <Text style={[styles.itemTitle, styles.itemTitleLight]}>Fall 2026</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    height: 68,
    paddingTop: 20,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  backBtn: { padding: 8 },
  backText: { color: '#5cc4a4', fontWeight: '700' },
  title: { flex: 1, textAlign: 'center', fontWeight: '700' },
  list: { padding: 20 },
  item: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)',
  },
  springItem: {
    backgroundColor: '#ff9966',
    borderColor: 'rgba(0,0,0,0.06)',
  },
  fallItem: {
    backgroundColor: '#b8e6b8',
    borderColor: 'rgba(0,0,0,0.06)',
  },
  itemTitleLight: {
    color: '#fff',
  },
  itemTitle: { fontSize: 16, fontWeight: '700' },
});
