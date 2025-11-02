# Fitness Tracker - Developer Guide

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Code Standards](#code-standards)
3. [Component Library](#component-library)
4. [Context API](#context-api)
5. [Calorie Tracking System](#calorie-tracking-system)
6. [Creating New Screens](#creating-new-screens)
7. [Validation](#validation)
8. [Testing](#testing)

---

## Architecture Overview

### Technology Stack
- **Framework:** React Native with Expo
- **Navigation:** React Navigation (Stack + Bottom Tabs)
- **State Management:** React Context API
- **Storage:** AsyncStorage
- **Bluetooth:** react-native-ble-plx
- **HTTP:** Fetch API (for WiFi integration)
- **Charts:** react-native-svg + custom components

### Project Structure
```
fitness-tracker-app/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Button.js
│   │   ├── StatCard.js
│   │   ├── ScreenContainer.js
│   │   ├── ScreenHeader.js
│   │   └── ErrorBoundary.js
│   ├── context/         # Global state management
│   │   ├── WorkoutContext.js
│   │   ├── BluetoothContext.js
│   │   ├── WiFiHealthContext.js
│   │   ├── UserProfileContext.js
│   │   └── CalorieHistoryContext.js
│   ├── screens/         # App screens
│   │   ├── HomeScreen.js
│   │   ├── WorkoutScreen.js
│   │   ├── StatsScreen.js
│   │   ├── BluetoothScreen.js
│   │   ├── SettingsScreen.js
│   │   └── UserProfileScreen.js
│   ├── theme/           # Design tokens
│   │   └── colors.js
│   └── utils/           # Utility functions
│       ├── responsive.js
│       ├── navigationConfig.js
│       └── logger.js
├── ios/                 # iOS native code
├── android/             # Android native code
└── scripts/             # Build and validation scripts
```

### Context Providers Hierarchy

**Critical:** Contexts must be nested in the correct order due to dependencies.

```jsx
<ErrorBoundary>
  <WorkoutProvider>
    <BluetoothProvider>
      <UserProfileProvider>
        <CalorieHistoryProvider>
          <WiFiHealthProvider>
            <NavigationContainer>
              {/* App screens */}
            </NavigationContainer>
          </WiFiHealthProvider>
        </CalorieHistoryProvider>
      </UserProfileProvider>
    </BluetoothProvider>
  </WorkoutProvider>
</ErrorBoundary>
```

**Why this order?**
- `WorkoutProvider`: Independent, wraps everything
- `BluetoothProvider`: Independent, handles device connections
- `UserProfileProvider`: Provides user data (age, weight, gender)
- `CalorieHistoryProvider`: Stores calorie entries
- `WiFiHealthProvider`: **Depends on** UserProfile and CalorieHistory for calorie calculations
- `ErrorBoundary`: Catches all React errors

---

## Code Standards

### Universal Header & Screen Styling

#### ScreenContainer Component

Use `ScreenContainer` as the root component for ALL screens:

```jsx
import ScreenContainer from '../components/ScreenContainer';
import { CONTENT_PADDING, getResponsiveFontSize } from '../utils/responsive';

const MyScreen = () => {
  return (
    <ScreenContainer>
      {/* Your content */}
    </ScreenContainer>
  );
};
```

**Props:**
- `scrollable` (boolean, default: true) - Makes content scrollable
- `keyboardAware` (boolean, default: true) - Handles keyboard on iOS
- `backgroundColor` (string) - Background color
- `noPadding` (boolean) - Remove default top padding
- `contentContainerStyle` (object) - Additional content styles

#### ScreenHeader Component

For custom headers (when not using React Navigation):

```jsx
import ScreenHeader from '../components/ScreenHeader';

const MyScreen = ({ navigation }) => {
  return (
    <ScreenContainer noPadding>
      <ScreenHeader 
        title="My Screen"
        subtitle="Optional description"
        onBack={() => navigation.goBack()}
        rightComponent={<Button />}
      />
      {/* Content */}
    </ScreenContainer>
  );
};
```

#### Responsive Design

Always use responsive utilities instead of hardcoded values:

```jsx
import { 
  CONTENT_PADDING,
  CARD_MARGIN,
  CARD_PADDING,
  getResponsiveFontSize,
  getContainerStyle,
} from '../utils/responsive';

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: CONTENT_PADDING.horizontal,
    paddingTop: CONTENT_PADDING.top,
    ...getContainerStyle(), // Centers on tablets
  },
  title: {
    fontSize: getResponsiveFontSize(24),
    fontWeight: '700',
  },
  card: {
    padding: CARD_PADDING,
    marginHorizontal: CARD_MARGIN,
    marginBottom: CARD_MARGIN,
  },
});
```

**Device Breakpoints:**
- Small (< 375px): 85% of base values
- Medium (375-414px): 100% (standard)
- Large (≥ 414px): 100%
- Tablet (≥ 768px): 150% padding, 120% fonts, centered content

#### Navigation Configuration

Use standardized navigation options:

```jsx
import { 
  getDefaultScreenOptions,
  noHeaderOptions,
  modalOptions,
} from './src/utils/navigationConfig';

// In App.js
<Stack.Navigator screenOptions={getDefaultScreenOptions()}>
  {/* Standard screen with header */}
  <Stack.Screen 
    name="Settings" 
    component={SettingsScreen}
    options={{ title: 'Settings' }}
  />
  
  {/* Screen without header (custom header) */}
  <Stack.Screen 
    name="CustomHeader" 
    component={CustomScreen}
    options={noHeaderOptions}
  />
  
  {/* Modal presentation */}
  <Stack.Screen 
    name="Account" 
    component={AccountScreen}
    options={{ ...modalOptions, title: 'Account' }}
  />
</Stack.Navigator>
```

### Error Handling

#### Production-Safe Logging

Never use raw `console.log` in production code:

```jsx
// ❌ Bad
console.log('User data:', userData);
console.error('Error:', error);

// ✅ Good
if (__DEV__) console.log('User data:', userData);
if (__DEV__) console.error('Error:', error);

// ✅ Better (use logger utility)
import logger from '../utils/logger';
logger.log('User data:', userData);
logger.error('Error:', error);
```

#### Error Boundaries

All screens are wrapped in `ErrorBoundary` at the app level. For screen-specific error handling:

```jsx
try {
  // Risky operation
  const data = await fetchData();
  setData(data);
} catch (error) {
  if (__DEV__) console.error('Error fetching data:', error);
  Alert.alert('Error', 'Failed to load data. Please try again.');
}
```

---

## Component Library

### Button Component

```jsx
import Button from '../components/Button';

<Button 
  title="Save"
  onPress={handleSave}
  disabled={!hasChanges}
  loading={isSaving}
/>
```

### StatCard Component

```jsx
import StatCard from '../components/StatCard';

<StatCard
  icon="footsteps"
  title="Steps"
  value="8,234"
  unit="steps"
  color="#007AFF"
/>
```

### WorkoutItem Component

```jsx
import WorkoutItem from '../components/WorkoutItem';

<WorkoutItem
  type="Running"
  duration={30}
  calories={250}
  date={new Date()}
  onDelete={handleDelete}
/>
```

### ErrorBoundary Component

Automatically included at app level. Catches all React errors and shows user-friendly message.

---

## Context API

### WorkoutContext

Manages workout history and statistics.

```jsx
import { useWorkouts } from '../context/WorkoutContext';

const MyComponent = () => {
  const { workouts, addWorkout, deleteWorkout, getTotalStats } = useWorkouts();
  
  const handleAdd = () => {
    addWorkout({
      type: 'Running',
      duration: 30,
      calories: 250,
      date: new Date().toISOString(),
    });
  };
  
  const stats = getTotalStats(); // { totalWorkouts, totalMinutes, totalCalories }
};
```

### BluetoothContext

Manages BLE connections to Arduino Nicla Sense ME.

```jsx
import { useBluetooth } from '../context/BluetoothContext';

const MyComponent = () => {
  const {
    devices,
    connectedDevice,
    isScanning,
    accelerometerData,
    startScan,
    stopScan,
    connectToDevice,
    disconnectDevice,
  } = useBluetooth();
  
  // devices: [{ id, name, rssi }]
  // accelerometerData: { x, y, z, timestamp }
};
```

### WiFiHealthContext

Manages WiFi connection to ESP32C3 health monitor.

```jsx
import { useWiFiHealth } from '../context/WiFiHealthContext';

const MyComponent = () => {
  const {
    isConnected,
    heartRate,
    spo2,
    steps,
    lis3dh,
    heartRateHistory,
    sessionCalories,
    connect,
    disconnect,
  } = useWiFiHealth();
  
  // Polls ESP32C3 every 1 second when connected
  // Auto-logs calories every 60 seconds
};
```

### UserProfileContext

Manages user biometric data and calorie calculations.

```jsx
import { useUserProfile } from '../context/UserProfileContext';

const MyComponent = () => {
  const {
    userProfile,
    updateProfile,
    calculateVO2Max,
    calculateCaloriesBurned,
  } = useUserProfile();
  
  // userProfile: { gender, age, weight, restingHeartRate, vo2Max }
  
  // Calculate calories for 30 min at 140 bpm
  const calories = calculateCaloriesBurned(30, 140);
};
```

### CalorieHistoryContext

Manages calorie entry storage and retrieval.

```jsx
import { useCalorieHistory } from '../context/CalorieHistoryContext';

const MyComponent = () => {
  const {
    entries,
    addCalorieEntry,
    getTodayCalories,
    getDailyCaloriesForWeek,
    getDailyCaloriesForMonth,
    clearHistory,
  } = useCalorieHistory();
  
  // Add entry
  await addCalorieEntry({
    calories: 250,
    source: 'workout', // 'workout' | 'wifi' | 'manual'
    heartRate: 140,
    duration: 30,
  });
  
  // Get today's total
  const today = await getTodayCalories();
  
  // Get last 7 days
  const week = await getDailyCaloriesForWeek(0);
  // week: [{ date, calories }, ...]
};
```

---

## Calorie Tracking System

### Overview

The app uses gender-specific calorie formulas based on heart rate, with enhanced accuracy when VO2 Max is known.

### Formulas

#### Male with VO2 Max
```
Calories/min = (0.634 × HR + 0.404 × VO2max + 0.394 × Weight + 0.271 × Age - 95.7735) / 4.184
```

#### Male without VO2 Max
```
Calories/min = (0.6309 × HR + 0.1988 × Weight + 0.2017 × Age - 55.0969) / 4.184
```

#### Female with VO2 Max
```
Calories/min = (0.45 × HR + 0.380 × VO2max + 0.103 × Weight + 0.274 × Age - 59.3954) / 4.184
```

#### Female without VO2 Max
```
Calories/min = (0.4472 × HR - 0.1263 × Weight + 0.074 × Age - 20.4022) / 4.184
```

### VO2 Max Calculation

```jsx
// Basic formula using age-predicted max HR
VO2 Max = 15.3 × (Max HR / Resting HR)

// Enhanced: Uses actual observed max HR if available
const maxHR = Math.max(...heartRateHistory) || (220 - age);
VO2 Max = 15.3 × (maxHR / restingHR);

// Clamped to realistic range: 10-100 ml/kg/min
```

### Calorie Logging Sources

1. **Manual Workout Entry**
   - User enters duration and workout type
   - Uses current heart rate or estimated HR based on activity
   - Stored in WorkoutContext and CalorieHistory

2. **WiFi Auto-Logging**
   - Every 60 seconds during WiFi connection
   - Uses real-time heart rate from ESP32C3
   - Calculates calories for 1-minute interval
   - Automatically saved to CalorieHistory

3. **Bluetooth Workouts**
   - User starts workout session
   - Tracks duration and average heart rate
   - Calculates total calories on workout end

### Data Persistence

All calorie entries are stored in AsyncStorage:
- Key: `@calorie_history`
- Format: Array of entry objects
- Each entry: `{ id, calories, timestamp, source, heartRate, duration }`

---

## Creating New Screens

### Step 1: Create Screen File

```jsx
// src/screens/NewScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ScreenContainer from '../components/ScreenContainer';
import { CONTENT_PADDING, CARD_MARGIN, getResponsiveFontSize } from '../utils/responsive';
import COLORS from '../theme/colors';

const NewScreen = ({ navigation }) => {
  const [data, setData] = useState(null);
  
  return (
    <ScreenContainer>
      <View style={styles.section}>
        <Text style={styles.title}>New Screen</Text>
        <Text style={styles.description}>Description here</Text>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: CARD_MARGIN,
    marginBottom: CARD_MARGIN,
  },
  title: {
    fontSize: getResponsiveFontSize(20),
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  description: {
    fontSize: getResponsiveFontSize(14),
    color: COLORS.textSecondary,
  },
});

export default NewScreen;
```

### Step 2: Register in Navigation

```jsx
// App.js
import NewScreen from './src/screens/NewScreen';

// Inside Stack.Navigator
<Stack.Screen 
  name="NewScreen" 
  component={NewScreen}
  options={{ title: 'New Screen' }}
/>
```

### Step 3: Navigate to Screen

```jsx
// From any other screen
navigation.navigate('NewScreen');
```

### Checklist for New Screens

- [ ] Import and use `ScreenContainer`
- [ ] Import responsive utilities (`CONTENT_PADDING`, `getResponsiveFontSize`)
- [ ] Use `COLORS` from theme instead of hardcoded colors
- [ ] Implement proper error handling
- [ ] Test on multiple device sizes (SE, standard, Pro Max, iPad)
- [ ] Verify back button works
- [ ] Check keyboard behavior if using inputs
- [ ] Run validation: `npm run validate`

---

## Validation

### Automated Screen Validation

Run the validation script to check for common issues:

```bash
npm run validate
```

This checks for:
- Missing `ScreenContainer` usage
- Hardcoded padding/font sizes
- Missing responsive imports
- Inconsistent navigation configuration

### Manual Testing Checklist

For each new screen:

1. **Device Sizes**
   - [ ] iPhone SE (375×667)
   - [ ] iPhone 14 (390×844)
   - [ ] iPhone 14 Pro Max (430×932)
   - [ ] iPad (768×1024)

2. **UI Elements**
   - [ ] No content hidden under notch/Dynamic Island
   - [ ] Text is readable on all devices
   - [ ] Buttons are tappable (min 44×44 pts)
   - [ ] Proper spacing and margins

3. **Functionality**
   - [ ] Navigation works (back button, deep links)
   - [ ] Form inputs visible above keyboard
   - [ ] Loading states work
   - [ ] Error states show proper messages
   - [ ] Data persists correctly

4. **Performance**
   - [ ] No unnecessary re-renders
   - [ ] Smooth scrolling
   - [ ] Fast screen transitions

---

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- WorkoutContext.test.js

# Run with coverage
npm test -- --coverage
```

### Writing Tests

Example test for a context:

```javascript
import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { useWorkouts, WorkoutProvider } from '../context/WorkoutContext';

describe('WorkoutContext', () => {
  it('should add workout', () => {
    const wrapper = ({ children }) => (
      <WorkoutProvider>{children}</WorkoutProvider>
    );
    
    const { result } = renderHook(() => useWorkouts(), { wrapper });
    
    act(() => {
      result.current.addWorkout({
        type: 'Running',
        duration: 30,
        calories: 250,
        date: new Date().toISOString(),
      });
    });
    
    expect(result.current.workouts.length).toBe(1);
    expect(result.current.workouts[0].type).toBe('Running');
  });
});
```

---

## Best Practices

### Do's
✅ Use `ScreenContainer` for all screens
✅ Import responsive utilities for sizing
✅ Use `__DEV__` checks for console statements
✅ Handle errors gracefully with try/catch
✅ Use Context API for global state
✅ Keep components small and focused
✅ Document complex logic with comments
✅ Test on multiple device sizes

### Don'ts
❌ Don't use hardcoded padding/font sizes
❌ Don't use raw console.log in production
❌ Don't nest Contexts in wrong order
❌ Don't mutate state directly
❌ Don't forget error handling
❌ Don't hardcode device dimensions
❌ Don't skip validation script

---

## Common Patterns

### Loading State
```jsx
const [loading, setLoading] = useState(false);

const handleLoad = async () => {
  setLoading(true);
  try {
    const data = await fetchData();
    setData(data);
  } catch (error) {
    if (__DEV__) console.error('Load error:', error);
    Alert.alert('Error', 'Failed to load data');
  } finally {
    setLoading(false);
  }
};

return loading ? (
  <ActivityIndicator size="large" color={COLORS.primary} />
) : (
  <View>{/* Content */}</View>
);
```

### Form Input
```jsx
const [value, setValue] = useState('');

<TextInput
  style={styles.input}
  value={value}
  onChangeText={setValue}
  placeholder="Enter value"
  placeholderTextColor={COLORS.textSecondary}
  returnKeyType="done"
  onSubmitEditing={Keyboard.dismiss}
/>
```

### Pull to Refresh
```jsx
const [refreshing, setRefreshing] = useState(false);

const onRefresh = async () => {
  setRefreshing(true);
  await loadData();
  setRefreshing(false);
};

<ScrollView
  refreshControl={
    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
  }
>
  {/* Content */}
</ScrollView>
```

---

## Additional Resources

- React Native Docs: https://reactnative.dev/docs/getting-started
- React Navigation: https://reactnavigation.org/docs/getting-started
- Expo Docs: https://docs.expo.dev/
- BLE PLX: https://github.com/dotintent/react-native-ble-plx

For hardware setup, see **SETUP_GUIDE.md**.

For App Store submission, see **APP_STORE_GUIDE.md**.
