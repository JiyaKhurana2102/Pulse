// app/(tabs)/create.tsx
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

// --- STYLING CONSTANTS (matching your mint theme) ---
const BACKGROUND_COLOR = '#E0F2F1'; // Light mint/teal background
const ACCENT_COLOR_LIGHT = '#B2DFDB'; // Lighter teal for button background
const ACCENT_COLOR_DARK = '#4DB6AC'; // Darker teal for borders/accents
const TEXT_COLOR_DARK = '#303030'; // Dark gray for primary text
const TEXT_COLOR_MINT = '#26A69A'; // Mint color for headers
const TEXT_COLOR_WHITE = '#FFFFFF';

// --- SCREENS ---
const SCREENS = {
  SELECTION: 'selection',
  NEW_GROUP: 'new_group',
  NEW_EVENT: 'new_event',
};

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

          {/* Message Box */}
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

  const handleScheduleEvent = () => {
    setMessage(`Event "${eventName || 'Untitled Event'}" Scheduled!`);
    setTimeout(() => {
      setMessage(null);
      onBack();
    }, 1500);
  };

  const CalendarPlaceholder = () => {
    // Simple static "calendar" grid for display. Replace with a real calendar picker if desired.
    const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dates = Array.from({ length: 30 }, (_, i) => i + 1);

    return (
      <View style={styles.calendarCard}>
        <View style={styles.calendarHeader}>
          <Text style={styles.calendarMonth}>April 2025</Text>
          <View style={styles.calendarChevrons}>
            <Text style={styles.chev}>{'<'}</Text>
            <Text style={styles.chev}>{'>'}</Text>
          </View>
        </View>

        <View style={styles.weekRow}>
          {days.map((d) => (
            <Text key={d} style={styles.weekDay}>
              {d}
            </Text>
          ))}
        </View>

        <View style={styles.datesGrid}>
          {/* For simplicity, we leave some blank columns at start to imitate month offset */}
          <View style={{ width: SCREEN_WIDTH * 0.02 }} />
          {dates.map((dt) => {
            const isSelected = dt === 20;
            return (
              <View
                key={dt}
                style={[
                  styles.dateCell,
                  isSelected && styles.dateCellSelected,
                ]}
              >
                <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>
                  {dt}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.timeRow}>
          <Text style={styles.timeLabel}>Time</Text>
          <View style={styles.timeBubble}>
            <Text style={styles.timeText}>9:41 AM</Text>
          </View>
        </View>
      </View>
    );
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

            <CalendarPlaceholder />
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
const SelectionScreen = ({ navigate }: { navigate: (screen: string) => void }) => {
  return (
    <View style={styles.selectionContainer}>
      <Text style={styles.pageTitle}>Create New</Text>
      <Text style={styles.pageSubtitle}>Choose one of the following:</Text>

      <MobileButton onPress={() => navigate(SCREENS.NEW_GROUP)} style={{ marginBottom: 12 }}>
        New group
      </MobileButton>

      <MobileButton onPress={() => navigate(SCREENS.NEW_EVENT)}>New event</MobileButton>
    </View>
  );
};

/* --- MAIN APP COMPONENT --- */
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
    <View style={[styles.appRoot, { backgroundColor: BACKGROUND_COLOR }]}>
      <View style={styles.mobileFrame}>
        {renderScreen()}
      </View>
      <Text style={styles.footerNote}>Pulse</Text>
    </View>
  );
}

/* --- STYLES --- */
const styles = StyleSheet.create({
  appRoot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  mobileFrame: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#ffffff',
    borderRadius: 28,
    overflow: 'hidden',
    // occupy most of vertical space like your web layout
    height: '90%',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  footerNote: {
    marginTop: 8,
    fontSize: 12,
    color: '#6B7280',
  },

  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
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
  backButtonText: { color: TEXT_COLOR_WHITE, fontSize: 22, fontWeight: '600' },

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
  messageText: { color: '#fff', fontSize: 16, fontWeight: '600' },

  scrollContent: { paddingTop: 48, paddingBottom: 12 },

  titleInput: {
    width: '100%',
    fontSize: 36,
    fontWeight: '300',
    textAlign: 'center',
    color: TEXT_COLOR_DARK,
    marginBottom: 6,
  },
  titleDivider: {
    height: 1,
    width: '75%',
    alignSelf: 'center',
    marginBottom: 18,
    backgroundColor: ACCENT_COLOR_DARK + '80',
  },

  label: { fontSize: 20, fontWeight: '300', marginBottom: 8, color: TEXT_COLOR_DARK },

  textArea: {
    width: '100%',
    padding: 12,
    fontSize: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: ACCENT_COLOR_DARK + '40',
    backgroundColor: ACCENT_COLOR_LIGHT + '60',
    marginBottom: 12,
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
  toggleLabel: { fontSize: 16, fontWeight: '600', color: TEXT_COLOR_DARK },

  mobileButton: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ACCENT_COLOR_LIGHT,
    borderWidth: 2,
    borderColor: ACCENT_COLOR_DARK + '80',
    elevation: 2,
  },
  mobileButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_COLOR_DARK,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    transform: [{ scale: 0.995 }],
  },

  selectionContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 28,
    paddingHorizontal: 22,
  },
  pageTitle: { fontSize: 40, fontWeight: '300', marginTop: 36, marginBottom: 12, color: TEXT_COLOR_DARK },
  pageSubtitle: { fontSize: 18, fontWeight: '300', marginBottom: 20, color: TEXT_COLOR_DARK },

  /* Calendar styles */
  calendarCard: {
    marginTop: 18,
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: ACCENT_COLOR_DARK + '20',
    elevation: 2,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calendarMonth: { fontSize: 18, fontWeight: '700', color: TEXT_COLOR_DARK },
  calendarChevrons: { flexDirection: 'row', gap: 8 },
  chev: { fontSize: 16, color: ACCENT_COLOR_DARK, marginHorizontal: 6 },

  weekRow: {
    flexDirection: 'row',
    marginTop: 8,
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  weekDay: { fontSize: 12, fontWeight: '700', color: '#6B7280', flex: 1, textAlign: 'center' },

  datesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  dateCell: {
    width: (SCREEN_WIDTH * 0.8) / 7 - 6,
    height: 36,
    margin: 3,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateCellSelected: {
    backgroundColor: ACCENT_COLOR_DARK + '20',
    borderWidth: 1,
    borderColor: ACCENT_COLOR_DARK + '40',
  },
  dateText: { fontSize: 14, color: TEXT_COLOR_DARK },
  dateTextSelected: { color: TEXT_COLOR_MINT, fontWeight: '700' },

  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: BACKGROUND_COLOR,
    alignItems: 'center',
  },
  timeLabel: { fontSize: 16, fontWeight: '600', color: TEXT_COLOR_DARK },
  timeBubble: {
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: ACCENT_COLOR_DARK,
  },
  timeText: { color: TEXT_COLOR_WHITE, fontWeight: '700', fontSize: 16 },
});
