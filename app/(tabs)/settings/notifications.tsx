import React, { useState } from 'react';

// --- Color Palette (Using your defined scheme) ---
const colors = {
  softMintBackground: '#D4EDE7', // Main light background
  darkTealAccent: '#008080', // Primary accent (dark text/buttons)
  mediumAccentGreen: '#66B2B2', // Secondary accent (toggles, highlights)
  white: '#FFFFFF',
  lightGray: '#A0AEC0',
  darkText: '#1F2937',
  offWhite: '#F7FCFA', // For section backgrounds
  // We need a color for the active toggle state, choosing a vibrant teal
  toggleActive: '#008080', 
};

// --- Custom Icon Components (Using SVG) ---

// Chevron for back button
const ChevronLeftIcon = ({ size = 24, color = colors.darkTealAccent }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m15 18-6-6 6-6" />
    </svg>
);

// User/Profile Icon
const UserIcon = ({ size = 24, color = colors.darkTealAccent }: { size?: number, color?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);

// --- Custom Toggle Switch Component ---
// This mimics a mobile switch using pure CSS/JSX
const ToggleSwitch = ({ isActive, onToggle }: { isActive: boolean, onToggle: () => void }) => {
  const trackColor = isActive ? colors.toggleActive : colors.lightGray;
  const thumbColor = colors.white;

  const toggleStyle: React.CSSProperties = {
    width: '50px',
    height: '30px',
    borderRadius: '15px',
    backgroundColor: trackColor,
    padding: '3px',
    transition: 'background-color 0.3s',
    cursor: 'pointer',
    position: 'relative',
    boxSizing: 'content-box',
    border: `1px solid ${trackColor}`,
  };

  const thumbStyle: React.CSSProperties = {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: thumbColor,
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s',
    transform: isActive ? 'translateX(20px)' : 'translateX(0)',
  };

  return (
    <div style={toggleStyle} onClick={onToggle}>
      <div style={thumbStyle} />
    </div>
  );
};

// --- Main Component ---
const NotificationSettings: React.FC = () => {
  // Initialize state for each toggle based on the screenshot
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [eventRemindersEnabled, setEventRemindersEnabled] = useState(true);
  const [soundsEnabled, setSoundsEnabled] = useState(true);

  // Define styles using React Native conventions (camelCase, no hyphens)
  // We use 'any' to suppress TypeScript errors for web compilation while using RN-style properties
  const styles: any = { 
    safeArea: {
      minHeight: '100vh',
      backgroundColor: colors.softMintBackground,
      fontFamily: 'Inter, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    container: {
      width: '100%',
      maxWidth: '400px', // Mobile simulation
      paddingHorizontal: '20px',
      paddingTop: '40px', // Space for status bar
    },
    // Top Navigation Header
    navHeader: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
    },
    navTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: colors.darkTealAccent,
    },
    backButton: {
      cursor: 'pointer',
      padding: '5px',
      backgroundColor: 'transparent',
      border: 'none',
    },
    // Manage Alerts Bar
    alertsBar: {
      backgroundColor: colors.offWhite,
      borderRadius: '12px',
      paddingVertical: '10px',
      paddingHorizontal: '15px',
      marginBottom: '30px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    },
    alertsText: {
      fontSize: '16px',
      fontWeight: '500',
      color: colors.darkTealAccent,
      marginLeft: '10px',
    },
    // Setting Item
    settingItem: {
      backgroundColor: colors.white,
      borderRadius: '12px',
      paddingVertical: '18px',
      paddingHorizontal: '20px',
      marginBottom: '10px',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      minHeight: '40px',
    },
    settingText: {
      fontSize: '18px',
      color: colors.darkText,
      fontWeight: '400',
      flex: 1,
    }
  };

  // Helper function to render a single setting row
  const SettingRow: React.FC<{ label: string, isActive: boolean, onToggle: () => void }> = ({ label, isActive, onToggle }) => (
    <div style={styles.settingItem}>
      <span style={styles.settingText}>{label}</span>
      <ToggleSwitch isActive={isActive} onToggle={onToggle} />
    </div>
  );

  return (
    <div style={styles.safeArea}>
      <div style={styles.container}>
        
        {/* Top Navigation Header */}
        <div style={styles.navHeader}>
          <button style={styles.backButton} onClick={() => console.log('Go back')}>
            <ChevronLeftIcon color={colors.darkTealAccent} />
          </button>
          <span style={styles.navTitle}>Notifications</span>
          <UserIcon color={colors.darkTealAccent} />
        </div>

        {/* Manage Alerts Bar */}
        <div style={styles.alertsBar}>
            <ChevronLeftIcon size={18} color={colors.darkTealAccent} />
            <span style={styles.alertsText}>Manage how you receive alerts</span>
        </div>

        {/* Settings List */}
        <div style={styles.settingsList}>
          
          <SettingRow 
            label="Push Notification" 
            isActive={pushEnabled} 
            onToggle={() => setPushEnabled(!pushEnabled)} 
          />
          
          <SettingRow 
            label="Email Updates" 
            isActive={emailEnabled} 
            onToggle={() => setEmailEnabled(!emailEnabled)} 
          />
          
          {/* Modified from Assignment Reminders to Event Reminders */}
          <SettingRow 
            label="Event Reminders" 
            isActive={eventRemindersEnabled} 
            onToggle={() => setEventRemindersEnabled(!eventRemindersEnabled)} 
          />
          
          <SettingRow 
            label="Sounds/Vibrations" 
            isActive={soundsEnabled} 
            onToggle={() => setSoundsEnabled(!soundsEnabled)} 
          />

        </div>

      </div>
    </div>
  );
};

export default NotificationSettings;