import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const THEME = {
  primary: '#DD88CF',
  primaryDark: '#4B164C',
  background: '#FDF7FD',
  text: '#2D2D2D',
};

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [gender, setGender] = useState(null);
  const [genderPreference, setGenderPreference] = useState(null);

  const steps = [
    {
      title: "What's your gender?",
      subtitle: "Select all that describe you to help us show your profile to the right people. You can add more details if you'd like.",
      options: ["Man", "Woman", "Beyond Binary"],
      onSelect: setGender,
    },
    {
      title: "Who are you interested in seeing?",
      subtitle: "Select all that describe you to help us show your profile to the right people. You can add more details if you'd like.",
      options: ["Men", "Women", "Everyone"],
      onSelect: setGenderPreference,
    }
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Save preferences and navigate to home
      try {
        const token = await AsyncStorage.getItem('auth_token');
        const response = await fetch('http://15.206.127.132:8000/users/update-profile', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            gender: gender.toLowerCase(),
            gender_preference: genderPreference.toLowerCase(),
          }),
        });

        if (response.ok) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Home' }],
          });
        } else {
          throw new Error('Failed to update profile');
        }
      } catch (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Error', 'Failed to update profile. Please try again.');
      }
    }
  };

  const renderProgressBar = () => {
    return (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBar}>
          {steps.map((_, index) => (
            <View
              key={index}
              style={[
                styles.progressSegment,
                {
                  backgroundColor: index <= currentStep ? '#FF4458' : '#E8E6EA',
                  marginRight: index < steps.length - 1 ? 4 : 0,
                }
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  const renderStep = () => {
    const step = steps[currentStep];
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.title}>{step.title}</Text>
        {step.subtitle && (
          <Text style={styles.subtitle}>{step.subtitle}</Text>
        )}
        <View style={styles.optionsContainer}>
          {step.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.optionButton,
                (currentStep === 0 && gender === option) || 
                (currentStep === 1 && genderPreference === option)
                  ? styles.selectedOption
                  : null,
              ]}
              onPress={() => step.onSelect(option)}
            >
              <Text style={[
                styles.optionText,
                (currentStep === 0 && gender === option) || 
                (currentStep === 1 && genderPreference === option)
                  ? styles.selectedOptionText
                  : null,
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={[
            styles.nextButton,
            ((currentStep === 0 && !gender) ||
            (currentStep === 1 && !genderPreference)) && 
            styles.nextButtonDisabled
          ]}
          onPress={handleNext}
          disabled={
            (currentStep === 0 && !gender) ||
            (currentStep === 1 && !genderPreference)
          }
        >
          <Text style={styles.nextButtonText}>
            {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => {
            if (currentStep > 0) {
              setCurrentStep(currentStep - 1);
            } else {
              navigation.goBack();
            }
          }}
        >
          <Icon name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        {renderProgressBar()}
      </View>
      {renderStep()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E6EA',
  },
  backButton: {
    padding: 8,
    marginBottom: 16,
  },
  progressBarContainer: {
    paddingHorizontal: 16,
  },
  progressBar: {
    flexDirection: 'row',
    height: 4,
  },
  progressSegment: {
    flex: 1,
    height: '100%',
    borderRadius: 2,
  },
  stepContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
    lineHeight: 24,
  },
  optionsContainer: {
    width: '100%',
  },
  optionButton: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E6EA',
    backgroundColor: '#FFFFFF',
  },
  selectedOption: {
    borderColor: THEME.primary,
    backgroundColor: THEME.primary,
  },
  optionText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  selectedOptionText: {
    color: '#FFFFFF',
  },
  nextButton: {
    backgroundColor: '#FF4458',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 24,
  },
  nextButtonDisabled: {
    backgroundColor: '#E8E6EA',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OnboardingScreen; 