import { EventRecord, getUserId, listUserEvents } from '@/services/events';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const colors = {
  softMintBackground: '#D4EDE7',
  darkTealAccent: '#008080',
  mediumAccentGreen: '#66B2B2',
  white: '#FFFFFF',
  lightGray: '#A0AEC0',
  darkText: '#1F2937',
};

const Icon = ({ name, size = 24, color = colors.darkTealAccent }: { name: string; size?: number; color?: string }) => {
  switch (name) {
    case 'ChevronLeft':
      return <Text style={{ fontSize: size, color }}>{'<'}</Text>;
    case 'ChevronRight':
      return <Text style={{ fontSize: size, color }}>{'>'}</Text>;
    case 'MapPin':
      return <Text style={{ fontSize: size * 0.8, color }}>📍</Text>;
    case 'Close':
      return <Text style={{ fontSize: size, lineHeight: size, color: colors.darkText }}>&times;</Text>;
    default:
      return null;
  }
};

interface CampusEvent {
  id: string;
  name: string;
  location: string;
  time: string;
  date: string;
}
interface EventData { [date: string]: CampusEvent[]; }
interface SelectedDateEvents { date: Date; events: CampusEvent[]; }

const formatDate = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const getDaysInMonth = (m: number, y: number): Date[] => {
  const date = new Date(y, m, 1); const out: Date[] = [];
  while (date.getMonth() === m) { out.push(new Date(date)); date.setDate(date.getDate() + 1); }
  return out;
};
const getCalendarWeeks = (m: number, y: number): (Date | null)[][] => {
  const days = getDaysInMonth(m, y); const firstDow = days[0].getDay(); const weeks: (Date | null)[][] = [[]];
  for (let i=0;i<firstDow;i++) weeks[0].push(null);
  let current = weeks[0];
  days.forEach(d => { if (current.length === 7) { current = []; weeks.push(current); } current.push(d); });
  while (current.length < 7) current.push(null);
  if (weeks.length>1 && weeks[weeks.length-1].every(d=>d===null)) weeks.pop();
  return weeks;
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 100, paddingHorizontal: 24, paddingBottom: 24 },
  container: { width: '100%', maxWidth: 400, padding: 20, alignSelf: 'center' },
  header: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 10, marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '700', fontFamily: 'Inter_700Bold', color: '#1A1A1A', textAlign: 'center' },
  calendarHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, paddingHorizontal: 10 },
  navButton: { padding: 8, borderRadius: 20, backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  monthYearText: { fontSize: 20, fontWeight: '700', color: colors.darkText },
  dayNamesContainer: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: colors.lightGray, marginBottom: 5 },
  dayNameText: { flex: 1, fontSize: 12, fontWeight: '600', color: colors.darkTealAccent, textAlign: 'center' },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  dateButtonWrapper: { width: `${100 / 7}%`, aspectRatio: 1, justifyContent: 'center', alignItems: 'center' },
  dateButton: { width: '90%', aspectRatio: 1, borderRadius: 12, justifyContent: 'center', alignItems: 'center', position: 'relative', paddingTop: 5, backgroundColor: 'transparent' },
  dateButtonDisabled: { opacity: 0.4 },
  dateButtonToday: { borderWidth: 2, borderColor: colors.darkTealAccent, backgroundColor: `${colors.mediumAccentGreen}20` },
  dateButtonSelected: { backgroundColor: colors.mediumAccentGreen },
  dateText: { fontSize: 16, fontWeight: '500', color: colors.darkText },
  dateTextSelected: { color: colors.white },
  dateTextToday: { fontWeight: '700', fontFamily: 'Inter_700Bold' },
  eventDotsContainer: { position: 'absolute', bottom: 5, flexDirection: 'row', alignItems: 'center' },
  eventDot: { width: 5, height: 5, borderRadius: 50, marginHorizontal: 1 },
  extraEventsText: { fontSize: 10, marginLeft: 2, color: colors.darkText },
  extraEventsTextSelected: { color: colors.white },
  modalOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', zIndex: 100, ...Platform.select({ web: { position: 'fixed' as 'fixed' } }) },
  modalContent: { backgroundColor: colors.white, borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 25, paddingBottom: 50, marginBottom: 24, maxHeight: '70%', width: '100%', maxWidth: 400, alignSelf: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: -5 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 20 },
  modalHeader: { marginBottom: 15, position: 'relative' },
  modalTitle: { fontSize: 22, fontWeight: '700', fontFamily: 'Inter_700Bold', color: colors.darkText },
  modalSubtitle: { fontSize: 16, color: colors.lightGray, marginTop: 2 },
  modalCloseButton: { position: 'absolute', top: 0, right: 0, padding: 5 },
  eventList: { maxHeight: 300, marginBottom: 20 },
  eventItem: { flexDirection: 'row', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  eventAccentBar: { width: 4, backgroundColor: colors.mediumAccentGreen, borderRadius: 2, marginRight: 10 },
  eventName: { fontSize: 16, fontWeight: '600', color: colors.darkText },
  eventDetailsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  eventDetailsText: { fontSize: 13, color: colors.lightGray, marginLeft: 4 },
  closeButton: { backgroundColor: colors.darkTealAccent, borderRadius: 10, paddingVertical: 14, marginTop: 10, justifyContent: 'center', alignItems: 'center' },
  closeButtonText: { color: colors.white, fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold', textAlign: 'center' },
});

const MyEventsScreen: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(today);
  const [modalData, setModalData] = useState<SelectedDateEvents | null>(null);
  const [userEvents, setUserEvents] = useState<EventRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUserEvents();
  }, []);

  const loadUserEvents = async () => {
    setLoading(true);
    try {
      const uid = await getUserId();
      const events = await listUserEvents(uid);
      setUserEvents(events);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Convert EventRecord[] to EventData format
  const eventsData: EventData = useMemo(() => {
    const map: EventData = {};
    userEvents.forEach(evt => {
      const dateKey = formatDate(new Date(evt.date));
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push({
        id: evt.id,
        name: evt.name,
        location: evt.location || evt.groupName || 'TBD',
        time: evt.time,
        date: dateKey,
      });
    });
    return map;
  }, [userEvents]);

  const currentMonthIndex = currentDate.getMonth();
  const currentYearVal = currentDate.getFullYear();
  const todayKey = formatDate(new Date());
  const calendarWeeks = useMemo(() => getCalendarWeeks(currentMonthIndex, currentYearVal), [currentMonthIndex, currentYearVal]);
  const handlePrevMonth = () => setCurrentDate(new Date(currentYearVal, currentMonthIndex - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentYearVal, currentMonthIndex + 1, 1));
  const handleDateClick = (date: Date) => { const key = formatDate(date); const events = eventsData[key] || []; if (events.length) setModalData({ date, events }); };
  const closeModal = () => setModalData(null);
  const NavButton: React.FC<any> = ({ children, onPress, title }) => (
    <TouchableOpacity onPress={onPress} style={styles.navButton} activeOpacity={0.7} accessibilityLabel={title}>{children}</TouchableOpacity>
  );
  return (
    <LinearGradient colors={['#FFFFFF', '#FFF7ED', '#FED7AA', '#D1FAE5', '#ECFEFF', '#FFFFFF']} locations={[0,0.2,0.4,0.6,0.8,1]} start={{ x:0.5,y:0 }} end={{ x:0.5,y:1 }} style={{ flex:1 }}>
      <View style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>My Events</Text>
            <Icon name="Calendar" size={24} color={colors.darkTealAccent} />
          </View>
          <View style={styles.calendarHeader}>
            <NavButton onPress={handlePrevMonth} title="Previous month"><Icon name="ChevronLeft" size={24} color={colors.darkTealAccent} /></NavButton>
            <Text style={styles.monthYearText}>{MONTH_NAMES[currentMonthIndex]} {currentYearVal}</Text>
            <NavButton onPress={handleNextMonth} title="Next month"><Icon name="ChevronRight" size={24} color={colors.darkTealAccent} /></NavButton>
          </View>
          <View style={styles.dayNamesContainer}>{DAY_NAMES.map(day => <Text key={day} style={styles.dayNameText}>{day}</Text>)}</View>
          <View style={styles.calendarGrid}>
            {calendarWeeks.flat().map((date, idx) => {
              const key = date ? formatDate(date) : ''; const events = date ? eventsData[key] : undefined;
              const isToday = key === todayKey; const hasEvents = !!events && events.length > 0; const isSelected = modalData && date && formatDate(modalData.date) === key; const isCurrentMonth = date && date.getMonth() === currentMonthIndex;
              const dateButtonStyles = [styles.dateButton, (!date || !isCurrentMonth) && styles.dateButtonDisabled, isToday && styles.dateButtonToday, isSelected && styles.dateButtonSelected];
              const dateTextStyles = [styles.dateText, isToday && styles.dateTextToday, isSelected && styles.dateTextSelected];
              return (
                <View key={idx} style={styles.dateButtonWrapper}>
                  <TouchableOpacity onPress={() => date && handleDateClick(date)} disabled={!date} style={dateButtonStyles} activeOpacity={hasEvents ? 0.7 : 1} accessibilityLabel={date ? date.toDateString() : 'Empty day'}>
                    <Text style={dateTextStyles}>{date ? date.getDate() : ''}</Text>
                    {hasEvents && (
                      <View style={styles.eventDotsContainer}>
                        {[...Array(Math.min(events.length, 3))].map((_, i) => (
                          <View key={i} style={[styles.eventDot, { backgroundColor: isSelected ? colors.white : colors.mediumAccentGreen }]} />
                        ))}
                        {events.length > 3 && <Text style={[styles.extraEventsText, isSelected && styles.extraEventsTextSelected]}>+{events.length - 3}</Text>}
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
        {modalData && (
          <TouchableOpacity style={styles.modalOverlay} onPress={closeModal} activeOpacity={1}>
            <View style={styles.modalContent} onStartShouldSetResponder={() => true}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Events for the day:</Text>
                <Text style={styles.modalSubtitle}>{modalData.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
                <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton} accessibilityLabel="Close"><Icon name="Close" size={24} color={colors.darkText} /></TouchableOpacity>
              </View>
              <View style={styles.eventList}>
                {modalData.events.map(event => (
                  <View key={event.id} style={styles.eventItem}>
                    <View style={styles.eventAccentBar} />
                    <View style={{ flex:1, paddingLeft:10 }}>
                      <Text style={styles.eventName}>{event.name}</Text>
                      <View style={styles.eventDetailsRow}>
                        <Icon name="MapPin" size={14} color={colors.mediumAccentGreen} />
                        <Text style={styles.eventDetailsText}>{event.location} • {event.time}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton} activeOpacity={0.8} accessibilityLabel="Close Event Details"><Text style={styles.closeButtonText}>Close</Text></TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </LinearGradient>
  );
};

export default MyEventsScreen;
