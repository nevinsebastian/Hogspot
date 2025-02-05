import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';


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

const BottomNavbar = ({ currentScreen }) => {
  const navigation = useNavigation(); // Initialize navigation

  return (
    <View style={styles.bottomNavbar}>
      {/* Home Button with Circle Highlight */}
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Home')}>
        <View style={[styles.iconContainer, currentScreen === 'home' && styles.activeIconContainer]}>
          <SvgXml xml={homeSvg} style={[styles.navIcon, currentScreen === 'home' && styles.activeNavIcon]} />
        </View>
      </TouchableOpacity>

      {/* Discover Button */}
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Discover')}>
        <SvgXml xml={discoverSvg} style={styles.navIcon} />
      </TouchableOpacity>

      {/* Center Plus Button (unchanged) */}
      <TouchableOpacity>
        <SvgXml xml={plusSvg} width={50} height={50} />
      </TouchableOpacity>

      {/* Matches Button */}
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Matches')}>
        <SvgXml xml={matchesSvg} style={styles.navIcon} />
      </TouchableOpacity>

      {/* Messages Button */}
      <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('Messages')}>
        <SvgXml xml={messagesSvg} style={styles.navIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeIconContainer: {
    backgroundColor: '#DD88CF', // Circle background only for active icon
  },
  navIcon: {
    width: 24,
    height: 24,
    color: '#4B164C', // Default color
  },
  activeNavIcon: {
    color: '#FFFFFF', // White icon inside when active
  },
});

export default BottomNavbar;