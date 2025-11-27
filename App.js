import React, { useEffect, useState, Suspense, lazy } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import * as SplashScreen from 'expo-splash-screen';
import { jwtDecode } from 'jwt-decode';
import Toast from 'react-native-toast-message';

// Lazy load screens
const WelcomeScreen = lazy(() => import('./components/WelcomeScreen'));
const RegisterScreen = lazy(() => import('./components/RegisterScreen'));
const OTPVerificationScreen = lazy(() => import('./components/OTPVerificationScreen'));
const CompleteRegistrationScreen = lazy(() => import('./components/CompleteRegistrationScreen'));
const LoginScreen = lazy(() => import('./components/LoginScreen'));
const HomeScreen = lazy(() => import('./components/HomeScreen'));
const Discover = lazy(() => import('./components/Discover'));
const Match = lazy(() => import('./components/Match'));
const Chat = lazy(() => import('./components/Chat'));
const ProfileScreen = lazy(() => import('./components/ProfileScreen'));
const UploadPhotoScreen = lazy(() => import('./components/UploadPhotoScreen'));
const SettingsScreen = lazy(() => import('./components/SettingsScreen'));
const OnboardingScreen = lazy(() => import('./components/OnboardingScreen'));

const Stack = createStackNavigator();
SplashScreen.preventAutoHideAsync();

// Loading component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#4B164C" />
  </View>
);

const App = () => {
  const [appReady, setAppReady] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [initialRoute, setInitialRoute] = useState('Welcome');
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Check login status
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            if (decodedToken.exp && decodedToken.exp > currentTime) {
              setIsLoggedIn(true);
              
              // Check if user needs onboarding
              const response = await fetch('http://18.207.241.126/users/user-', {
                headers: {
                  'Authorization': `Bearer ${token}`,
                },
              });
              
              if (response.ok) {
                const userInfo = await response.json();
                if (!userInfo.gender || !userInfo.gender_preference) {
                  setNeedsOnboarding(true);
                  setInitialRoute('Onboarding');
                } else {
                  setInitialRoute('Home');
                }
              } else {
                setInitialRoute('Home');
              }
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

        // Preload assets and data
        await Promise.all([
          // Add any asset preloading here
        ]);

        setAppReady(true);
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error('Error preparing app:', error);
      }
    };

    prepareApp();
  }, []);

  if (!appReady) {
    return <View style={styles.container} />;
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Suspense fallback={<LoadingScreen />}>
          <Stack.Navigator 
            initialRouteName={initialRoute}
            screenOptions={{ 
              headerShown: false,
              cardStyle: { backgroundColor: '#FDF7FD' },
              animationEnabled: false, // Disable animations for faster transitions
            }}
          >
            {/* Authentication Screens */}
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
            <Stack.Screen name="CompleteRegistration" component={CompleteRegistrationScreen} />
            
            {/* Onboarding Screen */}
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            
            {/* Main App Screens */}
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Discover" component={Discover} />
            <Stack.Screen name="Match" component={Match} />
            <Stack.Screen name="Chat" component={Chat} />
            <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
            <Stack.Screen name="UploadPhoto" component={UploadPhotoScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </Stack.Navigator>
        </Suspense>
      </NavigationContainer>
      <Toast />
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FDF7FD',
  },
});

export default App;
