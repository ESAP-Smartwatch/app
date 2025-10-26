# Design Standards

## Screen Padding Guidelines

### Tab Screens (with React Navigation Headers)
Screens that use the built-in React Navigation tab/stack headers should **NOT** have additional top padding on the container. The navigation system automatically handles safe area insets.

**Screens:**
- `HomeScreen.js`
- `WorkoutScreen.js`
- `StatsScreen.js`
- `MovementTrendsScreen.js`
- `BluetoothScreen.js`

**Implementation:**
```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    // NO paddingTop - handled by React Navigation
  },
});
```

---

### Modal Screens (with React Navigation Modal Presentation)
Modal screens presented by React Navigation should **NOT** have additional top padding as the modal presentation handles safe areas automatically.

**Screens:**
- `AccountScreen.js`
- `SettingsScreen.js`

**Implementation:**
```javascript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    // NO paddingTop - handled by modal presentation
  },
});
```

---

### Detail Screens (with Custom Headers)
Screens with custom header bars using SafeAreaView should have **20px top padding** to position the header properly below the status bar/dynamic island.

**Screens:**
- `UnitsScreen.js`
- `HeartRateZonesScreen.js`
- `GoalSettingsScreen.js`
- `HelpSupportScreen.js`

**Implementation:**
```javascript
import { SafeAreaView } from 'react-native-safe-area-context';

// Component
return (
  <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="#007AFF" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Screen Title</Text>
      <View style={{ width: 28 }} />
    </View>
    {/* Content */}
  </SafeAreaView>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 20, // Standard padding for custom header screens
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
});
```

**Key Points:**
- Use `SafeAreaView` with edges `['left', 'right', 'bottom']` to exclude top safe area
- Add `paddingTop: 20` to the container style
- This creates consistent spacing while ensuring back buttons and headers are accessible

---

### Modal Overlays (Full-Screen Modals with Custom Headers)
For modal overlays displayed on top of content (e.g., graph detail views in StatsScreen), use **60px top padding** to ensure the header clears the dynamic island area.

**Implementation:**
```javascript
<SafeAreaView 
  style={styles.modalSafeArea} 
  edges={['left', 'right', 'bottom']}
>
  <View style={styles.modalHeader}>
    <TouchableOpacity 
      onPress={() => setSelectedGraph(null)} 
      style={styles.closeButton}
    >
      <Ionicons name="close-circle" size={32} color="#007AFF" />
    </TouchableOpacity>
  </View>
  {/* Modal content */}
</SafeAreaView>

const styles = StyleSheet.create({
  modalSafeArea: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingTop: 60, // Extra padding to clear dynamic island
  },
});
```

---

## Navigation Animations

### Stack Navigation
Detail screens use slide-from-right animations for iOS-style navigation:

```javascript
<Stack.Screen 
  name="ScreenName" 
  component={ScreenComponent}
  options={{ 
    title: 'Screen Title',
    headerShown: false,
    animation: 'slide_from_right',
  }}
/>
```

**Navigation Flow:**
- Forward: Slides in from right
- Back: Slides out to left (via back button or swipe gesture)

---

## Color Palette

```javascript
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
};
```

---

## Chart Configuration

### X-Axis Labels
- **Hourly data (24-hour day view)**: Show labels every 4 hours (12AM, 4AM, 8AM, 12PM, 4PM, 8PM)
- **Daily data (7-day week view)**: Show all dates
- **Chart width**: 60px per hour (day view), 80px per day (week view)

### Scrolling Behavior
- Charts scroll to far right (most recent data) on mount
- Use ScrollView with `ref` and `scrollToEnd({ animated: false })`

---

## Date: October 26, 2025
Last Updated: After standardization of padding across all screens
