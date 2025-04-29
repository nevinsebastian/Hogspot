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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

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
  const [photos, setPhotos] = useState([null, null, null, null, null, null]);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;

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
    },
    {
      title: "Add your recent pics",
      subtitle: "Hey! Let's add 1 to start. We recommend a face pic.",
      options: [],
      onSelect: null,
    }
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
          // Upload photos
          const formData = new FormData();
          photos.forEach((photo, index) => {
            if (photo) {
              formData.append('images', {
                uri: photo,
                type: 'image/jpeg',
                name: `photo${index}.jpg`,
              });
            }
          });

          const photoResponse = await fetch('http://15.206.127.132:8000/users/upload-photos', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
            body: formData,
          });

          if (photoResponse.ok) {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Home' }],
            });
          } else {
            throw new Error('Failed to upload photos');
          }
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
      </View>
      {renderStep()}

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
});

export default OnboardingScreen; 