import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RegisterScreen from '../components/RegisterScreen';
import OTPVerificationScreen from '../components/OTPVerificationScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FDF7FD' },
      }}
    >
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator; 