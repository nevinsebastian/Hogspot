import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity,ActivityIndicator } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BottomNavbar from '../Things/BottomNavbar';


const backIcon = `<svg width="48" height="48" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect opacity="0.08" x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="#22172A"/>
<g clip-path="url(#clip0_1473_352)">
<path d="M23 14L17 20L23 26" stroke="#22172A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_1473_352">
<rect width="24" height="24" fill="white" transform="translate(8 8)"/>
</clipPath>
</defs>
</svg>
`;

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        const response = await fetch('http://15.206.127.132:8000/users/user-info', {
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

  if (!userInfo) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B164C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity style={styles.backIconContainer} onPress={() => navigation.goBack()}>
          <SvgXml xml={backIcon} width={40} height={40} />
        </TouchableOpacity>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: userInfo.image_url }}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.name}>{userInfo.name}</Text>
        <Text style={styles.email}>{userInfo.email}</Text>
        <Text style={styles.location}>{userInfo.date_of_birth}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>122</Text>
          <Text style={styles.statLabel}>Spots</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>67</Text>
          <Text style={styles.statLabel}>Hogspoted</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      <View style={styles.aboutSection}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
      </View>

      <View style={styles.line} />

      <View style={styles.photosSection}>
        <Text style={styles.sectionTitle}>Photos</Text>
        <View style={styles.photosContainer}>
          <View style={styles.photoContainer}>
          <Image
              source={{ uri: 'https://via.placeholder.com/100' }}
              style={styles.photo}
            />
          </View>
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/100' }}
              style={styles.photo}
            />
          </View>
          <View style={styles.photoContainer}>
            <Image
              source={{ uri: 'https://via.placeholder.com/100' }}
              style={styles.photo}
            />
          </View>
        </View>
      </View>
      <View style={styles.bottomNavbarContainer}>
        <BottomNavbar  />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fdf7fd',
    padding: 20,
  }, bottomNavbarContainer: {
    position: 'absolute',
    zIndex: 10,
    left: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4, // For Android shadow effect
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 50,
  },
  backIconContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 1,
  },
  profileImageContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: '#DD88CF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  location: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
  },
  editButton: {
    backgroundColor: '#4B164C',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  aboutSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 14,
    color: '#666',
  },
  line: {
    height: 1,
    backgroundColor: '#ddd',
    marginBottom: 20,
  },
  photosSection: {
    marginBottom: 20,
  },
  photosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  photoContainer: {
    width: 100,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#fff',
    elevation: 5, // Drop shadow for Android
    shadowColor: '#000', // Drop shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProfileScreen;