import { createEvent } from '@/services/events';
import { createGroup, getUserId, GroupRecord, joinGroup, listGroups } from '@/services/groups';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
const createCardColors = ['#ff9966', '#b8e6b8'];

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
  const categories = ['Academic','Sports','Creative','Social','Other'];
  const [category, setCategory] = useState<string>('Other');

  const handleCreateGroup = async () => {
    try {
      if (!groupName.trim() || !description.trim()) {
        setMessage('Name & description required');
        setTimeout(() => setMessage(null), 1500);
        return;
      }
      const userId = await getUserId();
      const groupId = await createGroup(groupName.trim(), description.trim(), category);
      await joinGroup(groupId, userId); // auto-join creator
      setMessage(`Group "${groupName.trim()}" Created!`);
      setTimeout(() => {
        setMessage(null);
        onBack();
      }, 1500);
    } catch (e: any) {
      setMessage(e.message || 'Error creating group');
      setTimeout(() => setMessage(null), 2000);
    }
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
            <Ionicons name="arrow-back" size={28} color="#fff" />
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
            <View style={[styles.cardContainerThin, { backgroundColor: '#ff9966' }]}>
              <Ionicons name="people" size={28} color="#fff" style={styles.cardIcon} />
              <TextInput
                value={groupName}
                onChangeText={setGroupName}
                placeholder="Group Name"
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={styles.cardInput}
              />
            </View>

            <View style={[styles.cardContainer, { backgroundColor: '#b8e6b8' }]}>
              <Ionicons name="document-text" size={28} color="#fff" style={styles.cardIcon} />
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Group description"
                placeholderTextColor="rgba(255,255,255,0.7)"
                multiline
                numberOfLines={4}
                style={[styles.cardInput, styles.cardTextArea]}
                textAlignVertical="top"
              />
            </View>

            {/* Category selector */}
            <View style={styles.categoryRow}>
              {categories.map(c => {
                const selected = category === c;
                return (
                  <Pressable
                    key={c}
                    onPress={() => setCategory(c)}
                    style={[styles.categoryChip, selected && styles.categoryChipSelected]}
                  >
                    <Text style={[styles.categoryChipText, selected && styles.categoryChipTextSelected]}>{c}</Text>
                  </Pressable>
                );
              })}
            </View>

            <MobileButton onPress={handleCreateGroup} disabled={!!message} style={styles.formActionWideSpaced}>
              Create Group
            </MobileButton>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

/* --- New Event Form --- */
const NewEventForm = ({ onBack }: { onBack: () => void }) => {
  const [location, setLocation] = useState('');
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [groups, setGroups] = useState<GroupRecord[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<GroupRecord | null>(null);
  const [showGroupPicker, setShowGroupPicker] = useState(false);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const allGroups = await listGroups();
      setGroups(allGroups);
      if (allGroups.length > 0 && !selectedGroup) {
        setSelectedGroup(allGroups[0]);
      }
    } catch (error) {
      console.error('Failed to load groups:', error);
    }
  };

  const handleScheduleEvent = async () => {
    try {
      if (!eventName.trim()) {
        setMessage('Event name required');
        setTimeout(() => setMessage(null), 1500);
        return;
      }
      if (!selectedGroup) {
        setMessage('Please select a group');
        setTimeout(() => setMessage(null), 1500);
        return;
      }
      await createEvent(
        eventName.trim(),
        description.trim(),
        date,
        selectedGroup.id, // groupId (required for backend)
        selectedGroup.name, // groupName for display
        location.trim() || undefined,
        undefined  // category
      );
      setMessage(`Event "${eventName.trim()}" Scheduled!`);
      setTimeout(() => {
        setMessage(null);
        onBack();
      }, 1500);
    } catch (e: any) {
      setMessage(e.message || 'Error creating event');
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const onChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
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
            <Ionicons name="arrow-back" size={28} color="#fff" />
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
            <View style={[styles.cardContainerThin, { backgroundColor: '#ff9966' }]}>
              <Ionicons name="calendar" size={28} color="#fff" style={styles.cardIcon} />
              <TextInput
                value={eventName}
                onChangeText={setEventName}
                placeholder="Event Name"
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={styles.cardInput}
              />
            </View>
            
            <TouchableOpacity
              onPress={() => setShowGroupPicker(true)}
              style={[styles.cardContainerThin, { backgroundColor: '#9b87f5' }]}
            >
              <Ionicons name="people" size={28} color="#fff" style={styles.cardIcon} />
              <Text style={styles.cardDateText}>
                {selectedGroup ? selectedGroup.name : 'Select Group'}
              </Text>
            </TouchableOpacity>

            <View style={[styles.cardContainerThin, { backgroundColor: '#b8e6b8' }]}>
              <Ionicons name="location" size={28} color="#fff" style={styles.cardIcon} />
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Location"
                placeholderTextColor="rgba(255,255,255,0.7)"
                style={styles.cardInput}
              />
            </View>

            <View style={[styles.cardContainer, { backgroundColor: '#f6a278' }]}>
              <Ionicons name="document-text" size={28} color="#fff" style={styles.cardIcon} />
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Event description"
                placeholderTextColor="rgba(255,255,255,0.7)"
                multiline
                numberOfLines={4}
                style={[styles.cardInput, styles.cardTextArea]}
                textAlignVertical="top"
              />
            </View>

            <TouchableOpacity
              onPress={() => setShowPicker(true)}
                style={[styles.cardContainerThin, { backgroundColor: '#5cc4a4' }]}
            >
              <Ionicons name="calendar" size={28} color="#fff" style={styles.cardIcon} />
              <View style={{ flex: 1 }}>
                <Text style={styles.cardDateText}>
                  {date.toDateString()}
                </Text>
                <Text style={[styles.cardDateText, { fontSize: 14, opacity: 0.9 }]}>
                  {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </TouchableOpacity>
            <MobileButton onPress={handleScheduleEvent} disabled={!!message} style={styles.formActionWideSpaced}>
              Schedule Event
            </MobileButton>
          </ScrollView>

          {showPicker && (
            <View style={styles.datePickerOverlay}>
              <View style={styles.datePickerInner}>
                <DateTimePicker
                  value={date}
                  mode="datetime"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onChange}
                  minimumDate={new Date()}
                  textColor="#000000"
                  style={Platform.OS === 'ios' ? styles.datePickerIOS : undefined}
                />
              </View>
              <Pressable onPress={() => setShowPicker(false)} style={styles.datePickerDone}>
                <Text style={styles.datePickerDoneText}>Done</Text>
              </Pressable>
            </View>
          )}

          {showGroupPicker && (
            <View style={styles.datePickerOverlay}>
              <View style={styles.datePickerInner}>
                <Text style={styles.pickerTitle}>Select Group</Text>
                <ScrollView style={styles.groupPickerScroll}>
                  {groups.map((group) => (
                    <TouchableOpacity
                      key={group.id}
                      onPress={() => {
                        setSelectedGroup(group);
                        setShowGroupPicker(false);
                      }}
                      style={[
                        styles.groupPickerItem,
                        selectedGroup?.id === group.id && styles.groupPickerItemSelected,
                      ]}
                    >
                      <Text style={styles.groupPickerItemText}>{group.name}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
              <Pressable onPress={() => setShowGroupPicker(false)} style={styles.datePickerDone}>
                <Text style={styles.datePickerDoneText}>Done</Text>
              </Pressable>
            </View>
          )}

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
  color: string;
}

const CreateCard: React.FC<CreateCardProps> = ({ iconName, label, onPress, color }) => (
  <Pressable
    onPress={onPress}
    style={({ pressed }) => [
      styles.settingsCardContainer,
      { backgroundColor: color },
      pressed && { transform: [{ scale: 0.98 }] },
    ]}
  >
    <Ionicons
      name={iconName}
      size={28}
      color="#fff"
      style={styles.settingsCardIcon}
    />
    <View style={styles.settingsCardTextWrapper}>
      <Text style={styles.settingsCardText}>{label}</Text>
    </View>
  </Pressable>
);

/* --- Selection Screen --- */
const SelectionScreen = ({ navigate }: { navigate: (screen: (typeof SCREENS)[keyof typeof SCREENS]) => void }) => (
  <View style={styles.selectionContainer}>
    <Text style={styles.pageTitle}>Bring your campus to life</Text>
    <Text style={styles.pageSubtitle}>Pick what you want to create</Text>

    <View style={styles.selectionList}>
      <CreateCard
        iconName="people"
        label="New group"
        onPress={() => navigate(SCREENS.NEW_GROUP)}
        color={createCardColors[0]}
      />
      <CreateCard
        iconName="calendar"
        label="New event"
        onPress={() => navigate(SCREENS.NEW_EVENT)}
        color={createCardColors[1]}
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
    top: -40,
    left: 20,
    zIndex: 10,
    padding: 12,
    backgroundColor: '#5cc4a4',
    borderRadius: 25,
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
  formActionButton: {
    marginTop: -8,
  },
  inlineActionButton: {
    marginTop: -4,
    marginVertical: 0,
  },
  formActionWideSpaced: {
    width: '100%',
    alignSelf: 'stretch',
    marginTop: 12,
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
    paddingTop: 30,
    paddingBottom: 80,
    paddingHorizontal: 22,
  },
  selectionList: {
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 12,
    color: '#111827',
    fontFamily: 'Inter_700Bold',
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
    color: '#000000',
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
    borderRadius: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 3,
    height: 100,
  },
  settingsCardIcon: {
    marginRight: 15,
  },
  settingsCardTextWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 15,
  },
  settingsCardText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },

  // --- Floating Label Styles ---
  floatingInputContainer: {
    position: 'relative',
    marginBottom: 28,
    width: '100%',
  },
  floatingInput: {
    width: '100%',
    padding: 16,
    fontSize: 18,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#5cc4a4',
    backgroundColor: 'rgba(255,255,255,0.9)',
    color: '#111827',
    fontFamily: 'Inter_400Regular',
  },
  floatingTextArea: {
    minHeight: 120,
    paddingTop: 28,
  },
  floatingLabel: {
    position: 'absolute',
    left: 16,
    top: 18,
    fontSize: 18,
    color: '#6B7280',
    backgroundColor: 'transparent',
    fontFamily: 'Inter_400Regular',
    pointerEvents: 'none',
  },
  floatingLabelActive: {
    top: -10,
    fontSize: 14,
    color: '#5cc4a4',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    fontWeight: '600',
  },

  // --- Bottom Sheet Styles ---
  topTitleInput: {
    width: '100%',
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
    fontFamily: 'Inter_700Bold',
    paddingHorizontal: 8,
  },
  bottomSheetCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 8,
  },
  sheetHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#D1D5DB',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 20,
  },
  sheetSectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    fontFamily: 'Inter_700Bold',
  },
  sheetInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  sheetIcon: {
    marginRight: 12,
    marginTop: 4,
  },
  sheetTextArea: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    fontFamily: 'Inter_400Regular',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardContainer: {
    borderRadius: 32,
    padding: 20,
    marginBottom: 20,
    minHeight: 100,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContainerThin: {
    borderRadius: 32,
    paddingVertical: 14,
    paddingHorizontal: 18,
    marginBottom: 16,
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    marginRight: 16,
  },
  cardInput: {
    flex: 1,
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#fff',
  },
  cardTextArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  cardDateText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: '#fff',
  },
  datePickerOverlay: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePickerDone: {
    backgroundColor: '#5cc4a4',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  datePickerDoneText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  datePickerInner: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  datePickerIOS: {
    width: '100%',
    transform: [{ scale: 1 }],
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#f6a278',
  },
  categoryChipSelected: {
    backgroundColor: '#ff9966',
  },
  categoryChipText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
  },
  categoryChipTextSelected: {
    fontFamily: 'Inter_700Bold',
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 16,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  groupPickerScroll: {
    maxHeight: 300,
    width: '100%',
  },
  groupPickerItem: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    marginBottom: 8,
  },
  groupPickerItemSelected: {
    backgroundColor: '#9b87f5',
  },
  groupPickerItemText: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    color: '#111827',
  },
});
