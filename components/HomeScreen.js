import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image ,Dimensions , ActivityIndicator} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-deck-swiper';
import BottomNavbar from '../Things/BottomNavbar';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';







const bellSvg = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_201_658)">
<path d="M10 5C10 4.46957 10.2107 3.96086 10.5858 3.58579C10.9609 3.21071 11.4696 3 12 3C12.5304 3 13.0391 3.21071 13.4142 3.58579C13.7893 3.96086 14 4.46957 14 5C15.1484 5.54303 16.1274 6.38833 16.8321 7.4453C17.5367 8.50227 17.9404 9.73107 18 11V14C18.0753 14.6217 18.2954 15.2171 18.6428 15.7381C18.9902 16.2592 19.4551 16.6914 20 17H4C4.54494 16.6914 5.00981 16.2592 5.35719 15.7381C5.70457 15.2171 5.92474 14.6217 6 14V11C6.05956 9.73107 6.4633 8.50227 7.16795 7.4453C7.8726 6.38833 8.85159 5.54303 10 5" stroke="#4B164C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 17V18C9 18.7956 9.31607 19.5587 9.87868 20.1213C10.4413 20.6839 11.2044 21 12 21C12.7956 21 13.5587 20.6839 14.1213 20.1213C14.6839 19.5587 15 18.7956 15 18V17" stroke="#4B164C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<circle cx="18" cy="6" r="3.25" fill="#DD88CF" stroke="white" stroke-width="1.5"/>
</g>
<defs>
<clipPath id="clip0_201_658">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>
`;


const HomeScreen = () => {
  const navigation = useNavigation();
  const { width, height } = Dimensions.get('window');
  const [hotspotData, setHotspotData] = useState(null);
  const [otherUsers, setOtherUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isInHotspot, setIsInHotspot] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      fetchHotspotData(location.coords.latitude, location.coords.longitude);
      fetchUserInfo();
    })();
  }, []);

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

  const fetchHotspotData = async (latitude, longitude) => {
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const response = await fetch('http://15.206.127.132:8000/hotspot/start_swiping', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          latitude,
          longitude,
        }),
      });

      const data = await response.json();
      if (data.status === 'success') {
        setHotspotData(data.hotspots[0]);
        setOtherUsers(data.other_users || []);
        setIsInHotspot(true);
      } else if (data.status === 'failure') {
        setIsInHotspot(false);
      }
    } catch (error) {
      console.error('Error fetching hotspot data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('auth_token');
      navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  const navigateToProfile = () => {
    navigation.navigate('ProfileScreen'); // Navigate to the Profile screen
  };

  const renderCard = (card) => {
    if (!card) {
      return null;
    }

    const imageUrl = card.images && card.images.length > 0 ? card.images[0].image_url : null;

    return (
      <View style={styles.card}>
        <Image
          source={imageUrl ? { uri: imageUrl } : require('../assets/mish.jpg')}
          style={styles.cardImage}
          onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
        />
        <LinearGradient
          colors={['transparent', 'rgba(75, 22, 76, 0.8)', '#4B164C']}
          locations={[0, 0.5, 1]}
          style={styles.gradient}
        >
          <View style={styles.circle}>
            <Text style={styles.starEmoji}>⭐</Text>
          </View>
          <Text style={styles.personName}>{card.name}</Text>
          <Text style={styles.personLocation}>{card.age}</Text>
        </LinearGradient>
      </View>
    );
  };

  const onSwiped = async (index, swipeDirection) => {
    const swipedUser = otherUsers[index];
    if (!swipedUser) return;
  
    const swipeType = swipeDirection === 'right' ? 'right' : 'left';
  
    try {
      const token = await AsyncStorage.getItem('auth_token');
      const response = await fetch('http://15.206.127.132:8000/swipe/', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          swiped_user_id: swipedUser.id,
          swipe_type: swipeType,
        }),
      });
  
      // Log the raw response for debugging
      const rawResponse = await response.text();
      console.log('Raw API Response:', rawResponse);
  
      // Try to parse the response as JSON
      let data;
      try {
        data = JSON.parse(rawResponse);
      } catch (jsonError) {
        console.error('Failed to parse JSON:', jsonError);
        Alert.alert('Error', 'We ran into an issue. Please try again.');
        return;
      }
  
      // Check if the response status is 201 (success)
      if (response.status === 201) {
        console.log('Swipe recorded successfully:', data.detail);
      } else {
        console.error('API Error:', data);
        Alert.alert('Error', 'We ran into an issue. Please try again.');
      }
    } catch (error) {
      console.error('Error recording swipe:', error);
      Alert.alert('Error', 'We ran into an issue. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B164C" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {isInHotspot ? (
        <>
          <Text style={styles.heading}>Hogspot</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <View style={styles.bellContainer}>
              <SvgXml xml={bellSvg} width={24} height={24} />
            </View>
          </TouchableOpacity>
          <View style={styles.mainRectangle}>
            <View style={styles.innerRectangle}>
              <Image source={require('../assets/lulu.jpg')} style={styles.image} />
            </View>
            <Text style={styles.locationText}>{hotspotData ? hotspotData.name : 'Loading...'}</Text>
          </View>
          <View style={styles.newRectangle}>
            <TouchableOpacity onPress={navigateToProfile}>
              <Image
                source={userInfo?.image_url ? { uri: userInfo.image_url } : require('../assets/profileava.jpg')}
                style={styles.newImage}
              />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <View style={styles.notMainReactangle}>
            <View style={styles.newRectangle}>
              <TouchableOpacity onPress={navigateToProfile}>
                <Image
                  source={userInfo?.image_url ? { uri: userInfo.image_url } : require('../assets/profileava.jpg')}
                  style={styles.newImage}
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.notLocationText}>Hogspot Near You</Text>
          </View>
          <TouchableOpacity style={styles.notNotificationButton}>
            <View style={styles.bellContainer}>
              <SvgXml xml={bellSvg} width={24} height={24} />
            </View>
          </TouchableOpacity>
        </>
      )}

      {isInHotspot ? (
        <View style={styles.swiperContainer}>
          {otherUsers.length > 0 ? (
            <Swiper
              cards={otherUsers}
              renderCard={renderCard}
              onSwiped={(index) => onSwiped(index, 'left')} // Swipe left
              onSwipedRight={(index) => onSwiped(index, 'right')} // Swipe right
              infinite
              backgroundColor="transparent"
              cardHorizontalMargin={0}
              stackSize={3}
              stackSeparation={-30}
              animateCardOpacity
              disableTopSwipe
              disableBottomSwipe
              stackAnimationFriction={10}
              stackAnimationTension={60}
              containerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              cardStyle={{ position: 'absolute' }}
            />
          ) : (
            <Text style={styles.noUsersText}>No users found in this hotspot.</Text>
          )}
        </View>
      ) : (
        <View style={styles.notInHotspotContainer}>
          <Text style={styles.notInHotspotText}>You are not in a Hogspot</Text>
        </View>
      )}

      <View style={styles.bottomNavbarContainer}>
        <BottomNavbar currentScreen="home" />
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fdf7fd',
  },
  heading: {
    fontSize: 28,
    fontFamily: 'inter-bold',
    color: '#4B164C',
    position: 'absolute',
    left: 16,
    top: Platform.OS === 'ios' ? 74 : 50,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  newImage: {
    width: 64.25,
    height: 64.63,
    borderRadius: 30,
    left: 300,
    top: 125,
    borderWidth: 2,
    borderColor: '#DD88CF',
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 16,
    top: 72,
  },
  notNotificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 16,
    top: 79,
  },
  bellContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#d1c9c9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainRectangle: {
    position: 'absolute',
    left: 7,
    top: 137,
    width: 288,
    height: 64,
    borderRadius: 40,
    backgroundColor: '#FFDFDF',
    borderColor: '#DDDFDF',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
  },

notMainReactangle: {
  position: 'absolute',
  left: 7,
  top: 72,
  width: 288,
  height: 64,
  borderRadius: 40,
  backgroundColor: '#FFDFDF',
  borderColor: '#DDDFDF',
  borderWidth: 1,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.2,
  shadowRadius: 3,
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 8,
},
  innerRectangle: {
    width: 57,
    height: 50,
    borderRadius: 32,
    borderColor: '#71656F',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  image: {
    width: 54,
    height: 49,
    borderRadius: 32,
  },
  locationText: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#4B164C',
    lineHeight: 31.2,
    marginTop:14
  },
  notLocationText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#4B164C',
    lineHeight: 31.2,
  },
  swiperContainer: {
    position: 'absolute',
    left: 14,
    top: 170,
    width: '100%',
    height: '0%',
  },
  notInHotspotContainer: {
    position: 'absolute',
    left: 14,
    top: 200,
    width: 360, // Same as swiperContainer
    height: 459, // Same as swiperContainer
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#999999',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  notInHotspotText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#4B164C',
  },
  card: {
    borderRadius: 24,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#999999',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    overflow: 'hidden',
    width: 360,
    height: 459,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 150,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 41.98,
    height: 42.82,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  starEmoji: {
    fontSize: 24,
  },
  personName: {
    position: 'absolute',
    bottom: 45,
    left: 24.79,
    width: 103.97,
    height: 26.75,
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    lineHeight: 19.6,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  personLocation: {
    position: 'absolute',
    bottom: 30,
    left: 24.79,
    width: 100.13,
    height: 22.29,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    lineHeight: 19.6,
    color: '#6C727F',
    textTransform: 'uppercase',
  },
  bottomNavbarContainer: {
    position: 'absolute',
    zIndex: 10,
    left: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, 

    
    shadowRadius: 4,
    elevation: 4,
  },
});

export default HomeScreen;