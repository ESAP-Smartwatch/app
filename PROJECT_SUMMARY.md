### Core Stack
- **React Native** 0.72.10
- **Expo** SDK 49
- **React Navigation** 6.x (Bottom Tabs)
- **react-native-ble-plx** 3.1.2 - Real BLE functionality
- **react-native-chart-kit** 6.12.0 - Data visualization
- **react-native-svg** 13.9.0 - Chart rendering

### App State Management
- **Context API** for workout data
- **BluetoothContext** for BLE connection management

### Architecture
```
app/
├── App.js                          # Main entry with providers
├── src/
│   ├── components/                 # Reusable UI components
│   │   ├── Button.js
│   │   ├── StatCard.js
│   │   └── WorkoutItem.js
│   ├── screens/                    # Main screens
│   │   ├── HomeScreen.js
│   │   ├── WorkoutScreen.js
│   │   ├── MovementTrendsScreen.js (NEW!)
│   │   ├── BluetoothScreen.js      (ENHANCED with real BLE)
│   │   └── StatsScreen.js
│   └── context/                    # State management
│       ├── WorkoutContext.js
│       └── BluetoothContext.js     (NEW!)
├── package.json
├── app.json
├── ARDUINO_SETUP.md               # Arduino integration guide
└── README.md
```
### Libraries
- Node.js (v14+)
- npm or yarn
- Xcode (for iOS)
- Android Studio (for Android)

### Installation Steps

1. **Install dependencies:**
```bash
npm install
```

2. **For Expo Go (BLE not available):**
```bash
npm start
```
Note: Bluetooth features will show a message that development build is required.

3. **For Development Build (BLE enabled):**
```bash
# iOS
npx expo run:ios

# Android  
npx expo run:android
```

### BLE Configuration

**Important:** Update UUIDs in `src/context/BluetoothContext.js` to match your Arduino firmware:

```javascript
// Line ~20-22
const NICLA_SENSE_SERVICE_UUID = '19b10000-e8f2-537e-4f6c-d104768a1214';
const ACCELEROMETER_CHAR_UUID = '19b10001-e8f2-537e-4f6c-d104768a1214';
```

### Data Format
Accelerometer data expected as:
- **6 bytes**: 3 x int16_t (X, Y, Z)
- **Scale**: Values multiplied by 1000 (e.g., 1.5g → 1500)
- **Endianness**: Little-endian

See `ARDUINO_SETUP.md` for complete Arduino firmware guide.
