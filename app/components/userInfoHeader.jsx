import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const AVATAR_SIZE = 96;

const UserInfoHeader = ({ firstName, lastName, email, bio, photo, onPhotoChange }) => {
  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission required');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      onPhotoChange({ type: 'upload', uri });
    }
  };

  return (
    <View style={styles.safeAreaContainer}>
      <View style={styles.row}>
        <View style={styles.left}>
          <View style={styles.avatarContainer}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.avatar} />
            ) : (
              <Ionicons
                name="person-circle-outline"
                size={AVATAR_SIZE}
                color="white"
              />
            )}

            <TouchableOpacity style={styles.cameraIcon} onPress={openGallery}>
              <Ionicons name="camera" size={18} color="black" />
            </TouchableOpacity>
          </View>

          {photo && (
            <TouchableOpacity onPress={() => onPhotoChange({ type: 'remove' })}>
              <Text style={styles.remove}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.right}>
          <Text style={styles.name}>
            {firstName} {lastName}
          </Text>
          <Text style={styles.username}>@{email}</Text>
          <Text style={styles.bio}>{bio || 'Add bio'}</Text>
        </View>
      </View>
    </View>
  );
};

export default UserInfoHeader;

const styles = StyleSheet.create({
  safeAreaContainer: {
    backgroundColor: '#262729',
    margin: 20,
    borderRadius: 10,
    padding: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 20,
  },
  left: {
    alignItems: 'center',
  },
  right: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  username: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  bio: {
    fontSize: 14,
    color: '#ccc',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  avatarContainer: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 4,
  },
  remove: {
    color: 'red',
    marginTop: 8,
    fontSize: 14,
  },
});
