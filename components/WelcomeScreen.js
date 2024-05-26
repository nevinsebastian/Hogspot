import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View >
      <Image 
        source={require('../assets/Group.png')} 
        style={styles.image} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff', 
  },
  image: {
    width: 311, 
    height: 316,
    marginBottom: 20, 
    marginLeft:48,
    marginTop:108
  },
  text: {
    fontSize: 24, 
  },
});

export default WelcomeScreen;
