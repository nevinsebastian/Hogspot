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
  const [activeTab, setActiveTab] = useState('images');
  const [profileImages, setProfileImages] = useState([]);
  const [tempProfileImages, setTempProfileImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingChanges, setSavingChanges] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [aboutText, setAboutText] = useState('A good listener. I love having a good talk to know each other\'s side 😊');
  const [editingAbout, setEditingAbout] = useState(false);

  useEffect(() => {
    fetchProfileImages();
  }, []);

  const fetchProfileImages = async () => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const response = await fetch('http://15.206.127.132:8000/users/profile_images', {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data) {
        setProfileImages(data);
        setTempProfileImages(data);
      }
    } catch (error) {
      console.error('Error fetching profile images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = ({ data }) => {
    setTempProfileImages(data);
    setHasChanges(true);
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
        <Text style={styles.headerTitle}>Settings</Text>
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
            <Text style={styles.sectionTitle}>Posts</Text>
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
              style={[
                styles.saveButton,
                savingChanges && styles.saveButtonDisabled
              ]}
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
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Me</Text>
            {editingAbout ? (
              <TextInput
                style={styles.aboutInput}
                value={aboutText}
                onChangeText={setAboutText}
                multiline
                numberOfLines={4}
                onBlur={() => setEditingAbout(false)}
              />
            ) : (
              <TouchableOpacity 
                style={styles.aboutTextContainer}
                onPress={() => setEditingAbout(true)}
              >
                <Text style={styles.aboutText}>{aboutText}</Text>
                <Icon name="pencil" size={20} color={THEME.lightText} />
              </TouchableOpacity>
            )}
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: THEME.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: THEME.darkText,
  },
  headerRight: {
    width: 24,
  },
  backButton: {
    padding: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
  content: {
    flex: 1,
  },
  section: {
    padding: 20,
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
  orderImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  imageItemContent: {
    flex: 1,
    marginLeft: 12,
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
  dragListContainer: {
    paddingHorizontal: 20,
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
  aboutText: {
    flex: 1,
    color: THEME.darkText,
    fontSize: 16,
    lineHeight: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
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
});

export default SettingsScreen; 