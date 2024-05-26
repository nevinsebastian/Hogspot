import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

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
    marginTop: 108
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
});

export default WelcomeScreen;
