import { Brand } from '@/constants/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// --- STYLING CONSTANTS ---
const BACKGROUND_COLOR = '#d5fcffff'; // Light mint/teal background
const ACCENT_COLOR_LIGHT = '#c9f9fdff'; // Lighter teal for buttons
const ACCENT_COLOR_DARK = '#71f3ffff'; // Darker teal for borders/accents
const TEXT_COLOR_DARK = '#000000ff'; // Dark gray for primary text
const TEXT_COLOR_MINT = '#bbe8e2ff'; // Mint color for selected date
const TEXT_COLOR_WHITE = '#FFFFFF';

// --- SCREENS ---
const SCREENS = {
  SELECTION: 'selection',
  NEW_GROUP: 'new_group',
  NEW_EVENT: 'new_event',
};

/* --- Buttons --- */
const MobileButton = ({ children, onPress, disabled = false, style }: any) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.mobileButton,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
        style,
      ]}
    >
      <Text style={styles.mobileButtonText}>{children}</Text>
    </Pressable>
  );
};

const BackButton = ({ onPress }: { onPress: () => void }) => (
  <Pressable onPress={onPress} style={styles.backButton}>
    <Text style={styles.backButtonText}>{'‹'}</Text>
  </Pressable>
);

/* --- New Group Form --- */
const NewGroupForm = ({ onBack }: { onBack: () => void }) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [inviteNeeded, setInviteNeeded] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleCreateGroup = () => {
    setMessage(`Group "${groupName || 'Untitled Group'}" Created!`);
    setTimeout(() => {
      setMessage(null);
      onBack();
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.innerContainer}>
          <BackButton onPress={onBack} />

          {message && (
            <View style={styles.messageOverlay}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          )}

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <TextInput
              value={groupName}
              onChangeText={setGroupName}
              placeholder="(Group Name)"
              placeholderTextColor="#6B7280"
              style={styles.titleInput}
            />

            <View style={styles.titleDivider} />

            <Text style={styles.label}>Group description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder=""
              multiline
              numberOfLines={4}
              style={styles.textArea}
              textAlignVertical="top"
            />

            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>Invite needed</Text>
              <Switch
                value={inviteNeeded}
                onValueChange={setInviteNeeded}
                trackColor={{ false: '#9CA3AF', true: ACCENT_COLOR_DARK }}
                thumbColor={inviteNeeded ? '#ffffff' : '#ffffff'}
              />
            </View>
          </ScrollView>

          <MobileButton onPress={handleCreateGroup} disabled={!!message} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/* --- New Event Form --- */
const NewEventForm = ({ onBack }: { onBack: () => void }) => {
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleScheduleEvent = () => {
    setMessage(`Event "${eventName || 'Untitled Event'}" Scheduled!`);
    setTimeout(() => {
      setMessage(null);
      onBack();
    }, 1500);
  };

  const onChange = (event: any, selectedDate?: Date) => {
    setShowPicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.innerContainer}>
          <BackButton onPress={onBack} />

          {message && (
            <View style={styles.messageOverlay}>
              <Text style={styles.messageText}>{message}</Text>
            </View>
          )}

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <TextInput
              value={eventName}
              onChangeText={setEventName}
              placeholder="(Event Name)"
              placeholderTextColor="#6B7280"
              style={styles.titleInput}
            />

            <View style={styles.titleDivider} />

            <Text style={styles.label}>Event description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder=""
              multiline
              numberOfLines={3}
              style={styles.textArea}
              textAlignVertical="top"
            />

            {/* --- Calendar Card --- */}
            <View style={styles.calendarCard}>
              <Text style={styles.calendarMonth}>Select Date & Time</Text>

              <Pressable
                onPress={() => setShowPicker(true)}
                style={styles.timeBubble}
              >
                <Text style={[styles.timeText, { fontSize: 16 }]}>
                  {date.toDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </Pressable>

              {showPicker && (
                <DateTimePicker
                  value={date}
                  mode="datetime"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onChange}
                  minimumDate={new Date()}
                />
              )}
            </View>
          </ScrollView>

          <MobileButton onPress={handleScheduleEvent} disabled={!!message}>
            Schedule Event
          </MobileButton>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/* --- Selection Screen --- */
const SelectionScreen = ({ navigate }: { navigate: (screen: string) => void }) => (
  <View style={styles.selectionContainer}>
    <Text style={styles.pageTitle}>Create New</Text>
    <Text style={styles.pageSubtitle}>Choose one of the following:</Text>

    <MobileButton onPress={() => navigate(SCREENS.NEW_GROUP)} style={{ marginBottom: 12 }}>
      New group
    </MobileButton>

    <MobileButton onPress={() => navigate(SCREENS.NEW_EVENT)}>New event</MobileButton>
  </View>
);

/* --- MAIN APP --- */
export default function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.SELECTION);

  const renderScreen = () => {
    switch (currentScreen) {
      case SCREENS.SELECTION:
        return <SelectionScreen navigate={setCurrentScreen} />;
      case SCREENS.NEW_GROUP:
        return <NewGroupForm onBack={() => setCurrentScreen(SCREENS.SELECTION)} />;
      case SCREENS.NEW_EVENT:
        return <NewEventForm onBack={() => setCurrentScreen(SCREENS.SELECTION)} />;
      default:
        return null;
    }
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#FFF7ED', '#FED7AA', '#D1FAE5', '#ECFEFF', '#FFFFFF']}
      locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.appRoot}
    >
      <View style={[styles.mobileFrame, { backgroundColor: 'rgba(255,255,255,0.75)' }]}>{renderScreen()}</View>
      <Text style={styles.footerNote}>Pulse</Text>
    </LinearGradient>
  );
}

/* --- STYLES --- */
const styles = StyleSheet.create({
  appRoot: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 8 },
  mobileFrame: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    overflow: 'hidden',
    height: '90%',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  footerNote: { marginTop: 8, fontSize: 12, color: '#6B7280', fontFamily: 'Lora' },

  container: { flex: 1, backgroundColor: 'transparent' },
  flex: { flex: 1 },
  innerContainer: { flex: 1, padding: 18, position: 'relative' },

  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
    backgroundColor: ACCENT_COLOR_DARK,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  backButtonText: { color: TEXT_COLOR_WHITE, fontSize: 22, fontWeight: '600', fontFamily: 'Lora' },

  messageOverlay: {
    position: 'absolute',
    top: '45%',
    left: '10%',
    right: '10%',
    backgroundColor: '#16A34A',
    padding: 14,
    borderRadius: 12,
    zIndex: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageText: { color: '#fff', fontSize: 16, fontWeight: '600', fontFamily: 'Lora' },

  scrollContent: { paddingTop: 48, paddingBottom: 12 },

  titleInput: {
    width: '100%',
    fontSize: 36,
    fontWeight: '300',
    textAlign: 'center',
    color: TEXT_COLOR_DARK,
    marginBottom: 6,
    fontFamily: 'Lora',
  },
  titleDivider: { height: 1, width: '75%', alignSelf: 'center', marginBottom: 18, backgroundColor: ACCENT_COLOR_DARK + '80' },

  label: { fontSize: 20, fontWeight: '300', marginBottom: 8, color: TEXT_COLOR_DARK, fontFamily: 'Lora' },

  textArea: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: ACCENT_COLOR_DARK + '40',
    backgroundColor: ACCENT_COLOR_LIGHT + '60',
    marginBottom: 12,
    fontFamily: 'Lora',
  },

  toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, marginTop: 8, borderRadius: 999, backgroundColor: ACCENT_COLOR_LIGHT, borderWidth: 1, borderColor: ACCENT_COLOR_DARK + '40' },
  toggleLabel: { fontSize: 16, fontWeight: '600', color: TEXT_COLOR_DARK, fontFamily: 'Lora' },

  mobileButton: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.05)',
    elevation: 2,
  },
  mobileButtonText: { fontSize: 18, fontWeight: '700', color: Brand.orange, fontFamily: 'Lora' },
  buttonDisabled: { opacity: 0.5 },
  buttonPressed: { transform: [{ scale: 0.995 }] },

  selectionContainer: { flex: 1, alignItems: 'center', paddingTop: 28, paddingHorizontal: 22 },
  pageTitle: { fontSize: 40, fontWeight: '300', marginTop: 36, marginBottom: 12, color: TEXT_COLOR_DARK, fontFamily: 'Lora' },
  pageSubtitle: { fontSize: 18, fontWeight: '300', marginBottom: 20, color: TEXT_COLOR_DARK, fontFamily: 'Lora' },

  calendarCard: {
    marginTop: 18,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    elevation: 2,
    alignItems: 'center',
  },
  calendarMonth: { fontSize: 18, fontWeight: '700', color: TEXT_COLOR_DARK, marginBottom: 12, fontFamily: 'Lora' },

  timeBubble: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: { color: Brand.orange, fontWeight: '700', fontSize: 18, fontFamily: 'Lora' },
});
