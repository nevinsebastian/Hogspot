import React, { useEffect, useState, useCallback } from 'react';
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
  Animated,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import DraggableFlatList, { ScaleDecorator } from 'react-native-draggable-flatlist';
import SettingsScreen from './SettingsScreen';
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

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);
  const [profileImages, setProfileImages] = useState([]);
  const [tempProfileImages, setTempProfileImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [savingChanges, setSavingChanges] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState('images');
  const [aboutText, setAboutText] = useState('A good listener. I love having a good talk to know each other\'s side 😊');
  const [editingAbout, setEditingAbout] = useState(false);
  const [preloadedImages, setPreloadedImages] = useState({});

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
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

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        const response = await fetch('http://18.207.241.126/users/user-info', {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (data) {
          setUserInfo(data);
        }
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchUserInfo();
  }, []);

  const fetchProfileImages = useCallback(async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const response = await fetch('http://18.207.241.126/users/profile_images', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data) {
        setProfileImages(data);
        setCurrentImageIndex(0);
      }
    } catch (error) {
      console.error('Error fetching profile images:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfileImages();
  }, [fetchProfileImages, refreshKey]);

  useEffect(() => {
    if (showSettings) {
      setTempProfileImages([...profileImages]);
      setHasChanges(false);
    }
  }, [showSettings, profileImages]);

  const handleDragEnd = ({ data }) => {
    setTempProfileImages(data);
    setHasChanges(true);
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

  const handleSaveChanges = async () => {
    if (!hasChanges || savingChanges) return;

    setSavingChanges(true);
    try {
      // Make the API calls first
      const updatePromises = tempProfileImages.map((image, index) => 
        updateImagePriority(image.id, index + 1)
      );
      
      await Promise.all(updatePromises);
      
      // Update the profile images state after successful API calls
      setProfileImages([...tempProfileImages]);
      
      // Reset states
      setHasChanges(false);
      setSavingChanges(false);
      
    } catch (error) {
      console.error('Error updating priorities:', error);
      Alert.alert('Error', 'Failed to update image order. Please try again.');
    } finally {
      setSavingChanges(false);
    }
  };

  const handleCloseSettings = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to discard them?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Discard',
            onPress: () => {
              setHasChanges(false);
              setTempProfileImages([...profileImages]);
              setShowSettings(false);
            },
            style: 'destructive',
          },
        ]
      );
    } else {
      setShowSettings(false);
    }
  };

  // Preload all images when component mounts or when profileImages changes
  useEffect(() => {
    const preloadAllImages = async () => {
      if (profileImages.length > 0) {
        const preloadPromises = profileImages.map(async (image) => {
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
  }, [profileImages]);

  // Optimize image loading with better caching
  const renderProfileImage = () => {
    if (profileImages.length === 0) return null;

    return (
      <ExpoImage
        source={{ uri: profileImages[currentImageIndex]?.image_url }}
        style={styles.profileImage}
        contentFit="cover"
        transition={100}
        cachePolicy="memory-disk"
        placeholder={require('../assets/profileava.jpg')}
        onError={(error) => {
          console.error('Error loading profile image:', error);
        }}
      />
    );
  };

  // Optimize navigation handlers
  const handleNextImage = useCallback(() => {
    if (currentImageIndex < profileImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  }, [currentImageIndex, profileImages.length]);

  const handlePreviousImage = useCallback(() => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  }, [currentImageIndex]);

  // Add this function to calculate age
  const calculateAge = (dob) => {
    if (!dob) return '';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  if (!userInfo) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={THEME.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container} key={refreshKey}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.mainContainer}>
        {/* Current Image */}
        {renderProfileImage()}
        
        {/* Gradient overlay */}
        <LinearGradient
          colors={['transparent', 'transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-left" size={32} color={THEME.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => navigation.navigate('Settings')}
          >
            <Icon name="cog" size={24} color={THEME.text} />
          </TouchableOpacity>
        </View>

        {/* Navigation Arrows */}
        <View style={styles.navigationContainer}>
          <TouchableOpacity 
            style={[styles.navButton, { opacity: currentImageIndex === 0 ? 0.5 : 1 }]}
            onPress={handlePreviousImage}
            disabled={currentImageIndex === 0}
          >
            <Icon name="chevron-up" size={40} color={THEME.text} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.navButton, { opacity: currentImageIndex === profileImages.length - 1 ? 0.5 : 1 }]}
            onPress={handleNextImage}
            disabled={currentImageIndex === profileImages.length - 1}
          >
            <Icon name="chevron-down" size={40} color={THEME.text} />
          </TouchableOpacity>
        </View>

        {/* Bottom Content */}
        <View style={styles.bottomContent}>
          {/* Name and Age Section with Gradient */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.8)']}
            style={styles.nameGradient}
          >
            <View style={styles.nameAgeContainer}>
              <Text style={styles.nameText}>{userInfo.name},</Text>
              <Text style={styles.ageText}>{calculateAge(userInfo.date_of_birth)}</Text>
            </View>
          </LinearGradient>

          {/* About Box */}
          <View style={styles.aboutBox}>
            <Text style={styles.aboutTitle}>About</Text>
            <Text style={styles.aboutText}>
              {aboutText}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  mainContainer: {
    flex: 1,
  },
  profileImage: {
    position: 'absolute',
    width: screenWidth,
    height: screenHeight,
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: screenHeight,
  },
  header: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  editButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
  },
  navigationContainer: {
    position: 'absolute',
    right: 20,
    top: '50%',
    transform: [{ translateY: -50 }],
    zIndex: 2,
  },
  navButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  bottomContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  nameGradient: {
    paddingVertical: 15,
    marginBottom: 10,
    borderRadius: 20,
  },
  nameAgeContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 20,
  },
  nameText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: THEME.text,
    marginRight: 8,
  },
  ageText: {
    fontSize: 28,
    color: THEME.text,
  },
  aboutBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.darkText,
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 16,
    color: THEME.darkText,
    lineHeight: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: THEME.modalBackground,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: screenHeight * 0.8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.darkText,
  },
  closeButton: {
    padding: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingHorizontal: 20,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: THEME.primary,
  },
  tabText: {
    marginLeft: 8,
    color: THEME.lightText,
    fontSize: 14,
    fontWeight: '500',
  },
  activeTabText: {
    color: THEME.primary,
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  settingSection: {
    padding: 20,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME.darkText,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: THEME.lightText,
    marginBottom: 16,
  },
  dragListContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  imageOrderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.background,
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  imageItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  orderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
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
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    margin: 20,
    marginTop: 0,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    color: '#FF3B30',
    marginLeft: 8,
    fontWeight: '600',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: THEME.primary,
    padding: 16,
    borderRadius: 12,
    margin: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
  aboutSection: {
    marginTop: 20,
  },
  aboutInput: {
    backgroundColor: THEME.background,
    borderWidth: 1,
    borderColor: THEME.lightText,
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  aboutTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: THEME.background,
    borderWidth: 1,
    borderColor: THEME.lightText,
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
  },
  preferencesSection: {
    marginTop: 20,
  },
  hiddenImage: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },
});

export default ProfileScreen;