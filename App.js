import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { WorkoutProvider } from './src/context/WorkoutContext';
import HomeScreen from './src/screens/HomeScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import StatsScreen from './src/screens/StatsScreen';
import BluetoothScreen from './src/screens/BluetoothScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <WorkoutProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === 'Home') {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === 'Workout') {
                iconName = focused ? 'fitness' : 'fitness-outline';
              } else if (route.name === 'Bluetooth') {
                iconName = focused ? 'bluetooth' : 'bluetooth-outline';
              } else if (route.name === 'Stats') {
                iconName = focused ? 'stats-chart' : 'stats-chart-outline';
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#007AFF',
            tabBarInactiveTintColor: 'gray',
            headerStyle: {
              backgroundColor: '#007AFF',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          })}
        >
          <Tab.Screen 
            name="Home" 
            component={HomeScreen}
            options={{ title: 'Fitness Tracker' }}
          />
          <Tab.Screen 
            name="Workout" 
            component={WorkoutScreen}
            options={{ title: 'Workouts' }}
          />
          <Tab.Screen 
            name="Bluetooth" 
            component={BluetoothScreen}
            options={{ title: 'Bluetooth' }}
          />
          <Tab.Screen 
            name="Stats" 
            component={StatsScreen}
            options={{ title: 'Statistics' }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </WorkoutProvider>
  );
}
