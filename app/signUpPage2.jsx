import { View, Text, StyleSheet, Image, useWindowDimensions, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Unna_700Bold } from '@expo-google-fonts/unna';

const SignUpPage2 = () => {

  const [fontsLoaded] = useFonts({
    UnnaBold: Unna_700Bold,
  });

  const { width, height } = useWindowDimensions();
  const router = useRouter();

  // States
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
          {/* Email */}
          <View style={styles.outerContainer}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.innerContainer}>
              <TextInput
                placeholder="email address"
                placeholderTextColor="white"
                style={styles.input}
                value={signUpEmail}
                onChangeText={setSignUpEmail}
                keyboardType="default"
                autoCapitalize="none"
              />
            </View>
          </View>

          {/* Password */}
          <View style={styles.outerContainer}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.innerContainer}>
              <TextInput
                placeholder="enter password"
                placeholderTextColor="white"
                style={styles.passwordInput}
                value={signUpPassword}
                onChangeText={setSignUpPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.outerContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.innerContainer}>
              <TextInput
                placeholder="confirm password"
                placeholderTextColor="white"
                style={styles.passwordInput}
                value={signUpConfirmPassword}
                onChangeText={setSignUpConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={() => router.push('signUpPage2')}>
            <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>

          <Text style={styles.pageNumber}>2 / 2 pages</Text>

          <Text style={styles.signUpText}>
            Already have an account? <Text style={styles.signUpLink} onPress={() => router.push('/')}>Sign In</Text>
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

export default SignUpPage2;
