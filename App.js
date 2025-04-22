import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import { jwtDecode } from 'jwt-decode';

import WelcomeScreen from './components/WelcomeScreen';
import RegisterScreen from './components/RegisterScreen';
import OTPVerificationScreen from './components/OTPVerificationScreen';
import CompleteRegistrationScreen from './components/CompleteRegistrationScreen';
import LoginScreen from './components/LoginScreen';
import HomeScreen from './components/HomeScreen';
import Discover from './components/Discover';
import Match from './components/Match';
import Chat from './components/Chat';
import ProfileScreen from './components/ProfileScreen';
import UploadPhotoScreen from './components/UploadPhotoScreen';

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
          const decodedToken = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decodedToken.exp && decodedToken.exp > currentTime) {
            setIsLoggedIn(true);
          } else {
            await AsyncStorage.removeItem('auth_token');
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          await AsyncStorage.removeItem('auth_token');
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
        <Stack.Navigator 
          initialRouteName={isLoggedIn ? 'Home' : 'Welcome'} 
          screenOptions={{ 
            headerShown: false,
            cardStyle: { backgroundColor: '#FDF7FD' },
          }}
        >
          {/* Authentication Screens */}
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
          <Stack.Screen name="CompleteRegistration" component={CompleteRegistrationScreen} />
          
          {/* Main App Screens */}
          <Stack.Screen name="Home" component={HomeScreen} options={{ animationEnabled: false }} />
          <Stack.Screen name="Discover" component={Discover} options={{ animationEnabled: false }} />
          <Stack.Screen name="Match" component={Match} options={{ animationEnabled: false }} />
          <Stack.Screen name="Chat" component={Chat} options={{ animationEnabled: false }} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} options={{ animationEnabled: false }} />
          <Stack.Screen name="UploadPhoto" component={UploadPhotoScreen} />
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
