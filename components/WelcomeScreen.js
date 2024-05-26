import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { SvgXml } from 'react-native-svg';

const googleSvg = `
<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="20" cy="20" r="20" fill="white"/>
<path d="M29.8055 18.0415H29V18H20V22H25.6515C24.827 24.3285 22.6115 26 20 26C16.6865 26 14 23.3135 14 20C14 16.6865 16.6865 14 20 14C21.5295 14 22.921 14.577 23.9805 15.5195L26.809 12.691C25.023 11.0265 22.634 10 20 10C14.4775 10 10 14.4775 10 20C10 25.5225 14.4775 30 20 30C25.5225 30 30 25.5225 30 20C30 19.3295 29.931 18.675 29.8055 18.0415Z" fill="#FFC107"/>
<path d="M11.1528 15.3455L14.4383 17.755C15.3273 15.554 17.4803 14 19.9998 14C21.5293 14 22.9208 14.577 23.9803 15.5195L26.8088 12.691C25.0228 11.0265 22.6338 10 19.9998 10C16.1588 10 12.8278 12.1685 11.1528 15.3455Z" fill="#FF3D00"/>
<path d="M20.0002 30.0001C22.5832 30.0001 24.9302 29.0116 26.7047 27.4041L23.6097 24.7851C22.5719 25.5743 21.3039 26.0011 20.0002 26.0001C17.3992 26.0001 15.1907 24.3416 14.3587 22.0271L11.0977 24.5396C12.7527 27.7781 16.1137 30.0001 20.0002 30.0001Z" fill="#4CAF50"/>
<path d="M29.8055 18.0415H29V18H20V22H25.6515C25.2571 23.1082 24.5467 24.0766 23.608 24.7855L23.6095 24.7845L26.7045 27.4035C26.4855 27.6025 30 25 30 20C30 19.3295 29.931 18.675 29.8055 18.0415Z" fill="#1976D2"/>
</svg>
`;

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/Group.png')} 
        style={styles.image} 
      />
      <Text style={styles.text}>
        Find <Text style={styles.loveText}>Love</Text> Where it Matters Most!
      </Text>
      <TouchableOpacity style={styles.button}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>✉️</Text>
        </View>
        <Text style={styles.buttonText}>Login with Email</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.googleButton]}>
        <View style={styles.iconContainer}>
          <SvgXml xml={googleSvg} />
        </View>
        <Text style={styles.buttonTextgoogle}>Login with Google</Text>
      </TouchableOpacity>
      <Text style={styles.signUpText}>
        Don’t have an account? <Text style={styles.signUpLink}>Sign Up</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: 311, 
    height: 316,
    marginBottom: 20, 
    marginTop: 108,
  },
  text: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#22172A',
    textAlign: 'center',
    width: 279,
    height: 72,
  },
  loveText: {
    color: '#DD88FC',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4B164C',
    width: 295,
    height: 56,
    borderRadius: 32,
    marginTop: 20,
    position: 'relative',
  },
  googleButton: {
    backgroundColor: '#FCF3FA',
  },
  iconContainer: {
    backgroundColor: '#FFFFFF',
    position: 'absolute',
    left: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: 'Inter-Bold',
    marginLeft: 50, 
  },
  buttonTextgoogle: {
    fontSize: 16,
    color: '#4B164C',
    fontFamily: 'Inter-Bold',
    marginLeft: 50, 
  },
  signUpText: {
    fontSize: 14,
    color: 'rgba(34, 23, 42, 0.7)',
    fontFamily: 'Inter-Regular',
    marginTop: 47,
  },
  signUpLink: {
    color: '#DD88CF',
    fontFamily: 'Inter-SemiBold',
  },
});

export default WelcomeScreen;
