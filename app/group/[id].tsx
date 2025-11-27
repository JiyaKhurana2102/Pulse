import { ChatMessage, getMessages, sendMessage } from '@/services/chat';
import { getUserId, listGroups } from '@/services/groups';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GroupChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [uid, setUid] = useState<string>('');
  const [groupName, setGroupName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const pollStoppedRef = useRef(false);
  const intervalRef = useRef<number | null>(null);

  const loadMessages = async () => {
    if (pollStoppedRef.current) return;
    try {
      const msgs = await getMessages(id);
      setMessages(msgs);
    } catch (error: any) {
      // Stop polling if no auth or invalid token to prevent spam
      const msg = error?.message || '';
      if (msg === 'NO_AUTH' || msg === 'FORBIDDEN' || /invalid|expired/i.test(msg) || /must be a member/i.test(msg)) {
        if (intervalRef.current !== null) clearInterval(intervalRef.current);
        pollStoppedRef.current = true;
        console.log('Polling stopped due to auth/membership issue.');
        try {
          // Optionally navigate back to avoid showing stale chat
          router.back();
        } catch {}
        return;
      }
      console.error('Failed to load messages:', error);
    }
  };

  useEffect(() => {
    (async () => {
      const userId = await getUserId();
      setUid(userId);
      // fetch group name for header
      try {
        const groups = await listGroups();
        const g = groups.find(x => x.id === id);
        if (g?.name) setGroupName(g.name);
      } catch {}
      
      await loadMessages();

      // Poll for new messages every 3 seconds (only if not stopped)
      intervalRef.current = setInterval(loadMessages, 3000) as unknown as number;
      return () => {
        if (intervalRef.current !== null) clearInterval(intervalRef.current);
        pollStoppedRef.current = true;
      };
    })();
  }, [id]);

  useEffect(() => {
    const sub = Keyboard.addListener('keyboardDidShow', () => {
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    });
    return () => sub.remove();
  }, []);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    
    setLoading(true);
    try {
      await sendMessage(id, text);
      setInput('');
      await loadMessages(); // Reload to get the new message
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    } catch (error: any) {
      console.error('Failed to send message:', error);
      alert(`Failed to send message: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#FFFFFF','#FFF7ED','#FED7AA','#D1FAE5','#ECFEFF','#FFFFFF']} locations={[0,0.2,0.4,0.6,0.8,1]} start={{x:0.5,y:0}} end={{x:0.5,y:1}} style={{flex:1}}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS==='ios'?'padding':undefined}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} style={styles.backPill}><Text style={styles.backText}>Back</Text></Pressable>
            <Text style={styles.title}>{groupName || 'Group Chat'}</Text>
            <View style={{ width: 60 }} />
          </View>
          <ScrollView ref={scrollRef} contentContainerStyle={styles.chatContent} onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}>
            {messages.map(m => {
              const isSystem = m.type === 'system' || m.userId === 'system';
              if (isSystem) {
                return (
                  <View key={m.id} style={{ width: '100%', alignItems: 'center', paddingVertical: 4 }}>
                    <Text style={styles.systemText}>{m.text}</Text>
                  </View>
                );
              }
              return (
                <View key={m.id} style={[styles.bubble, m.userId===uid? styles.bubbleMine: styles.bubbleOther]}>
                  <Text style={styles.senderText}>{m.userId===uid ? `You (${m.senderName})` : m.senderName}</Text>
                  <Text style={styles.bubbleText}>{m.text}</Text>
                  <Text style={styles.timeText}>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                </View>
              );
            })}
          </ScrollView>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              value={input}
              onChangeText={setInput}
              placeholder="Message"
              placeholderTextColor="#11182799"
              onSubmitEditing={handleSend}
              returnKeyType="send"
              onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50)}
            />
            <Pressable onPress={handleSend} style={styles.sendButton} disabled={loading}>
              <Text style={styles.sendText}>{loading ? '...' : 'Send'}</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  flex: { flex: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  backPill: { backgroundColor: '#5cc4a4', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8 },
  backText: { color: '#fff', fontFamily: 'Inter_700Bold' },
  title: { fontSize: 20, fontFamily: 'Inter_700Bold', color: '#111827' },
  chatContent: { paddingHorizontal: 16, paddingBottom: 16, gap: 8 },
  bubble: { maxWidth: '80%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleMine: { alignSelf: 'flex-end', backgroundColor: '#ff9966' },
  bubbleOther: { alignSelf: 'flex-start', backgroundColor: '#b8e6b8' },
  senderText: { color: '#ffffff', opacity: 0.95, fontSize: 12, marginBottom: 4, fontFamily: 'Inter_700Bold' },
  bubbleText: { color: '#ffffff', fontFamily: 'Inter_400Regular' },
  timeText: { color: '#ffffff', opacity: 0.85, fontSize: 12, marginTop: 4, fontFamily: 'Inter_400Regular' },
  systemText: { color: '#4B5563', fontSize: 12, fontFamily: 'Inter_600SemiBold', backgroundColor: 'rgba(0,0,0,0.05)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  inputRow: { flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12 },
  input: { flex: 1, backgroundColor: '#ffffff', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 10, fontFamily: 'Inter_400Regular', color: '#111827' },
  sendButton: { backgroundColor: '#5cc4a4', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 10 },
  sendText: { color: '#fff', fontFamily: 'Inter_700Bold' },
});
