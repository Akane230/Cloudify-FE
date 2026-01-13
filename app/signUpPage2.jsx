import { View, Text, StyleSheet, Image, useWindowDimensions, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFonts, Unna_700Bold } from '@expo-google-fonts/unna';
import { authService } from '../services/authService';

const SignUpPage2 = () => {
  const [fontsLoaded] = useFonts({
    UnnaBold: Unna_700Bold,
  });

  const { width, height } = useWindowDimensions();
  const router = useRouter();

  const params = useLocalSearchParams();

  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!signUpEmail || !signUpPassword || !signUpConfirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (signUpPassword.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        username: params.username,
        email: signUpEmail,
        first_name: params.firstName,
        last_name: params.lastName,
        display_name: `${params.firstName} ${params.lastName}`,
        phone_number: '',
        profile_picture_url: '',
        password: signUpPassword,
        password_confirmation: signUpConfirmPassword,
      };

      await authService.register(userData);

      Alert.alert('Success', 'Registration successful!', [
        {
          text: 'OK',
          onPress: () => router.push('/'), 
        },
      ]);
    } catch (error) {
      console.error('Registration error:', error);

      let errorMessage = 'Registration failed';
      if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        errorMessage = errors.join('\n');
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
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
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading}
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
                editable={!isLoading}
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
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>SIGN UP</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.pageNumber}>2 / 2 pages</Text>

          <Text style={styles.signUpText}>
            Already have an account? <Text style={styles.signUpLink} onPress={() => router.push('/')}>Sign In</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SignUpPage2;

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
  buttonDisabled: {
    opacity: 0.6,
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

