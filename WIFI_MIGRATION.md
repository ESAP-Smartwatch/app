# WiFi Migration Summary

## Overview
The BluetoothScreen has been converted to use WiFi connectivity to communicate with the Xiao ESP32C3 instead of Bluetooth connectivity with the Arduino Nicla Sense ME.

## Changes Made

### BluetoothScreen.js
The entire screen has been refactored to:

1. **Remove Bluetooth Dependencies**
   - Removed `useBluetooth` context hook
   - Removed BLE-specific functionality
   - Eliminated device scanning and pairing logic

2. **Add WiFi Communication**
   - Uses HTTP fetch API to communicate with ESP32C3
   - Connects to device at `192.168.4.1` (default AP mode IP)
   - Polls `/readings` endpoint every 1 second for health data

3. **New State Management**
   - `isConnected`: Connection status
   - `isConnecting`: Loading state during connection attempt
   - `heartRate`: Current heart rate (BPM)
   - `spo2`: Current blood oxygen level (%)
   - `connectionError`: Error message display
   - `lastUpdate`: Timestamp of last successful data fetch

4. **Core Functions**
   - `fetchHealthData()`: Fetches JSON data from ESP32C3 with 5-second timeout
   - `handleConnect()`: Initiates connection and starts polling interval
   - `handleDisconnect()`: Stops polling and resets state

5. **UI Updates**
   - Changed title from "Bluetooth Pairing" to "WiFi Connection"
   - Updated subtitle to reference Xiao ESP32C3
   - Simplified connection flow (no device list or scanning)
   - Added SpO2 (blood oxygen) display
   - Updated info card with WiFi setup instructions
   - Added technical information card with network details

## ESP32C3 Configuration

The screen expects the ESP32C3 to:
- Run as WiFi Access Point with SSID: "HealthNode"
- Password: "12345678"
- Respond to HTTP GET requests at `http://192.168.4.1/readings`
- Return JSON format: `{"hr": <number>, "spo2": <number>}`

## Usage Instructions

1. Power on the Xiao ESP32C3 device
2. On your phone, go to WiFi settings
3. Connect to network "HealthNode" with password "12345678"
4. Open the app and navigate to the connection screen
5. Tap "Connect to Device"
6. Health data will update every second

## Design Standards Maintained

- Consistent padding and margins (16px, 20px)
- Card-based UI with shadows and rounded corners (12px radius)
- Color scheme preserved:
  - Primary blue: #007AFF
  - Success green: #34C759
  - Error red: #FF3B30
  - Background: #F5F5F7
- Typography hierarchy maintained
- Icon usage consistent with existing patterns
- No emojis used in UI text

## Error Handling

- 5-second timeout on HTTP requests
- Connection failure alerts with troubleshooting steps
- Visual error indicators
- Graceful degradation when connection is lost

## Future Enhancements

Consider adding:
- Connection status indicator with signal strength
- Historical data charting
- Automatic reconnection attempts
- Multiple device support
- Custom IP configuration
