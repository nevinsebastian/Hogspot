import React from 'react';
import { View, StyleSheet } from 'react-native';
import WelcomeScreen from './components/WelcomeScreen';
import HomeScreen from './components/HomeScreen';
import Discover from './components/Discover';

const App = () => {
  return (
    <View style={styles.container}>
      <Discover/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
