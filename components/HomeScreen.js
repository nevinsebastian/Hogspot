import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import SwipeCards from 'react-native-swipe-cards';


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

const homeSvg = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 3L4 10V20C4 20.2652 4.12041 20.5196 4.33474 20.7071C4.54906 20.8946 4.83975 21 5.14286 21H8.57143C8.87453 21 9.16522 20.8946 9.37955 20.7071C9.59388 20.5196 9.71429 20.2652 9.71429 20V16C9.71429 15.7348 9.83469 15.4804 10.049 15.2929C10.2633 15.1054 10.554 15 10.8571 15H13.1429C13.446 15 13.7367 15.1054 13.951 15.2929C14.1653 15.4804 14.2857 15.7348 14.2857 16V20C14.2857 20.2652 14.4061 20.5196 14.6205 20.7071C14.8348 20.8946 15.1255 21 15.4286 21H18.8571C19.1602 21 19.4509 20.8946 19.6653 20.7071C19.8796 20.5196 20 20.2652 20 20V10L12 3Z" stroke="#4B164C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const discoverSvg = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1347_305)">
<path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="#4B164C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M8 16L10 10L16 8L14 14L8 16Z" stroke="#4B164C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_1347_305">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>

`;

const plusSvg = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1347_317)">
<path d="M12 5V19" stroke="#4B164C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M5 12H19" stroke="#4B164C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</g>
<defs>
<clipPath id="clip0_1347_317">
<rect width="24" height="24" fill="white"/>
</clipPath>
</defs>
</svg>

`;

const matchesSvg = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 4.354C12.5374 3.7447 13.2477 3.31351 14.0362 3.11779C14.8247 2.92208 15.6542 2.97112 16.4142 3.2584C17.1741 3.54568 17.8286 4.05757 18.2905 4.72596C18.7524 5.39435 18.9998 6.18754 18.9998 7C18.9998 7.81246 18.7524 8.60565 18.2905 9.27404C17.8286 9.94243 17.1741 10.4543 16.4142 10.7416C15.6542 11.0289 14.8247 11.0779 14.0362 10.8822C13.2477 10.6865 12.5374 10.2553 12 9.646M15 21H3V20C3 18.4087 3.63214 16.8826 4.75736 15.7574C5.88258 14.6321 7.4087 14 9 14C10.5913 14 12.1174 14.6321 13.2426 15.7574C14.3679 16.8826 15 18.4087 15 20V21ZM15 21H21V20C21.0001 18.9467 20.723 17.9119 20.1965 16.9997C19.6699 16.0875 18.9125 15.3299 18.0004 14.8032C17.0882 14.2765 16.0535 13.9992 15.0002 13.9992C13.9469 13.9991 12.9122 14.2764 12 14.803M13 7C13 8.06087 12.5786 9.07828 11.8284 9.82843C11.0783 10.5786 10.0609 11 9 11C7.93913 11 6.92172 10.5786 6.17157 9.82843C5.42143 9.07828 5 8.06087 5 7C5 5.93913 5.42143 4.92172 6.17157 4.17157C6.92172 3.42143 7.93913 3 9 3C10.0609 3 11.0783 3.42143 11.8284 4.17157C12.5786 4.92172 13 5.93913 13 7Z" stroke="#4B164C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

`;

const messagesSvg = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 11.5C21.0034 12.8199 20.695 14.1219 20.1 15.3C19.3944 16.7118 18.3097 17.8992 16.9674 18.7293C15.6251 19.5594 14.0782 19.9994 12.5 20C11.1801 20.0034 9.8781 19.6951 8.69999 19.1L3 21L4.9 15.3C4.30493 14.1219 3.99656 12.8199 4 11.5C4.00061 9.92177 4.44061 8.37487 5.27072 7.03257C6.10082 5.69027 7.28825 4.60559 8.69999 3.90003C9.8781 3.30496 11.1801 2.99659 12.5 3.00003H13C15.0843 3.11502 17.053 3.99479 18.5291 5.47088C20.0052 6.94698 20.885 8.91567 21 11V11.5Z" stroke="#4B164C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

`;

const data = [
  { id: 1, name: 'Mishell Rose Mathew', location: 'Kochi', image: require('../assets/person.jpg') },
  // Add more data objects if you have multiple cards
];


//const Card = ({ person }) => (
//  <View style={styles.card}>
//    <LinearGradient colors={['#4B164C', '#4B164C70']} style={styles.gradient}>
//      <Image source={person.image} style={styles.cardImage} />
//      <View style={styles.circle}>
//        <Text style={styles.starEmoji}>⭐</Text>
//      </View>
//      <Text style={styles.personName}>{person.name}</Text>
//      <Text style={styles.personLocation}>{person.location}</Text>
//    </LinearGradient>
//  </View>
//);


const HomeScreen = () => {

  

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Hogspot</Text>
      <TouchableOpacity style={styles.notificationButton}>
        <SvgXml xml={bellSvg} style={styles.bellIcon} />
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

      <View style={styles.bottomShape}>
        <LinearGradient
          colors={['#4B164C', '#4B164C70']}
          style={styles.gradient}
        >
          <Image source={require('../assets/person.jpg')} style={styles.bottomImage} />
          <View style={styles.circle}>
            <Text style={styles.starEmoji}>⭐</Text>
          </View>
          <Text style={styles.personName}>Mishell Rose Mathew</Text>
          <Text style={styles.personLocation}>Kochi</Text>
        </LinearGradient>
      </View>

      <View style={styles.bottomNavbar}>
        <TouchableOpacity style={styles.navButton}>
          <SvgXml xml={homeSvg} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <SvgXml xml={discoverSvg} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <SvgXml xml={plusSvg} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <SvgXml xml={matchesSvg} style={styles.navIcon} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton}>
          <SvgXml xml={messagesSvg} style={styles.navIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#4B164C',
    position: 'absolute',
    left: 16,
    top: 58,
  },
  notificationButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems:'center',
position: 'absolute',
right: 16,
top: 52,
},
bellIcon: {
width: 24,
height: 24,
color: '#4B164C',
},
mainRectangle: {
position: 'absolute',
left: 7,
top: 112,
width: 268,
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
width: 50,
height: 50,
borderRadius: 32,
},
locationText: {
fontSize: 24,
fontFamily: 'Inter-Bold',
color: '#4B164C',
lineHeight: 31.2, // 130% of 24
},
newRectangle: {
position: 'absolute',
left: 290,
top: 108, // Adjusted to align better with the existing rectangle
width: 70,
height: 67,
borderRadius: 32,
borderColor: '#DD88CF',
borderWidth: 2,
justifyContent: 'center',
alignItems: 'center',
},
newImage: {
width: 61.25,
height: 58.63,
borderRadius: 30,
},
bottomShape: {
position: 'absolute',
left: 8,
top: 213,
width: 360,
height: 459,
borderRadius: 24,
backgroundColor: '#FFFFFF',
borderWidth: 1,
borderColor: '#999999',
shadowColor: '#000',
shadowOffset: { width: 0, height: 2 },
shadowOpacity: 0.2,
shadowRadius: 3,
overflow: 'hidden',
},
gradient: {
flex: 1,
justifyContent: 'flex-start',
alignItems: 'center',
borderRadius: 24,
},
bottomImage: {
width: 361.05,
height: 566.06,
resizeMode: 'cover',
position: 'absolute',
top: 0,
left: 0,
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
width: 83.97,
height: 26.75,
fontFamily: 'Inter-SemiBold',
fontSize: 14,
lineHeight: 19.6, // 140% of 14
color: '#FFFFFF',
borderColor:"#999999"
},
personLocation: {
position: 'absolute',
bottom: 30,
left: 24.79,
width: 45.13,
height: 22.29,
fontFamily: 'Inter-Medium',
fontSize: 14,
lineHeight: 19.6, // 140% of 14
color: '#FFFFFF',
},
bottomNavbar: {
position: 'absolute',
left: 24,
top: 722,
width: 327,
height: 64,
borderRadius: 40,
backgroundColor: '#FFFFFF',
shadowColor: '#752277',
shadowOffset: { width: 0, height: 8 },
shadowOpacity: 0.15,
shadowRadius: 40,
flexDirection: 'row',
justifyContent: 'space-around',
alignItems: 'center',
},
navButton: {
justifyContent: 'center',
alignItems: 'center',
},
navIcon: {
width: 24,
height: 24,
color: '#4B164C',
},
});

export default HomeScreen;