import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Alert,
} from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const THEME = {
  primary: '#DD88CF',
  primaryDark: '#4B164C',
  background: '#FDF7FD',
  text: '#2D2D2D',
};

const OTP_TIME_LIMIT = 90; // 1:30 minutes in seconds

const OTPVerificationScreen = ({ navigation, route }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isComplete, setIsComplete] = useState(false);
  const { email } = route.params;
  const inputRef = useRef();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(OTP_TIME_LIMIT);
  const [isTimerActive, setIsTimerActive] = useState(true);

  useEffect(() => {
    // Auto focus the input when screen mounts
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);

    // Start the countdown timer
    const timer = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          setIsTimerActive(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleOtpChange = (text) => {
    // Remove any non-numeric characters
    const cleanText = text.replace(/[^0-9]/g, '');
    
    // Split the text into an array of single digits
    const newOtp = cleanText.split('').slice(0, 6);
    
    // Pad the array with empty strings if needed
    while (newOtp.length < 6) {
      newOtp.push('');
    }
    
    setOtp(newOtp);
    setIsComplete(newOtp.every(digit => digit !== ''));
  };

  const handleResendCode = async () => {
    if (isTimerActive) return;

    try {
      const response = await fetch(`http://15.206.127.132:8000/verify/verify-email?email=${encodeURIComponent(email)}`, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok && data.msg === "OTP sent to your email.") {
        // Reset timer and states
        setTimeRemaining(OTP_TIME_LIMIT);
        setIsTimerActive(true);
        Alert.alert('Success', 'New OTP has been sent to your email.');
      } else {
        Alert.alert('Error', 'Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };

  const handleVerifyOTP = async () => {
    if (!isTimerActive) {
      Alert.alert('Error', 'OTP has expired. Please request a new one.');
      return;
    }

    // Join the OTP array into a string
    const otpCode = otp.join('');
    
    if (!otpCode || otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `http://15.206.127.132:8000/verify/verify-otp?email=${encodeURIComponent(email)}&otp_code=${otpCode}`,
        {
          method: 'POST',
          headers: {
            'accept': 'application/json',
          },
        }
      );

      const data = await response.json();
      console.log('OTP verification response:', data);

      if (response.ok && data.msg === "Email verified successfully.") {
        navigation.navigate('CompleteRegistration', { email });
      } else {
        Alert.alert('Error', data.detail || 'Invalid OTP');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
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
          style={styles.closeButton} 
          onPress={() => navigation.goBack()}
        >
          <Icon name="close" size={24} color={THEME.text} />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>Confirm account</Text>
          <Text style={styles.subtitle}>Enter your verification code</Text>
          <Text style={styles.emailText}>We've sent it to {email}.</Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <View key={index} style={styles.digitContainer}>
                <Text style={styles.digit}>{digit}</Text>
                <View style={[styles.underline, isComplete && styles.underlineActive]} />
              </View>
            ))}
            <TextInput
              ref={inputRef}
              value={otp.join('')}
              onChangeText={handleOtpChange}
              style={styles.hiddenInput}
              keyboardType="number-pad"
              maxLength={6}
              caretHidden={true}
            />
          </View>

          {loading ? (
            <View style={[styles.confirmButton, styles.confirmButtonLoading]}>
              <Text style={styles.confirmButtonText}>Verifying...</Text>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.confirmButton, (!isComplete || !isTimerActive) && styles.confirmButtonDisabled]}
              onPress={handleVerifyOTP}
              disabled={!isComplete || !isTimerActive || loading}
            >
              <Text style={[styles.confirmButtonText, (!isComplete || !isTimerActive) && styles.confirmButtonTextDisabled]}>
                Confirm
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            onPress={handleResendCode} 
            disabled={isTimerActive || loading}
            style={styles.resendContainer}
          >
            <Text style={styles.resendText}>Haven't received an email? </Text>
            <Text style={[
              styles.resendLink, 
              isTimerActive && styles.resendLinkDisabled,
              !isTimerActive && styles.resendLinkActive
            ]}>
              {isTimerActive ? `Send again (${formatTime(timeRemaining)})` : 'Send again'}
            </Text>
          </TouchableOpacity>
        </View>
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
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 10 : 20,
    right: 20,
    zIndex: 1,
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: 32,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '600',
    color: THEME.text,
    marginBottom: 12,
  },
  emailText: {
    fontSize: 16,
    color: THEME.text,
    marginBottom: 32,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  digitContainer: {
    alignItems: 'center',
    width: 40,
  },
  digit: {
    fontSize: 24,
    color: THEME.text,
    marginBottom: 4,
  },
  underline: {
    width: '100%',
    height: 2,
    backgroundColor: THEME.text,
    opacity: 0.3,
  },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
  },
  resendText: {
    fontSize: 16,
    color: THEME.text,
  },
  resendLink: {
    fontSize: 16,
    color: THEME.primaryDark,
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
  confirmButton: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
    backgroundColor: THEME.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonDisabled: {
    backgroundColor: '#E0E0E0',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButtonTextDisabled: {
    color: '#999999',
  },
  underlineActive: {
    backgroundColor: THEME.primary,
    opacity: 1,
  },
  confirmButtonLoading: {
    backgroundColor: THEME.primary,
    opacity: 0.8,
  },
  resendLinkActive: {
    color: THEME.primaryDark,
    fontWeight: '600',
  },
  resendLinkDisabled: {
    color: THEME.text,
    opacity: 0.5,
  },
});

export default OTPVerificationScreen; 