import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackIcon from '../../assets/icons/backIcon';
import UserInfoHeader from '../components/userInfoHeader';
import api from '../../config/api';

const userInfo = () => {
  const router = useRouter();

  const handleBack = () => {
    router.push('/tabs/profile');
  };

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [bio, setBio] = useState('');
  const [editableBio, setEditableBio] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [photo, setPhoto] = useState(null);
  const [originalUser, setOriginalUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/user', { withCredentials: true });
        const user = {
          firstName: res.data.first_name || '',
          lastName: res.data.last_name || '',
          bio: res.data.bio || '',
          username: res.data.username || '',
          email: res.data.email || '',
          phoneNumber: res.data.phone_number || '',
          photo: res.data.profile_picture_url || null,
        };

        setOriginalUser(user);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setBio(user.bio);
        setEditableBio(user.bio);
        setUsername(user.username);
        setEmail(user.email);
        setPhoneNumber(user.phoneNumber);
        setPhoto(user.photo);
      } catch (err) {
        console.error(err.response?.data || err.message);
      }
    };

    fetchUser();
  }, []);

  const handlePhotoChange = async ({ type, uri }) => {
    try {
      if (type === 'upload') {
        const formData = new FormData();
        formData.append('image', { uri, name: 'profile.jpg', type: 'image/jpeg' });
        const res = await api.post('/user/profile-picture', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setPhoto(res.data.profile_picture_url);
      } else if (type === 'remove') {
        await api.delete('/user/profile-picture');
        setPhoto(null);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const handleSave = async () => {
    try {
      const payload = {
        first_name: firstName,
        last_name: lastName,
        bio: editableBio,
        username,
        email,
        phone_number: phoneNumber,
      };

      const res = await api.put('/user', payload, { withCredentials: true });

      setFirstName(res.data.first_name);
      setLastName(res.data.last_name);
      setBio(res.data.bio);
      setEditableBio(res.data.bio ?? '');
      setUsername(res.data.username);
      setEmail(res.data.email);
      setPhoneNumber(res.data.phone_number);

      setOriginalUser({
        firstName: res.data.first_name,
        lastName: res.data.last_name,
        bio: res.data.bio,
        username: res.data.username,
        email: res.data.email,
        phoneNumber: res.data.phone_number,
        photo,
      });

      setIsEditing(false);
    } catch (err) {
      console.error('Save failed:', err.response?.data || err.message);
    }
  };

  const isDirty =
    originalUser &&
    (firstName !== originalUser.firstName ||
      lastName !== originalUser.lastName ||
      editableBio !== originalUser.bio ||
      username !== originalUser.username ||
      email !== originalUser.email ||
      phoneNumber !== originalUser.phoneNumber ||
      photo !== originalUser.photo);

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <BackIcon width={7} height={14} fill="white" />
          </TouchableOpacity>

          <Text style={styles.text}>User Information</Text>

          <TouchableOpacity onPress={handleSave} disabled={!isDirty} style={styles.saveButton}>
            <Text style={[styles.saveText, { color: isDirty ? '#4da6ff' : '#666' }]}>Save</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.userInfoContainer}>
          <UserInfoHeader
            firstName={firstName}
            lastName={lastName}
            email={email}
            bio={editableBio}
            photo={photo}
            onPhotoChange={handlePhotoChange}
            editable={true}
          />

          <View style={styles.outerContainer}>
            {/** First Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>First Name</Text>
              <View style={styles.innerContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="First Name"
                  placeholderTextColor="gray"
                  value={firstName}
                  onChangeText={setFirstName}
                  color="white"
                />
              </View>
            </View>

            {/** Last Name */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Last Name</Text>
              <View style={styles.innerContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Last Name"
                  placeholderTextColor="gray"
                  value={lastName}
                  onChangeText={setLastName}
                  color="white"
                />
              </View>
            </View>

            {/** Bio */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Bio</Text>
              <View style={styles.innerContainer}>
                {isEditing ? (
                  <TextInput
                    style={[styles.input, styles.bioInput]}
                    placeholder="Add bio"
                    placeholderTextColor="gray"
                    value={editableBio}
                    onChangeText={setEditableBio}
                    multiline
                    autoFocus
                  />
                ) : (
                  <TouchableOpacity style={{ flex: 1 }} onPress={() => setIsEditing(true)}>
                    <Text
                      style={[
                        styles.input,
                        { color: bio ? 'white' : 'gray', fontStyle: bio ? 'normal' : 'italic' },
                      ]}
                    >
                      {bio || 'Add bio'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/** Username */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Username</Text>
              <View style={styles.innerContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  placeholderTextColor="gray"
                  value={username}
                  onChangeText={setUsername}
                  color="white"
                />
              </View>
            </View>

            {/** Email */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.innerContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  placeholderTextColor="gray"
                  value={email}
                  onChangeText={setEmail}
                  color="white"
                />
              </View>
            </View>

            {/** Phone Number */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.innerContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Phone Number"
                  placeholderTextColor="gray"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  color="white"
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default userInfo;

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
  outerContainer: {
    paddingHorizontal: 20, 
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 20, 
  },
  label: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
    marginBottom: 8,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#262729',
    borderRadius: 15,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 16,
  },
  bioInput: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  saveButton: {
    position: 'absolute',
    right: 20,
  },
  saveText: {
    color: '#4da6ff',
    fontSize: 16,
    fontWeight: '600',
  },
});