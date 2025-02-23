import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';


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

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity style={styles.backIconContainer}  onPress={() => navigation.goBack()} >
          <SvgXml xml={backIcon} width={40} height={40} />
        </TouchableOpacity>
        <Image
          source={require('../assets/profile.jpg')} // Replace with the actual profile image source
          style={styles.profileImage}
        />
        <Text style={styles.name}>Melissa Peters</Text>
        <Text style={styles.email}>melissa@gmail.com</Text>
        <Text style={styles.location}>Lagos, Nigeria</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
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
    zIndex: 1, // Ensure the icon is above other elements
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
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
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;