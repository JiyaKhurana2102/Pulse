import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const StudyRoomsScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safe}>
      <WebView 
        source={{ uri: 'https://libcal.utdallas.edu/allspaces' }}
        style={styles.webview}
        startInLoadingState={true} // show loading indicator
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  webview: {
    flex: 1,
  },
});

export default StudyRoomsScreen;
