import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// ---- ICON TYPE SAFETY ----
export type IoniconName = keyof typeof Ionicons.glyphMap;
export type MaterialName = keyof typeof MaterialCommunityIcons.glyphMap;

interface SafeIconProps {
  name: IoniconName | MaterialName;
  library: 'ion' | 'mci';
  size: number;
  color: string;
}

const SafeIcon = ({ name, library, size, color }: SafeIconProps) => {
  return library === 'ion' ? (
    <Ionicons name={name as IoniconName} size={size} color={color} />
  ) : (
    <MaterialCommunityIcons name={name as MaterialName} size={size} color={color} />
  );
};

// ---- EDITABLE ROW ----
interface EditableRowProps {
  label: string;
  value: string;
  iconName: IoniconName | MaterialName;
  library?: 'ion' | 'mci';
  isPassword?: boolean;
  onChangeText?: (text: string) => void;
  onPress?: () => void;
  keyboardType?: 'default' | 'number-pad' | 'phone-pad';
}

const EditableRow = ({
  label,
  value,
  iconName,
  library = 'mci',
  isPassword = false,
  onChangeText,
  onPress,
  keyboardType = 'default',
}: EditableRowProps) => {
  return (
    <View style={styles.row}>
      <View style={styles.iconContainer}>
        <SafeIcon name={iconName} library={library} size={28} color={ICON_COLOR} />
      </View>

      <Pressable style={styles.inputBox} onPress={onPress} disabled={!onPress}>
        {onPress ? (
          <Text style={styles.inputText}>{value || label}</Text>
        ) : (
          <TextInput
            style={styles.inputText}
            value={value}
            onChangeText={onChangeText}
            placeholder={label}
            placeholderTextColor={TEXT_COLOR_DARK + '80'}
            secureTextEntry={isPassword}
            keyboardType={keyboardType}
          />
        )}
      </Pressable>

      <SafeIcon
        name={isPassword ? ('eye-off' as MaterialName) : ('pencil' as MaterialName)}
        library="mci"
        size={24}
        color={ICON_COLOR}
      />
    </View>
  );
};

// ---- MAIN SCREEN ----
const BACKGROUND_COLOR = 'transparent';
const ACCENT_COLOR = '#008080ff';
const ICON_COLOR = '#4DB6AC';
const TEXT_COLOR_DARK = '#ffffffff';

export default function SettingsScreen() {
  const [name, setName] = useState('Jiya Khurana');
  const [email, setEmail] = useState('test@email');
  const [password, setPassword] = useState('********');
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);

  // const handleDateChange = (event: any, selectedDate?: Date) => {
  //  // const currentDate = selectedDate || dateOfBirth;
  //   setShowDatePicker(Platform.OS === 'ios');
  //   setDateOfBirth(currentDate);
  // };

  // const formattedDate = dateOfBirth.toLocaleDateString('en-US', {
  //   month: '2-digit',
  //   day: '2-digit',
  //   year: 'numeric',
  // });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImageUri(result.assets[0].uri);
    }
  };

  return (
    <LinearGradient
      colors={['#FFFFFF', '#FFF7ED', '#FED7AA', '#D1FAE5', '#ECFEFF', '#FFFFFF']}
      locations={[0, 0.2, 0.4, 0.6, 0.8, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ ...styles.safeArea, backgroundColor: 'transparent' }}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          {/* Header
          <View style={styles.header}>
            <SafeIcon name="arrow-back" library="ion" size={28} color={ICON_COLOR} />
            <Text style={styles.title}>Settings</Text>
            <View style={{ width: 28 }} />
          </View> */}

          {/* Profile Button */}
          <Pressable style={styles.profileButton}>
            <Text style={styles.profileButtonText}>Profile</Text>
          </Pressable>

          {/* Image Upload */}
          <TouchableOpacity style={styles.imageContainer} onPress={pickImage}>
            {profileImageUri ? (
              <Image source={{ uri: profileImageUri }} style={styles.profileImage} />
            ) : (
              <View style={styles.profilePlaceholder} />
            )}
            <View style={styles.uploadOverlay}>
              <Text style={styles.uploadText}>Upload</Text>
            </View>
          </TouchableOpacity>

          {/* Editable Fields */}
          <View style={styles.settingsList}>
            <EditableRow
              label="Name"
              value={name}
              onChangeText={setName}
              iconName="account-outline"
              library="mci"
            />
            <EditableRow
              label="Email"
              value={email}
              onChangeText={setEmail}
              iconName="email-outline"
              library="mci"
              keyboardType="default"
            />

            <EditableRow
              label="Password"
              value={password}
              onChangeText={setPassword}
              iconName="lock-outline"
              library="mci"
              isPassword
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}

// ---- STYLES ----
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'transparent' },
  flex: { flex: 1 },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 100, alignItems: 'center' },

  header: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 15,
  },

  title: {
    fontSize: 34,
    fontFamily: 'Inter_400Regular',
    fontWeight: '300',
    color: TEXT_COLOR_DARK,
    flex: 1,
    textAlign: 'center',
  },

  profileButton: {
    backgroundColor: ACCENT_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 5,
    marginBottom: 25,
  },

  profileButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_COLOR_DARK,
    fontFamily: 'Inter_400Regular',
  },

  imageContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: ACCENT_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    overflow: 'hidden',
  },

  profilePlaceholder: { width: '100%', height: '100%', backgroundColor: ACCENT_COLOR },
  profileImage: { width: '100%', height: '100%' },

  uploadOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingVertical: 5,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
  },

  uploadText: { color: '#fff', fontSize: 12, fontWeight: '500' },

  settingsList: { width: '100%', alignItems: 'center' },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },

  iconContainer: { width: 40, justifyContent: 'center', alignItems: 'center', marginRight: 10 },

  inputBox: {
    flex: 1,
    backgroundColor: ACCENT_COLOR,
    borderRadius: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    paddingHorizontal: 15,
    marginRight: 10,
    justifyContent: 'center',
    minHeight: 50,
  },

  inputText: { fontSize: 17, color: TEXT_COLOR_DARK, fontWeight: '400' },

  editIcon: { width: 30, textAlign: 'center' },
});
