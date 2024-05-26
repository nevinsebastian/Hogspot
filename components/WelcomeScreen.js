// WelcomeScreen.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image 
        source={require('../assets/Group.png')} 
        style={styles.image} 
      />
      <Text style={styles.text}>Welcome Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff', // Optional: to set a background color
  },
  image: {
    width: 311, // Adjust the width of the image
    height: 306, // Adjust the height of the image
    marginBottom: 20, // Space between image and text
  },
  text: {
    fontSize: 24, // Adjust the size of the text
  },
});

export default WelcomeScreen;
