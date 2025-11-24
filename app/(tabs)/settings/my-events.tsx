import React, { useMemo, useState } from 'react';
// IMPORT REACT NATIVE COMPONENTS
import { LinearGradient } from 'expo-linear-gradient';
import {
    Platform, // Used for buttons
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// --- Color Palette (Based on third image: Soft Mint/Teal) ---
const colors = {
  softMintBackground: '#D4EDE7', // Main light background
  darkTealAccent: '#008080', // Primary accent (dark text/buttons)
  mediumAccentGreen: '#66B2B2', // Secondary accent (event dots, highlights)
  white: '#FFFFFF',
  lightGray: '#A0AEC0',
  darkText: '#1F2937',
  eventDotColor: '#1F2937', // Use a dark color for better contrast
};

// --- Custom Icon Component (Replaced SVG with simple Text/View) ---
// Note: In a real RN app, you'd use a library like 'react-native-vector-icons'.
// We are keeping the structure but replacing web elements.
const Icon = ({ name, size = 24, color = colors.darkTealAccent }: { name: string, size?: number, color?: string }) => {
    // For simplicity in a self-contained example, we'll return a simple View/Text
    // instead of complex SVG/path elements, which require a separate <Svg> component.
    // For a calendar/pin/chevron, using an emoji or placeholder is safer for a quick fix.
    
    // In a real application, you would use 'react-native-svg' for the path elements.
    // For this fix, we'll simplify all non-text icons to a placeholder view.
    const iconStyle = {
        width: size,
        height: size,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    };
    
    switch (name) {
        case 'Calendar':
            return <Text style={{ fontSize: size, color }}>📅</Text>; // Placeholder
        case 'ChevronLeft':
            return <Text style={{ fontSize: size, color }}>{'<'}</Text>;
        case 'ChevronRight':
            return <Text style={{ fontSize: size, color }}>{'>'}</Text>;
        case 'MapPin':
            return <Text style={{ fontSize: size * 0.8, color }}>📍</Text>; // Placeholder
        case 'Close':
            // Use a simple Text character for the close button
            return (
                <Text style={{ fontSize: size, lineHeight: size, color: colors.darkText }}>&times;</Text>
            );
        default:
            return null;
    }
};

// --- Typescript Interfaces for Data and State ---
interface CampusEvent {
  id: string;
  name: string;
  location: string;
  time: string;
  date: string; // YYYY-MM-DD format
}

interface EventData {
  [date: string]: CampusEvent[]; // Key is YYYY-MM-DD
}

interface SelectedDateEvents {
  date: Date;
  events: CampusEvent[];
}

// --- Mock Data Setup ---
// Helper to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get dates for the current month
const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();

// Mock data using current month dates for easy testing
const mockEvents: EventData = {
  [formatDate(new Date(currentYear, currentMonth, 17))]: [
    {
      id: 'e1',
      name: 'KTP Chapter Meeting',
      location: 'Student Union, Room 101',
      time: '6:00 PM',
      date: formatDate(new Date(currentYear, currentMonth, 17)),
    },
    {
      id: 'e2',
      name: 'ISA Concert Auditions',
      location: 'Performance Hall',
      time: '7:30 PM',
      date: formatDate(new Date(currentYear, currentMonth, 17)),
    },
  ],
  [formatDate(new Date(currentYear, currentMonth, 23))]: [
    {
      id: 'e3',
      name: 'Haunted House SUAAB',
      location: 'Recreation Center',
      time: '8:00 PM',
      date: formatDate(new Date(currentYear, currentMonth, 23)),
    },
    {
      id: 'e4',
      name: 'Late Night Study Session',
      location: 'Library 24/7 Zone',
      time: '11:00 PM',
      date: formatDate(new Date(currentYear, currentMonth, 23)),
    },
    {
      id: 'e5',
      name: 'Campus Cleanup Drive',
      location: 'Campus Green',
      time: '9:00 AM',
      date: formatDate(new Date(currentYear, currentMonth, 23)),
    },
  ],
};

// --- Calendar Logic ---

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getDaysInMonth = (month: number, year: number): Date[] => {
  const date = new Date(year, month, 1);
  const dates: Date[] = [];
  while (date.getMonth() === month) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return dates;
};

const getCalendarWeeks = (month: number, year: number): (Date | null)[][] => {
  const monthDays = getDaysInMonth(month, year);
  const firstDayOfWeek = monthDays[0].getDay();
  const weeks: (Date | null)[][] = [[]];

  for (let i = 0; i < firstDayOfWeek; i++) {
    weeks[0].push(null);
  }

  let currentWeek = weeks[0];
  monthDays.forEach((date) => {
    if (currentWeek.length === 7) {
      currentWeek = [];
      weeks.push(currentWeek);
    }
    currentWeek.push(date);
  });

  while (currentWeek.length < 7) {
    currentWeek.push(null);
  }

  if (weeks.length > 1 && weeks[weeks.length - 1].every(d => d === null)) {
    weeks.pop();
  }

  return weeks;
};

// --- Styles using StyleSheet.create (React Native best practice) ---
const styles = StyleSheet.create({
    safeArea: {
      flex: 1, // Use flex to take up the screen
      backgroundColor: 'transparent',
      // No need for fontFamily, display, justify/align, etc. on the root view
    },
    container: {
      width: '100%',
      maxWidth: 400, // Simulate a mobile screen width
      padding: 20,
      alignSelf: 'center', // Center the container on larger screens
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      marginBottom: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: colors.darkTealAccent,
    },
    calendarHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
      paddingHorizontal: 10,
    },
    navButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: 'transparent',
      alignItems: 'center',
      justifyContent: 'center',
    },
    monthYearText: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.darkText,
    },
    dayNamesContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      textAlign: 'center', // Text alignment is done on the Text component
      paddingBottom: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.lightGray,
      marginBottom: 5,
    },
    dayNameText: {
      flex: 1, // Distribute evenly
      fontSize: 12,
      fontWeight: '600',
      color: colors.darkTealAccent,
      textAlign: 'center',
    },
    calendarGrid: {
      // Use flex to simulate a grid layout (7 columns)
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 4,
    },
    dateButtonWrapper: {
        width: `${100 / 7}%`, // Distribute 7 buttons per row
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateButton: {
      width: '90%', // Use percentage of the wrapper
      aspectRatio: 1,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      paddingTop: 5,
      backgroundColor: 'transparent',
    },
    dateButtonDisabled: {
      opacity: 0.4,
    },
    dateButtonToday: {
      borderWidth: 2,
      borderColor: colors.darkTealAccent,
      backgroundColor: `${colors.mediumAccentGreen}20`,
    },
    dateButtonSelected: {
      backgroundColor: colors.mediumAccentGreen,
    },
    dateText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.darkText,
    },
    dateTextSelected: {
        color: colors.white,
    },
    dateTextToday: {
      fontWeight: 'bold',
    },
    eventDotsContainer: {
      position: 'absolute',
      bottom: 5,
      flexDirection: 'row',
      alignItems: 'center',
    },
    eventDot: {
      width: 5,
      height: 5,
      borderRadius: 50,
      marginHorizontal: 1,
    },
    eventDotSelected: {
        backgroundColor: colors.white,
    },
    extraEventsText: {
      fontSize: 10,
      marginLeft: 2,
      color: colors.darkText,
    },
    extraEventsTextSelected: {
        color: colors.white,
    },
    // --- Modal Styles (Using RN conventions for positioning) ---
    modalOverlay: {
      // Use absolute fill or dimensions for RN overlay
      ...StyleSheet.absoluteFillObject, 
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end', // Align to the bottom
      zIndex: 100,
      // For web, use 'fixed', for RN use 'absoluteFillObject'
      ...Platform.select({
        web: { position: 'fixed' as 'fixed' },
      })
    },
    modalContent: {
      backgroundColor: colors.white,
      borderTopLeftRadius: 25,
      borderTopRightRadius: 25,
      padding: 25,
      maxHeight: '70%',
      width: '100%',
      maxWidth: 400, 
      alignSelf: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -5 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 20, // Android shadow
    },
    modalHeader: {
      marginBottom: 15,
      position: 'relative',
    },
    modalTitle: {
      fontSize: 22,
      fontWeight: 'bold',
      color: colors.darkText,
    },
    modalSubtitle: {
      fontSize: 16,
      color: colors.lightGray,
      marginTop: 2,
    },
    modalCloseButton: {
      position: 'absolute',
      top: 0,
      right: 0,
      padding: 5,
    },
    eventList: {
      maxHeight: 300,
      marginBottom: 20,
    },
    eventItem: {
      flexDirection: 'row',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    eventAccentBar: {
      width: 4,
      backgroundColor: colors.mediumAccentGreen,
      borderRadius: 2,
      marginRight: 10,
    },
    eventName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.darkText,
    },
    eventDetailsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    eventDetailsText: {
      fontSize: 13,
      color: colors.lightGray,
      marginLeft: 4,
    },
    closeButton: {
      backgroundColor: colors.darkTealAccent,
      borderRadius: 10,
      paddingVertical: 14,
      marginTop: 10,
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButtonText: {
      color: colors.white,
      fontSize: 16,
      fontWeight: '700',
      textAlign: 'center',
    },
});

// --- Main Component ---

const MyEventsScreen: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(today);
  const [modalData, setModalData] = useState<SelectedDateEvents | null>(null);

  const currentMonthIndex = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const todayDateKey = formatDate(new Date());

  const calendarWeeks = useMemo(() => getCalendarWeeks(currentMonthIndex, currentYear), [currentMonthIndex, currentYear]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonthIndex - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonthIndex + 1, 1));
  };

  const handleDateClick = (date: Date) => {
    const dateKey = formatDate(date);
    const events = mockEvents[dateKey] || [];
    
    // Only show modal if there are events
    if (events.length > 0) {
        setModalData({ date, events });
    }
  };

  const closeModal = () => {
    setModalData(null);
  };
  
  // Custom button component to simulate hover/press feedback
  const NavButton: React.FC<any> = ({ children, onPress, title }) => (
    <TouchableOpacity
      onPress={onPress}
      style={styles.navButton}
      // You can add logic here for touch feedback/opacity if needed
      activeOpacity={0.7}
      accessibilityLabel={title}
    >
      {children}
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#FFFFFF', '#FFF7ED', '#FED7AA', '#D1FAE5', '#ECFEFF', '#FFFFFF']}
      locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={{ ...styles.safeArea, backgroundColor: 'transparent' }}>
        <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          {/* Replaced <h1> with <Text> */}
          <Text style={styles.title}>My Events</Text>
          <Icon name="Calendar" size={24} color={colors.darkTealAccent} />
        </View>

        {/* Calendar Header (Month/Year Navigation) */}
        <View style={styles.calendarHeader}>
          <NavButton 
            onPress={handlePrevMonth} 
            title="Previous month"
          >
            <Icon name="ChevronLeft" size={24} color={colors.darkTealAccent} />
          </NavButton>
          {/* Replaced <span> with <Text> */}
          <Text style={styles.monthYearText}>
            {MONTH_NAMES[currentMonthIndex]} {currentYear}
          </Text>
          <NavButton 
            onPress={handleNextMonth} 
            title="Next month"
          >
            <Icon name="ChevronRight" size={24} color={colors.darkTealAccent} />
          </NavButton>
        </View>

        {/* Weekday Names */}
        <View style={styles.dayNamesContainer}>
          {DAY_NAMES.map((day) => (
            // Replaced <span> with <Text>
            <Text key={day} style={styles.dayNameText}>
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.calendarGrid}>
          {calendarWeeks.flat().map((date, index) => {
            const dateKey = date ? formatDate(date) : '';
            const events = date ? mockEvents[dateKey] : undefined;
            const isToday = dateKey === todayDateKey;
            const hasEvents = !!events && events.length > 0;
            const isSelected = modalData && date && formatDate(modalData.date) === dateKey;
            const isCurrentMonth = date && date.getMonth() === currentMonthIndex;
            
            // Combine styles using an array for conditional styling
            const dateButtonStyles = [
                styles.dateButton,
                (!date || !isCurrentMonth) && styles.dateButtonDisabled,
                isToday && styles.dateButtonToday,
                isSelected && styles.dateButtonSelected,
            ];

            const dateTextStyles = [
                styles.dateText,
                isToday && styles.dateTextToday,
                isSelected && styles.dateTextSelected,
            ];

            return (
              // Wrapper View to ensure correct flexible column layout
              <View key={index} style={styles.dateButtonWrapper}>
                {/* Replaced <button> with <TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => date && handleDateClick(date)}
                  disabled={!date}
                  style={dateButtonStyles}
                  activeOpacity={hasEvents ? 0.7 : 1}
                  accessibilityLabel={date ? date.toDateString() : 'Empty day'}
                >
                  {/* Replaced <span> with <Text> */}
                  <Text style={dateTextStyles}>
                    {date ? date.getDate() : ''}
                  </Text>
                  {hasEvents && (
                    <View style={styles.eventDotsContainer}>
                      {[...Array(Math.min(events.length, 3))].map((_, i) => (
                        <View
                          key={i}
                          style={[
                            styles.eventDot, 
                            { backgroundColor: isSelected ? colors.white : colors.mediumAccentGreen },
                          ]}
                        />
                      ))}
                      {events.length > 3 && (
                        <Text style={[styles.extraEventsText, isSelected && styles.extraEventsTextSelected]}>
                            +{events.length - 3}
                        </Text>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>

      {/* Event Details Modal/Panel */}
      {modalData && (
        // Replaced <div> with <View> for modal overlay
        <TouchableOpacity
            style={styles.modalOverlay}
            onPress={closeModal} // Close on tapping outside
            activeOpacity={1} // Prevents touch feedback on overlay
        >
          {/* Replaced <div> with <View> for modal content */}
          <View style={styles.modalContent} onStartShouldSetResponder={() => true} // Allows View to block touch propagation
          >
            <View style={styles.modalHeader}>
              {/* Replaced <h2> with <Text> */}
              <Text style={styles.modalTitle}>
                Events for the day:
              </Text>
              {/* Replaced <p> with <Text> */}
              <Text style={styles.modalSubtitle}>
                {modalData.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </Text>
              {/* Replaced <button> with <TouchableOpacity> */}
              <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton} accessibilityLabel="Close">
                <Icon name="Close" size={24} color={colors.darkText} />
              </TouchableOpacity>
            </View>

            <View style={styles.eventList}>
              {modalData.events.map((event) => (
                <View key={event.id} style={styles.eventItem}>
                  <View style={styles.eventAccentBar} />
                  <View style={{ flex: 1, paddingLeft: 10 }}>
                    {/* Replaced <p> with <Text> */}
                    <Text style={styles.eventName}>{event.name}</Text>
                    <View style={styles.eventDetailsRow}>
                      <Icon name="MapPin" size={14} color={colors.mediumAccentGreen} />
                      {/* Replaced <span> with <Text> */}
                      <Text style={styles.eventDetailsText}>
                        {event.location} &bull; {event.time}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Replaced <button> with <TouchableOpacity> */}
            <TouchableOpacity 
                onPress={closeModal} 
                style={styles.closeButton}
                activeOpacity={0.8}
                accessibilityLabel="Close Event Details"
            >
              {/* Replaced <span> with <Text> */}
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    </View>
    </LinearGradient>
  );
};

export default MyEventsScreen;