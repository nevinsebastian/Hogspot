import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider as PaperProvider } from 'react-native-paper';
import { useFonts, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';

import WelcomeScreen from './components/WelcomeScreen';
import RegisterScreen from './components/RegisterScreen';
import VerifyEmailScreen from './components/VerifyEmailScreen';
import VerifyOTPScreen from './components/VerifyOTPScreen';
import HomeScreen from './components/HomeScreen';
import LoginScreen from './components/LoginScreen';
import Discover from './components/Discover';
import Match from './components/Match';
import Chat from './components/Chat';

const Stack = createStackNavigator();

SplashScreen.preventAutoHideAsync(); // Prevent splash screen from auto-hiding

const App = () => {
  const [appReady, setAppReady] = useState(false);

  const [fontsLoaded] = useFonts({
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    const prepareApp = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync(); // Hide splash screen once fonts are loaded
        setAppReady(true);
      }
    };
    prepareApp();
  }, [fontsLoaded]);

  if (!appReady) {
    return <View style={styles.container} />; // Empty view to hold splash screen
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={HomeScreen}options={{ animationEnabled: false }} />
          <Stack.Screen name="Discover" component={Discover} options={{ animationEnabled: false }} />
          <Stack.Screen name="Match" component={Match} options={{ animationEnabled: false }} />
          <Stack.Screen name="Chat" component={Chat} options={{ animationEnabled: false }} />
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
