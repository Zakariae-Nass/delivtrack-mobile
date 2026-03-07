import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import AgenceDashboardScreen from '../screens/agence/DashboardScreen';
import LivreurHomeScreen from '../screens/livreur/HomeScreen';
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
        </Stack.Navigator>
    )
};

export default StackNavigator;