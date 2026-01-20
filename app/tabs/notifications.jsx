import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

const notifications = () => {
  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}></View>
    </SafeAreaView>
  )
}

export default notifications


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
});