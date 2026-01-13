import { View, Text, TextInput, StyleSheet, TouchableOpacity, useWindowDimensions, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CreateIcon from '../../assets/icons/createIcon';
import api from '../../config/api'; 
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const Home = () => {
  
  const [activeTab, setActiveTab] = useState("signIn");

  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [photo, setPhoto] = useState(null);

  const router = useRouter();

  const { width, height } = useWindowDimensions();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/user', {
          withCredentials: true, 
        });
        setUsername(response.data.username); 
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is required!');
      return;
    }

    // Open camera
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1], 
      quality: 1,
    });

    if (!result.canceled) {
      console.log(result.assets[0].uri); // URI of the captured image
    }

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  


  if (loading) {
    return (
      <View style={{flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'black'}}>
        <ActivityIndicator size="large" color="white"/>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>

        <View style={styles.header}>
          <View style={{ width: 40}} />
          <Text style={styles.usernameText}>{username || 'user_name'}</Text>
          <TouchableOpacity style={styles.createButton} onPress={() => router.push('/group_chat/create')}>
            <CreateIcon width={24} height={24}/>
          </TouchableOpacity>
        </View>

        <View style={styles.userAccounts}>
          <View style={styles.currentUserWrapper}>
            <Ionicons name="person-circle-outline" size={98} color="white" />
            <TouchableOpacity style={styles.cameraIcon} onPress={openCamera}>
              <Ionicons name="camera" size={20} color="black" />
            </TouchableOpacity>
            <Text style={styles.userYou}>You</Text>
          </View>
        </View>

        <View style={styles.messageTabs}>
          <TouchableOpacity style={[styles.tab]} 
          onPress={() => { setActiveTab("signIn"); setSignInEmail(""); setSignInPassword(""); }}>
            <Text style={[styles.tabText, activeTab === "signIn" && styles.activeTabText]}>Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.tab]} 
          onPress={() => { setActiveTab("register"); setFirstName(""); setLastName(""); setUsername(""); setRegisterEmail(""); setRegisterPassword(""); setConfirmPassword(""); }}>
            <Text style={[styles.tabText, activeTab === "register" && styles.activeTabText]}>Register</Text>
          </TouchableOpacity>
        </View>

    </View>

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
    flex: 1,                     
    alignItems: 'center',        
    backgroundColor: 'black',    
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    position: 'relative',
  },
  usernameText: {
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  createButton: {
    position: 'absolute',
    right: -116,
    alignItems: 'center',
  },
  outerContainer: {
    marginTop: 20,
    width: '90%',
  },
  label: {
    color: 'white',
    marginBottom: 5,
    fontSize: 14,
  },
  innerContainer: {
    height: 50,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 40,
    justifyContent: 'center',
    paddingHorizontal: 20,   
  },
  input: {
    color: 'white',
    fontSize: 16,
  },
  userAccounts: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'flex-start',
    width: '100%',
  },
  currentUserWrapper: {
    position: 'relative',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 30,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 2,
  },
  userYou: {
    color: 'white',
    textAlign: 'center',
  },
  messageTabs: {

  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
});
