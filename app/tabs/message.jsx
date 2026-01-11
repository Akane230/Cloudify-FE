import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import CreateIcon from '../../assets/icons/createIcon';
import api from '../../config/api'; 

const Home = () => {
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
          <Text style={styles.usernameText}>{username || 'user_name'}</Text>
          <TouchableOpacity style={styles.createButton} onPress={() => router.push('/group_chat/create')}>
            <CreateIcon width={24} height={24}/>
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
  createButton : {
    position: 'absolute',
    right: -116,
    alignItems: 'center',
  },
})
