import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

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
<path d="M21 11H13V3H11V11H3V13H11V21H13V13H21V11Z" stroke="#4B164C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const plusSvg = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 5V19M5 12H19" stroke="#4B164C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const matchesSvg = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 21C12 21 4 14.1865 4 8.7C4 5.79863 6.2 3.6 9.1 3.6C10.6763 3.6 12 4.52344 12 5.95312C12 4.52344 13.3237 3.6 14.9 3.6C17.8 3.6 20 5.79863 20 8.7C20 14.1865 12 21 12 21Z" stroke="#4B164C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

const messagesSvg = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 6V14C21 15.1046 20.1046 16 19 16H7L3 20V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6Z" stroke="#4B164C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

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
          <Text style={styles.personName}>Nevin</Text>
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
    backgroundColor: '#FFFFFF',
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
bottom: 90,
left: 24.79,
width: 83.97,
height: 26.75,
fontFamily: 'Inter-SemiBold',
fontSize: 14,
lineHeight: 19.6, // 140% of 14
color: '#FFFFFF',
},
personLocation: {
position: 'absolute',
bottom: 60,
left: 24.79,
width: 45.13,
height: 22.29,
fontFamily: 'Inter-SemiBold',
fontSize: 14,
lineHeight: 19.6, // 140% of 14
color: '#FFFFFF',
},
bottomNavbar: {
position: 'absolute',
left: 24,
top: 712,
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