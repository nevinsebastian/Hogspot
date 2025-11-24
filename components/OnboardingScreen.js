import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  Animated,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';
import Slider from '@react-native-community/slider';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const { width, height } = Dimensions.get('window');

const THEME = {
  primary: '#DD88CF',
  primaryDark: '#4B164C',
  background: '#FDF7FD',
  text: '#2D2D2D',
};

// Predefined options matching backend enums
const EDUCATION_LEVELS = {
  higher_secondary: "Higher Secondary",
  bachelors: "Bachelor's Degree",
  masters: "Master's Degree",
  phd: "Ph.D."
};

const HABITS = {
  smoking: {
    occasionally: "occasionally",
    never: "never",
    socially: "socially"
  },
  drinking: {
    occasionally: "occasionally",
    never: "never",
    socially: "socially"
  },
  workout: {
    daily: "daily",
    never: "never",
    sometimes: "sometimes"
  }
};

const INTERESTS = [
  "football",
  "tennis",
  "cricket",
  "other_sports",
  "books",
  "arts",
  "rides",
  "trekking",
  "swimming",
  "movies",
  "music",
  "coding",
  "others"
];

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const [currentStep, setCurrentStep] = useState(0);
  const [gender, setGender] = useState(null);
  const [genderPreference, setGenderPreference] = useState(null);
  const [photos, setPhotos] = useState([null, null, null, null, null, null]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;

  // New state variables
  const [bio, setBio] = useState('');
  const [educationLevel, setEducationLevel] = useState(null);
  const [collegeName, setCollegeName] = useState('');
  const [profession, setProfession] = useState('');
  const [company, setCompany] = useState('');
  const [smoking, setSmoking] = useState(null);
  const [drinking, setDrinking] = useState(null);
  const [workout, setWorkout] = useState(null);
  const [height_cm, setHeight] = useState(170);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const steps = [
    {
      title: "What's your gender?",
      subtitle: "Select all that describe you to help us show your profile to the right people. You can add more details if you'd like.",
      options: ["male", "female", "both"],
      onSelect: setGender,
    },
    {
      title: "Who are you interested in seeing?",
      subtitle: "Select all that describe you to help us show your profile to the right people. You can add more details if you'd like.",
      options: ["male", "female", "both"],
      onSelect: setGenderPreference,
    },
    {
      title: "Add your recent pics",
      subtitle: "Hey! Let's add 1 to start. We recommend a face pic.",
      options: [],
      onSelect: null,
    },
    {
      title: "Write your bio",
      subtitle: "Let others know about you",
      type: "bio",
    },
    {
      title: "Education",
      subtitle: "Tell us about your education",
      type: "education",
      options: Object.values(EDUCATION_LEVELS),
    },
    {
      title: "Work",
      subtitle: "What do you do?",
      type: "work",
    },
    {
      title: "Lifestyle",
      subtitle: "Share your habits",
      type: "lifestyle",
    },
    {
      title: "Interests",
      subtitle: "Select your interests",
      type: "interests",
      options: INTERESTS.map(interest => interest.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')),
    },
  ];

  const showTooltip = (index) => {
    setSelectedPhotoIndex(index);
    setShowDeleteModal(true);
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      bounciness: 8,
    }).start();
  };

  const hideTooltip = () => {
    Animated.timing(slideAnim, {
      toValue: height,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setShowDeleteModal(false);
      setSelectedPhotoIndex(null);
    });
  };

  const handleDeletePhoto = () => {
    if (selectedPhotoIndex !== null) {
      const newPhotos = [...photos];
      newPhotos[selectedPhotoIndex] = null;
      setPhotos(newPhotos);
    }
    hideTooltip();
  };

  const pickImage = async (index) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });

      if (!result.canceled) {
        const newPhotos = [...photos];
        newPhotos[index] = result.assets[0].uri;
        setPhotos(newPhotos);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        
        // Format the data according to API requirements
        const profileData = {
          bio: bio || null,
          gender: gender || null,
          gender_preference: genderPreference || null,
          education_level: educationLevel || null,
          college_name: collegeName || null,
          profession: profession || null,
          company: company || null,
          height_cm: height_cm || null,
          smoking: smoking || null,
          drinking: drinking || null,
          workout: workout || null,
          interests: selectedInterests.length > 0 ? selectedInterests : null
        };

        // Remove null values from the request
        const filteredData = Object.fromEntries(
          Object.entries(profileData).filter(([_, value]) => value !== null)
        );

        // First API call: Complete profile
        const profileResponse = await fetch('http://18.207.241.126/users/complete_profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(filteredData),
        });

        if (!profileResponse.ok) {
          const errorData = await profileResponse.json();
          throw new Error(errorData.detail || 'Failed to update profile');
        }

        // Second API call: Upload images if any
        if (photos.some(photo => photo !== null)) {
          const formData = new FormData();
          photos.forEach((photo, index) => {
            if (photo) {
              formData.append('files', {
                uri: photo,
                type: 'image/jpeg',
                name: `photo${index}.jpg`,
              });
            }
          });

          const photoResponse = await fetch('http://18.207.241.126/users/upload_images', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          });

          if (!photoResponse.ok) {
            const errorData = await photoResponse.json();
            throw new Error(errorData.detail || 'Failed to upload images');
          }
        }

        navigation.reset({
          index: 0,
          routes: [{ name: 'Home' }],
        });
      } catch (error) {
        console.error('Error updating profile:', error);
        Alert.alert('Error', error.message || 'Failed to update profile. Please try again.');
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

  const renderPhotoGrid = () => {
    const photoCount = photos.filter(photo => photo !== null).length;

    return (
      <View style={styles.photoGridContainer}>
        <View style={styles.photoCountContainer}>
          <Text style={styles.photoCount}>{photoCount} / 6</Text>
        </View>
        <View style={styles.photoGrid}>
          {photos.map((photo, index) => (
            <TouchableOpacity
              key={index}
              style={styles.photoBox}
              onPress={() => !photo && pickImage(index)}
            >
              {photo ? (
                <View style={styles.photoContainer}>
                  <Image source={{ uri: photo }} style={styles.photo} />
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => showTooltip(index)}
                  >
                    <View style={styles.deleteButtonInner}>
                      <Icon name="close" size={16} color="#FFFFFF" />
                    </View>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.addPhotoButton}>
                  <Icon name="plus" size={30} color="#FF4458" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderInputStep = () => {
    const step = steps[currentStep];
    
    switch (step.type) {
      case 'bio':
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.bioInput}
              multiline
              placeholder="Write something about yourself..."
              value={bio}
              onChangeText={setBio}
              maxLength={500}
            />
            <Text style={styles.charCount}>{bio.length}/500</Text>
          </View>
        );

      case 'education':
        return (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
          >
            <ScrollView
              style={styles.educationScrollView}
              contentContainerStyle={styles.educationScrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {!isKeyboardVisible && (
                <View style={styles.educationSection}>
                  <Text style={styles.sectionTitle}>Education Level</Text>
                  <View style={styles.pillOptionsContainer}>
                    {Object.entries(EDUCATION_LEVELS).map(([key, value]) => (
                      <TouchableOpacity
                        key={key}
                        style={[
                          styles.pillOption,
                          educationLevel === key && styles.selectedPillOption,
                        ]}
                        onPress={() => setEducationLevel(key)}
                      >
                        <Text style={[
                          styles.pillOptionText,
                          educationLevel === key && styles.selectedPillOptionText,
                        ]}>
                          {value}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {educationLevel !== 'higher_secondary' && (
                <View style={styles.educationSection}>
                  <Text style={styles.sectionTitle}>College/University Name</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter your college/university name"
                    value={collegeName}
                    onChangeText={setCollegeName}
                    returnKeyType="done"
                    onFocus={() => setIsKeyboardVisible(true)}
                    onBlur={() => setIsKeyboardVisible(false)}
                  />
                  {isKeyboardVisible && (
                    <View style={styles.suggestionsContainer}>
                      <Text style={styles.suggestionText}>Suggestions will appear here</Text>
                    </View>
                  )}
                </View>
              )}
            </ScrollView>
          </KeyboardAvoidingView>
        );

      case 'work':
        return (
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="What's your profession?"
              value={profession}
              onChangeText={setProfession}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Company name"
              value={company}
              onChangeText={setCompany}
            />
          </View>
        );

      case 'lifestyle':
        return (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
          >
            <ScrollView
              style={styles.lifestyleScrollView}
              contentContainerStyle={styles.lifestyleScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.lifestyleSection}>
                <Text style={styles.sectionTitle}>Smoking</Text>
                <View style={styles.pillOptionsContainer}>
                  {Object.entries(HABITS.smoking).map(([key, value]) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.pillOption,
                        smoking === key && styles.selectedPillOption,
                      ]}
                      onPress={() => setSmoking(key)}
                    >
                      <Text style={[
                        styles.pillOptionText,
                        smoking === key && styles.selectedPillOptionText,
                      ]}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.lifestyleSection}>
                <Text style={styles.sectionTitle}>Drinking</Text>
                <View style={styles.pillOptionsContainer}>
                  {Object.entries(HABITS.drinking).map(([key, value]) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.pillOption,
                        drinking === key && styles.selectedPillOption,
                      ]}
                      onPress={() => setDrinking(key)}
                    >
                      <Text style={[
                        styles.pillOptionText,
                        drinking === key && styles.selectedPillOptionText,
                      ]}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.lifestyleSection}>
                <Text style={styles.sectionTitle}>Workout</Text>
                <View style={styles.pillOptionsContainer}>
                  {Object.entries(HABITS.workout).map(([key, value]) => (
                    <TouchableOpacity
                      key={key}
                      style={[
                        styles.pillOption,
                        workout === key && styles.selectedPillOption,
                      ]}
                      onPress={() => setWorkout(key)}
                    >
                      <Text style={[
                        styles.pillOptionText,
                        workout === key && styles.selectedPillOptionText,
                      ]}>
                        {value.charAt(0).toUpperCase() + value.slice(1)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.lifestyleSection}>
                <Text style={styles.sectionTitle}>Height</Text>
                <View style={styles.heightContainer}>
                  <Slider
                    style={styles.slider}
                    minimumValue={140}
                    maximumValue={220}
                    value={height_cm}
                    onValueChange={setHeight}
                    minimumTrackTintColor="#FF4458"
                    maximumTrackTintColor="#E8E6EA"
                    step={1}
                  />
                  <Text style={styles.heightText}>{height_cm} cm</Text>
                </View>
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
        );

      case 'interests':
        return (
          <View style={styles.inputContainer}>
            <View style={styles.interestsGrid}>
              {INTERESTS.map((interest, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.interestButton,
                    selectedInterests.includes(interest) && styles.selectedInterest,
                  ]}
                  onPress={() => {
                    if (selectedInterests.includes(interest)) {
                      setSelectedInterests(selectedInterests.filter(i => i !== interest));
                    } else {
                      setSelectedInterests([...selectedInterests, interest]);
                    }
                  }}
                >
                  <Text style={[
                    styles.interestText,
                    selectedInterests.includes(interest) && styles.selectedInterestText,
                  ]}>
                    {interest.replace(/_/g, ' ').split(' ').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const renderStep = () => {
    const step = steps[currentStep];
    return (
      <ScrollView style={styles.stepContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{step.title}</Text>
        {step.subtitle && (
          <Text style={styles.subtitle}>{step.subtitle}</Text>
        )}
        {currentStep === 2 ? (
          renderPhotoGrid()
        ) : step.type ? (
          renderInputStep()
        ) : (
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
        )}
      </ScrollView>
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
        {currentStep > 2 && (
          <TouchableOpacity 
            style={styles.skipButton}
            onPress={() => {
              if (currentStep === steps.length - 1) {
                // If on last step, treat as complete with null interests
                setSelectedInterests([]);
                handleNext();
              } else {
                setCurrentStep(currentStep + 1);
              }
            }}
          >
            <Text style={styles.skipButtonText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
      {renderStep()}

      {/* Next Button Fixed at Bottom */}
      <TouchableOpacity
        style={[
          styles.nextButton,
          ((currentStep === 0 && !gender) ||
          (currentStep === 1 && !genderPreference) ||
          (currentStep === 2 && !photos.some(photo => photo !== null))) && 
          styles.nextButtonDisabled
        ]}
        onPress={handleNext}
        disabled={
          (currentStep === 0 && !gender) ||
          (currentStep === 1 && !genderPreference) ||
          (currentStep === 2 && !photos.some(photo => photo !== null))
        }
      >
        <Text style={styles.nextButtonText}>
          {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="none"
        onRequestClose={hideTooltip}
      >
        <TouchableWithoutFeedback onPress={hideTooltip}>
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <Animated.View 
                style={[
                  styles.tooltipContainer,
                  {
                    transform: [{ translateY: slideAnim }]
                  }
                ]}
              >
                <TouchableOpacity
                  style={styles.tooltipOption}
                  onPress={handleDeletePhoto}
                >
                  <Text style={styles.tooltipDeleteText}>Delete photo</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tooltipOption, styles.tooltipCancelOption]}
                  onPress={hideTooltip}
                >
                  <Text style={styles.tooltipCancelText}>Cancel</Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
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
    paddingBottom: 100,
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
  photoGridContainer: {
    marginTop: 20,
  },
  photoCountContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F3F3F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  photoCount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  photoBox: {
    width: (width - 72) / 3,
    height: (width - 72) / 3,
    marginBottom: 12,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#E8E6EA',
  },
  photoContainer: {
    width: '100%',
    height: '100%',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  addPhotoButton: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
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
    marginHorizontal: 24,
    marginBottom: 24,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  nextButtonDisabled: {
    backgroundColor: '#E8E6EA',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonInner: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  tooltipContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 16,
  },
  tooltipOption: {
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E8E6EA',
  },
  tooltipDeleteText: {
    fontSize: 18,
    color: '#FF4458',
    fontWeight: '500',
  },
  tooltipCancelOption: {
    borderBottomWidth: 0,
  },
  tooltipCancelText: {
    fontSize: 18,
    color: '#000000',
    fontWeight: '500',
  },
  skipButton: {
    position: 'absolute',
    right: 16,
    top: Platform.OS === 'ios' ? 0 : 20,
    padding: 8,
  },
  skipButtonText: {
    color: '#FF4458',
    fontSize: 16,
    fontWeight: '500',
  },
  inputContainer: {
    marginTop: 20,
    width: '100%',
  },
  bioInput: {
    borderWidth: 1,
    borderColor: '#E8E6EA',
    borderRadius: 8,
    padding: 16,
    minHeight: 120,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  charCount: {
    alignSelf: 'flex-end',
    color: '#666666',
    marginTop: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E8E6EA',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 20,
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 24,
    marginBottom: 12,
  },
  heightContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  heightText: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  interestButton: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E8E6EA',
    marginBottom: 12,
    alignItems: 'center',
  },
  selectedInterest: {
    backgroundColor: '#FF4458',
    borderColor: '#FF4458',
  },
  interestText: {
    fontSize: 14,
    color: '#000000',
  },
  selectedInterestText: {
    color: '#FFFFFF',
  },
  educationScrollView: {
    flex: 1,
    width: '100%',
  },
  educationScrollContent: {
    paddingBottom: 100,
  },
  educationSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 12,
    color: '#000000',
  },
  pillOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  pillOption: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8E6EA',
    backgroundColor: '#FFFFFF',
    margin: 6,
  },
  selectedPillOption: {
    borderColor: '#c188dd',
    backgroundColor: '#DD88CF',
  },
  pillOptionText: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '500',
  },
  selectedPillOptionText: {
    color: '#FFFFFF',
  },
  suggestionsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginTop: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E8E6EA',
  },
  suggestionText: {
    fontSize: 14,
    color: '#666666',
    padding: 8,
  },
  lifestyleScrollView: {
    flex: 1,
    width: '100%',
  },
  lifestyleScrollContent: {
    paddingBottom: 20,
  },
  lifestyleSection: {
    marginBottom: 24,
  },
});

export default OnboardingScreen; 