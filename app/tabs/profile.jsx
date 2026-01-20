import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SettingsIcon from '../../assets/icons/settingsIcon';
import MessageIconInactive from '../../assets/icons/messageIconInactive';
import FriendreqIcon from '../../assets/icons/friendreqIcon';
import ArchiveIcon from '../../assets/icons/archiveIcon';

const AVATAR_SIZE = 80;

const Profile = () => {
  const router = useRouter();

  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    photo: null,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/user', { withCredentials: true });
        setUser({
          firstName: res.data.first_name,
          lastName: res.data.last_name,
          email: res.data.email,
          photo: res.data.profile_picture_url || null,
        });
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      Alert.alert('Log Out', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await api.post('/logout', {}, { withCredentials: true });
            await AsyncStorage.removeItem('authToken');
            router.replace('/index'); 
          },
        },
      ]);
    } catch (err) {
      console.error('Logout failed:', err.response?.data || err.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.userInfoContainer}>
          <TouchableOpacity
            style={styles.userInfoButton}
            onPress={() => router.push('/pages/userInfo')}
            activeOpacity={0.7}
          >
            <View style={styles.avatarContainer}>
              {user.photo ? (
                <Image source={{ uri: user.photo }} style={styles.avatar} />
              ) : (
                <View
                  style={[
                    styles.avatar,
                    { justifyContent: 'center', alignItems: 'center', backgroundColor: 'gray' },
                  ]}
                >
                  <Text style={{ color: 'white', fontSize: 36 }}>
                    {user.firstName?.[0]}
                    {user.lastName?.[0]}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.userTextContainer}>
              <Text style={styles.userName}>
                {user.firstName} {user.lastName}
              </Text>
              <Text style={styles.userHandle}>@{user.email}</Text>
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.menuCard}>
          <SettingsIcon width={24} height={24} />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuCard}>
          <MessageIconInactive width={24} height={24} />
          <Text style={styles.menuText}>Message requests</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuCard}>
          <FriendreqIcon width={24} height={24} />
          <Text style={styles.menuText}>Friend requests</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuCard}>
          <ArchiveIcon width={24} height={24} />
          <Text style={styles.menuText}>Archive</Text>
        </TouchableOpacity>

        <View style={styles.logOutContainer}>
          <TouchableOpacity style={styles.logOutButton} onPress={handleLogout}>
            <Text style={styles.logOutText}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  title: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  userInfoContainer: {
    marginBottom: 20,
    backgroundColor: '#262729',
    borderRadius: 10,
    padding: 15,
  },
  userInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    width: '100%',
  },
  avatarContainer: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: 'hidden',
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  userTextContainer: {
    flex: 1,
  },
  userName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userHandle: {
    color: 'gray',
    fontSize: 14,
    marginTop: 2,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262729',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  menuText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 15,
  },
  logOutContainer: {
    marginTop: 40,
    marginBottom: 30,
  },
  logOutButton: {
    backgroundColor: '#262729',
    borderRadius: 10,
    padding: 15,
    paddingHorizontal: 50,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  logOutText: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
