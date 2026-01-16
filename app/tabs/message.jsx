import { View, Text, TextInput, StyleSheet, TouchableOpacity, useWindowDimensions, ActivityIndicator, Image, ScrollView } from 'react-native';
import React, { act, useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CreateIcon from '../../assets/icons/createIcon';
import api from '../../config/api';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const AVATAR_SIZE = 98;

const Home = () => {
  const [activeTab, setActiveTab] = useState('allChats');
  const [searchText, setSearchText] = useState('');

  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState(null);

  const router = useRouter();
  const { width } = useWindowDimensions();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/user', { withCredentials: true });
        setUsername(response.data.username);
        setPhoto(response.data.profile_picture_url);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const openGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setPhoto(uri);
      uploadProfilePicture(uri);
    }
  };

  const uploadProfilePicture = async (uri) => {
    const formData = new FormData();
    formData.append('image', {
      uri,
      name: 'profile.jpg',
      type: 'image/jpeg',
    });

    try {
      const res = await api.post('/user/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setPhoto(res.data.profile_picture_url);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView contentContainerStyle={[styles.container, { width }]}>

        <View style={styles.header}>
          <View style={{ width: 24 }} />
          <Text style={styles.usernameText}>{username || 'user_name'}</Text>
          <TouchableOpacity onPress={() => router.push('/pages/createGroupChat')}>
            <CreateIcon width={24} height={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#999" style={{ marginLeft: 12 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.userAccounts}>
          <View style={styles.avatarWrapper}>
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

            <Text style={styles.userYou}>You</Text>
          </View>
        </View>

        <View style={styles.messageTabs}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab('allChats')}
          >
            <Text style={[styles.tabText, activeTab === 'allChats' && styles.tabActiveText]}>All Chats</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.tab}
            onPress={() => setActiveTab('messageRequest')}
          >
            <Text style={[styles.tabText, activeTab === 'messageRequest' && styles.tabActiveText]}>Message Request</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  header: {
    width: '100%',
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  usernameText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    backgroundColor: 'black',       
    borderWidth: 1,                  
    borderColor: 'white',           
    borderRadius: 25,                
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 16,
    alignSelf: 'center',
  },
  searchInput: {
    flex: 1,
    color: 'white',
    marginLeft: 8,
    fontSize: 16,
  },
  userAccounts: {
    width: '100%',
    paddingHorizontal: 16,
    marginTop:20,
  },
  avatarWrapper: {
    width: AVATAR_SIZE,
    alignItems: 'center',
    position: 'relative',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 22,
    right: 6,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 3,
  },
  userYou: {
    marginTop: 6,
    color: 'white',
    textAlign: 'center',
  },
  messageTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 24,
    width: '100%',
  },
  tab: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: 'white',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '500',
  },
  activeTabText: {
    fontWeight: '700',
  },
});