import { View, Text, StyleSheet, Image, useWindowDimensions, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React from 'react';
import {useRouter} from 'expo-router';
import { useState, useEffect } from 'react'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import {Ionicons} from '@expo/vector-icons';
import { useFonts, Unna_700Bold } from '@expo-google-fonts/unna';
import * as SplashScreen from 'expo-splash-screen';
import { authService } from '../services/authService';

const SignInPage = () => {

  const [fontsLoaded] = useFonts({
    UnnaBold: Unna_700Bold,
  });

  const {width, height} = useWindowDimensions();

  const router = useRouter();

  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    if (!signInEmail || !signInPassword) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }

    setIsLoading(true);

    const response = await authService.login(signInEmail, signInPassword);

    if (response.success) {
      Alert.alert("Success", "You have successfully logged in!");
      router.push('/tabs/message');
    } else {
      Alert.alert("Error", response.message || "Invalid email or password.");
    }

    setIsLoading(false);
  };
  
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeAreaContainer}>
      <View style={styles.container}>
        <View style={[styles.header, {width: width, height: height * 0.25}]}>
          <Image
            source = {require('../assets/logo/logo2_black.png')}
            style={{
              width: width * 1.3,
              height: height * 0.5,
              resizeMode: 'contain',
            }}
          />
        </View>

        <View style={styles.signInContainer}>
          <View style={styles.outerContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.innerContainer}>
              <TextInput
                placeholder="enter email address"
                placeholderTextColor="white"
                style={styles.input}
                value={signInEmail}
                onChangeText={setSignInEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.outerContainer}>
            <Text style={styles.label}>Password</Text> 
            <View style={styles.innerContainer}>
              <TextInput
                placeholder="enter password"
                placeholderTextColor="white"
                style={styles.passwordInput}
                value={signInPassword}
                onChangeText={setSignInPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />

              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="white" />  
              </TouchableOpacity>  
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleSignIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>SIGN IN</Text>
            )}
          </TouchableOpacity>
          
          <Text style={styles.signUpText}>
            Don't have an account? <Text style={styles.signUpLink} onPress={() => router.push('signUpPage1')}>Sign Up</Text>
          </Text>
          
        </View>

      </View>
    </SafeAreaView>
      
  )
}

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
  container: {

  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 75,
  },
  signInContainer: {
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
    paddingTop: 15,
    paddingBottom: 15,

  },
  label: {
    color: 'white',
    fontSize: 18,
  },
  input: {
    flex: 1,
    color: 'white',
  },
  passwordContainer: {
    
  },
  passwordInput: {
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
    paddingTop: 15,
    paddingBottom: 15,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontFamily: 'UnnaBold',
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

export default SignInPage;