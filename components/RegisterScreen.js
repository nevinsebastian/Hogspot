import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { TextInput, Button, Text, Checkbox, HelperText } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { isValidEmail } from '../utils/emailValidator';

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

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [showFullForm, setShowFullForm] = useState(false);
  const [name, setName] = useState('');
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

  const handleContinue = () => {
    const { isValid, error } = isValidEmail(email);
    if (!isValid) {
      setEmailError(error);
      return;
    }
    setShowFullForm(true);
  };

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
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
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 25}
      >
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="close" size={24} color={THEME.text} />
        </TouchableOpacity>

        <ScrollView 
          contentContainerStyle={styles.scrollContainer} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.contentContainer}>
            <Text variant="headlineLarge" style={styles.title}>
              {showFullForm ? 'Create Account' : 'Log in or sign up'}
            </Text>

            <View style={styles.inputContainer}>
              <TextInput
                value={email}
                onChangeText={validateAndSetEmail}
                style={styles.input}
                mode="outlined"
                label="Email"
                placeholder="Enter your email"
                placeholderTextColor={THEME.placeholder}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                outlineStyle={styles.inputOutline}
                outlineColor={emailError ? '#FF0000' : THEME.primary}
                activeOutlineColor={emailError ? '#FF0000' : THEME.primaryDark}
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
                disabled={showFullForm}
              />
              {emailError ? (
                <HelperText type="error" style={styles.errorText}>
                  {emailError}
                </HelperText>
              ) : null}

              {!showFullForm ? (
                <>
                  <Button
                    mode="contained"
                    onPress={handleContinue}
                    style={[styles.button, !email || emailError ? styles.buttonDisabled : null]}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.buttonLabel}
                    disabled={!email || !!emailError}
                    buttonColor={THEME.primary}
                  >
                    Continue
                  </Button>

                  <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>or</Text>
                    <View style={styles.divider} />
                  </View>

                  <View style={styles.socialButtonsContainer}>
                    <TouchableOpacity style={styles.socialFullButton}>
                      <Icon name="phone" size={24} color={THEME.text} style={styles.socialIcon} />
                      <Text style={styles.socialButtonText}>Continue with Phone</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialFullButton}>
                      <Icon name="apple" size={24} color={THEME.text} style={styles.socialIcon} />
                      <Text style={styles.socialButtonText}>Continue with Apple</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialFullButton}>
                      <Icon name="google" size={24} color="#DB4437" style={styles.socialIcon} />
                      <Text style={styles.socialButtonText}>Continue with Google</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.socialFullButton}>
                      <Icon name="facebook" size={24} color="#4267B2" style={styles.socialIcon} />
                      <Text style={styles.socialButtonText}>Continue with Facebook</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                // Full registration form
                <>
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                    mode="outlined"
                    label="Name"
                    placeholder="Enter your name"
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
                  />

                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    style={styles.input}
                    mode="outlined"
                    label="Password"
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
                      />
                    }
                  />

                  <View style={styles.termsContainer}>
                    <Checkbox.Android
                      status={agreeToTerms ? 'checked' : 'unchecked'}
                      onPress={() => setAgreeToTerms(!agreeToTerms)}
                      color={THEME.primary}
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
                    labelStyle={styles.buttonLabel}
                    loading={loading}
                    disabled={loading || !name || !password || !agreeToTerms}
                    buttonColor={THEME.primary}
                  >
                    {loading ? 'Creating Account...' : 'Sign Up'}
                  </Button>
                </>
              )}
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
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 20,
    right: 20,
    zIndex: 1,
    padding: 8,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: THEME.text,
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
    backgroundColor: THEME.inputBackground,
    borderRadius: 16,
  },
  inputOutline: {
    borderRadius: 16,
  },
  inputContent: {
    height: 56,
  },
  errorText: {
    color: '#FF0000',
    marginTop: -12,
    marginBottom: 12,
  },
  button: {
    borderRadius: 12,
    marginVertical: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonContent: {
    height: 56,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: THEME.text,
    opacity: 0.2,
  },
  dividerText: {
    marginHorizontal: 16,
    color: THEME.text,
    fontSize: 14,
    opacity: 0.6,
  },
  socialButtonsContainer: {
    width: '100%',
    gap: 12,
  },
  socialFullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.text + '20',
    backgroundColor: '#fff',
  },
  socialIcon: {
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 16,
    color: THEME.text,
    fontWeight: '500',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  termsText: {
    color: THEME.text,
    fontSize: 14,
    marginLeft: 8,
    opacity: 0.7,
  },
  termsLink: {
    color: THEME.primaryDark,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
