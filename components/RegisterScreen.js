import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates'; // Calendar picker for Date of Birth

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [emailError, setEmailError] = useState(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword || !dateOfBirth) {
      Alert.alert('Missing Information', 'Please fill all the fields.');
      return;
    }
    if (!validateEmail(email)) {
      setEmailError(true);
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    Alert.alert('Registration Successful', `Welcome, ${name}!`);
    navigation.navigate('Login');
  };

  const onDateConfirm = (params) => {
    setDateOfBirth(params.date.toISOString().split('T')[0]); // Format: YYYY-MM-DD
    setDatePickerVisible(false);
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Register
      </Text>
      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setEmailError(!validateEmail(text)); // Update email error dynamically
        }}
        style={styles.input}
        mode="outlined"
        keyboardType="email-address"
        error={emailError}
      />
      {emailError && (
        <HelperText type="error" visible={emailError}>
          Enter a valid email address (e.g., user@example.com)
        </HelperText>
      )}
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Date of Birth"
        value={dateOfBirth || ''}
        onFocus={() => setDatePickerVisible(true)}
        style={styles.input}
        mode="outlined"
        editable={false}
        right={<TextInput.Icon icon="calendar" onPress={() => setDatePickerVisible(true)} />}
      />
      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Register
      </Button>
      <DatePickerModal
        locale="en"
        mode="single"
        visible={datePickerVisible}
        onDismiss={() => setDatePickerVisible(false)}
        date={new Date()}
        onConfirm={onDateConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
});

export default RegisterScreen;
