import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SvgXml } from 'react-native-svg';

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
    alignItems: 'center',
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
});

export default HomeScreen;
