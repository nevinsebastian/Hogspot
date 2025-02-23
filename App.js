import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import jwtDecode from 'jwt-decode'; // Import JWT decode library

import WelcomeScreen from './components/WelcomeScreen';
import RegisterScreen from './components/RegisterScreen';
import VerifyEmailScreen from './components/VerifyEmailScreen';
import VerifyOTPScreen from './components/VerifyOTPScreen';
import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import Discover from './components/Discover';
import Match from './components/Match';
import Chat from './components/Chat';
import ProfileScreen from './components/ProfileScreen';

const Stack = createStackNavigator();
SplashScreen.preventAutoHideAsync();

const App = () => {
  const [appReady, setAppReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('auth_token');

      if (token) {
        try {
          const decodedToken = jwtDecode(token); // Decode JWT token
          const currentTime = Date.now() / 1000; // Get current time in seconds
          console.log(jwtDecode);

          if (decodedToken.exp && decodedToken.exp > currentTime) {
            setIsLoggedIn(true);
          } else {
            // Token expired, remove it
            await AsyncStorage.removeItem('auth_token');
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          await AsyncStorage.removeItem('auth_token'); // If there's an error, assume invalid token
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }

      await SplashScreen.hideAsync();
      setAppReady(true);
    };

    checkLoginStatus();
  }, []);

  if (!appReady) {
    return <View style={styles.container} />;
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={isLoggedIn ? 'Home' : 'Welcome'} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ animationEnabled: false }} />
          <Stack.Screen name="Discover" component={Discover} options={{ animationEnabled: false }} />
          <Stack.Screen name="Match" component={Match} options={{ animationEnabled: false }} />
          <Stack.Screen name="Chat" component={Chat} options={{ animationEnabled: false }} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ animationEnabled: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
