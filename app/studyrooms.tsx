import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Room = {
  id: number;
  name: string;
  building: string;
  floor: string;
  capacity: number;
  amenities: string[];
  // if false, room is permanently unavailable (e.g., maintenance)
  available: boolean;
};

type Reservation = {
  roomId: number;
  dateKey: string; // "YYYY-MM-DD"
  timeSlot: string;
  reservedBy: string;
};

const STORAGE_KEY = 'pulse_studyroom_reservations_v1';

const initialRooms: Room[] = [
  {
    id: 1,
    name: 'Study Room 101',
    building: 'Library',
    floor: '1st Floor',
    capacity: 4,
    amenities: ['Whiteboard', 'TV', 'Outlets'],
    available: true,
  },
  {
    id: 2,
    name: 'Study Room 205',
    building: 'Library',
    floor: '2nd Floor',
    capacity: 6,
    amenities: ['Whiteboard', 'Windows', 'Outlets'],
    available: true,
  },
  {
    id: 3,
    name: 'Group Space A',
    building: 'Student Center',
    floor: '3rd Floor',
    capacity: 8,
    amenities: ['TV', 'Whiteboard', 'Windows'],
    available: true, 
  },
  {
    id: 4,
    name: 'Study Room 302',
    building: 'Library',
    floor: '3rd Floor',
    capacity: 4,
    amenities: ['Whiteboard', 'Outlets'],
    available: true,
  },
];

const buildings = ['All', 'Library', 'Student Center', 'Academic Hall'];

const timeSlots = [
  '9:00 AM - 11:00 AM',
  '11:00 AM - 1:00 PM',
  '2:00 PM - 4:00 PM',
  '4:00 PM - 6:00 PM',
];

// Date -> "YYYY-MM-DD"
const dateKeyFromDate = (d: Date): string => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

// Date -> "MM/DD/YYYY" for display
const formatDate = (d: Date): string => {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

// Compare Y-M-D only
const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

// "2:00 PM - 4:00 PM" + baseDate -> end Date | null
const parseTimeSlotEnd = (timeSlot: string, baseDate: Date): Date | null => {
  const parts = timeSlot.split('-');
  if (parts.length !== 2) return null;
  const endPart = parts[1].trim(); // "4:00 PM"
  const [timePart, ampm] = endPart.split(' ');
  if (!timePart || !ampm) return null;
  const [hourStr, minuteStr] = timePart.split(':');
  const minute = Number(minuteStr ?? '0');
  let hour = Number(hourStr);
  if (isNaN(hour) || isNaN(minute)) return null;

  const ampmUpper = ampm.toUpperCase();
  if (ampmUpper === 'PM' && hour < 12) hour += 12;
  if (ampmUpper === 'AM' && hour === 12) hour = 0;

  return new Date(
    baseDate.getFullYear(),
    baseDate.getMonth(),
    baseDate.getDate(),
    hour,
    minute,
    0,
    0
  );
};

const StudyRoomsScreen: React.FC = () => {
  const router = useRouter();

  const [rooms] = useState<Room[]>(initialRooms);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reservationsLoaded, setReservationsLoaded] = useState(false);

  const [selectedTime, setSelectedTime] = useState<string>('2:00 PM - 4:00 PM');
  const [selectedBuilding, setSelectedBuilding] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Real-time "now" and "today"
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Date selection via calendar
  const [selectedDate, setSelectedDate] = useState<Date>(today);

  // min/max for reservation: today → today+30 days
  const minDate = today;
  const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 30);

  // Name prompt state
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [roomToReserve, setRoomToReserve] = useState<Room | null>(null);
  const [tempName, setTempName] = useState('');

  const selectedDateKey = dateKeyFromDate(selectedDate);

  // Load reservations from AsyncStorage on mount
  useEffect(() => {
    const loadReservations = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          const parsed = JSON.parse(json) as Reservation[];
          setReservations(parsed);
        }
      } catch (e) {
        console.log('Error loading reservations', e);
      } finally {
        setReservationsLoaded(true);
      }
    };
    loadReservations();
  }, []);

  // Save reservations whenever they change (after initial load)
  useEffect(() => {
    if (!reservationsLoaded) return;
    const saveReservations = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reservations));
      } catch (e) {
        console.log('Error saving reservations', e);
      }
    };
    saveReservations();
  }, [reservations, reservationsLoaded]);

  const filteredRooms = rooms.filter((room) => {
    const matchesBuilding =
      selectedBuilding === 'All' || room.building === selectedBuilding;

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      q.length === 0 ||
      room.name.toLowerCase().includes(q) ||
      room.building.toLowerCase().includes(q);

    return matchesBuilding && matchesSearch;
  });

  const findReservation = (roomId: number): Reservation | undefined =>
    reservations.find(
      (r) =>
        r.roomId === roomId &&
        r.dateKey === selectedDateKey &&
        r.timeSlot === selectedTime
    );

  const handleReservePress = (room: Room) => {
    if (!room.available) {
      Alert.alert('Unavailable', 'This room is not reservable right now.');
      return;
    }

    // past date?
    if (selectedDate.getTime() < today.getTime()) {
      Alert.alert('Past date', 'You cannot reserve a room for a date in the past.');
      return;
    }

    // if today, block ended time slots
    if (isSameDay(selectedDate, today)) {
      const end = parseTimeSlotEnd(selectedTime, selectedDate);
      if (end && end.getTime() <= now.getTime()) {
        Alert.alert(
          'Time not available',
          'You cannot reserve a time slot that has already ended today.'
        );
        return;
      }
    }

    // double booking check
    if (findReservation(room.id)) {
      Alert.alert(
        'Already reserved',
        'This room is already reserved for that time slot.'
      );
      return;
    }

    setRoomToReserve(room);
    setTempName('');
    setShowNamePrompt(true);
  };

  const handleConfirmReserve = () => {
    if (!roomToReserve || !tempName.trim()) return;

    const name = tempName.trim();

    setReservations((prev) => [
      ...prev,
      {
        roomId: roomToReserve.id,
        dateKey: selectedDateKey,
        timeSlot: selectedTime,
        reservedBy: name,
      },
    ]);

    setShowNamePrompt(false);
    setRoomToReserve(null);
    setTempName('');
  };

  const handleCancelReserve = () => {
    setShowNamePrompt(false);
    setRoomToReserve(null);
    setTempName('');
  };

  return (
    <SafeAreaView style={{ ...styles.safe, backgroundColor: 'transparent' }}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#5A9A7A" />
        </TouchableOpacity>

        {/* Search bar */}
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={18}
            color="#7A9A8A"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search by room or building"
            placeholderTextColor="#7A9A8A"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Date selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Date</Text>
          <View style={styles.datePickerContainer}>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              minimumDate={minDate}
              maximumDate={maxDate}
              display="spinner"
              onChange={(event: DateTimePickerEvent, date?: Date) => {
                if (event.type === 'set' && date) {
                  const onlyDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                  setSelectedDate(onlyDate);
                }
              }}
              textColor="#2D4A3A"
            />
          </View>
        </View>

        {/* Time selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timeGrid}>
            {timeSlots.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <TouchableOpacity
                  key={time}
                  onPress={() => setSelectedTime(time)}
                  activeOpacity={0.8}
                  style={[
                    styles.timeButton,
                    isSelected && styles.timeButtonSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.timeButtonText,
                      isSelected && styles.timeButtonTextSelected,
                    ]}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Building filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Building</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.buildingRow}
          >
            {buildings.map((building) => {
              const isSelected = selectedBuilding === building;
              return (
                <TouchableOpacity
                  key={building}
                  onPress={() => setSelectedBuilding(building)}
                  activeOpacity={0.8}
                  style={[
                    styles.buildingChip,
                    isSelected && styles.buildingChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.buildingChipText,
                      isSelected && styles.buildingChipTextSelected,
                    ]}
                  >
                    {building}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Available rooms */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Rooms</Text>
          <View style={styles.roomsList}>
            {filteredRooms.map((room) => {
              const reservation = findReservation(room.id);
              const isPermanentlyUnavailable = !room.available;
              const isReserved = !!reservation;

              return (
                <View
                  key={room.id}
                  style={[
                    styles.roomCard,
                    (isPermanentlyUnavailable || isReserved) &&
                      styles.roomCardUnavailable,
                  ]}
                >
                  <View style={styles.roomHeader}>
                    <View style={styles.roomInfo}>
                      <Text style={styles.roomName}>{room.name}</Text>
                      <Text style={styles.roomSub}>
                        {room.building} • {room.floor}
                      </Text>
                    </View>

                    {isReserved ? (
                      <View style={styles.bookedTag}>
                        <Text style={styles.bookedTagText}>
                          Reserved by {reservation?.reservedBy}
                        </Text>
                      </View>
                    ) : isPermanentlyUnavailable ? (
                      <View style={styles.bookedTag}>
                        <Text style={styles.bookedTagText}>Booked</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.reserveButton}
                        onPress={() => handleReservePress(room)}
                      >
                        <Text style={styles.reserveButtonText}>Reserve</Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={styles.roomFooter}>
                    <View style={styles.capacityRow}>
                      <Ionicons
                        name="people-outline"
                        size={16}
                        color="#5A9A7A"
                      />
                      <Text style={styles.capacityText}>{room.capacity}</Text>
                    </View>
                    <View style={styles.amenitiesRow}>
                      {room.amenities.slice(0, 2).map((amenity, index) => (
                        <View key={index} style={styles.amenityChip}>
                          <Text style={styles.amenityText}>{amenity}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              );
            })}

            {filteredRooms.length === 0 && (
              <Text style={styles.emptyText}>
                No rooms match this search/building yet.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Name prompt overlay */}
      {showNamePrompt && (
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>
              Reserve {roomToReserve?.name} at {selectedTime}
            </Text>
            <Text style={styles.modalSubtitle}>
              Date: {formatDate(selectedDate)}
            </Text>
            <TextInput
              placeholder="Enter your name"
              placeholderTextColor="#7A9A8A"
              style={styles.modalInput}
              value={tempName}
              onChangeText={setTempName}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancel]}
                onPress={handleCancelReserve}
              >
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalConfirm]}
                onPress={handleConfirmReserve}
              >
                <Text style={styles.modalConfirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  content: {
    padding: 16,
    paddingTop: 20,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#9BD9C3',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B5D4C5',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 4,
    fontSize: 16,
    color: '#2D4A3A',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#2D4A3A',
    marginBottom: 12,
    fontWeight: '600',
  },
  datePickerContainer: {
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#B5D4C5',
    paddingVertical: 8,
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeButton: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#9BD9C3',
  },
  timeButtonSelected: {
    backgroundColor: '#7BC87B',
  },
  timeButtonText: {
    fontSize: 14,
    color: '#2D4A3A',
  },
  timeButtonTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  buildingRow: {
    gap: 8,
    paddingRight: 8,
  },
  buildingChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#9BD9C3',
  },
  buildingChipSelected: {
    backgroundColor: '#7BC87B',
  },
  buildingChipText: {
    color: '#2D4A3A',
    fontSize: 14,
  },
  buildingChipTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  roomsList: {
    gap: 10,
  },
  roomCard: {
    borderRadius: 18,
    padding: 12,
    backgroundColor: '#9BD9C3',
  },
  roomCardUnavailable: {
    backgroundColor: '#B5D4C5',
    opacity: 0.85,
  },
  roomHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  roomInfo: {
    flex: 1,
    marginRight: 12,
  },
  roomName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D4A3A',
  },
  roomSub: {
    fontSize: 13,
    color: '#5A9A7A',
    marginTop: 2,
  },
  reserveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#7BC87B',
  },
  reserveButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  bookedTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#7A9A8A',
  },
  bookedTagText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  roomFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  capacityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  capacityText: {
    fontSize: 13,
    color: '#5A9A7A',
  },
  amenitiesRow: {
    flexDirection: 'row',
    gap: 6,
  },
  amenityChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#B5D4C5',
  },
  amenityText: {
    fontSize: 12,
    color: '#2D4A3A',
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    color: '#7A9A8A',
  },
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    width: '80%',
    backgroundColor: '#D4E9DB',
    borderRadius: 20,
    padding: 16,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D4A3A',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#5A9A7A',
    marginBottom: 12,
  },
  modalInput: {
    borderRadius: 999,
    backgroundColor: '#B5D4C5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: '#2D4A3A',
    marginBottom: 12,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  modalButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  modalCancel: {
    backgroundColor: '#B5D4C5',
  },
  modalConfirm: {
    backgroundColor: '#7BC87B',
  },
  modalCancelText: {
    color: '#2D4A3A',
    fontWeight: '500',
  },
  modalConfirmText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default StudyRoomsScreen;
