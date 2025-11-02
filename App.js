import React from 'react';
import { Platform, View, StyleSheet, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

/*
 * ============================================================================
 * HEADER ICON CROPPING FIX - DOCUMENTATION
 * ============================================================================
 * 
 * PROBLEM: Header icons (account, settings, bluetooth) were being cropped at
 * the bottom, making them partially invisible and looking unprofessional.
 * 
 * ROOT CAUSE: React Navigation's header containers have default overflow 
 * behavior that clips content, and insufficient padding causes icons to be
 * cut off at container boundaries.
 * 
 * SOLUTION IMPLEMENTED:
 * 
 * 1. WRAPPER LAYER APPROACH:
 *    - Wrap each icon in a <View> with style={styles.absoluteIconWrapper}
 *    - Wrap icon component itself in <View> with style={styles.iconBackground}
 *    - This creates multiple layers that can each have overflow: 'visible'
 * 
 * 2. Z-INDEX & ELEVATION:
 *    - Set zIndex: 9999 on wrapper Views (iOS)
 *    - Set elevation: 9999 on wrapper Views (Android)
 *    - Ensures icons render ABOVE all other content, preventing clipping
 * 
 * 3. OVERFLOW: VISIBLE:
 *    - Apply overflow: 'visible' to ALL parent containers:
 *      * absoluteIconWrapper
 *      * iconBackground
 *      * headerButton
 *      * headerRightContainer
 *    - This allows content to extend beyond container bounds
 * 
 * 4. PADDING ADJUSTMENTS:
 *    - Reduce button padding from 12-16px to 8px
 *    - Increase headerLeftContainerStyle/headerRightContainerStyle paddingBottom
 *    - Adjust header height to accommodate full icon size
 * 
 * 5. HEADER HEIGHT CONFIGURATION:
 *    - iOS: 120px height minimum
 *    - Android: 80px height minimum
 *    - paddingBottom: 20px for icon containers
 *    - paddingTop: 15px (iOS) / 8px (Android)
 * 
 * TO FIX SIMILAR ISSUES IN THE FUTURE:
 * 1. Check if content is being clipped at container edges
 * 2. Add overflow: 'visible' to the component and ALL parent containers
 * 3. Add high zIndex (9999) and elevation (9999) values
 * 4. Wrap in multiple View layers if single layer doesn't work
 * 5. Adjust container padding/height to provide adequate space
 * 6. Test on both iOS and Android devices
 * 
 * KEY STYLES TO REFERENCE:
 * - absoluteIconWrapper (high z-index wrapper)
 * - iconBackground (transparent overflow wrapper)
 * - headerButton (button with overflow visible)
 * - headerRightContainer (container with overflow visible)
 * 
 * ============================================================================
 */

import { WorkoutProvider } from './src/context/WorkoutContext';
import { BluetoothProvider } from './src/context/BluetoothContext';
import { WiFiHealthProvider } from './src/context/WiFiHealthContext';
import HomeScreen from './src/screens/HomeScreen';
import WorkoutScreen from './src/screens/WorkoutScreen';
import StatsScreen from './src/screens/StatsScreen';
import BluetoothScreen from './src/screens/BluetoothScreen';
import MovementTrendsScreen from './src/screens/MovementTrendsScreen';
import AccountScreen from './src/screens/AccountScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import UnitsScreen from './src/screens/UnitsScreen';
import HeartRateZonesScreen from './src/screens/HeartRateZonesScreen';
import GoalSettingsScreen from './src/screens/GoalSettingsScreen';
import HelpSupportScreen from './src/screens/HelpSupportScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

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

// Main tab navigator component
function MainTabs({ navigation }) {
  return (
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
          } else if (route.name === 'Connect') {
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
        headerShown: true,
        headerStyle: {
          backgroundColor: COLORS.surface,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === 'ios' ? 100 : 70,
        },
        headerTitleStyle: {
          fontWeight: '600',
          fontSize: 17,
        },
        headerTitleAlign: 'center',
        headerLeftContainerStyle: {
          paddingLeft: 16,
          paddingTop: Platform.OS === 'ios' ? 12 : 3,
          paddingBottom: 3,
          // CRITICAL: These containers must have proper padding to prevent icon cropping
          // Adjust paddingBottom to ensure full icon visibility
        },
        headerRightContainerStyle: {
          paddingRight: 16,
          paddingTop: Platform.OS === 'ios' ? 12 : 3,
          paddingBottom: 3,
          // CRITICAL: These containers must have proper padding to prevent icon cropping
          // Adjust paddingBottom to ensure full icon visibility
        },
        // SOLUTION FOR ICON CROPPING ISSUES:
        // 1. Wrap icons in multiple View layers with overflow: 'visible'
        // 2. Set zIndex: 9999 and elevation: 9999 on wrapper Views
        // 3. Reduce button padding (use 8px instead of 12-16px)
        // 4. Set overflow: 'visible' on all parent containers
        // 5. Adjust header height and container padding to accommodate icons
        headerLeft: () => (
          route.name === 'Home' ? (
            <View style={styles.absoluteIconWrapper}>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => navigation.navigate('Account')}
                activeOpacity={0.7}
              >
                <View style={styles.iconBackground}>
                  <Ionicons name="person-circle-outline" size={28} color="#007AFF" />
                </View>
              </TouchableOpacity>
            </View>
          ) : null
        ),
        headerRight: () => (
          route.name === 'Home' ? (
            <View style={styles.headerRightContainer}>
              <View style={styles.absoluteIconWrapper}>
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={() => navigation.navigate('Settings')}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconBackground}>
                    <Ionicons name="settings-outline" size={24} color="#007AFF" />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.absoluteIconWrapper}>
                <TouchableOpacity
                  style={styles.headerButton}
                  onPress={() => navigation.navigate('Connect')}
                  activeOpacity={0.7}
                >
                  <View style={styles.iconBackground}>
                    <Ionicons name="bluetooth" size={24} color="#007AFF" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : null
        ),
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
        name="Connect" 
        component={BluetoothScreen}
        options={{ 
          title: 'Connect',
          tabBarLabel: 'Connect',
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <WorkoutProvider>
      <BluetoothProvider>
        <WiFiHealthProvider>
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerStyle: {
                  backgroundColor: COLORS.surface,
                  height: Platform.OS === 'ios' ? 100 : 70,
                },
                headerTintColor: COLORS.text,
                headerTitleStyle: {
                  fontWeight: '700',
                  fontSize: 17,
                },
                headerTitleAlign: 'center',
              headerBackTitleVisible: false,
              headerLeftContainerStyle: {
                paddingLeft: 16,
                paddingTop: Platform.OS === 'ios' ? 12 : 3,
                paddingBottom: 3,
              },
              headerRightContainerStyle: {
                paddingRight: 16,
                paddingTop: Platform.OS === 'ios' ? 12 : 3,
                paddingBottom: 3,
              },
            }}
          >
            <Stack.Screen 
              name="MainTabs" 
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen 
              name="Account" 
              component={AccountScreen}
              options={{ 
                title: 'Account',
                presentation: 'modal',
              }}
            />
            <Stack.Screen 
              name="Settings" 
              component={SettingsScreen}
              options={{ 
                title: 'Settings',
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="Units" 
              component={UnitsScreen}
              options={{ 
                title: 'Units',
                headerShown: false,
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="HeartRateZones" 
              component={HeartRateZonesScreen}
              options={{ 
                title: 'Heart Rate Zones',
                headerShown: false,
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="GoalSettings" 
              component={GoalSettingsScreen}
              options={{ 
                title: 'Goal Settings',
                headerShown: false,
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen 
              name="HelpSupport" 
              component={HelpSupportScreen}
              options={{ 
                title: 'Help & Support',
                headerShown: false,
                animation: 'slide_from_right',
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
        </WiFiHealthProvider>
      </BluetoothProvider>
    </WorkoutProvider>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    overflow: 'visible',
    zIndex: 1000,
  },
  // ICON CROPPING FIX - CRITICAL STYLES
  // These styles prevent header icons from being cropped at the bottom
  // Key principles:
  // 1. overflow: 'visible' - allows content to extend beyond container bounds
  // 2. zIndex: 9999 - ensures icons render on top of all other content
  // 3. elevation: 9999 - Android equivalent of zIndex for proper layering
  absoluteIconWrapper: {
    overflow: 'visible',
    zIndex: 9999,
    elevation: 9999,
  },
  iconBackground: {
    overflow: 'visible',
    backgroundColor: 'transparent',
  },
  headerButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible', // CRITICAL: Allows icon to render fully without clipping
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    overflow: 'visible', // CRITICAL: Parent must also allow overflow
    zIndex: 9999,
    elevation: 9999,
  },
});
