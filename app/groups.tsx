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
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header + back button */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#5A9A7A" />
          </TouchableOpacity>
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
    backgroundColor: '#D4E9DB',
  },
  content: {
    padding: 16,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#9BD9C3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D4A3A',
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
  categoryRow: {
    gap: 8,
    paddingRight: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#9BD9C3',
  },
  categoryChipSelected: {
    backgroundColor: '#7BC87B',
  },
  categoryText: {
    fontSize: 14,
    color: '#2D4A3A',
  },
  categoryTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
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
  groupMeta: {
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
  emptyState: {
    backgroundColor: '#B5D4C5',
    borderRadius: 18,
    padding: 16,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2D4A3A',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#5A9A7A',
  },
});

export default GroupsScreen;
