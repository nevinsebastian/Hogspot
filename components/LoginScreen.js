import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Define theme colors
const THEME = {
  primary: '#DD88CF',
  primaryDark: '#4B164C',
  background: '#FDF7FD',
  inputBackground: '#dcdcdc',
  text: '#2D2D2D',
  placeholder: '#999999',
};

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://15.206.127.132:8000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
        body: new URLSearchParams({
          username,
          password,
          grant_type: '',
          scope: '',
          client_id: '',
          client_secret: '',
        }).toString(),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        await AsyncStorage.setItem('auth_token', data.access_token);
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      } else {
        Alert.alert('Login Failed', data.detail || 'Invalid credentials');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={THEME.primaryDark} />
        </TouchableOpacity>

        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
              <Text variant="headlineLarge" style={styles.title}>Sign In</Text>
              <Text style={styles.subtitle}>Hi! Welcome back, please sign in to continue</Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                mode="outlined"
                placeholder="Enter your email"
                placeholderTextColor={THEME.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                outlineStyle={styles.inputOutline}
                outlineColor={THEME.primary}
                activeOutlineColor={THEME.primaryDark}
                theme={{
                  colors: {
                    primary: THEME.primaryDark,
                    text: THEME.text,
                    placeholder: THEME.placeholder,
                    background: THEME.inputBackground,
                  },
                  roundness: 16,
                }}
                contentStyle={styles.inputContent}
              />

              <Text style={[styles.inputLabel, { marginTop: 16 }]}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={styles.input}
                mode="outlined"
                placeholder="Enter your password"
                placeholderTextColor={THEME.placeholder}
                outlineStyle={styles.inputOutline}
                outlineColor={THEME.primary}
                activeOutlineColor={THEME.primaryDark}
                theme={{
                  colors: {
                    primary: THEME.primaryDark,
                    text: THEME.text,
                    placeholder: THEME.placeholder,
                    background: THEME.inputBackground,
                  },
                  roundness: 16,
                }}
                contentStyle={styles.inputContent}
                right={
                  <TextInput.Icon
                    icon={showPassword ? "eye-off" : "eye"}
                    onPress={() => setShowPassword(!showPassword)}
                    color={THEME.primary}
                    style={styles.eyeIcon}
                  />
                }
              />

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.button}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
                loading={loading}
                disabled={loading}
                buttonColor={THEME.primary}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>

              <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Or sign in with</Text>
                <View style={styles.divider} />
              </View>

              <View style={styles.socialButtonsContainer}>
                <TouchableOpacity style={styles.socialButton}>
                  <Icon name="apple" size={24} color="#000" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Icon name="google" size={24} color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                  <Icon name="facebook" size={24} color="#4267B2" />
                </TouchableOpacity>
              </View>

              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                  <Text style={styles.signUpLink}>Sign Up</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 20,
    left: 20,
    zIndex: 1,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 80 : 40,
    paddingBottom: 24,
    minHeight: SCREEN_HEIGHT - (Platform.OS === 'ios' ? 120 : 80),
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: THEME.primaryDark,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: THEME.text,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.7,
  },
  inputContainer: {
    width: '100%',
    marginTop: 0,
  },
  inputLabel: {
    fontSize: 16,
    color: THEME.primaryDark,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    marginBottom: 8,
    backgroundColor: THEME.inputBackground,
    borderRadius: 16,
    overflow: 'hidden',
  },
  inputOutline: {
    borderRadius: 16,
  },
  inputContent: {
    backgroundColor: THEME.inputBackground,
    height: 56,
  },
  eyeIcon: {
    marginRight: 8,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
    marginTop: 8,
  },
  forgotPasswordText: {
    color: THEME.primaryDark,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  button: {
    borderRadius: 30,
    marginBottom: 24,
    elevation: 4,
    shadowColor: THEME.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonContent: {
    paddingVertical: 8,
    height: 56,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: '600',
    letterSpacing: 0.5,
    color: '#FFFFFF',
    textTransform: 'none',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: THEME.primary,
    opacity: 0.3,
  },
  dividerText: {
    marginHorizontal: 16,
    color: THEME.text,
    fontSize: 14,
    opacity: 0.7,
  },
  socialButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: THEME.inputBackground,
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: THEME.text,
    fontSize: 14,
    opacity: 0.7,
  },
  signUpLink: {
    color: THEME.primaryDark,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
