import { BotMessage, sendChatbotMessage } from '@/services/chatbot';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import 'react-native-gesture-handler'; // Must be at the top
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MessagesScreen() {
  const [messages, setMessages] = useState<BotMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [botTyping, setBotTyping] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const insets = useSafeAreaInsets();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const sessionIdRef = useRef<string>('sess_' + Date.now().toString(36));

  useEffect(() => {
    setMessages([
      { id: 'welcome', text: 'Hi! I am UTD Guide. Ask me about parking, dining, events, groups, study rooms, or the campus map.', from: 'bot', createdAt: Date.now() },
    ]);
  }, []);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setKeyboardVisible(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setKeyboardVisible(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('@chatbot_history');
        if (raw) {
          const history: BotMessage[] = JSON.parse(raw);
          setMessages(history);
          return;
        }
      } catch {}
      setMessages([
        { id: 'welcome', text: 'Hi! I am UTD Guide. Ask me about parking, dining, events, groups, study rooms, or the campus map.', from: 'bot', createdAt: Date.now() },
      ]);
    })();
  }, []);

  const pushMessage = (m: BotMessage, shouldScroll = false) => {
    setMessages(prev => [...prev, m]);
    if (shouldScroll) {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const userMsg: BotMessage = { id: 'u_' + Date.now(), text, from: 'user', createdAt: Date.now() };
    pushMessage(userMsg, false);
    setInput('');
    setLoading(true);
    setBotTyping(true);
    try {
      const { reply, suggestions: sugg } = await sendChatbotMessage(text, sessionIdRef.current);
      pushMessage({ id: 'b_' + Date.now(), text: reply, from: 'bot', createdAt: Date.now() }, true);
      setSuggestions(sugg);
    } catch (e: any) {
      pushMessage({ id: 'b_err_' + Date.now(), text: e.message || 'Chatbot unavailable.', from: 'bot', createdAt: Date.now() }, true);
      setSuggestions(['help','events today','parking']);
    } finally {
      setLoading(false);
      setBotTyping(false);
    }
  };

  return (
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
              }}
            />
          )}
        />
      </SafeAreaView>
    </LinearGradient>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  flex: { flex: 1 },
  loading: { position: 'absolute', top: 12, right: 12, zIndex: 10 },
  chatWrapper: { flex: 1 },
  chatContent: { paddingHorizontal: 16, gap: 8, paddingTop: 8 },
  chatContentBottom: { flexGrow: 1, justifyContent: 'flex-end', paddingBottom: 16 },
  bubble: { maxWidth: '80%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleMine: { alignSelf: 'flex-end', backgroundColor: '#0b84ff' },
  bubbleOther: { alignSelf: 'flex-start', backgroundColor: '#2c9e6f' },
  typingBubble: { alignSelf: 'flex-start', backgroundColor: '#2c9e6f80' },
  senderText: { color: '#ffffff', opacity: 0.95, fontSize: 12, marginBottom: 4, fontFamily: 'Inter_700Bold' },
  bubbleText: { color: '#ffffff', fontFamily: 'Inter_400Regular' },
  timeText: { color: '#ffffff', opacity: 0.85, fontSize: 12, marginTop: 4, fontFamily: 'Inter_400Regular' },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 12, paddingTop: 10, paddingBottom: 10, borderTopWidth: 1, borderTopColor: '#ddd', backgroundColor: '#fff' },
  input: { flex: 1, backgroundColor: '#ffffff', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10, fontFamily: 'Inter_400Regular', color: '#111827' },
  sendButton: { backgroundColor: '#5cc4a4', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 10 },
  sendText: { color: '#fff', fontFamily: 'Inter_700Bold' },
  clearButton: { backgroundColor: '#dc2626', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10 },
  clearText: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 12 },
  suggestionRow: { paddingHorizontal: 12, paddingTop: 4 },
  suggestionContent: { gap: 8 },
  suggestionChip: { backgroundColor: '#11182710', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, borderColor: '#5cc4a4' },
  suggestionText: { color: '#0b5d44', fontFamily: 'Inter_500Medium', fontSize: 12 },
});
