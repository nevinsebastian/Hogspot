import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://13.232.70.195/users/register', {
        name,
        email,
        password,
        confirm_password: confirmPassword,
        date_of_birth: dateOfBirth
      });

      if (response.status === 201) {
        console.log('Registration successful:', response.data);
        navigation.navigate('VerifyEmail', { email });
      }
    } catch (error) {
      console.error('Registration error:', error.response ? error.response.data : error.message);
      if (error.response && error.response.data && error.response.data.detail === "Email already registered") {
        Alert.alert('Email Already Registered', 'This email is already registered. Please login or use a different email.');
      } else {
        Alert.alert('Registration Error', 'Please check your details and try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input} 
        placeholder="Name" 
        value={name} 
        onChangeText={setName} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Password" 
        secureTextEntry 
        value={password} 
        onChangeText={setPassword} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Confirm Password" 
        secureTextEntry 
        value={confirmPassword} 
        onChangeText={setConfirmPassword} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Date of Birth (YYYY-MM-DD)" 
        value={dateOfBirth} 
        onChangeText={setDateOfBirth} 
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
  },
});

export default RegisterScreen;
