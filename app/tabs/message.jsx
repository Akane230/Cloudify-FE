import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.pangitKharl}>REVIEW AND ACCEPT MY PR DICKHEAD</Text>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,                     
    justifyContent: 'center',    
    alignItems: 'center',        
    backgroundColor: 'white',    
  },
  pangitKharl: {
    fontSize: 30,
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',          
  },
})