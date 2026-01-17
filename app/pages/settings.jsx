import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackIcon from '../../assets/icons/backIcon';
import UserInfoHeader from '../components/userInfoHeader';
import api from '../../config/api';

const Settings = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push('/tabs/profile');
  };

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/user', { withCredentials: true });

        const user = {
          firstName: res.data.first_name || '',
          lastName: res.data.last_name || '',
          bio: res.data.bio || '',
          email: res.data.email || '',
          photo: res.data.profile_picture_url || null,
        };

        setFirstName(user.firstName);
        setLastName(user.lastName);
        setBio(user.bio);
        setEmail(user.email);
        setPhoto(user.photo);
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView style={styles.container}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <BackIcon width={7} height={14} fill="white" />
          </TouchableOpacity>

          <Text style={styles.text}>Settings</Text>
        </View>

        {!loading && (
          <View style={styles.userInfoContainer}>
            <UserInfoHeader
              firstName={firstName}
              lastName={lastName}
              email={email}
              bio={bio}
              photo={photo}
            />
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  userInfoContainer: {
    paddingBottom: 40,
  },
});