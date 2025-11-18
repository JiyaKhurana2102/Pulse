import React, { useState, useMemo } from 'react';

// --- Color Palette (Based on third image: Soft Mint/Teal) ---
const colors = {
  softMintBackground: '#D4EDE7', // Main light background
  darkTealAccent: '#008080', // Primary accent (dark text/buttons)
  mediumAccentGreen: '#66B2B2', // Secondary accent (event dots, highlights)
  white: '#FFFFFF',
  lightGray: '#A0AEC0',
  darkText: '#1F2937',
};

// --- Custom Icon Component (Using SVG for self-containment) ---
// We use inline SVG for reliability in restricted environments.
const Icon = ({ name, size = 24, color = colors.darkTealAccent }: { name: string, size?: number, color?: string }) => {
    switch (name) {
        case 'Calendar':
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />
                </svg>
            );
        case 'ChevronLeft':
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m15 18-6-6 6-6" />
                </svg>
            );
        case 'ChevronRight':
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m9 18 6-6-6-6" />
                </svg>
            );
        case 'MapPin':
            return (
                <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
                </svg>
            );
        case 'Close':
            // Use a simple text character for the close button
            return (
                <span style={{ fontSize: size, lineHeight: 1, color: colors.darkText }}>&times;</span>
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
  
  // Base styles using React Native style conventions
  // Note: We use 'any' type here to allow React Native properties like 'paddingVertical'
  const styles: any = { 
    safeArea: {
      minHeight: '100vh',
      paddingTop: '20px',
      backgroundColor: colors.softMintBackground,
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    container: {
      width: '100%',
      maxWidth: '400px', // Simulate a mobile screen width
      padding: '20px',
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      // Reverted to React Native mobile syntax
      paddingVertical: '10px', 
      marginBottom: '20px',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: colors.darkTealAccent,
    },
    calendarHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
      // Reverted to React Native mobile syntax
      paddingHorizontal: '10px', 
    },
    navButton: {
      padding: '8px',
      borderRadius: '20px',
      cursor: 'pointer',
      backgroundColor: 'transparent',
      border: 'none',
      transition: 'background-color 0.15s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    navButtonHover: {
      backgroundColor: `${colors.mediumAccentGreen}20`,
    },
    monthYearText: {
      fontSize: '20px',
      fontWeight: '700',
      color: colors.darkText,
    },
    dayNamesContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      textAlign: 'center',
      paddingBottom: '8px',
      borderBottom: `1px solid ${colors.lightGray}`,
      marginBottom: '5px',
    },
    dayNameText: {
      fontSize: '12px',
      fontWeight: '600',
      color: colors.darkTealAccent,
    },
    calendarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '4px 0',
    },
    dateButton: {
      width: '90%',
      aspectRatio: '1/1',
      borderRadius: '12px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      paddingTop: '5px',
      margin: 'auto',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: 'transparent',
      transition: 'background-color 0.15s, border-color 0.15s',
    },
    dateButtonDisabled: {
      opacity: 0.4,
      cursor: 'default',
    },
    dateButtonCurrentMonth: {
        opacity: 1,
    },
    dateButtonToday: {
      border: `2px solid ${colors.darkTealAccent}`,
      backgroundColor: `${colors.mediumAccentGreen}20`,
    },
    dateButtonSelected: {
      backgroundColor: colors.mediumAccentGreen,
      color: colors.white, // Text becomes white when selected
    },
    dateText: {
      fontSize: '16px',
      fontWeight: '500',
      color: colors.darkText,
    },
    dateTextToday: {
      fontWeight: 'bold',
    },
    eventDotsContainer: {
      position: 'absolute',
      bottom: '5px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    eventDot: {
      width: '5px',
      height: '5px',
      borderRadius: '50%',
      // Reverted to React Native mobile syntax
      marginHorizontal: '1px', 
    },
    extraEventsText: {
      fontSize: '10px',
      marginLeft: '2px',
    },
    // --- Modal Styles ---
    modalOverlay: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      zIndex: 100,
    },
    modalContent: {
      backgroundColor: colors.white,
      borderTopLeftRadius: '25px',
      borderTopRightRadius: '25px',
      padding: '25px',
      maxHeight: '70%',
      width: '100%',
      maxWidth: '400px', // Constrain modal to mobile width
      boxShadow: '0 -10px 30px rgba(0, 0, 0, 0.1)',
      cursor: 'default',
    },
    modalHeader: {
      marginBottom: '15px',
      position: 'relative',
    },
    modalTitle: {
      fontSize: '22px',
      fontWeight: 'bold',
      color: colors.darkText,
    },
    modalSubtitle: {
      fontSize: '16px',
      color: colors.lightGray,
      marginTop: '2px',
    },
    modalCloseButton: {
      position: 'absolute',
      top: '0',
      right: '0',
      padding: '5px',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: 'transparent',
    },
    eventList: {
      maxHeight: '300px',
      overflowY: 'auto',
      marginBottom: '20px',
    },
    eventItem: {
      display: 'flex',
      flexDirection: 'row',
      // Reverted to React Native mobile syntax
      paddingVertical: '12px', 
      borderBottom: '1px solid #eee',
    },
    eventAccentBar: {
      width: '4px',
      backgroundColor: colors.mediumAccentGreen,
      borderRadius: '2px',
      marginRight: '10px',
    },
    eventName: {
      fontSize: '16px',
      fontWeight: '600',
      color: colors.darkText,
    },
    eventDetailsRow: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: '4px',
    },
    eventDetailsText: {
      fontSize: '13px',
      color: colors.lightGray,
      marginLeft: '4px',
    },
    closeButton: {
      backgroundColor: colors.darkTealAccent,
      borderRadius: '10px',
      // Reverted to React Native mobile syntax
      paddingVertical: '14px', 
      textAlign: 'center',
      marginTop: '10px',
      cursor: 'pointer',
      border: 'none',
      transition: 'background-color 0.15s',
    },
    closeButtonText: {
      color: colors.white,
      fontSize: '16px',
      fontWeight: '700',
    },
  };

  return (
    <div style={styles.safeArea}>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>My Events</h1>
          <Icon name="Calendar" size={24} color={colors.darkTealAccent} />
        </div>

        {/* Calendar Header (Month/Year Navigation) */}
        <div style={styles.calendarHeader}>
          <button 
            onClick={handlePrevMonth} 
            style={styles.navButton} 
            title="Previous month"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.navButtonHover.backgroundColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.navButton.backgroundColor}
          >
            <Icon name="ChevronLeft" size={24} color={colors.darkTealAccent} />
          </button>
          <span style={styles.monthYearText}>
            {MONTH_NAMES[currentMonthIndex]} {currentYear}
          </span>
          <button 
            onClick={handleNextMonth} 
            style={styles.navButton} 
            title="Next month"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.navButtonHover.backgroundColor}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.navButton.backgroundColor}
          >
            <Icon name="ChevronRight" size={24} color={colors.darkTealAccent} />
          </button>
        </div>

        {/* Weekday Names */}
        <div style={styles.dayNamesContainer}>
          {DAY_NAMES.map((day) => (
            <span key={day} style={styles.dayNameText}>
              {day}
            </span>
          ))}
        </div>

        {/* Calendar Grid */}
        <div style={styles.calendarGrid}>
          {calendarWeeks.flat().map((date, index) => {
            const dateKey = date ? formatDate(date) : '';
            const events = date ? mockEvents[dateKey] : undefined;
            const isToday = dateKey === todayDateKey;
            const hasEvents = !!events && events.length > 0;
            const isSelected = modalData && date && formatDate(modalData.date) === dateKey;
            const isCurrentMonth = date && date.getMonth() === currentMonthIndex;
            
            const buttonStyle: React.CSSProperties = {
                ...styles.dateButton,
                ...(!date || !isCurrentMonth ? styles.dateButtonDisabled : styles.dateButtonCurrentMonth),
                ...(isToday ? styles.dateButtonToday : {}),
                ...(isSelected ? styles.dateButtonSelected : {}),
                backgroundColor: isSelected ? colors.mediumAccentGreen : isToday ? `${colors.mediumAccentGreen}20` : 'transparent',
                color: isSelected ? colors.white : styles.dateText.color,
                // Add hover style simulation for web
                onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
                    if (date) {
                        e.currentTarget.style.backgroundColor = isSelected ? colors.mediumAccentGreen : `${colors.mediumAccentGreen}40`;
                    }
                },
                onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
                    if (date) {
                        e.currentTarget.style.backgroundColor = isSelected ? colors.mediumAccentGreen : isToday ? `${colors.mediumAccentGreen}20` : 'transparent';
                    }
                }
            };
            
            const dateTextStyle = {
                ...styles.dateText,
                ...(isToday ? styles.dateTextToday : {}),
                color: isSelected ? colors.white : styles.dateText.color,
            };

            return (
              <div key={index} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <button
                  onClick={() => date && handleDateClick(date)}
                  disabled={!date}
                  style={buttonStyle}
                  title={date ? date.toDateString() : 'Empty day'}
                >
                  <span style={dateTextStyle}>
                    {date ? date.getDate() : ''}
                  </span>
                  {hasEvents && (
                    <div style={styles.eventDotsContainer}>
                      {[...Array(Math.min(events.length, 3))].map((_, i) => (
                        <div
                          key={i}
                          style={{ 
                            ...styles.eventDot, 
                            backgroundColor: isSelected ? colors.white : colors.mediumAccentGreen,
                          }}
                        ></div>
                      ))}
                      {events.length > 3 && (
                        <span style={{ ...styles.extraEventsText, color: isSelected ? colors.white : styles.extraEventsText.color }}>
                            +{events.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Details Modal/Panel */}
      {modalData && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>
                Events for the day:
              </h2>
              <p style={styles.modalSubtitle}>
                {modalData.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </p>
              <button onClick={closeModal} style={styles.modalCloseButton} title="Close">
                <Icon name="Close" size={24} color={colors.darkText} />
              </button>
            </div>

            <div style={styles.eventList}>
              {modalData.events.map((event) => (
                <div key={event.id} style={styles.eventItem}>
                  <div style={styles.eventAccentBar} />
                  <div style={{ flex: 1, paddingLeft: '10px' }}>
                    <p style={styles.eventName}>{event.name}</p>
                    <div style={styles.eventDetailsRow}>
                      <Icon name="MapPin" size={14} color={colors.mediumAccentGreen} />
                      <span style={styles.eventDetailsText}>
                        {event.location} &bull; {event.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
                onClick={closeModal} 
                style={styles.closeButton}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.mediumAccentGreen}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.closeButton.backgroundColor}
            >
              <span style={styles.closeButtonText}>Close</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEventsScreen;