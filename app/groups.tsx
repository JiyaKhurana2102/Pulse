import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Group = {
  id: string;
  name: string;
  members: string;   // e.g. "234 members"
  category: string;  // e.g. "Academic"
};

const categories = ['All', 'Academic', 'Sports', 'Creative', 'Social', 'Other'];

const GroupsScreen: React.FC = () => {
  const router = useRouter();

  
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const filteredGroups = groups.filter((group) => {
    const matchesCategory =
      selectedCategory === 'All' || group.category === selectedCategory;

    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      q.length === 0 ||
      group.name.toLowerCase().includes(q) ||
      group.category.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <SafeAreaView style={{ ...styles.safe, backgroundColor: 'transparent' }}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Join a Group</Text>
        </View>

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
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  activeOpacity={0.8}
                  style={[
                    styles.categoryChip,
                    isSelected && styles.categoryChipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      isSelected && styles.categoryTextSelected,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Groups list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Groups</Text>

          {filteredGroups.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No groups available yet</Text>
              <Text style={styles.emptySubtitle}>
                Once groups are created, they&apos;ll show up here so you can join them.
              </Text>
            </View>
          ) : (
            <View style={styles.groupsList}>
              {filteredGroups.map((group) => (
                <View key={group.id} style={styles.groupCard}>
                  <View style={styles.groupInfo}>
                    <Text style={styles.groupName}>{group.name}</Text>
                    <Text style={styles.groupMeta}>
                      {group.members} • {group.category}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.joinButton}>
                    <Text style={styles.joinButtonText}>Join</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
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
  headerRow: {
    marginBottom: 32,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b8e6b8',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 4,
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Inter_400Regular',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#111827',
    marginBottom: 12,
    fontFamily: 'Inter_700Bold',
  },
  categoryRow: {
    gap: 8,
    paddingRight: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#f6a278',
  },
  categoryChipSelected: {
    backgroundColor: '#ff9966',
  },
  categoryText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontFamily: 'Inter_400Regular',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
  groupsList: {
    gap: 10,
  },
  groupCard: {
    backgroundColor: '#5cc4a4',
    borderRadius: 24,
    padding: 16,
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
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
  },
  groupMeta: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
    fontFamily: 'Inter_400Regular',
  },
  joinButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#ff9966',
  },
  joinButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    fontSize: 14,
  },
  emptyState: {
    backgroundColor: '#b8e6b8',
    borderRadius: 24,
    padding: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#1F2937',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#374151',
    fontFamily: 'Inter_400Regular',
  },
});

export default GroupsScreen;
