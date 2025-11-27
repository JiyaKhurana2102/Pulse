import { getUserId, GroupRecord, leaveGroup, listGroups } from '@/services/groups';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function MyGroupsScreen() {
  const [groups, setGroups] = useState<GroupRecord[]>([]);
  const [userGroups, setUserGroups] = useState<GroupRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const uid = await getUserId();
        const data = await listGroups();
        setGroups(data);
        setUserGroups(data.filter(g => g.members.includes(uid)));
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <LinearGradient
      colors={['#FFFFFF', '#FFF7ED', '#FED7AA', '#D1FAE5', '#ECFEFF', '#FFFFFF']}
      locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Your Groups</Text>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {loading && <Text style={styles.message}>Loading...</Text>}
          {error && <Text style={styles.todo}>{error}</Text>}
          {!loading && !error && userGroups.length === 0 && (
            <View style={styles.contentContainer}>
              <Text style={styles.message}>You haven't joined any groups yet.</Text>
              <Text style={styles.todo}>Go to "Join a Group" to browse.</Text>
            </View>
          )}
          {!loading && userGroups.map(g => (
            <View key={g.id} style={styles.groupCardRow}>
              <Pressable style={styles.groupInfoCol} onPress={() => {
                // Navigate to group chat
                // Using imperative navigation from expo-router
                try {
                  // dynamic route push
                  // eslint-disable-next-line @typescript-eslint/no-var-requires
                  const { router } = require('expo-router');
                  router.push(`/group/${g.id}`);
                } catch {}
              }}>
                <Text style={styles.groupName}>{g.name}</Text>
                <Text style={styles.groupMeta}>{g.members.length} members</Text>
              </Pressable>
              <Text
                style={styles.leaveButton}
                onPress={() => {
                  Alert.alert(
                    'Leave Group',
                    `Do you want to leave "${g.name}"?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Yes',
                        onPress: async () => {
                          const uid = await getUserId();
                          await leaveGroup(g.id, uid);
                          setUserGroups(prev => prev.filter(x => x.id !== g.id));
                        },
                      },
                    ],
                  );
                }}
              >
                Leave
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-start',
    paddingTop: 100,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
    color: '#1A1A1A',
    marginBottom: 20,
    textAlign: 'center',
  },
  contentContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  scrollContent: {
    paddingBottom: 40,
    gap: 12,
  },
  message: {
    fontSize: 16,
    color: '#4A4A4A',
    marginBottom: 10,
    lineHeight: 22,
  },
  todo: {
    fontSize: 14,
    color: '#C0392B',
    marginTop: 15,
    fontStyle: 'italic',
  },
  groupCardRow: {
    backgroundColor: '#5cc4a4',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  groupInfoCol: {
    flexShrink: 1,
    paddingRight: 12,
  },
  groupName: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  groupMeta: {
    fontSize: 13,
    fontFamily: 'Inter_400Regular',
    color: 'rgba(255,255,255,0.85)',
  },
  leaveButton: {
    borderWidth: 2,
    borderColor: '#dc2626',
    color: '#dc2626',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    textAlign: 'center',
    minWidth: 80,
    fontFamily: 'Inter_700Bold',
  },
});
