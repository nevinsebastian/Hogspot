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
    work: 'Software Engineer',
    education: 'Add',
    gender: 'Man',
    location: 'New York',
    hometown: 'Boston',
    height: '180 cm',
    exercise: 'Active',
    education_level: 'Bachelor\'s degree',
    drinking: 'Socially',
    smoking: 'Never',
    looking_for: 'Relationship',
    want_kids: 'Not sure',
    have_kids: 'Don\'t have kids'
  });

  const aboutSections = [
    { id: 'work', icon: 'briefcase', label: 'Work', value: profileInfo.work },
    { id: 'education', icon: 'school', label: 'Education', value: profileInfo.education },
    { id: 'gender', icon: 'account', label: 'Gender', value: profileInfo.gender },
    { id: 'location', icon: 'map-marker', label: 'Location', value: profileInfo.location },
    { id: 'hometown', icon: 'home', label: 'Hometown', value: profileInfo.hometown },
  ];

  const moreSections = [
    { id: 'height', icon: 'human-male-height', label: 'Height', value: profileInfo.height },
    { id: 'exercise', icon: 'dumbbell', label: 'Exercise', value: profileInfo.exercise },
    { id: 'education_level', icon: 'school', label: 'Education level', value: profileInfo.education_level },
    { id: 'drinking', icon: 'glass-wine', label: 'Drinking', value: profileInfo.drinking },
    { id: 'smoking', icon: 'smoking', label: 'Smoking', value: profileInfo.smoking },
    { id: 'looking_for', icon: 'magnify', label: 'Looking for', value: profileInfo.looking_for },
    { id: 'want_kids', icon: 'baby-carriage', label: 'Kids', value: profileInfo.want_kids },
    { id: 'have_kids', icon: 'account-child', label: 'Have kids', value: profileInfo.have_kids },
  ];

  useEffect(() => {
    console.log('SettingsScreen mounted');
    fetchProfileImages().catch(error => {
      console.error('Error in fetchProfileImages:', error);
      Alert.alert('Error', 'Failed to load profile images. Please try again.');
    });
  }, []);

  const fetchProfileImages = async () => {
    try {
      console.log('Fetching profile images...');
      const token = await AsyncStorage.getItem('auth_token');
      if (!token) {
        console.error('No auth token found');
        throw new Error('Authentication token not found');
      }

      const response = await fetch('http://15.206.127.132:8000/users/profile_images', {
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
      `http://15.206.127.132:8000/users/update_image_priority/${imageId}?priority=${newPriority}`,
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

  const renderSectionContent = (section) => {
    switch (section.id) {
      case 'gender':
        return (
          <View style={styles.expandedContent}>
            {['Man', 'Woman', 'Other'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  profileInfo.gender === option && styles.selectedOption
                ]}
                onPress={() => {
                  setProfileInfo({...profileInfo, gender: option});
                  setExpandedSection(null);
                }}
              >
                <Text style={[
                  styles.optionText,
                  profileInfo.gender === option && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        );
      // Add more cases for other sections
      default:
        return (
          <View style={styles.expandedContent}>
            <TextInput
              style={styles.expandedInput}
              value={profileInfo[section.id]}
              onChangeText={(text) => setProfileInfo({...profileInfo, [section.id]: text})}
              placeholder={`Enter your ${section.label.toLowerCase()}`}
            />
          </View>
        );
    }
  };

  const renderSection = (section) => (
    <View key={section.id}>
      <TouchableOpacity
        style={styles.sectionItem}
        onPress={() => handleSectionPress(section.id)}
      >
        <View style={styles.sectionLeft}>
          <Icon name={section.icon} size={24} color={THEME.darkText} />
          <Text style={styles.sectionLabel}>{section.label}</Text>
        </View>
        <View style={styles.sectionRight}>
          <Text style={styles.sectionValue}>{section.value}</Text>
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
        <View style={styles.headerRight} />
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
                  <Image 
                    source={{ uri: item.image_url }} 
                    style={styles.orderImage} 
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
          <Text style={styles.sectionTitle}>About you</Text>
          {aboutSections.map(renderSection)}
          
          <Text style={styles.sectionTitle}>More about you</Text>
          <Text style={styles.sectionSubtitle}>Cover the things most people are curious about.</Text>
          {moreSections.map(renderSection)}
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
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: THEME.background,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedOption: {
    backgroundColor: THEME.primary,
    borderColor: THEME.primary,
  },
  optionText: {
    fontSize: 16,
    color: THEME.darkText,
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
});

export default SettingsScreen; 