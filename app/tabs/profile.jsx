import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const profile = () => {
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <Text style={styles.text}>Profile</Text>

        <View style={styles.userInfoContainer}>

        </View>

        <View style={styles.logOutContainer}>
          <TouchableOpacity style={styles.logOutButton}></TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  )
}

export default profile

const styles = StyleSheet.create({ 
  safeAreaContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,     
    backgroundColor: 'black',
  },
  text: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    alignItems: 'flex-start',
    left: 20,
  },
  userInfoContainer: {
    backgroundColor: '#262729',
    margin: 20,
    borderRadius: 10,
    padding: 70,
  },
  logOutContainer: {
    backgroundColor: '#262729',
    margin: 20,
    borderRadius: 10,
    padding: 20,
  },
  logOutButton: {

  },
});