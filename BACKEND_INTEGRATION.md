# Backend Integration Complete ✅

## Summary
Your frontend is now connected to the Express/Firebase backend running on **localhost:8080**.

## What Changed

### 1. API Configuration
- **File**: `constants/api.ts`
- **Change**: Set `API_BASE = 'http://localhost:8080'`
- **Note**: For real device testing, replace `localhost` with your computer's LAN IP (e.g., `192.168.x.x`)

### 2. Authentication Service
- **File**: `services/auth.ts`
- **Changes**:
  - Removed AsyncStorage-based local user management
  - Added Firebase backend authentication
  - `login()` → calls `POST /auth/login` with email/password
  - `signup()` → calls `POST /auth/signup` with name/email/password
  - Stores Firebase `idToken`, `refreshToken`, and user `uid` in AsyncStorage
  - Added `getAuthToken()` helper for authenticated requests
  - Removed `seedDefaultUser()` (no longer needed)

### 3. Groups Service
- **File**: `services/groups.ts`
- **Changes**:
  - Set `LOCAL_MODE = false`
  - All functions now call backend endpoints with authentication:
    - `listGroups()` → `GET /groups`
    - `createGroup()` → `POST /groups`
    - `joinGroup()` → `POST /groups/:id/join`
  - Added `getAuthHeaders()` to include Bearer token in requests
  - `getUserId()` now retrieves Firebase `uid` from AsyncStorage

### 4. Events Service
- **File**: `services/events.ts`
- **Changes**:
  - Set `LOCAL_MODE = false`
  - Updated `EventRecord` interface:
    - Added `group` field (required group ID)
    - Added `attendees` array (backend RSVP tracking)
  - Updated functions:
    - `listEvents()` → Fetches events from all groups via `GET /events/group/:id`
    - `createEvent()` → `POST /events` with **required** `groupId` parameter
    - `saveEvent()` → `POST /events/:id/rsvp` (RSVP to event)
    - `unsaveEvent()` → Not yet implemented in backend (logged warning)
    - `listUserEvents()` → Filters by `attendees` array instead of `savedBy`

### 5. Event Creation UI
- **File**: `app/(tabs)/create.tsx`
- **Changes**:
  - Added group selector (required for backend events)
  - Added state: `groups`, `selectedGroup`, `showGroupPicker`
  - Added `useEffect` to load groups on mount
  - New UI component: Group picker card (purple) between Event Name and Location
  - Group picker modal with scrollable list of available groups
  - Validation: Requires group selection before creating event
  - Added styles: `pickerTitle`, `groupPickerScroll`, `groupPickerItem`, `groupPickerItemSelected`, `groupPickerItemText`

### 6. App Layout
- **File**: `app/_layout.tsx`
- **Changes**:
  - Removed `seedDefaultUser()` import and call
  - Authentication now relies on backend signup/login

## Backend Requirements

Your backend must be running on **localhost:8080** with these endpoints:

### Auth Endpoints
- `POST /auth/signup` - Create Firebase user
  - Body: `{ email, password, name }`
  - Returns: `{ user: { uid, email, name }, idToken, refreshToken }`

- `POST /auth/login` - Login with Firebase
  - Body: `{ email, password }`
  - Returns: `{ user: { uid, email, name }, idToken, refreshToken }`

### Groups Endpoints
- `GET /groups` - List all groups
- `POST /groups` - Create new group
  - Body: `{ name, description, category }`
  - Returns: `{ groupId }`
- `POST /groups/:id/join` - Join group
  - Body: `{ userId }`

### Events Endpoints
- `POST /events` - Create event
  - Body: `{ name, description, date, time, group, location, category }`
  - Returns: `{ eventId }`
- `GET /events/group/:id` - List events in group
- `POST /events/:id/rsvp` - RSVP to event
  - Body: `{ userId }`

## Testing Steps

1. **Start Backend**:
   ```bash
   cd campus-app-backend
   node server.js
   ```
   Verify it's running on port 8080.

2. **Start Frontend**:
   ```bash
   npx expo start
   ```

3. **Test Flow**:
   - Open app → Login screen appears (no default user)
   - Create new account with signup
   - Create a group first (groups are required for events)
   - Create an event (must select a group)
   - Verify data persists in Firebase/Firestore

## Known Limitations

1. **No Un-RSVP**: Backend doesn't have an endpoint to un-RSVP from events yet
2. **No Leave Group**: Backend doesn't have an endpoint to leave groups
3. **Event Filtering**: `listEvents()` fetches from all groups, may be slow with many groups

## Reverting to Local Mode

If you need to switch back to offline/local mode:

1. Set `LOCAL_MODE = true` in:
   - `services/groups.ts` (line 5)
   - `services/events.ts` (line 3)

2. Revert `services/auth.ts` to use AsyncStorage

3. Add back `seedDefaultUser()` in `app/_layout.tsx`
