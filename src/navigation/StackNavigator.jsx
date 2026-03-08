import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import AgenceDashboardScreen from '../screens/agence/DashboardScreen';
import LivreurHomeScreen from '../screens/livreur/HomeScreen';
import DriverProfileScreen from '../screens/livreur/DriverProfileScreen';
import KycScreen from '../screens/livreur/KycScreen';
import MesCandidaturesScreen from '../screens/livreur/MesCandidaturesScreen';
import LivreurWalletScreen from '../screens/livreur/LivreurWalletScreen';
import { Colors } from '../config/theme';
import { STORAGE_KEYS } from '../config/constants';

const Stack = createStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="AgenceDashboard" component={AgenceDashboardScreen} />
            <Stack.Screen name="LivreurHome" component={LivreurHomeScreen} />
            <Stack.Screen name="DriverProfile" component={DriverProfileScreen} />
            <Stack.Screen name="KycVerification" component={KycScreen} />
            <Stack.Screen name="MesCandidatures" component={MesCandidaturesScreen} />
            <Stack.Screen name="Wallet" component={LivreurWalletScreen} />
        </Stack.Navigator>
    )
};

export default StackNavigator;