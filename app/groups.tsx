import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const groups = [
  { name: 'Study Buddies', members: '234 members', category: 'Academic' },
  { name: 'Campus Gamers', members: '567 members', category: 'Gaming' },
  { name: 'Fitness Club', members: '189 members', category: 'Sports' },
  { name: 'Art & Design', members: '345 members', category: 'Creative' },
  { name: 'Book Club', members: '156 members', category: 'Literature' },
  { name: 'Tech Innovators', members: '423 members', category: 'Technology' },
];

const categories = ['All', 'Academic', 'Sports', 'Creative', 'Social'];

const GroupsScreen: React.FC = () => {
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // filter by category + search
  const filteredGroups = groups.filter((group) => {
    const matchesCategory =
      selectedCategory === 'All' || group.category === selectedCategory;

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      q.length === 0 || group.name.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={styles.safe}>
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
            placeholder="Search groups"
            placeholderTextColor="#7A9A8A"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.chipRow}>
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  activeOpacity={0.8}
                  style={[
                    styles.chip,
                    isSelected && styles.chipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipText,
                      isSelected && styles.chipTextSelected,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Groups list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Groups</Text>
          <View style={styles.groupsList}>
            {filteredGroups.map((group, index) => (
              <View key={index} style={styles.groupCard}>
                <View style={styles.groupInfo}>
                  <Text style={styles.groupName}>{group.name}</Text>
                  <Text style={styles.groupMembers}>{group.members}</Text>
                </View>
                <TouchableOpacity style={styles.joinButton}>
                  <Text style={styles.joinButtonText}>Join</Text>
                </TouchableOpacity>
              </View>
            ))}

            {filteredGroups.length === 0 && (
              <Text style={styles.emptyText}>
                No groups match this category/search yet.
              </Text>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#D4E9DB',
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
  micIcon: {
    marginLeft: 8,
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
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#9BD9C3',
    borderRadius: 999,
  },
  chipSelected: {
    backgroundColor: '#7BC87B',
  },
  chipText: {
    color: '#2D4A3A',
    fontSize: 14,
  },
  chipTextSelected: {
    fontWeight: '700',
  },
  groupsList: {
    gap: 10,
  },
  groupCard: {
    backgroundColor: '#9BD9C3',
    borderRadius: 18,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupInfo: {
    flex: 1,
    marginRight: 12,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2D4A3A',
  },
  groupMembers: {
    fontSize: 13,
    color: '#5A9A7A',
    marginTop: 2,
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#7BC87B',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    color: '#7A9A8A',
  },
});

export default GroupsScreen;
