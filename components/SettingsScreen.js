import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  StatusBar,
  TextInput,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import Slider from '@react-native-community/slider';
import { Image as ExpoImage } from 'expo-image';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const THEME = {
  primary: '#FF5864',
  secondary: '#FFE4E6',
  background: '#FFFFFF',
  text: '#FFFFFF',
  darkText: '#2D2D2D',
  lightText: '#8E8E8E',
  modalBackground: '#F8F8F8',
};

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('about');
  const [expandedSection, setExpandedSection] = useState(null);
  const [profileImages, setProfileImages] = useState([]);
  const [tempProfileImages, setTempProfileImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingChanges, setSavingChanges] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    bio: '',
    gender: '',
    gender_preference: '',
    education_level: '',
    college_name: '',
    profession: '',
    company: '',
    height_cm: '',
    smoking: '',
    drinking: '',
    workout: '',
    interests: ''
  });

  const [errors, setErrors] = useState({
    gender: false,
    gender_preference: false
  });

  const [selectedInterests, setSelectedInterests] = useState([]);

  const SMOKING_OPTIONS = [
    'Never',
    'Occasionally',
    'Socially'
  ];

  const DRINKING_OPTIONS = [
    'Never',
    'Occasionally',
    'Socially'
  ];

  const WORKOUT_OPTIONS = [
    'Never',
    'Sometimes',
    'Daily'
  ];

  const INTERESTS_OPTIONS = [
    'football',
    'tennis',
    'cricket',
    'other_sports',
    'books',
    'arts',
    'rides',
    'trekking',
    'swimming',
    'movies',
    'music',
    'coding',
    'others'
  ];

  const aboutSections = [
    { 
      id: 'bio', 
      icon: 'text', 
      label: 'Bio', 
      value: profileInfo.bio,
      type: 'text',
      multiline: true,
      placeholder: 'Tell us about yourself...'
    },
    { 
      id: 'gender', 
      icon: 'account', 
      label: 'Gender', 
      value: profileInfo.gender,
      type: 'options',
      required: true,
      options: ['Male', 'Female'],
      horizontal: true
    },
    { 
      id: 'gender_preference', 
      icon: 'account-heart', 
      label: 'Gender Preference', 
      value: profileInfo.gender_preference,
      type: 'options',
      required: true,
      options: ['Male', 'Female'],
      horizontal: true
    },
    { 
      id: 'education_level', 
      icon: 'school', 
      label: 'Education Level', 
      value: profileInfo.education_level,
      type: 'options',
      options: ['School', 'College'],
      horizontal: true
    },
    { 
      id: 'college_name', 
      icon: 'domain', 
      label: 'College/University', 
      value: profileInfo.college_name,
      type: 'text',
      placeholder: 'Your college/university'
    },
    { 
      id: 'profession', 
      icon: 'briefcase', 
      label: 'Profession', 
      value: profileInfo.profession,
      type: 'text',
      placeholder: 'Your profession'
    },
    { 
      id: 'company', 
      icon: 'office-building', 
      label: 'Company', 
      value: profileInfo.company,
      type: 'text',
      placeholder: 'Your company'
    },
    { 
      id: 'height_cm', 
      icon: 'human-male-height', 
      label: 'Height', 
      value: profileInfo.height_cm,
      type: 'slider',
      min: 140,
      max: 220,
    },
    { 
      id: 'smoking', 
      icon: 'smoking', 
      label: 'Smoking', 
      value: profileInfo.smoking,
      type: 'options',
      options: SMOKING_OPTIONS,
      grid: true
    },
    { 
      id: 'drinking', 
      icon: 'glass-wine', 
      label: 'Drinking', 
      value: profileInfo.drinking,
      type: 'options',
      options: DRINKING_OPTIONS,
      grid: true
    },
    { 
      id: 'workout', 
      icon: 'dumbbell', 
      label: 'Workout', 
      value: profileInfo.workout,
      type: 'options',
      options: WORKOUT_OPTIONS,
      horizontal: true
    },
    { 
      id: 'interests', 
      icon: 'heart', 
      label: 'Interests', 
      value: selectedInterests.join(', '),
      type: 'interests',
    },
  ];

  const [hasProfileChanges, setHasProfileChanges] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState({});

  useEffect(() => {
    console.log('SettingsScreen mounted');
    fetchProfileImages().catch(error => {
      console.error('Error in fetchProfileImages:', error);
      Alert.alert('Error', 'Failed to load profile images. Please try again.');
    });
  }, []);

  useEffect(() => {
    const preloadAllImages = async () => {
      if (tempProfileImages.length > 0) {
        const preloadPromises = tempProfileImages.map(async (image) => {
          if (!preloadedImages[image.id]) {
            try {
              await ExpoImage.prefetch(image.image_url);
              setPreloadedImages(prev => ({
                ...prev,
                [image.id]: true
              }));
            } catch (error) {
              console.error('Error preloading image:', error);
            }
          }
        });
        await Promise.all(preloadPromises);
      }
    };

    preloadAllImages();
  }, [tempProfileImages]);

  const fetchProfileImages = async () => {
    try {
      console.log('Fetching profile images...');
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        console.error('No auth token found');
        throw new Error('Authentication token not found');
      }

      const response = await fetch('http://18.207.241.126/users/profile_images', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.message || 'Failed to fetch profile images');
      }

      const data = await response.json();
      console.log('Profile images fetched successfully:', data);
      if (data) {
        setProfileImages(data);
        setTempProfileImages(data);
      }
    } catch (error) {
      console.error('Error fetching profile images:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateImagePriority = async (imageId, newPriority) => {
    const token = await AsyncStorage.getItem('auth_token');
    const response = await fetch(
      `http://18.207.241.126/users/update_image_priority/${imageId}?priority=${newPriority}`,
      {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      }
    );
    
    if (!response.ok) {
      throw new Error('Failed to update image priority');
    }
    return await response.json();
  };

  const handleDragEnd = ({ data }) => {
    setTempProfileImages(data);
    setHasChanges(true);
  };

  const handleSaveChanges = async () => {
    if (!hasChanges || savingChanges) return;

    setSavingChanges(true);
    try {
      const updatePromises = tempProfileImages.map((image, index) => 
        updateImagePriority(image.id, index + 1)
      );
      
      await Promise.all(updatePromises);
      setProfileImages([...tempProfileImages]);
      setHasChanges(false);
      Alert.alert('Success', 'Image order updated successfully');
    } catch (error) {
      console.error('Error updating priorities:', error);
      Alert.alert('Error', 'Failed to update image order. Please try again.');
    } finally {
      setSavingChanges(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('auth_token');
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  const handleSectionPress = (sectionId) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const handleUpdateField = (id, value) => {
    setProfileInfo(prev => ({
      ...prev,
      [id]: value
    }));
    
    if (id === 'gender' || id === 'gender_preference') {
      setErrors(prev => ({
        ...prev,
        [id]: !value
      }));
    }
    setHasProfileChanges(true);
  };

  const handleInterestToggle = (interest) => {
    setSelectedInterests(prev => {
      if (prev.includes(interest)) {
        return prev.filter(i => i !== interest);
      }
      if (prev.length >= 6) {
        Alert.alert('Maximum Interests', 'You can select up to 6 interests');
        return prev;
      }
      return [...prev, interest];
    });
  };

  const handleSaveProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Format interests to match API requirements
      const formattedInterests = selectedInterests.map(interest => 
        interest.toLowerCase().replace(/\s+/g, '_')
      );

      const requestBody = {
        bio: profileInfo.bio || null,
        gender: profileInfo.gender ? profileInfo.gender.toLowerCase() : null,
        gender_preference: profileInfo.gender_preference ? profileInfo.gender_preference.toLowerCase() : null,
        education_level: profileInfo.education_level ? profileInfo.education_level.toLowerCase() : null,
        college_name: profileInfo.college_name || null,
        profession: profileInfo.profession || null,
        company: profileInfo.company || null,
        height_cm: profileInfo.height_cm ? Number(profileInfo.height_cm) : null,
        smoking: profileInfo.smoking ? profileInfo.smoking.toLowerCase() : null,
        drinking: profileInfo.drinking ? profileInfo.drinking.toLowerCase() : null,
        workout: profileInfo.workout ? profileInfo.workout.toLowerCase() : null,
        interests: formattedInterests.length > 0 ? formattedInterests.join(',') : null
      };

      console.log('Sending request body:', requestBody);

      const response = await fetch('http://18.207.241.126/users/complete_profile', {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors
        if (response.status === 422 && data.detail) {
          const errorMessages = data.detail.map(err => err.msg).join('\n');
          throw new Error(errorMessages);
        }
        throw new Error(data.message || 'Failed to update profile');
      }

      console.log('Profile updated successfully:', data);
      setHasProfileChanges(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert(
        'Error',
        typeof error === 'string' ? error : error.message || 'Failed to update profile. Please try again.'
      );
    }
  };

  const renderSectionContent = (section) => {
    if (section.type === 'slider') {
      return (
        <View style={styles.expandedContent}>
          <View style={styles.sliderContainer}>
            <Slider
              style={styles.slider}
              minimumValue={section.min}
              maximumValue={section.max}
              step={1}
              value={Number(profileInfo[section.id]) || section.min}
              onValueChange={(value) => handleUpdateField(section.id, String(value))}
              minimumTrackTintColor={THEME.primary}
              maximumTrackTintColor="#E0E0E0"
              thumbTintColor={THEME.primary}
            />
            <Text style={styles.sliderValue}>
              {profileInfo[section.id] || section.min} cm
            </Text>
        </View>
          </View>
      );
    }

    if (section.type === 'interests') {
      return (
        <View style={styles.expandedContent}>
          <Text style={styles.interestsHelper}>
            Select up to 6 interests
          </Text>
          <View style={styles.interestsGrid}>
            {INTERESTS_OPTIONS.map((interest) => (
              <TouchableOpacity
                key={interest}
                style={[
                  styles.interestButton,
                  selectedInterests.includes(interest) && styles.selectedInterest
                ]}
                onPress={() => handleInterestToggle(interest)}
              >
                <Text style={[
                  styles.interestText,
                  selectedInterests.includes(interest) && styles.selectedInterestText
                ]}>
                  {interest}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      );
    }

    if (section.type === 'options') {
      if (section.grid || section.id === 'education_level') {
        return (
          <View style={styles.expandedContent}>
            <View style={styles.gridOptionsContainer}>
              {section.options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    styles.gridOptionButton,
                    profileInfo[section.id] === option && styles.selectedOption,
                    errors[section.id] && styles.errorButton,
                  ]}
                  onPress={() => {
                    handleUpdateField(section.id, option);
                    setExpandedSection(null);
                  }}
                >
                  <Text style={[
                    styles.optionText,
                    profileInfo[section.id] === option && styles.selectedOptionText
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
        </View>
            {errors[section.id] && (
              <Text style={styles.errorText}>This field is required</Text>
            )}
        </View>
        );
      }
      
      return (
        <View style={styles.expandedContent}>
          <ScrollView 
            horizontal={section.horizontal}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.optionsContainer,
              section.horizontal && styles.horizontalOptionsContainer
            ]}
          >
            {section.options.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  profileInfo[section.id] === option && styles.selectedOption,
                  errors[section.id] && styles.errorButton,
                  section.horizontal && styles.horizontalOptionButton
                ]}
                onPress={() => {
                  handleUpdateField(section.id, option);
                  setExpandedSection(null);
                }}
              >
                <Text style={[
                  styles.optionText,
                  profileInfo[section.id] === option && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {errors[section.id] && (
            <Text style={styles.errorText}>This field is required</Text>
          )}
          </View>
      );
    }

    return (
      <View style={styles.expandedContent}>
            <TextInput
          style={[
            styles.expandedInput,
            section.multiline && styles.multilineInput
          ]}
          value={profileInfo[section.id]}
          onChangeText={(text) => handleUpdateField(section.id, text)}
          placeholder={section.placeholder}
          multiline={section.multiline}
          numberOfLines={section.multiline ? 4 : 1}
          keyboardType={section.keyboardType || 'default'}
            />
          </View>
    );
  };

  const renderSection = (section) => (
    <View key={section.id}>
      <TouchableOpacity
        style={[
          styles.sectionItem,
          errors[section.id] && styles.errorSection
        ]}
        onPress={() => handleSectionPress(section.id)}
      >
        <View style={styles.sectionLeft}>
          <Icon name={section.icon} size={24} color={errors[section.id] ? '#FF3B30' : THEME.darkText} />
          <Text style={styles.sectionLabel}>
            {section.label}
            {section.required && <Text style={styles.requiredStar}> *</Text>}
          </Text>
        </View>
        <View style={styles.sectionRight}>
          <Text 
            style={[
              styles.sectionValue,
              !profileInfo[section.id] && styles.placeholderText
            ]}
            numberOfLines={1}
          >
            {profileInfo[section.id] || 'Add'}
          </Text>
          <Icon 
            name={expandedSection === section.id ? 'chevron-up' : 'chevron-right'} 
            size={24} 
            color={THEME.lightText} 
            />
          </View>
      </TouchableOpacity>
      {expandedSection === section.id && renderSectionContent(section)}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-left" size={24} color={THEME.darkText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        {hasProfileChanges && (
          <TouchableOpacity 
            style={styles.saveHeaderButton}
            onPress={handleSaveProfile}
          >
            <Text style={styles.saveHeaderText}>Save</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'images' && styles.activeTab]}
          onPress={() => setActiveTab('images')}
        >
          <Icon name="image" size={24} color={activeTab === 'images' ? THEME.primary : THEME.lightText} />
          <Text style={[styles.tabText, activeTab === 'images' && styles.activeTabText]}>Images</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'about' && styles.activeTab]}
          onPress={() => setActiveTab('about')}
        >
          <Icon name="account" size={24} color={activeTab === 'about' ? THEME.primary : THEME.lightText} />
          <Text style={[styles.tabText, activeTab === 'about' && styles.activeTabText]}>About</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tab, activeTab === 'preferences' && styles.activeTab]}
          onPress={() => setActiveTab('preferences')}
        >
          <Icon name="cog" size={24} color={activeTab === 'preferences' ? THEME.primary : THEME.lightText} />
          <Text style={[styles.tabText, activeTab === 'preferences' && styles.activeTabText]}>Preferences</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'images' && (
        <View style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photos</Text>
            <Text style={styles.sectionSubtitle}>Hold and drag to reorder</Text>
          </View>

          <DraggableFlatList
            data={tempProfileImages}
            onDragEnd={handleDragEnd}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item, drag, isActive }) => (
              <ScaleDecorator>
                <TouchableOpacity
                  style={[
                    styles.imageOrderItem,
                    { backgroundColor: isActive ? '#F0F0F0' : THEME.background }
                  ]}
                  onLongPress={drag}
                  delayLongPress={150}
                  disabled={isActive}
                >
                  <ExpoImage
                    source={{ uri: item.image_url }} 
                    style={styles.orderImage} 
                    contentFit="cover"
                    transition={100}
                    cachePolicy="memory-disk"
                    placeholder={require('../assets/profileava.jpg')}
                    onError={(error) => {
                      console.error('Error loading image:', error);
                    }}
                  />
                  <View style={styles.imageItemContent}>
                    <Text style={styles.orderPriority}>Priority {item.priority}</Text>
                    <Text style={styles.dragHint}>Hold to drag</Text>
                  </View>
                  <Icon name="drag-horizontal-variant" size={24} color={THEME.lightText} />
                </TouchableOpacity>
              </ScaleDecorator>
            )}
            contentContainerStyle={styles.dragListContainer}
          />

          {hasChanges && (
            <TouchableOpacity 
              style={[styles.saveButton, savingChanges && styles.saveButtonDisabled]}
              onPress={handleSaveChanges}
              disabled={savingChanges}
            >
              {savingChanges ? (
                <ActivityIndicator color={THEME.text} />
              ) : (
                <>
                  <Icon name="content-save" size={24} color={THEME.text} />
                  <Text style={styles.saveButtonText}>Save Changes</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}

      {activeTab === 'about' && (
        <ScrollView style={styles.content}>
          {aboutSections.map(renderSection)}
        </ScrollView>
      )}

      {activeTab === 'preferences' && (
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.logoutButton}
              onPress={handleLogout}
            >
              <Icon name="logout" size={24} color="#FF3B30" />
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: THEME.darkText,
  },
  content: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.darkText,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: THEME.lightText,
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  sectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: THEME.background,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  sectionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionLabel: {
    fontSize: 16,
    color: THEME.darkText,
    marginLeft: 16,
  },
  sectionRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionValue: {
    fontSize: 16,
    color: THEME.lightText,
    marginRight: 8,
  },
  expandedContent: {
    padding: 20,
    backgroundColor: '#F8F8F8',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  expandedInput: {
    backgroundColor: THEME.background,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  optionsContainer: {
    flexDirection: 'column',
    gap: 8,
  },
  horizontalOptionsContainer: {
    flexDirection: 'row',
    paddingRight: 20,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: THEME.background,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontalOptionButton: {
    marginRight: 8,
    marginBottom: 0,
    minWidth: 100,
  },
  selectedOption: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  optionText: {
    fontSize: 16,
    color: THEME.darkText,
    textAlign: 'center',
  },
  selectedOptionText: {
    color: THEME.text,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: THEME.background,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: THEME.primary,
  },
  tabText: {
    marginLeft: 8,
    fontSize: 14,
    color: THEME.lightText,
    fontWeight: '600',
  },
  activeTabText: {
    color: THEME.primary,
  },
  imageOrderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.background,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  imageItemContent: {
    flex: 1,
    marginLeft: 16,
  },
  orderPriority: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.darkText,
    marginBottom: 4,
  },
  dragHint: {
    fontSize: 12,
    color: THEME.lightText,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.primary,
    padding: 16,
    borderRadius: 12,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 8,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorSection: {
    borderLeftWidth: 2,
    borderLeftColor: '#FF3B30',
  },
  errorButton: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  requiredStar: {
    color: '#FF3B30',
  },
  placeholderText: {
    color: THEME.lightText,
    fontStyle: 'italic',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  gridOptionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  gridOptionButton: {
    width: '48%', // slightly less than 50% to account for gap
    marginRight: 0,
    marginBottom: 10,
  },
  sliderContainer: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderValue: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.darkText,
    marginTop: 8,
  },
  interestsHelper: {
    fontSize: 14,
    color: THEME.lightText,
    marginBottom: 16,
  },
  interestsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  interestButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: THEME.background,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 8,
  },
  selectedInterest: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  interestText: {
    fontSize: 14,
    color: THEME.darkText,
  },
  selectedInterestText: {
    color: THEME.text,
  },
  headerRight: {
    width: 60,
  },
  saveHeaderButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: THEME.primary,
    borderRadius: 8,
  },
  saveHeaderText: {
    color: THEME.text,
    fontWeight: '600',
    fontSize: 16,
  },
});

export default SettingsScreen; 