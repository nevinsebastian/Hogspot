import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity, SafeAreaView } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

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
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!name.trim()) {
      newErrors.name = 'Legal name is required';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    const today = new Date();
    const age = today.getFullYear() - dateOfBirth.getFullYear();
    if (age < 18) {
      newErrors.dateOfBirth = 'You must be at least 18 years old';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://15.206.127.132:8000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          confirm_password: confirmPassword,
          date_of_birth: formatDate(dateOfBirth),
        }),
      });

      const data = await response.json();

      if (response.status === 201) {
        Alert.alert('Success', 'Registration successful!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert('Error', data.detail || 'Registration failed');
      }
    } catch (error) {
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
            <Text style={styles.label}>Legal name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              style={styles.input}
              mode="outlined"
              placeholder="First name on ID"
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
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <TextInput
                value={formatDate(dateOfBirth)}
                style={styles.input}
                mode="outlined"
                editable={false}
                error={!!errors.dateOfBirth}
                right={<TextInput.Icon icon="calendar" />}
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
            </TouchableOpacity>
            {errors.dateOfBirth && <HelperText type="error">{errors.dateOfBirth}</HelperText>}
            <Text style={styles.helperText}>
              To sign up, you need to be at least 18. Your birthday won't be shared with other people who use Hogspot.
            </Text>

            <Text style={styles.label}>Password</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
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
              onChangeText={setConfirmPassword}
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
              style={styles.button}
              loading={loading}
              disabled={loading}
              contentStyle={styles.buttonContent}
              labelStyle={styles.buttonLabel}
            >
              Agree and continue
            </Button>

            <Text style={styles.termsText}>
              By selecting Agree and continue, I agree to Hogspot's Terms of Service, Payments Terms of Service, and Nondiscrimination Policy and acknowledge the Privacy Policy.
            </Text>
          </View>
        </ScrollView>

        {showDatePicker && (
          <DateTimePicker
            value={dateOfBirth}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDateOfBirth(selectedDate);
              }
            }}
            maximumDate={new Date()}
          />
        )}
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
});

export default CompleteRegistrationScreen; 