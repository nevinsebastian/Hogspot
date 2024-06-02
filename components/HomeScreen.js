



import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

const bellSvg = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12 2C13.1 2 14 2.9 14 4H10C10 2.9 10.9 2 12 2ZM18 8V11C18 12.66 18.79 14.14 20 15.1V16H4V15.1C5.21 14.14 6 12.66 6 11V8C6 5.79 7.79 4 10 4H14C16.21 4 18 5.79 18 8ZM16 17H8V18H16V17Z" fill="#4B164C"/>
</svg>
`;

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>Hogspot</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <SvgXml xml={bellSvg} />
        </TouchableOpacity>
      </View>
      <View style={styles.rectangleContainer}>
        <LinearGradient
          colors={['#7D4E76', '#E38DD5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBorder}
        >
          <View style={styles.rectangleContent}>
            <View style={styles.circleContainer}>
              <Image
                source={require('../assets/lulu.jpg')}
                style={styles.circleImage}
              />
            </View>
            <Text style={styles.rectangleText}>Lulu, Kochi</Text>
          </View>
        </LinearGradient>
        <View style={styles.externalShape}>
          <Image
            source={require('../assets/profile.jpg')}
            style={styles.externalImage}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 58,
    paddingBottom: 10,
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
    borderWidth: 1,
    borderColor: '#4B164C',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 16,
    top: 52,
  },
  rectangleContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  gradientBorder: {
    width: 271,
    height: 70,
    borderRadius: 32,
    padding: 2,
  },
  rectangleContent: {
    flex: 1,
    backgroundColor: '#F8E7F6',
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circleContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 4,
    borderColor: '#DD88CF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  circleImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  rectangleText: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#4B164C',
    marginLeft: 16,
  },
  externalShape: {
    position: 'absolute',
    right: -35, // Adjust to position correctly
    top: -2,
    width: 70,
    height: 67,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#DD88CF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  externalImage: {
    width: 62,
    height: 59,
    borderRadius: 16,
  },
});

export default HomeScreen;
