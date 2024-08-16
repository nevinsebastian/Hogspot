import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const VerifyOTPScreen = ({ navigation, route }) => {
  const [email, setEmail] = useState(route.params.email);
  const [otp, setOtp] = useState('');

  const handleVerifyOTP = async () => {
    try {
      const response = await axios.post(`http://3.86.38.127:8000/verify/verify-otp?email=${encodeURIComponent(email)}&otp_code=${otp}`);
      console.log('OTP Verification response:', response.data);

      if (response.status === 200) {
        console.log('Email verified successfully:', response.data);
        Alert.alert('Success', 'Email verified successfully.');
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('OTP verification error:', error.response ? error.response.data : error.message);
      Alert.alert('OTP Verification Error', 'Failed to verify OTP. Please try again.');
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
      <TextInput 
        style={styles.input} 
        placeholder="OTP" 
        value={otp} 
        onChangeText={setOtp} 
      />
      <Button title="Verify OTP" onPress={handleVerifyOTP} />
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

export default VerifyOTPScreen;
