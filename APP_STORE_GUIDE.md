# Fitness Tracker - App Store Submission Guide

## Table of Contents
1. [App Store Requirements](#app-store-requirements)
2. [Privacy & Permissions](#privacy--permissions)
3. [Build Configuration](#build-configuration)
4. [Pre-Submission Checklist](#pre-submission-checklist)
5. [Building for Production](#building-for-production)
6. [App Store Connect Setup](#app-store-connect-setup)
7. [Screenshots & Marketing](#screenshots--marketing)
8. [Submission Process](#submission-process)
9. [Common Rejection Reasons](#common-rejection-reasons)

---

## App Store Requirements

### Completed Items ✅

#### 1. App Icons
- **Status:** ✅ Configured and validated
- **Source File:** `assets/appicon.png`
- **Resolution:** 1024×1024px (marketing icon)
- **Format:** PNG, no transparency, no rounded corners (iOS adds them)
- **Auto-generated sizes:** All device-specific sizes generated via `expo prebuild`
- **Compliance:** Meets both App Store and Play Store requirements

#### 2. Privacy Manifests
**Location:** `ios/FitnessTracker/Info.plist`

All required usage descriptions are configured:

```xml
<key>NSBluetoothAlwaysUsageDescription</key>
<string>This app uses Bluetooth to connect to your fitness devices and track your heart rate, steps, and movement data during workouts.</string>

<key>NSBluetoothPeripheralUsageDescription</key>
<string>Bluetooth is required to communicate with fitness tracking devices like the Arduino Nicla Sense ME and ESP32C3 health monitor.</string>

<key>NSLocalNetworkUsageDescription</key>
<string>This app connects to your ESP32C3 health monitor over the local network to receive real-time heart rate and SpO2 data.</string>

<key>NSLocationWhenInUseUsageDescription</key>
<string>Location access is needed to discover and connect to nearby fitness devices using Bluetooth.</string>

<key>NSHealthShareUsageDescription</key>
<string>We use your health data to calculate accurate calorie burn and provide personalized fitness insights.</string>

<key>NSHealthUpdateUsageDescription</key>
<string>This app writes workout data to the Health app so you can track your fitness progress.</string>

<key>NSMotionUsageDescription</key>
<string>Motion data is used to track your steps and movement patterns during workouts.</string>
```

#### 3. Background Modes
**Configured in `app.json`:**

```json
"ios": {
  "infoPlist": {
    "UIBackgroundModes": ["bluetooth-central"]
  }
}
```

This allows the app to maintain Bluetooth connections in the background.

#### 4. Error Handling
- **Error Boundary:** ✅ Implemented (`src/components/ErrorBoundary.js`)
- **Production Logging:** ✅ All console statements wrapped with `__DEV__` checks
- **Crash Prevention:** ✅ Try/catch blocks in all async operations
- **User Feedback:** ✅ Alerts for all error states

#### 5. Code Quality
- **Build Status:** ✅ 0 errors
- **Warnings:** 1 cosmetic warning (Hermes prebuilt) - safe to ignore
- **Deprecated APIs:** ✅ None - migrated to `react-native-safe-area-context`
- **Memory Leaks:** ✅ Proper cleanup in all contexts

#### 6. UI/UX Standards
- **Responsive Design:** ✅ iPhone SE to iPad
- **Safe Areas:** ✅ Proper handling of notch/Dynamic Island
- **Keyboard Handling:** ✅ Inputs visible when keyboard shown
- **Navigation:** ✅ Back buttons work consistently
- **Loading States:** ✅ Activity indicators for async operations

---

## Privacy & Permissions

### Required Permissions

The app requires the following permissions with user-facing explanations:

| Permission | Purpose | User Impact |
|------------|---------|-------------|
| **Bluetooth** | Connect to fitness devices (Arduino, ESP32) | Required for heart rate/steps tracking |
| **Local Network** | WiFi connection to ESP32C3 | Optional - only for WiFi features |
| **Location (When In Use)** | Discover nearby BLE devices | Required for Bluetooth scanning |
| **Health Data** | Read/write workout data | Optional - enhances tracking |
| **Motion** | Track steps and movement | Required for step counting |

### Privacy Policy Requirements

**You must provide a Privacy Policy URL.** Include:

1. **Data Collection:**
   - Heart rate, steps, SpO2, movement data
   - User profile (age, weight, gender, VO2 max)
   - Workout history and calorie data

2. **Data Usage:**
   - Calculate calories burned
   - Track fitness progress
   - Generate health insights
   - Display statistics and trends

3. **Data Storage:**
   - Stored locally on device using AsyncStorage
   - No data transmitted to external servers
   - User can clear data anytime

4. **Data Sharing:**
   - No third-party sharing
   - No advertising networks
   - No analytics services

5. **User Rights:**
   - Can delete all data via app settings
   - Can export data (future feature)
   - Full control over permissions

**Sample Privacy Policy Template:**
```
Privacy Policy for Fitness Tracker

Data Collection:
We collect health and fitness data including heart rate, steps, oxygen saturation (SpO2), 
and movement patterns from connected devices. We also store user profile information 
(age, weight, gender) for accurate calorie calculations.

Data Usage:
Your data is used exclusively to provide fitness tracking features, calculate calorie burn, 
and generate personalized health insights. All data is stored locally on your device.

Data Storage:
All data is stored locally using device storage (AsyncStorage). No data is transmitted to 
external servers or cloud storage.

Data Sharing:
We do not share, sell, or transmit your data to any third parties. There are no advertising 
networks or analytics services in this app.

User Control:
You can delete all your data at any time through the app settings. You have full control 
over all device permissions.

Contact: support@yourdomain.com
```

---

## Build Configuration

### app.json Configuration

**Current Status:** ✅ Configured

```json
{
  "expo": {
    "name": "Fitness Tracker",
    "slug": "fitness-tracker",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/appicon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "bundleIdentifier": "com.fitnesstracker.app",
      "buildNumber": "1",
      "supportsTablet": true,
      "requireFullScreen": false,
      "config": {
        "usesNonExemptEncryption": false
      }
    },
    "android": {
      "package": "com.fitnesstracker.app",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/appicon.png",
        "backgroundColor": "#ffffff"
      }
    }
  }
}
```

### Export Compliance

**Critical:** Set `usesNonExemptEncryption: false` if your app:
- Does not use HTTPS (we use HTTP for local WiFi only)
- Does not implement custom encryption
- Only uses iOS standard encryption

If you add HTTPS or custom encryption later, you'll need to file export compliance documentation.

---

## Pre-Submission Checklist

### Code Requirements
- [x] App builds without errors
- [x] No deprecated API warnings
- [x] Error boundaries implemented
- [x] Production logging configured
- [x] All async operations have error handling
- [x] Memory leaks fixed (proper cleanup)
- [x] Navigation works correctly
- [x] Back buttons function properly

### UI/UX Requirements
- [x] Tested on iPhone SE (smallest)
- [x] Tested on iPhone 14 Pro Max (largest)
- [x] Tested on iPad (tablet support)
- [x] Safe area handling (notch/island)
- [x] Keyboard doesn't hide inputs
- [x] All text is readable
- [x] Buttons are tappable (44×44pt min)
- [x] Consistent navigation patterns

### Privacy & Permissions
- [x] All permissions have usage descriptions
- [x] Usage descriptions are clear and specific
- [x] Background modes declared
- [x] Privacy policy prepared
- [x] Export compliance configured
- [ ] Privacy policy URL added to App Store Connect

### App Store Assets
- [x] App icon (1024×1024)
- [ ] Screenshots (see next section)
- [ ] App description written
- [ ] Keywords researched
- [ ] Support URL prepared
- [ ] Privacy policy URL prepared

---

## Building for Production

### Prerequisites

1. **Apple Developer Account**
   - Active membership ($99/year)
   - Visit: https://developer.apple.com/programs/

2. **Install EAS CLI**
   ```bash
   npm install -g eas-cli
   ```

3. **Login to Expo**
   ```bash
   eas login
   ```

### Build Steps

#### 1. Configure EAS Build

```bash
eas build:configure
```

This creates `eas.json` with build profiles.

#### 2. Build for App Store

```bash
# Production build for App Store
eas build --platform ios --profile production

# This will:
# - Upload your code to Expo servers
# - Build iOS archive (.ipa)
# - Sign with your certificates
# - Take ~10-15 minutes
```

#### 3. Download Build

Once complete, you'll get a download link:
```
✔ Build successful
🎉 Your build is ready!
Download: https://expo.dev/accounts/[your-account]/projects/[project]/builds/[build-id]
```

#### 4. Submit to App Store

**Option A: Automatic (Recommended)**
```bash
eas submit --platform ios --profile production
```

**Option B: Manual**
1. Download the `.ipa` file
2. Open Transporter app (from Mac App Store)
3. Drag and drop the `.ipa` file
4. Submit to App Store Connect

---

## App Store Connect Setup

### 1. Create App

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - **Platform:** iOS
   - **Name:** Fitness Tracker
   - **Primary Language:** English (U.S.)
   - **Bundle ID:** com.fitnesstracker.app
   - **SKU:** fitness-tracker-001 (or any unique identifier)

### 2. App Information

**Category:** Health & Fitness

**Subcategory:** Fitness

**Content Rights:**
- Does not contain third-party content

**Age Rating:**
Complete questionnaire - expected rating: 4+

### 3. Pricing and Availability

- **Price:** Free
- **Availability:** All territories (or select specific countries)

### 4. App Privacy

**Data Collection:**
- Health & Fitness: Yes (heart rate, steps, workouts)
- Location: Yes (only for Bluetooth discovery)

**Data Usage:**
- App functionality only
- Not used for tracking
- Not used for advertising

**Data Linking:**
- Not linked to user identity (anonymous)

---

## Screenshots & Marketing

### Required Screenshot Sizes

**iPhone:**
- 6.9" Display (iPhone 15 Pro Max): 1320 × 2868
- 6.7" Display (iPhone 14 Pro Max): 1290 × 2796
- 6.5" Display (iPhone 11 Pro Max): 1242 × 2688

**iPad:**
- 12.9" Display (iPad Pro): 2048 × 2732

**Minimum Required:** At least 2 screenshots for one iPhone size

### Screenshots to Capture

1. **Home Screen**
   - Shows daily summary
   - Displays current stats
   - Navigation visible

2. **Stats Screen**
   - Heart rate graph
   - Weekly trends
   - Data visualization

3. **Workout Screen**
   - Live tracking interface
   - Heart rate display
   - Duration timer

4. **Bluetooth Connection**
   - Device list
   - Connection status
   - Real-time data

5. **Settings Screen**
   - User profile
   - App preferences
   - Clear organization

### How to Capture Screenshots

**Using Simulator:**
```bash
# Start simulator
npx expo run:ios

# In Simulator: Device → Screenshot (⌘S)
# Saves to Desktop
```

**Using Physical Device:**
Press Volume Up + Side Button simultaneously

### App Description Template

```
TITLE: Fitness Tracker - Heart Rate & Calories

SUBTITLE: Track workouts with real-time health data

DESCRIPTION:
Track your fitness journey with real-time health monitoring and accurate calorie 
tracking. Connect your Arduino or ESP32 devices for live heart rate, SpO2, and 
step tracking.

FEATURES:
• Real-time heart rate monitoring via Bluetooth
• Accurate calorie calculations based on your biometric data
• Step counting and movement tracking
• Workout history and progress trends
• WiFi integration with ESP32C3 health monitors
• Beautiful data visualization with interactive charts
• Privacy-focused - all data stored locally

ACCURATE CALORIE TRACKING:
Uses scientifically-validated formulas that adjust based on your:
- Gender (male/female specific formulas)
- Age and body weight
- VO2 Max (auto-calculated or manually entered)
- Real-time heart rate during exercise

HARDWARE SUPPORT:
• Arduino Nicla Sense ME (Bluetooth)
• ESP32C3 + MAX30102 (WiFi)
• Any compatible heart rate sensor

PRIVACY:
Your health data never leaves your device. No cloud storage, no third-party 
sharing, complete control over your data.

Perfect for fitness enthusiasts, athletes, and anyone serious about tracking 
their health with precision.

KEYWORDS: fitness, health, tracker, heart rate, calories, workout, exercise, 
bluetooth, arduino, esp32, health monitor, steps, spo2, oxygen
```

---

## Submission Process

### Step-by-Step

#### 1. Build & Submit
```bash
eas build --platform ios --profile production
eas submit --platform ios --profile production
```

#### 2. Complete App Store Connect

1. **App Information**
   - Name, category, age rating
   
2. **Pricing**
   - Free or paid
   
3. **App Privacy**
   - Complete privacy questionnaire
   
4. **Version Information**
   - Screenshots
   - Description
   - Keywords
   - Support URL
   - Privacy policy URL
   
5. **Build**
   - Select uploaded build
   
6. **Age Rating**
   - Complete questionnaire

#### 3. Submit for Review

1. Click "Submit for Review"
2. Answer additional questions:
   - Advertising identifier: No
   - Export compliance: Already configured in app.json
   - Content rights: Does not contain third-party content

#### 4. Wait for Review

- **Typical time:** 24-48 hours
- **Status updates:** Via App Store Connect and email
- **Possible outcomes:** Approved, Rejected, Metadata Rejected

---

## Common Rejection Reasons

### How to Avoid Them

#### 1. Missing Privacy Policy
**Problem:** No privacy policy URL provided
**Solution:** ✅ Add URL in App Store Connect (see Privacy Policy section)

#### 2. Insufficient Usage Descriptions
**Problem:** Generic or unclear permission descriptions
**Solution:** ✅ All descriptions are specific and explain exact usage

#### 3. Crashes or Bugs
**Problem:** App crashes during review
**Solution:** ✅ Error boundaries and try/catch blocks implemented

#### 4. Misleading Functionality
**Problem:** App doesn't do what description claims
**Solution:** Ensure description matches actual features

#### 5. Requires External Hardware
**Problem:** App unusable without specific hardware
**Solution:** App works with multiple hardware options, clearly documented

#### 6. Incomplete App
**Problem:** Features don't work or are placeholders
**Solution:** ✅ All features implemented and functional

#### 7. Design Issues
**Problem:** UI elements hidden, unusable, or inconsistent
**Solution:** ✅ Responsive design tested on all devices

### If Rejected

1. **Read rejection reason carefully**
2. **Fix the specific issues mentioned**
3. **Test thoroughly**
4. **Increment build number** in `app.json`
5. **Rebuild and resubmit:**
   ```bash
   eas build --platform ios --profile production
   eas submit --platform ios --profile production
   ```

---

## Post-Approval

### After App is Live

1. **Monitor Reviews**
   - Respond to user feedback
   - Address reported issues

2. **Analytics** (Future)
   - Consider adding App Store analytics
   - Track downloads and engagement

3. **Updates**
   - Fix bugs promptly
   - Add requested features
   - Increment version in app.json

### Releasing Updates

```bash
# 1. Update version in app.json
"version": "1.1.0",
"ios": { "buildNumber": "2" }

# 2. Build and submit
eas build --platform ios --profile production
eas submit --platform ios --profile production

# 3. Update "What's New" in App Store Connect
```

---

## Support Resources

- **App Store Review Guidelines:** https://developer.apple.com/app-store/review/guidelines/
- **Human Interface Guidelines:** https://developer.apple.com/design/human-interface-guidelines/
- **App Store Connect Help:** https://developer.apple.com/help/app-store-connect/
- **Expo Submission Guide:** https://docs.expo.dev/submit/ios/

For development documentation, see **DEVELOPER_GUIDE.md**.

For setup and hardware, see **SETUP_GUIDE.md**.
