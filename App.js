import React from 'react';
import { View, StyleSheet } from 'react-native';
import WelcomeScreen from './components/WelcomeScreen';

const App = () => {
  return (
    <View style={styles.container}>
      <WelcomeScreen />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
