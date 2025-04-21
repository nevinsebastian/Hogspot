import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Checkbox, HelperText } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { isValidEmail } from '../utils/emailValidator';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateAndSetEmail = (text) => {
    setEmail(text);
    if (text) {
      const { isValid, error } = isValidEmail(text);
      setEmailError(error || '');
    } else {
      setEmailError('');
    }
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const { isValid, error } = isValidEmail(email);
    if (!isValid) {
      setEmailError(error);
      return;
    }

    if (!agreeToTerms) {
      Alert.alert('Error', 'Please agree to the Terms & Conditions');
      return;
    }

    setLoading(true);
    // Add your registration logic here
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Text variant="headlineLarge" style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Please fill the details and create account</Text>

        <View style={styles.inputContainer}>
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
            outlineColor="#E0E0E0"
            activeOutlineColor="#2D4356"
            theme={{ roundness: 8 }}
          />

          <View>
            <TextInput
              label="Email"
              value={email}
              onChangeText={validateAndSetEmail}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              outlineColor={emailError ? '#FF0000' : '#E0E0E0'}
              activeOutlineColor={emailError ? '#FF0000' : '#2D4356'}
              theme={{ roundness: 8 }}
              error={!!emailError}
            />
            {emailError ? (
              <HelperText type="error" visible={!!emailError}>
                {emailError}
              </HelperText>
            ) : null}
          </View>

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
            mode="outlined"
            outlineColor="#E0E0E0"
            activeOutlineColor="#2D4356"
            theme={{ roundness: 8 }}
            right={
              <TextInput.Icon
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => setShowPassword(!showPassword)}
                color="#2D4356"
              />
            }
          />

          <View style={styles.termsContainer}>
            <Checkbox.Android
              status={agreeToTerms ? 'checked' : 'unchecked'}
              onPress={() => setAgreeToTerms(!agreeToTerms)}
              color="#2D4356"
            />
            <Text style={styles.termsText}>
              I agree with <Text style={styles.termsLink}>Terms & Conditions</Text>
            </Text>
          </View>

          <Button
            mode="contained"
            onPress={handleRegister}
            style={styles.button}
            contentStyle={styles.buttonContent}
            loading={loading}
            disabled={loading || !!emailError}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </Button>

          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or sign up with</Text>
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

          <View style={styles.signInContainer}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2D4356',
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  termsText: {
    color: '#666',
    fontSize: 14,
    marginLeft: 8,
  },
  termsLink: {
    color: '#2D4356',
    fontWeight: 'bold',
  },
  button: {
    borderRadius: 8,
    marginBottom: 24,
    backgroundColor: '#2D4356',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontSize: 14,
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
    backgroundColor: '#F5F5F5',
    marginHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    color: '#666',
    fontSize: 14,
  },
  signInLink: {
    color: '#2D4356',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
