import { View, Text, StyleSheet, Image, useWindowDimensions, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFonts, Unna_700Bold } from '@expo-google-fonts/unna';

const SignUpPage = () => {
  const [fontsLoaded] = useFonts({
    UnnaBold: Unna_700Bold,
  });

  const { width, height } = useWindowDimensions();
  const router = useRouter();

  const [signUpFirstName, setSignUpFirstName] = useState("");
  const [signUpLastName, setSignUpLastName] = useState("");
  const [signUpUsername, setSignUpUsername] = useState("");

  const handleNext = () => {
    if (!signUpFirstName || !signUpLastName || !signUpUsername) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    router.push(
      `/signUpPage2?firstName=${encodeURIComponent(signUpFirstName)}&lastName=${encodeURIComponent(signUpLastName)}&username=${encodeURIComponent(signUpUsername)}`
    );
  };

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={[styles.header, { width: width, height: height * 0.25 }]}>
          <Image
            source={require('../assets/logo/logo2_black.png')}
            style={{
              width: width * 1.3,
              height: height * 0.5,
              resizeMode: 'contain',
            }}
          />
        </View>

        <View style={styles.signUpContainer}>
          <View style={styles.outerContainer}>
            <Text style={styles.label}>First Name</Text>
            <View style={styles.innerContainer}>
              <TextInput
                placeholder="first name"
                placeholderTextColor="white"
                style={styles.input}
                value={signUpFirstName}
                onChangeText={setSignUpFirstName}
                keyboardType="default"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.outerContainer}>
            <Text style={styles.label}>Last Name</Text>
            <View style={styles.innerContainer}>
              <TextInput
                placeholder="last name"
                placeholderTextColor="white"
                style={styles.input}
                value={signUpLastName}
                onChangeText={setSignUpLastName}
                keyboardType="default"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.outerContainer}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.innerContainer}>
              <TextInput
                placeholder="username"
                placeholderTextColor="white"
                style={styles.input}
                value={signUpUsername}
                onChangeText={setSignUpUsername}
                keyboardType="default"
                autoCapitalize="none"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>NEXT</Text>
          </TouchableOpacity>

          <Text style={styles.pageNumber}>1 / 2 pages</Text>

          <Text style={styles.signUpText}>
            Already have an account? <Text style={styles.signUpLink} onPress={() => router.push('/')}>Sign In</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUpPage;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: "black",
    marginTop: -50,
  },
  container: {},
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 75,
  },
  signUpContainer: {
    marginTop: 50,
    paddingHorizontal: 35,
  },
  outerContainer: {
    paddingVertical: 15,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 15,
  },
  label: {
    color: 'white',
    fontSize: 18,
  },
  input: {
    flex: 1,
    color: 'white',
  },
  button: {
    backgroundColor: '#72a1f1',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'UnnaBold',
  },
  pageNumber: {
    color: 'white',
    fontSize: 12,
    marginTop: 20,
    textAlign: 'right',
  },
  signUpText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  signUpLink: {
    color: '#72a1f1',
  },
});

