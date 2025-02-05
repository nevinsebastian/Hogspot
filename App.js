import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper'; // Import PaperProvider

import WelcomeScreen from './components/WelcomeScreen';
import RegisterScreen from './components/RegisterScreen';
import VerifyEmailScreen from './components/VerifyEmailScreen';
import VerifyOTPScreen from './components/VerifyOTPScreen';
import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import Discover from './components/Discover';


const Stack = createStackNavigator();

const App = () => {
  return (
    <PaperProvider> {/* Wrap your app with PaperProvider */}
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{ headerShown: false }} // This removes the header for all screens
        >
          {/* <Stack.Screen name="Welcome" component={WelcomeScreen} /> */}
          {/* <Stack.Screen name="Register" component={RegisterScreen} /> */}
          {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Discover" component={Discover} />

        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
