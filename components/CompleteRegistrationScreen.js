import React, { useState, useRef } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define theme colors (matching RegisterScreen)
const THEME = {
  primary: '#DD88CF',
  primaryDark: '#4B164C',
  background: '#FDF7FD',
  inputBackground: '#FFFFFF',
  text: '#2D2D2D',
  placeholder: '#999999',
  error: '#FF0000',
};

const CompleteRegistrationScreen = ({ route, navigation }) => {
  const { email } = route.params;
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isAgeValid, setIsAgeValid] = useState(true);
  
  const monthRef = useRef(null);
  const yearRef = useRef(null);

  const validatePassword = (pass, confirm) => {
    if (pass.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (confirm && pass !== confirm) {
      return 'Passwords do not match';
    }
    return '';
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    const error = validatePassword(text, confirmPassword);
    setErrors(prev => ({
      ...prev,
      password: error,
      confirmPassword: error || validatePassword(text, confirmPassword)
    }));
  };

  const handleConfirmPasswordChange = (text) => {
    setConfirmPassword(text);
    const error = validatePassword(password, text);
    setErrors(prev => ({
      ...prev,
      confirmPassword: error
    }));
  };

  const checkAge = (d, m, y) => {
    if (!d || !m || !y || y.length !== 4) return true; // Don't show error until complete date is entered
    
    const birthDate = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
    const today = new Date();
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred this year
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 18;
  };

  const handleDayChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue.length <= 2) {
      setDay(numericValue);
      setIsAgeValid(checkAge(numericValue, month, year));
      if (numericValue.length === 2 && parseInt(numericValue) <= 31 && parseInt(numericValue) > 0) {
        monthRef.current?.focus();
      }
    }
  };

  const handleMonthChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue.length <= 2) {
      setMonth(numericValue);
      setIsAgeValid(checkAge(day, numericValue, year));
      if (numericValue.length === 2 && parseInt(numericValue) <= 12 && parseInt(numericValue) > 0) {
        yearRef.current?.focus();
      }
    }
  };

  const handleYearChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue.length <= 4) {
      setYear(numericValue);
      setIsAgeValid(checkAge(day, month, numericValue));
    }
  };

  const validateDate = () => {
    const currentDate = new Date();
    const inputDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    
    // Check if date is valid
    if (inputDate.toString() === 'Invalid Date') {
      return 'Please enter a valid date';
    }

    // Check if all parts are filled
    if (!day || !month || !year || year.length !== 4) {
      return 'Please enter a complete date';
    }

    if (!isAgeValid) {
      return 'You must be at least 18 years old';
    }

    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Legal name is required';
    }
    
    const passwordError = validatePassword(password, confirmPassword);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    const dateError = validateDate();
    if (dateError) {
      newErrors.dateOfBirth = dateError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDateForApi = () => {
    const paddedDay = day.padStart(2, '0');
    const paddedMonth = month.padStart(2, '0');
    return `${year}-${paddedMonth}-${paddedDay}`;
  };

  const handleLogin = async (email, password) => {
    try {
      console.log('Attempting login with:', { email });
      
      // Create form data
      const formData = new URLSearchParams();
      formData.append('username', email);
      formData.append('password', password);
      formData.append('grant_type', '');
      formData.append('scope', '');
      formData.append('client_id', '');
      formData.append('client_secret', '');

      const loginResponse = await fetch('http://18.207.241.126/login', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const loginData = await loginResponse.json();
      console.log('Login response:', loginData);

      if (loginResponse.ok && loginData.access_token) {
        // Store the token with the same key as LoginScreen
        await AsyncStorage.setItem('auth_token', loginData.access_token);
        await AsyncStorage.setItem('userEmail', email);
        
        // Check if user needs onboarding
        const userInfoResponse = await fetch('http://18.207.241.126/users/user-info', {
          headers: {
            'Authorization': `Bearer ${loginData.access_token}`,
          },
        });
        
        if (userInfoResponse.ok) {
          const userInfo = await userInfoResponse.json();
          if (!userInfo.gender || !userInfo.gender_preference) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            });
          } else {
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainTabs' }],
            });
          }
        } else {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
          });
        }
      } else {
        console.error('Login failed:', loginData);
        // If login fails, navigate to login screen
        navigation.navigate('Login', {
          email,
          message: 'Registration successful. Please log in to continue.'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      navigation.navigate('Login', {
        email,
        message: 'Registration successful. Please log in to continue.'
      });
    }
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://18.207.241.126/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email,
          password,
          confirm_password: confirmPassword,
          date_of_birth: formatDateForApi(),
        }),
      });

      const data = await response.json();
      console.log('Registration response:', data);

      if (response.status === 201) {
        // Registration successful, attempt immediate login
        console.log('Registration successful, attempting immediate login');
        await handleLogin(email, password);
      } else {
        console.error('Registration failed:', data);
        Alert.alert('Error', data.detail || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
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
          <Icon name="arrow-left" size={24} color={THEME.text} />
        </TouchableOpacity>

        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Finish signing up</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrors(prev => ({ ...prev, name: undefined }));
              }}
              style={styles.input}
              mode="outlined"
              placeholder="Name"
              error={!!errors.name}
              outlineStyle={styles.inputOutline}
              theme={{
                colors: {
                  primary: THEME.primaryDark,
                  text: THEME.text,
                  error: THEME.error,
                  placeholder: THEME.placeholder,
                  background: THEME.inputBackground,
                },
                roundness: 8,
              }}
            />
            {errors.name && <HelperText type="error">{errors.name}</HelperText>}

            <Text style={styles.label}>Email</Text>
            <TextInput
              value={email}
              style={styles.input}
              mode="outlined"
              disabled
              outlineStyle={styles.inputOutline}
              theme={{
                colors: {
                  primary: THEME.primaryDark,
                  text: THEME.text,
                  background: THEME.inputBackground,
                },
                roundness: 8,
              }}
            />

            <Text style={styles.label}>Date of birth</Text>
            <View style={styles.dateContainer}>
              <View style={styles.dateInputGroup}>
                <TextInput
                  value={day}
                  onChangeText={handleDayChange}
                  style={[styles.input, styles.dateInput]}
                  mode="outlined"
                  placeholder="DD"
                  keyboardType="number-pad"
                  maxLength={2}
                  error={!!errors.dateOfBirth || !isAgeValid}
                  outlineStyle={styles.inputOutline}
                  theme={{
                    colors: {
                      primary: THEME.primaryDark,
                      text: THEME.text,
                      error: THEME.error,
                      placeholder: THEME.placeholder,
                      background: THEME.inputBackground,
                    },
                    roundness: 8,
                  }}
                />
                <Text style={styles.dateSeparator}>/</Text>
                <TextInput
                  ref={monthRef}
                  value={month}
                  onChangeText={handleMonthChange}
                  style={[styles.input, styles.dateInput]}
                  mode="outlined"
                  placeholder="MM"
                  keyboardType="number-pad"
                  maxLength={2}
                  error={!!errors.dateOfBirth || !isAgeValid}
                  outlineStyle={styles.inputOutline}
                  theme={{
                    colors: {
                      primary: THEME.primaryDark,
                      text: THEME.text,
                      error: THEME.error,
                      placeholder: THEME.placeholder,
                      background: THEME.inputBackground,
                    },
                    roundness: 8,
                  }}
                />
                <Text style={styles.dateSeparator}>/</Text>
                <TextInput
                  ref={yearRef}
                  value={year}
                  onChangeText={handleYearChange}
                  style={[styles.input, styles.dateInput, styles.yearInput]}
                  mode="outlined"
                  placeholder="YYYY"
                  keyboardType="number-pad"
                  maxLength={4}
                  error={!!errors.dateOfBirth || !isAgeValid}
                  outlineStyle={styles.inputOutline}
                  theme={{
                    colors: {
                      primary: THEME.primaryDark,
                      text: THEME.text,
                      error: THEME.error,
                      placeholder: THEME.placeholder,
                      background: THEME.inputBackground,
                    },
                    roundness: 8,
                  }}
                />
              </View>
            </View>
            {(errors.dateOfBirth || !isAgeValid) && (
              <HelperText type="error" style={styles.errorText}>
                {errors.dateOfBirth || 'You must be at least 18 years old'}
              </HelperText>
            )}
            <Text style={styles.helperText}>
              To sign up, you need to be at least 18. Your birthday won't be shared with other people who use Hogspot.
            </Text>

            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={handlePasswordChange}
              style={styles.input}
              mode="outlined"
              secureTextEntry={!showPassword}
              error={!!errors.password}
              right={
                <TextInput.Icon
                  icon={showPassword ? "eye-off" : "eye"}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              outlineStyle={styles.inputOutline}
              theme={{
                colors: {
                  primary: THEME.primaryDark,
                  text: THEME.text,
                  error: THEME.error,
                  background: THEME.inputBackground,
                },
                roundness: 8,
              }}
            />
            {errors.password && <HelperText type="error">{errors.password}</HelperText>}

            <Text style={styles.label}>Confirm Password</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={handleConfirmPasswordChange}
              style={styles.input}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              error={!!errors.confirmPassword}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? "eye-off" : "eye"}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                />
              }
              outlineStyle={styles.inputOutline}
              theme={{
                colors: {
                  primary: THEME.primaryDark,
                  text: THEME.text,
                  error: THEME.error,
                  background: THEME.inputBackground,
                },
                roundness: 8,
              }}
            />
            {errors.confirmPassword && <HelperText type="error">{errors.confirmPassword}</HelperText>}

            <Button
              mode="contained"
              onPress={handleRegister}
              style={[styles.button, (loading || !isAgeValid) && styles.buttonDisabled]}
              loading={loading}
              disabled={loading || !isAgeValid}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              {loading ? 'Creating account...' : 'Agree and continue'}
            </Button>

            <Text style={styles.termsText}>
              By selecting Agree and continue, I agree to Hogspot's Terms of Service, Payments Terms of Service, and Nondiscrimination Policy and acknowledge the Privacy Policy.
            </Text>
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
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 20,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
    gap: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: THEME.text,
    marginBottom: -8,
  },
  input: {
    backgroundColor: THEME.inputBackground,
  },
  inputOutline: {
    borderRadius: 8,
  },
  dateContainer: {
    width: '100%',
  },
  dateInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateInput: {
    flex: 2,
    textAlign: 'center',
  },
  yearInput: {
    flex: 3,
  },
  dateSeparator: {
    fontSize: 20,
    color: THEME.text,
    marginHorizontal: 4,
  },
  helperText: {
    fontSize: 12,
    color: THEME.text,
    opacity: 0.7,
    marginTop: -8,
  },
  button: {
    marginTop: 16,
    borderRadius: 8,
    backgroundColor: THEME.primary,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    height: 48,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 12,
    color: THEME.text,
    opacity: 0.7,
    marginTop: 16,
  },
  errorText: {
    color: THEME.error,
    marginTop: 4,
    marginBottom: 4,
  },
});

export default CompleteRegistrationScreen; 