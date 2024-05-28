import React from 'react';
import { View, StyleSheet } from 'react-native';
import WelcomeScreen from './components/WelcomeScreen';
import HomeScreen from './components/HomeScreen';

const App = () => {
  return (
    <View style={styles.container}>
      <HomeScreen/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
