import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-deck-swiper';
import BottomNavbar from '../Things/BottomNavbar';




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



const cardData = [
  {
    id: 1,
    name: 'Mishell Rose Mathew',
    location: 'Kochi',
    image: require('../assets/mish.jpg'),
  },
  {
    id: 2,
    name: 'Nevin',
    location: 'Alappuzha',
    image: require('../assets/nevin.jpg'),
  },
  {
    id: 3,
    name: 'Bin',
    location: 'Trivandrum',
    image: require('../assets/bin.jpg'),
  }, {
    id: 4,
    name: 'Sreejith',
    location: 'Trivandrum',
    image: require('../assets/sree.jpeg'),
  },
];

const HomeScreen = () => {
  const navigation = useNavigation();

  const renderCard = (card) => {
    return (
      <View style={styles.card}>
        <Image source={card.image} style={styles.cardImage} />
        <LinearGradient
          colors={['transparent', 'rgba(75, 22, 76, 0.8)', '#4B164C']}
          locations={[0, 0.5, 1]} // Adjust gradient stops
          style={styles.gradient}
        >
          <View style={styles.circle}>
            <Text style={styles.starEmoji}>⭐</Text>
          </View>
          <Text style={styles.personName}>{card.name}</Text>
          <Text style={styles.personLocation}>{card.location}</Text>
        </LinearGradient>
      </View>
    );
  };

  const onSwiped = (index) => {
    console.log(`Card ${index} swiped`);
  };

  return (
    <View style={styles.container}>
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
        <Text style={styles.locationText}>Lulu, Kochi</Text>
      </View>
      <View style={styles.newRectangle}>
        <Image source={require('../assets/profile.jpg')} style={styles.newImage} />
      </View>
      {/* Swipeable Cards */}
      <View style={styles.swiperContainer}>
      <Swiper
  cards={cardData}
  renderCard={renderCard}
  onSwiped={onSwiped}
  infinite
  backgroundColor="transparent"
  cardHorizontalMargin={0}
  stackSize={3} // Keep 3 cards visible at a time
  stackSeparation={-30} // Makes the next card more visible
  animateCardOpacity
  disableTopSwipe
  disableBottomSwipe
  stackAnimationFriction={10} // Reduces delay by making animation snappier
  stackAnimationTension={60} // Makes stacking more responsive
  containerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
  cardStyle={{ position: 'absolute' }} // Ensures correct stacking
/>


      </View>

      <View style={styles.bottomNavbarContainer}>
        <BottomNavbar currentScreen="home" />
      </View>
      </View>
  );
};

const styles = StyleSheet.create({
  bottomNavbarContainer: {
position: 'absolute',
    zIndex: 10, // Ensure BottomNavbar is above Swiper
    left:8, // Set left position to 0
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4, // For Android shadow effect
  },

  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fdf7fd',
  },
  heading: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#4B164C',
    position: 'absolute',
    left: 16,
    top: 74,
  }, 
   newImage: {
    width: 64.25,
    height: 64.63,
    borderRadius: 30,
    left:300,
    top:125,
    borderWidth: 2, // Add a stroke
    borderColor: '#DD88CF', // Black color for the stroke
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
  bellContainer: {
    width: 48,
    height: 48,
    borderRadius: 24, // Makes it a circle
    borderWidth: 1.5, // Adjust stroke width
    borderColor: '#d1c9c9', // Border color
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellIcon: {
    width: 24,
    height: 24,
    color: '#4B164C',
    
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
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#4B164C',
    lineHeight: 31.2,
  },
  swiperContainer: {
    position: 'absolute',
    left: 14,
    top: 170,
    width: '100%',
    height: '0%', // Adjust height to avoid overlapping with BottomNavbar
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
    width: 360, // Fixed width to match Figma
    height: 459, // Matches Figma
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
 
});

export default HomeScreen;