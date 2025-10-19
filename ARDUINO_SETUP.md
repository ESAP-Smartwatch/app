# Arduino Nicla Sense ME Integration Guide

## Overview
This fitness tracking app now includes real Bluetooth Low Energy (BLE) support to connect with the Arduino Nicla Sense ME device for real-time accelerometer data collection.

## Important Configuration

### BLE UUIDs
The app is configured with placeholder UUIDs that need to be updated to match your Arduino firmware. Update these in `src/context/BluetoothContext.js`:

```javascript
// Current placeholder UUIDs (line ~8-10)
const NICLA_SENSE_SERVICE_UUID = '19b10000-e8f2-537e-4f6c-d104768a1214';
const ACCELEROMETER_CHAR_UUID = '19b10001-e8f2-537e-4f6c-d104768a1214';
```

### Finding Your Arduino's UUIDs
1. Use the BLE scanner in the app to connect to your Arduino
2. Check the console logs for discovered services and characteristics
3. Update the UUIDs in BluetoothContext.js accordingly

## Arduino Nicla Sense ME Setup

### Required Arduino Libraries
- ArduinoBLE
- Arduino_BMI270_BMM150 (for accelerometer)

### Sample Arduino Sketch
```cpp
#include <ArduinoBLE.h>
#include <Arduino_BMI270_BMM150.h>

// Define your service and characteristic UUIDs
BLEService fitnessService("19B10000-E8F2-537E-4F6C-D104768A1214");
BLECharacteristic accelCharacteristic("19B10001-E8F2-537E-4F6C-D104768A1214", 
                                      BLERead | BLENotify, 6);

void setup() {
  Serial.begin(9600);
  
  // Initialize IMU
  if (!IMU.begin()) {
    Serial.println("Failed to initialize IMU!");
    while (1);
  }
  
  // Initialize BLE
  if (!BLE.begin()) {
    Serial.println("Failed to initialize BLE!");
    while (1);
  }
  
  BLE.setLocalName("Nicla Sense ME");
  BLE.setAdvertisedService(fitnessService);
  fitnessService.addCharacteristic(accelCharacteristic);
  BLE.addService(fitnessService);
  
  BLE.advertise();
  Serial.println("Bluetooth device active, waiting for connections...");
}

void loop() {
  BLEDevice central = BLE.central();
  
  if (central) {
    Serial.print("Connected to central: ");
    Serial.println(central.address());
    
    while (central.connected()) {
      float x, y, z;
      
      if (IMU.accelerationAvailable()) {
        IMU.readAcceleration(x, y, z);
        
        // Convert float to int16 and pack into 6 bytes
        int16_t accelData[3];
        accelData[0] = (int16_t)(x * 1000);
        accelData[1] = (int16_t)(y * 1000);
        accelData[2] = (int16_t)(z * 1000);
        
        accelCharacteristic.writeValue((uint8_t*)accelData, 6);
      }
      
      delay(100); // Send data every 100ms
    }
    
    Serial.println("Disconnected from central");
  }
}
```

## Data Format

### Accelerometer Data
The app expects accelerometer data in the following format:
- **Size**: 6 bytes
- **Format**: 3 x int16_t (2 bytes each)
- **Order**: X-axis, Y-axis, Z-axis
- **Scale**: Values are multiplied by 1000 (e.g., 1.5g → 1500)
- **Endianness**: Little-endian

The app automatically converts these values back to g-force units for display.

## Permissions

### iOS
Permissions are automatically requested when needed. Configured in `app.json`:
- NSBluetoothAlwaysUsageDescription
- NSBluetoothPeripheralUsageDescription

### Android
Required permissions (configured in `app.json`):
- BLUETOOTH
- BLUETOOTH_ADMIN
- BLUETOOTH_CONNECT (Android 12+)
- BLUETOOTH_SCAN (Android 12+)
- ACCESS_FINE_LOCATION

## Features

### Movement Trends Screen
- View daily steps, calories, distance, and active minutes
- Interactive charts (Line and Bar charts)
- Time range selector (Week, Month, Year)
- Insights and achievement tracking
- Apple Health-inspired design

### Bluetooth Screen
- Real-time device scanning for Arduino Nicla Sense ME
- Connect/disconnect functionality
- Live accelerometer data display (X, Y, Z axes)
- Signal strength indication
- Connection status monitoring

## Troubleshooting

### Device Not Found
1. Ensure Arduino is powered on
2. Make sure BLE advertising is active
3. Check device name includes "Nicla" or "Arduino"
4. Try refreshing the scan

### Cannot Connect
1. Ensure only one app is trying to connect at a time
2. Reset Arduino and try again
3. Check Bluetooth permissions are granted
4. Verify device is within range (< 10 meters)

### No Data Received
1. Verify UUIDs match between app and Arduino
2. Check Arduino serial monitor for connection status
3. Ensure characteristic has NOTIFY property enabled
4. Verify data format matches expected structure

### Common Issues
- **"PoweredOff" state**: Enable Bluetooth in device settings
- **Permission denied**: Grant all required permissions
- **UUID mismatch**: Update UUIDs in BluetoothContext.js

## Development Notes

### Testing Without Hardware
The app includes mock data generators for testing UI without physical hardware:
- Movement Trends screen generates sample movement data
- Home screen shows calculated statistics

### Expo Development Build Required
Note: BLE functionality requires a development build, not Expo Go:
```bash
npx expo run:ios
# or
npx expo run:android
```

## Next Steps

1. **Update UUIDs**: Replace placeholder UUIDs with your actual Arduino UUIDs
2. **Flash Arduino**: Upload the BLE firmware to your Nicla Sense ME
3. **Build App**: Create a development build (not Expo Go)
4. **Test Connection**: Scan and connect to your device
5. **Verify Data**: Check accelerometer values update in real-time

## Resources

- [Arduino Nicla Sense ME Docs](https://docs.arduino.cc/hardware/nicla-sense-me)
- [ArduinoBLE Library](https://www.arduino.cc/reference/en/libraries/arduinoble/)
- [react-native-ble-plx](https://github.com/dotintent/react-native-ble-plx)
- [BLE UUID Generator](https://www.uuidgenerator.net/)

## Support

For issues related to:
- **App functionality**: Check console logs and error messages
- **Arduino programming**: Refer to Arduino documentation
- **BLE concepts**: Review BLE specification and tutorials
