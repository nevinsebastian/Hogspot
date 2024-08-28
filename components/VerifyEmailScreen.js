import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const VerifyEmailScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState(route.params.email);

  const handleVerifyEmail = async () => {
    try {
      const encodedEmail = encodeURIComponent(email);
      console.log(`Sending verification request to: http://13.232.70.195/verify/verify-email?email=${encodedEmail}`);
      const response = await axios.post(`http://13.232.70.195/verify/verify-email?email=${encodedEmail}`);
      console.log('Verification response:', response.data);

      if (response.status === 200) {
        console.log('Email verification initiated:', response.data);
        navigation.navigate('VerifyOTP', { email });
      }
    } catch (error) {
      console.error('Email verification error:', error.response ? error.response.data : error.message);
      if (error.response && error.response.data && error.response.data.detail === "Email already registered") {
        Alert.alert('Email Verification Error', 'This email is already registered.');
      } else {
        Alert.alert('Email Verification Error', 'Failed to send verification email. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        value={email} 
        onChangeText={setEmail} 
      />
      <Button title="Verify Email" onPress={handleVerifyEmail} />
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

export default VerifyEmailScreen;
