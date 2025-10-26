import React from 'react';
import { Platform, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { WorkoutProvider } from './src/context/WorkoutContext';
import { BluetoothProvider } from './src/context/BluetoothContext';
import HomeScreen from './src/screens/HomeScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import StatsScreen from './src/screens/StatsScreen';
import BluetoothScreen from './src/screens/BluetoothScreen';
import MovementTrendsScreen from './src/screens/MovementTrendsScreen';

const Tab = createBottomTabNavigator();

// Swift.org inspired color palette
const COLORS = {
  primary: '#F05138',        // Swift orange
  secondary: '#FF6B35',      // Vibrant coral
  accent: '#4A90E2',         // Soft blue
  background: '#FAFAFA',     // Off-white
  surface: '#FFFFFF',        // Pure white
  text: '#1D1D1F',          // Dark gray (Apple style)
  textSecondary: '#86868B', // Medium gray
  border: '#E5E5EA',        // Light border
  tabBarBg: '#F8F8F8',      // Tab bar background
  success: '#30D158',       // iOS green
  gradient1: '#FF6B35',     // Gradient start
  gradient2: '#F05138',     // Gradient end
};

export default function App() {
  return (
    <WorkoutProvider>
      <BluetoothProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                  iconName = focused ? 'home' : 'home-outline';
                } else if (route.name === 'Workout') {
                  iconName = focused ? 'fitness' : 'fitness-outline';
                } else if (route.name === 'Trends') {
                  iconName = focused ? 'analytics' : 'analytics-outline';
                } else if (route.name === 'Bluetooth') {
                  iconName = focused ? 'bluetooth' : 'bluetooth-outline';
                } else if (route.name === 'Stats') {
                  iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                }

                return (
                  <View style={styles.iconContainer}>
                    <Ionicons name={iconName} size={24} color={color} />
                  </View>
                );
              },
              tabBarActiveTintColor: COLORS.primary,
              tabBarInactiveTintColor: COLORS.textSecondary,
              tabBarStyle: {
                backgroundColor: COLORS.tabBarBg,
                borderTopWidth: 0,
                elevation: 0,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: -1 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                height: Platform.OS === 'ios' ? 85 : 65,
                paddingBottom: Platform.OS === 'ios' ? 25 : 10,
                paddingTop: 8,
                paddingHorizontal: 20,
              },
              tabBarItemStyle: {
                marginHorizontal: 4,
              },
              tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: '600',
                marginTop: -2,
              },
              headerStyle: {
                backgroundColor: COLORS.surface,
                elevation: 0,
                shadowOpacity: 0,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.border,
              },
              headerTintColor: COLORS.text,
              headerTitleStyle: {
                fontWeight: '700',
                fontSize: 17,
              },
              // Smooth animations
              animation: 'shift',
              transitionSpec: {
                open: {
                  animation: 'timing',
                  config: {
                    duration: 300,
                  },
                },
                close: {
                  animation: 'timing',
                  config: {
                    duration: 250,
                  },
                },
              },
              cardStyleInterpolator: ({ current, layouts }) => {
                return {
                  cardStyle: {
                    opacity: current.progress,
                  },
                };
              },
            })}
          >
            <Tab.Screen 
              name="Home" 
              component={HomeScreen}
              options={{ 
                title: 'Home',
                tabBarLabel: 'Home',
              }}
            />
            <Tab.Screen 
              name="Workout" 
              component={WorkoutScreen}
              options={{ 
                title: 'Workouts',
                tabBarLabel: 'Workouts',
              }}
            />
            <Tab.Screen 
              name="Stats" 
              component={StatsScreen}
              options={{ 
                title: 'Statistics',
                tabBarLabel: 'Stats',
              }}
            />
            <Tab.Screen 
              name="Trends" 
              component={MovementTrendsScreen}
              options={{ 
                title: 'Trends',
                tabBarLabel: 'Trends',
              }}
            />
            <Tab.Screen 
              name="Bluetooth" 
              component={BluetoothScreen}
              options={{ 
                title: 'Connect',
                tabBarLabel: 'Connect',
              }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </BluetoothProvider>
    </WorkoutProvider>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
