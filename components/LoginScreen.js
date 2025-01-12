import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper'; // Using React Native Paper as an alternative

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username === 'test' && password === 'test') {
      navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
    } else {
      alert('Invalid credentials.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Text variant="headlineMedium" style={styles.title}>Login</Text>
        <TextInput 
          label="Username" 
          value={username} 
          onChangeText={setUsername} 
          style={styles.input} 
          mode="outlined" 
        />
        <TextInput 
          label="Password" 
          value={password} 
          onChangeText={setPassword} 
          secureTextEntry 
          style={styles.input} 
          mode="outlined" 
        />
        <Button 
          mode="contained" 
          onPress={handleLogin} 
          buttonColor="#4B164C" 
          style={styles.button}
          labelStyle={{ color: '#fff' }}
        >
          Login
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
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

export default LoginScreen;
