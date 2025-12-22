import React, { useEffect, useState, Suspense, lazy } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { jwtDecode } from 'jwt-decode';
import Toast from 'react-native-toast-message';

// Regular import for ProfileScreen and SettingsScreen (frequently accessed, lazy loading causes issues with worklets dependencies)
import ProfileScreen from './components/ProfileScreen';
import SettingsScreen from './components/SettingsScreen';
import CustomTabBar from './components/CustomTabBar';

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
const UploadPhotoScreen = lazy(() => import('./components/UploadPhotoScreen'));
const OnboardingScreen = lazy(() => import('./components/OnboardingScreen'));

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
SplashScreen.preventAutoHideAsync();

// Loading component
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#4B164C" />
  </View>
);

// Main Tab Navigator for bottom navigation
const MainTabs = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        tabBarStyle: { 
          position: 'absolute',
          height: 0,
          opacity: 0,
          elevation: 0,
        },
        lazy: false, // Preload all tabs for instant switching
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ tabBarLabel: '' }}
      />
      <Tab.Screen 
        name="Discover" 
        component={Discover}
        options={{ tabBarLabel: '' }}
      />
      <Tab.Screen 
        name="Match" 
        component={Match}
        options={{ tabBarLabel: '' }}
      />
      <Tab.Screen 
        name="Chat" 
        component={Chat}
        options={{ tabBarLabel: '' }}
      />
    </Tab.Navigator>
  );
};

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
              const response = await fetch('http://18.207.241.126/users/user-info', {
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
                  setInitialRoute('MainTabs');
                }
              } else {
                setInitialRoute('MainTabs');
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
    <SafeAreaProvider>
      <PaperProvider>
        <NavigationContainer>
          <Suspense fallback={<LoadingScreen />}>
          <Stack.Navigator 
            initialRouteName={initialRoute}
            screenOptions={{ 
              headerShown: false,
              cardStyle: { backgroundColor: '#FDF7FD' },
              animation: 'fade', // Use fade animation instead of slide
              animationDuration: 150, // Quick fade transition
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
            
            {/* Main Tab Navigator */}
            <Stack.Screen 
              name="MainTabs" 
              component={MainTabs}
              options={{
                animation: 'none', // No animation for tab navigator
              }}
            />
            
            {/* Modal/Stack Screens */}
            <Stack.Screen 
              name="ProfileScreen" 
              component={ProfileScreen}
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen 
              name="UploadPhoto" 
              component={UploadPhotoScreen}
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{
                presentation: 'modal',
                animation: 'slide_from_bottom',
              }}
            />
          </Stack.Navigator>
          </Suspense>
        </NavigationContainer>
        <Toast />
      </PaperProvider>
    </SafeAreaProvider>
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


// hq cord [[9.477211, 76.335547],[9.477287, 76.336090],[9.476803, 76.336259],[9.476835, 76.335587],[9.477211, 76.335547]]