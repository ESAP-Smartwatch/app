# Fitness Tracker - Setup Guide

## Table of Contents
1. [Quick Start](#quick-start)
2. [Installation](#installation)
3. [Running the App](#running-the-app)
4. [Arduino Hardware Setup](#arduino-hardware-setup)
5. [ESP32C3 WiFi Setup](#esp32c3-wifi-setup)
6. [Troubleshooting](#troubleshooting)

---

## Quick Start

### Prerequisites
- Node.js 16+ installed
- Xcode (for iOS) or Android Studio (for Android)
- Physical device for Bluetooth features
- Arduino Nicla Sense ME (optional, for Bluetooth sensors)
- ESP32C3 (optional, for WiFi health monitoring)

### Installation

```bash
# Clone repository
cd fitness-tracker-app

# Install dependencies
npm install

# iOS: Install CocoaPods dependencies
cd ios && pod install && cd ..
```

### Running the App

#### iOS
```bash
npx expo run:ios
```

#### Android
```bash
npx expo run:android
```

**⚠️ Important:** Development build is required for Bluetooth functionality. Expo Go will not work for BLE features.

---

## Key Features Overview

### 1. Workout Entry
- Open the "Workout" tab
- Tap "+ Add Workout"
- Enter workout details (duration, type)
- Calories are auto-calculated based on your user profile
- Input preview shows values above keyboard
- Tap "Hide Keyboard" or outside to dismiss

### 2. Bluetooth Connection (Arduino Nicla)
- Open the "Bluetooth" tab
- Enable Bluetooth on your device
- Tap "Start Scanning"
- Select your Arduino Nicla Sense ME from the list
- Auto-reconnect if connection drops (up to 3 attempts)
- View real-time: Heart Rate (BPM) and Accelerometer (X/Y/Z)

### 3. WiFi Health Monitoring (ESP32C3)
- Navigate to Settings → WiFi Health Monitor
- Device creates WiFi hotspot "ESP32-Health-Monitor"
- Connect to hotspot
- Tap "Connect" in app
- Receives: Heart rate, SpO2, accelerometer, step count
- Auto-logs calories every 60 seconds based on heart rate

### 4. Statistics Dashboard
- Open the "Stats" tab
- View today's summary: steps, heart rate, calories
- Interactive charts: tap to expand
- Add manual data entries
- Manage and delete workouts

### 5. User Profile & Calorie Tracking
- Navigate to Settings → User Profile
- Set gender, age, weight, resting heart rate
- Calculate or manually enter VO2 Max
- System uses your profile for accurate calorie calculations:
  - Male with VO2 Max formula
  - Male without VO2 Max formula
  - Female with VO2 Max formula
  - Female without VO2 Max formula

---

## Arduino Hardware Setup

### Arduino Nicla Sense ME Integration

#### Required Libraries
- ArduinoBLE
- Arduino_BMI270_BMM150 (accelerometer)

#### BLE UUIDs Configuration

The app uses BLE to communicate with Arduino. Update UUIDs in `src/context/BluetoothContext.js`:

```javascript
// Update these to match your Arduino firmware
const NICLA_SENSE_SERVICE_UUID = '19b10000-e8f2-537e-4f6c-d104768a1214';
const ACCELEROMETER_CHAR_UUID = '19b10001-e8f2-537e-4f6c-d104768a1214';
```

#### Finding Your Arduino's UUIDs
1. Use BLE scanner in the app to connect
2. Check console logs for discovered services and characteristics
3. Update UUIDs in BluetoothContext.js

#### Sample Arduino Sketch

```cpp
#include <ArduinoBLE.h>
#include <Arduino_BMI270_BMM150.h>

// Define service and characteristic UUIDs
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
  
  // Set device name
  BLE.setLocalName("NiclaSense");
  BLE.setAdvertisedService(fitnessService);
  
  // Add characteristics
  fitnessService.addCharacteristic(accelCharacteristic);
  BLE.addService(fitnessService);
  
  // Start advertising
  BLE.advertise();
  Serial.println("Bluetooth device active, waiting for connections...");
}

void loop() {
  BLEDevice central = BLE.central();
  
  if (central) {
    Serial.println("Connected to central");
    
    while (central.connected()) {
      float x, y, z;
      
      if (IMU.accelerationAvailable()) {
        IMU.readAcceleration(x, y, z);
        
        // Pack data into 6 bytes (2 bytes per axis)
        byte data[6];
        int16_t xVal = (int16_t)(x * 1000);
        int16_t yVal = (int16_t)(y * 1000);
        int16_t zVal = (int16_t)(z * 1000);
        
        data[0] = xVal & 0xFF;
        data[1] = (xVal >> 8) & 0xFF;
        data[2] = yVal & 0xFF;
        data[3] = (yVal >> 8) & 0xFF;
        data[4] = zVal & 0xFF;
        data[5] = (zVal >> 8) & 0xFF;
        
        accelCharacteristic.writeValue(data, 6);
        delay(100);
      }
    }
    
    Serial.println("Disconnected from central");
  }
}
```

#### Uploading to Arduino
1. Connect Arduino Nicla Sense ME via USB
2. Open Arduino IDE
3. Select board: Tools → Board → Arduino Mbed OS Nicla Boards → Nicla Sense ME
4. Select port: Tools → Port → (your device)
5. Upload sketch
6. Open Serial Monitor to verify operation

#### Testing Connection
1. Power on Arduino
2. Open Bluetooth tab in app
3. Tap "Scan"
4. Look for "NiclaSense" in device list
5. Tap to connect
6. View real-time accelerometer data

---

## ESP32C3 WiFi Setup

### Hardware Requirements
- ESP32C3 development board
- MAX30102 sensor (heart rate + SpO2)
- LIS3DH accelerometer
- USB cable for programming

### ESP32C3 Firmware

The ESP32C3 creates a WiFi access point and serves sensor data over HTTP.

#### Required Libraries
- WiFi.h (built-in)
- WebServer.h (built-in)
- Wire.h (built-in)
- MAX30105.h (for MAX30102 sensor)
- Adafruit_LIS3DH.h (for accelerometer)

#### Sample ESP32 Sketch

```cpp
#include <WiFi.h>
#include <WebServer.h>
#include <Wire.h>
#include "MAX30105.h"
#include <Adafruit_LIS3DH.h>

// WiFi credentials
const char* ssid = "ESP32-Health-Monitor";
const char* password = "12345678";

// Sensors
MAX30105 particleSensor;
Adafruit_LIS3DH lis = Adafruit_LIS3DH();

WebServer server(80);

// Sensor data
int heartRate = 0;
int spo2 = 0;
int steps = 0;
float accelX = 0, accelY = 0, accelZ = 0;

void setup() {
  Serial.begin(115200);
  
  // Initialize I2C
  Wire.begin();
  
  // Initialize MAX30102
  if (!particleSensor.begin(Wire, I2C_SPEED_FAST)) {
    Serial.println("MAX30102 not found!");
  }
  particleSensor.setup();
  particleSensor.setPulseAmplitudeRed(0x0A);
  
  // Initialize LIS3DH
  if (!lis.begin(0x18)) {
    Serial.println("LIS3DH not found!");
  }
  lis.setRange(LIS3DH_RANGE_4_G);
  
  // Setup WiFi AP
  WiFi.softAP(ssid, password);
  Serial.print("Access Point IP: ");
  Serial.println(WiFi.softAPIP());
  
  // Setup HTTP endpoints
  server.on("/readings", handleReadings);
  server.begin();
  Serial.println("HTTP server started");
}

void loop() {
  server.handleClient();
  
  // Read sensors
  updateSensors();
  delay(100);
}

void updateSensors() {
  // Read heart rate and SpO2
  long irValue = particleSensor.getIR();
  if (irValue > 50000) {
    heartRate = random(60, 100); // Replace with actual calculation
    spo2 = random(95, 100);
  }
  
  // Read accelerometer
  lis.read();
  accelX = lis.x;
  accelY = lis.y;
  accelZ = lis.z;
  
  // Simple step counting (threshold detection)
  float magnitude = sqrt(accelX*accelX + accelY*accelY + accelZ*accelZ);
  if (magnitude > 1.5) {
    steps++;
  }
}

void handleReadings() {
  String json = "{";
  json += "\"hr\":" + String(heartRate) + ",";
  json += "\"spo2\":" + String(spo2) + ",";
  json += "\"steps\":" + String(steps) + ",";
  json += "\"lis3dh\":\"X:" + String((int)accelX) + " Y:" + String((int)accelY) + " Z:" + String((int)accelZ) + "\"";
  json += "}";
  
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.send(200, "application/json", json);
}
```

#### Wiring Diagram

**MAX30102 to ESP32C3:**
- VIN → 3.3V
- GND → GND
- SDA → GPIO8 (SDA)
- SCL → GPIO9 (SCL)

**LIS3DH to ESP32C3:**
- VIN → 3.3V
- GND → GND
- SDA → GPIO8 (SDA)
- SCL → GPIO9 (SCL)

#### Upload and Test
1. Connect ESP32C3 via USB
2. Select board in Arduino IDE: ESP32C3 Dev Module
3. Upload sketch
4. Open Serial Monitor to see IP address (usually 192.168.4.1)
5. Connect phone to "ESP32-Health-Monitor" WiFi
6. Test endpoint: http://192.168.4.1/readings
7. Open app and connect via WiFi Health Monitor

---

## Troubleshooting

### Bluetooth Issues

**Problem:** Can't find Arduino device
- Ensure Arduino is powered on and sketch is running
- Check Serial Monitor for "Bluetooth device active" message
- Try moving closer to device
- Restart Bluetooth on phone
- Re-upload Arduino sketch

**Problem:** Connection drops frequently
- App has auto-reconnect (up to 3 attempts)
- Check battery level on Arduino
- Reduce distance between phone and Arduino
- Verify UUIDs match between app and Arduino

**Problem:** No accelerometer data showing
- Check that Arduino IMU initialized (Serial Monitor)
- Verify characteristic UUID matches in both app and Arduino
- Test with simulated data first (app provides fallback)

### WiFi Issues

**Problem:** Can't connect to ESP32
- Verify ESP32 is powered and WiFi AP is active
- Check Serial Monitor for "Access Point IP" message
- Ensure phone is connected to "ESP32-Health-Monitor" WiFi
- Default IP should be 192.168.4.1
- Try forgetting and reconnecting to WiFi network

**Problem:** No sensor data
- Verify sensor wiring (I2C connections)
- Check Serial Monitor for sensor initialization errors
- Test HTTP endpoint directly in browser: http://192.168.4.1/readings
- Ensure sensors are powered (3.3V)

**Problem:** Calorie logging not working
- Go to Settings → User Profile
- Enter age, weight, gender, resting heart rate
- Calories require valid user profile to calculate
- Check that heart rate data is being received (> 0)

### App Issues

**Problem:** Keyboard covers input fields
- This is fixed - form should auto-adjust
- Tap "Hide Keyboard" button if needed
- Try tapping outside input field

**Problem:** Stats not updating
- Pull down to refresh
- Check that workouts are being saved
- Verify AsyncStorage permissions
- Try restarting app

**Problem:** VO2 Max calculation fails
- Enter valid age (1-120 years)
- Enter valid resting heart rate (30-200 bpm)
- For better accuracy, connect to WiFi/Bluetooth for real heart rate data
- Manual entry is also supported

### Build Issues

**Problem:** iOS build fails
```bash
cd ios
pod install
cd ..
npx expo run:ios
```

**Problem:** Android build fails
```bash
cd android
./gradlew clean
cd ..
npx expo run:android
```

**Problem:** Native module errors
```bash
npm install
npx expo prebuild --clean
npx expo run:ios
```

---

## Additional Resources

- Arduino Nicla Sense ME Documentation: https://docs.arduino.cc/hardware/nicla-sense-me
- ESP32C3 Documentation: https://docs.espressif.com/projects/esp-idf/en/latest/esp32c3/
- React Native BLE PLX: https://github.com/dotintent/react-native-ble-plx
- MAX30102 Sensor: https://www.maximintegrated.com/en/products/interface/sensor-interface/MAX30102.html

For development standards and code architecture, see **DEVELOPER_GUIDE.md**.

For App Store submission, see **APP_STORE_GUIDE.md**.
