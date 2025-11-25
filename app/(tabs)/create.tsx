import { Brand } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
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
  Text,
  TextInput,
  View
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

// match Settings accent color
const SETTINGS_ACCENT_COLOR = '#46e0e0ff';

// --- SCREENS ---
const SCREENS = {
  SELECTION: 'selection',
  NEW_GROUP: 'new_group',
  NEW_EVENT: 'new_event',
} as const;

/* --- Primary button used in forms (bottom action) --- */
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
      <View style={styles.buttonContent}>
        <Text style={styles.mobileButtonText}>{children}</Text>
        <Ionicons name="chevron-forward-outline" size={24} color="#111827" />
      </View>
    </Pressable>
  );
};

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
          {/* Back Button */}
          <Pressable onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={SETTINGS_ACCENT_COLOR} />
          </Pressable>

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
          </ScrollView>

          <MobileButton onPress={handleCreateGroup} disabled={!!message}>
            Create Group
          </MobileButton>
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
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.innerContainer}>
          {/* Back Button */}
          <Pressable onPress={onBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={28} color={SETTINGS_ACCENT_COLOR} />
          </Pressable>

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

              <Pressable onPress={() => setShowPicker(true)} style={styles.timeBubble}>
                <Text style={[styles.timeText, { fontSize: 16 }]}>
                  {date.toDateString()}{' '}
                  {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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

/* --- Settings-style card reused on Create screen --- */
interface CreateCardProps {
  iconName: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}

const CreateCard: React.FC<CreateCardProps> = ({ iconName, label, onPress }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.settingsCardContainer,
      pressed && { transform: [{ scale: 0.98 }] },
    ]}
  >
    <Ionicons
      name={iconName}
      size={28}
      color={SETTINGS_ACCENT_COLOR}
      style={styles.settingsCardIcon}
    />
    <View style={styles.settingsCardTextWrapper}>
      <Text style={styles.settingsCardText}>{label}</Text>
    </View>
    <Ionicons name="chevron-forward-outline" size={24} color="black" />
  </Pressable>
);

/* --- Selection Screen --- */
const SelectionScreen = ({ navigate }: { navigate: (screen: (typeof SCREENS)[keyof typeof SCREENS]) => void }) => (
  <View style={styles.selectionContainer}>
    <Text style={styles.pageTitle}>Bring your campus to life</Text>
    <Text style={styles.pageSubtitle}>Pick what you want to create</Text>

    <View style={styles.selectionList}>
      <CreateCard
        iconName="people-outline"
        label="New group"
        onPress={() => navigate(SCREENS.NEW_GROUP)}
      />
      <CreateCard
        iconName="calendar-outline"
        label="New event"
        onPress={() => navigate(SCREENS.NEW_EVENT)}
      />
    </View>
  </View>
);

/* --- MAIN SCREEN (Create tab) --- */
export default function App() {
  const [currentScreen, setCurrentScreen] = useState<(typeof SCREENS)[keyof typeof SCREENS]>(
    SCREENS.SELECTION,
  );

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
      style={{ flex: 1 }}
    >
      <SafeAreaView style={styles.fullScreenSafeArea}>{renderScreen()}</SafeAreaView>
    </LinearGradient>
  );
}

/* --- STYLES --- */
const styles = StyleSheet.create({
  fullScreenSafeArea: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },

  container: { flex: 1, backgroundColor: 'transparent' },
  flex: { flex: 1 },
  innerContainer: { flex: 1, padding: 18, position: 'relative' },

  backButton: {
    position: 'absolute',
    top: 1,
    left: 20,
    zIndex: 10,
    padding: 8,
  },

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
  messageText: {
    color: '#fefefeff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Inter_400Regular',
  },

  // Forms content - aligned at consistent height
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingBottom: 24,
  },

  titleInput: {
    width: '100%',
    fontSize: 36,
    fontWeight: '300',
    textAlign: 'center',
    color: TEXT_COLOR_DARK,
    marginBottom: 6,
    fontFamily: 'Inter_400Regular',
  },
  titleDivider: {
    height: 1,
    width: '75%',
    alignSelf: 'center',
    marginBottom: 18,
    backgroundColor: ACCENT_COLOR_DARK + '80',
  },

  label: {
    fontSize: 20,
    fontWeight: '300',
    marginBottom: 8,
    color: TEXT_COLOR_DARK,
    fontFamily: 'Inter_400Regular',
  },

  textArea: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: ACCENT_COLOR_DARK + '40',
    backgroundColor: ACCENT_COLOR_LIGHT + '60',
    marginBottom: 12,
    fontFamily: 'Inter_400Regular',
  },

  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginTop: 8,
    borderRadius: 999,
    backgroundColor: ACCENT_COLOR_LIGHT,
    borderWidth: 1,
    borderColor: ACCENT_COLOR_DARK + '40',
  },
  toggleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_COLOR_DARK,
    fontFamily: 'Inter_400Regular',
  },

  mobileButton: {
    width: '90%',
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.75)',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    minHeight: 52,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  mobileButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Inter_400Regular',
    flex: 1,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonPressed: { transform: [{ scale: 0.995 }] },

  selectionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingBottom: 80,
    paddingHorizontal: 22,
  },
  selectionList: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: '300',
    marginTop: 8,
    marginBottom: 12,
    color: TEXT_COLOR_DARK,
    fontFamily: 'Inter_400Regular',
  },
  pageSubtitle: {
    fontSize: 18,
    fontWeight: '300',
    marginBottom: 20,
    color: TEXT_COLOR_DARK,
    fontFamily: 'Inter_400Regular',
  },

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
  calendarMonth: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_COLOR_DARK,
    marginBottom: 12,
    fontFamily: 'Inter_700Bold',
  },

  timeBubble: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeText: {
    color: Brand.orange,
    fontWeight: '700',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },

  // --- Settings-style card styles (copied from Settings screen) ---
  settingsCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  settingsCardIcon: {
    marginRight: 15,
    backgroundColor: 'rgba(0,0,0,0.06)',
    padding: 5,
    borderRadius: 50,
  },
  settingsCardTextWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 15,
  },
  settingsCardText: {
    color: '#111827',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Inter_400Regular',
  },
});
