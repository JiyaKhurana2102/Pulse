import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Bubble, Composer, GiftedChat, InputToolbar } from 'react-native-gifted-chat';
import { SafeAreaView } from 'react-native-safe-area-context';

const BACKEND_URL = Platform.OS === 'android' ? 'http://10.0.2.2:8080/chat' : 'http://localhost:8080/chat'; // adjust for Android emulator

export default function MessagesScreen() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Initial bot message
  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hi! I am UTD Guide. Ask me about parking, dining, events, or which app screen to open.',
        createdAt: new Date(),
        user: { _id: 2, name: 'UTD Guide' },
      },
    ]);
  }, []);

  const onSend = useCallback(async (newMessages: any[] = []) => {
    setMessages(prev => GiftedChat.append(prev, newMessages));
    const userMessage = newMessages[0].text;

    setLoading(true);
    try {
      const resp = await axios.post(BACKEND_URL, {
        messages: [{ role: 'user', content: userMessage }],
      });
      const botReply = resp.data.reply;

      setMessages(prev =>
        GiftedChat.append(prev, [
          {
            _id: Math.random().toString(36).substring(7),
            text: botReply,
            createdAt: new Date(),
            user: { _id: 2, name: 'UTD Guide' },
          },
        ])
      );
    } catch (err) {
      console.error(err);
      setMessages(prev =>
        GiftedChat.append(prev, [
          {
            _id: Math.random().toString(36).substring(7),
            text: "Sorry, I couldn't reach the server.",
            createdAt: new Date(),
            user: { _id: 2, name: 'UTD Guide' },
          },
        ])
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
    <LinearGradient
      colors={['#FFFFFF', '#FFF7ED', '#FED7AA', '#D1FAE5', '#ECFEFF', '#FFFFFF']}
      locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
      pointerEvents="box-none"
    >
      {loading && (
        <ActivityIndicator
          size="small"
          color="#0b84ff"
          style={{ position: 'absolute', top: 10, right: 10 }}
        />
      )}

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0} style={{ flex: 1 }}>
          <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{ _id: 1 }}
            minComposerHeight={55}
            renderBubble={props => (
              <Bubble
                {...props}
                wrapperStyle={{
                  right: { backgroundColor: '#0b84ff' },
                  left: { backgroundColor: 'white' },
                }}
              />
            )}
            renderInputToolbar={props => (
              <InputToolbar
                {...props}
                containerStyle={{
                  borderTopWidth: 1,
                  borderTopColor: '#ddd',
                  paddingTop: 6,
                  paddingBottom: Platform.OS === 'ios' ? 12 : 6,
                  marginBottom: Platform.OS === 'ios' ? 20 : 0, // Raise input bar
                }}
              />
            )}
            renderComposer={props => (
              <Composer
                {...props}
                textInputProps={{
                  placeholder: 'Type your message here...',
                  placeholderTextColor: '#999',
                  style: { fontSize: 16, minHeight: 50 },
                  editable: true,
                }}
              />
            )}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
