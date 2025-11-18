import React, { useState } from 'react';
// Tailwind CSS classes are used directly on elements.

// --- STYLING CONSTANTS (Matching your elegant, light green/mint theme) ---
const BACKGROUND_COLOR = '#E0F2F1'; // Light mint/teal background
const ACCENT_COLOR_LIGHT = '#B2DFDB'; // Lighter teal for button background
const ACCENT_COLOR_DARK = '#4DB6AC';  // Darker teal for borders/accents
const TEXT_COLOR_DARK = '#303030';   // Dark gray for primary text (simulating elegance)
const TEXT_COLOR_MINT = '#26A69A';   // Mint color for headers

// --- NAVIGATION/VIEW STATE ---
const SCREENS = {
    SELECTION: 'selection',
    NEW_GROUP: 'new_group',
    NEW_EVENT: 'new_event',
};

// --- Custom Components ---

/**
 * Common Button Component styled to match your design (rounded corners, soft shadow).
 */
const MobileButton = ({ children, onClick, className = '', disabled = false, ...props }) => (
    <button
        onClick={onClick}
        className={`w-full py-4 px-4 my-2 text-lg font-semibold tracking-wide rounded-xl shadow-md transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]
                   text-gray-800 border-2 border-teal-400/50 hover:bg-teal-300/80 
                   ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        style={{ backgroundColor: ACCENT_COLOR_LIGHT }}
        disabled={disabled}
        {...props}
    >
        {children}
    </button>
);

/**
 * Back Button Component (using inline SVG)
 */
const BackButton = ({ onClick }) => (
    <button
        onClick={onClick}
        className="absolute top-4 left-4 p-2 rounded-full text-xl z-10 transition-colors shadow-lg focus:outline-none"
        style={{ backgroundColor: ACCENT_COLOR_DARK }}
    >
        {/* Simple Back Arrow SVG (Lucide: arrow-left) */}
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
    </button>
);

/**
 * --- 1. NEW GROUP FORM ---
 */
const NewGroupForm = ({ onBack }) => {
    const [groupName, setGroupName] = useState('');
    const [description, setDescription] = useState('');
    const [inviteNeeded, setInviteNeeded] = useState(false);
    const [message, setMessage] = useState(null);

    const handleCreateGroup = () => {
        // Simple message box display
        setMessage(`Group "${groupName || 'Untitled Group'}" Created!`);
        setTimeout(() => {
            setMessage(null);
            onBack();
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full p-6 relative">
            <BackButton onClick={onBack} />
            
            {/* Message Box */}
            {message && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white p-4 rounded-lg shadow-xl z-50 text-center transition-opacity duration-300">
                    {message}
                </div>
            )}

            <div className="flex-1 overflow-y-auto pt-16 pb-4">
                {/* Group Name Input */}
                <input
                    type="text"
                    placeholder="(Group Name)"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="w-full text-4xl text-center font-light bg-transparent outline-none placeholder-gray-500/80 mb-1 pt-4"
                    style={{ color: TEXT_COLOR_DARK }}
                />
                <div className="h-px w-3/4 mx-auto mb-8" style={{ backgroundColor: ACCENT_COLOR_DARK + '80' }}></div>

                {/* Group Description */}
                <label className="text-2xl font-light mb-2 block" style={{ color: TEXT_COLOR_DARK }}>Group description</label>
                <textarea
                    placeholder=""
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="w-full p-4 text-lg rounded-xl resize-none outline-none border-2 focus:ring-2 focus:ring-teal-500 shadow-inner"
                    style={{ backgroundColor: ACCENT_COLOR_LIGHT + '60', borderColor: ACCENT_COLOR_DARK + '40', color: TEXT_COLOR_DARK }}
                />
                
                {/* Invite Needed Switch (using Tailwind for look-alike) */}
                <div className="flex justify-between items-center rounded-full p-3 mt-6 shadow-inner"
                     style={{ backgroundColor: ACCENT_COLOR_LIGHT, borderColor: ACCENT_COLOR_DARK + '40', borderWidth: '1px' }}>
                    <span className="text-lg font-semibold ml-2" style={{ color: TEXT_COLOR_DARK }}>Invite needed</span>
                    <label className="relative inline-flex items-center cursor-pointer mr-2">
                        <input type="checkbox" checked={inviteNeeded} onChange={() => setInviteNeeded(!inviteNeeded)} className="sr-only peer" />
                        <div className={`w-11 h-6 rounded-full peer-focus:outline-none transition-all duration-300 shadow-inner 
                            ${inviteNeeded ? 'bg-teal-600' : 'bg-gray-400'}`}>
                            <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow 
                                ${inviteNeeded ? 'translate-x-full' : 'translate-x-0'}`}></div>
                        </div>
                    </label>
                </div>
            </div>

            <MobileButton onClick={handleCreateGroup} disabled={!!message}>
                Create Group
            </MobileButton>
        </div>
    );
};

/**
 * --- 2. NEW EVENT FORM ---
 */
const NewEventForm = ({ onBack }) => {
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState(null);

    const handleScheduleEvent = () => {
        // Simple message box display
        setMessage(`Event "${eventName || 'Untitled Event'}" Scheduled!`);
        setTimeout(() => {
            setMessage(null);
            onBack();
        }, 1500);
    };

    // Placeholder for the Calendar and Time selector UI
    const CalendarPlaceholder = () => (
        <div className="bg-white rounded-2xl shadow-lg p-5 mt-6 border-2" style={{ borderColor: ACCENT_COLOR_DARK + '20' }}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold" style={{ color: TEXT_COLOR_DARK }}>April 2025</h3>
                <div className="flex space-x-3">
                    {/* Chevron Left SVG */}
                    <svg className="w-4 h-4 cursor-pointer" style={{ color: ACCENT_COLOR_DARK }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path>
                    </svg>
                    {/* Chevron Right SVG */}
                    <svg className="w-4 h-4 cursor-pointer" style={{ color: ACCENT_COLOR_DARK }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"></path>
                    </svg>
                </div>
            </div>
            
            <div className="grid grid-cols-7 text-center text-sm font-bold mb-2">
                {/* Days of the week */}
                {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((day, i) => (
                    <span key={i} className="text-gray-500">{day}</span>
                ))}
            </div>

            <div className="grid grid-cols-7 text-center">
                {/* Dates */}
                <span className="col-start-3"></span>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30].map((date, i) => (
                    <span 
                        key={i} 
                        className={`p-1 m-1 cursor-pointer rounded-full transition-colors 
                            ${date === 20 ? 'font-bold' : ''}`}
                        style={{
                            backgroundColor: date === 20 ? ACCENT_COLOR_DARK + '20' : 'transparent',
                            borderColor: date === 20 ? ACCENT_COLOR_DARK + '40' : 'transparent',
                            borderWidth: date === 20 ? '1px' : '0',
                            color: date === 20 ? TEXT_COLOR_MINT : TEXT_COLOR_DARK,
                        }}
                    >
                        {date}
                    </span>
                ))}
            </div>

            <div className="flex justify-between items-center mt-5 pt-3 border-t" style={{ borderTopColor: BACKGROUND_COLOR }}>
                <span className="text-lg font-medium" style={{ color: TEXT_COLOR_DARK }}>Time</span>
                <div className="rounded-xl px-4 py-2 shadow-md" style={{ backgroundColor: ACCENT_COLOR_DARK }}>
                    <span className="text-white font-bold text-lg">9:41 AM</span>
                </div>
            </div>
        </div>
    );

    return (
        <div className="flex flex-col h-full p-6 relative">
            <BackButton onClick={onBack} />
            
            {/* Message Box */}
            {message && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-500 text-white p-4 rounded-lg shadow-xl z-50 text-center transition-opacity duration-300">
                    {message}
                </div>
            )}

            <div className="flex-1 overflow-y-auto pt-16 pb-4">
                {/* Event Name Input */}
                <input
                    type="text"
                    placeholder="(Event Name)"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="w-full text-4xl text-center font-light bg-transparent outline-none placeholder-gray-500/80 mb-1 pt-4"
                    style={{ color: TEXT_COLOR_DARK }}
                />
                <div className="h-px w-3/4 mx-auto mb-8" style={{ backgroundColor: ACCENT_COLOR_DARK + '80' }}></div>
                
                {/* Event Description */}
                <label className="text-2xl font-light mb-2 block" style={{ color: TEXT_COLOR_DARK }}>Event description</label>
                <textarea
                    placeholder=""
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full p-4 text-lg rounded-xl resize-none outline-none border-2 focus:ring-2 focus:ring-teal-500 shadow-inner"
                    style={{ backgroundColor: ACCENT_COLOR_LIGHT + '60', borderColor: ACCENT_COLOR_DARK + '40', color: TEXT_COLOR_DARK }}
                />

                {/* Calendar / Date Picker Placeholder */}
                <CalendarPlaceholder />
            </div>

            <MobileButton onClick={handleScheduleEvent} disabled={!!message}>
                Schedule Event
            </MobileButton>
        </div>
    );
};


/**
 * --- 3. SELECTION SCREEN ---
 */
const SelectionScreen = ({ navigate }) => (
    <div className="flex flex-col items-center p-8 h-full">
        <h1 className="text-5xl font-light mt-16 mb-12" style={{ color: TEXT_COLOR_DARK }}>Event</h1>
        <h2 className="text-xl font-light mb-10" style={{ color: TEXT_COLOR_DARK }}>Choose one of the following:</h2>
        
        <MobileButton onClick={() => navigate(SCREENS.NEW_GROUP)} className="mb-4">
            New group
        </MobileButton>
        
        <MobileButton onClick={() => navigate(SCREENS.NEW_EVENT)}>
            New event
        </MobileButton>
    </div>
);


/**
 * --- MAIN APP COMPONENT (Web Wrapper) ---
 */
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
        <div 
            className="flex min-h-screen items-center justify-center p-2 sm:p-5"
            style={{ backgroundColor: BACKGROUND_COLOR }}
        >
            {/* Mobile Frame Container (Simulating iPhone View) */}
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[90vh] relative">
                {renderScreen()}
            </div>
            <p className="mt-4 text-xs text-gray-500">
                Web-compatible version using React and Tailwind CSS.
            </p>
        </div>
    );
}