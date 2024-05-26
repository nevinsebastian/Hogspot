import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

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
  },
  iconContainer: {
    backgroundColor: '#FFFFFF',
    position:'absolute',
    left:10,
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
  },
});

export default WelcomeScreen;
