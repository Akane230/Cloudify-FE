import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const create = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>

        {/* Temporary Back Button */}
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={{ color: 'white' }}>create</Text>
      </View>
    </SafeAreaView>
  )
}

export default create;

const styles = StyleSheet.create({
  safeAreaContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    color: 'white',
    fontSize: 16,
  },
});
