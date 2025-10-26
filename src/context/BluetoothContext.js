import React, { createContext, useState, useContext, useEffect } from 'react';
import { PermissionsAndroid, Platform, Alert } from 'react-native';

// Conditionally import BLE manager
let BleManager;
let isBleAvailable = true;

try {
  const BleModule = require('react-native-ble-plx');
  BleManager = BleModule.BleManager;
} catch (e) {
  console.log('BLE not available - running in Expo Go or BLE module not installed');
  isBleAvailable = false;
}

const BluetoothContext = createContext();

// Arduino Nicla Sense ME specific UUIDs
// Note: These are placeholder UUIDs - you'll need to replace them with actual UUIDs from your Arduino firmware
const NICLA_SENSE_SERVICE_UUID = '19b10000-e8f2-537e-4f6c-d104768a1214'; // Generic UUID - replace with actual
const ACCELEROMETER_CHAR_UUID = '19b10001-e8f2-537e-4f6c-d104768a1214'; // Replace with actual characteristic UUID
const DEVICE_NAME_PREFIX = 'Nicla'; // Arduino Nicla devices typically have "Nicla" in their name

export const BluetoothProvider = ({ children }) => {
  const [manager] = useState(() => {
    if (isBleAvailable && BleManager) {
      try {
        return new BleManager();
      } catch (error) {
        console.log('Could not initialize BLE Manager:', error.message);
        return null;
      }
    }
    return null;
  });
  
  const [devices, setDevices] = useState([]);
  const [connectedDevice, setConnectedDevice] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [heartRateData, setHeartRateData] = useState(72);
  const [isBluetoothEnabled, setIsBluetoothEnabled] = useState(false);
  const [bleNotAvailable, setBleNotAvailable] = useState(!isBleAvailable || !manager);
  const [connectionRetryCount, setConnectionRetryCount] = useState(0);
  const [isSimulatingData, setIsSimulatingData] = useState(false);

  // Refs for intervals and keepalive
  const dataSimulationInterval = React.useRef(null);
  const keepaliveInterval = React.useRef(null);
  const reconnectTimeout = React.useRef(null);

  useEffect(() => {
    if (manager) {
      checkBluetoothState();
    }
    
    // Cleanup on unmount
    return () => {
      stopDataSimulation();
      stopKeepalive();
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (manager && connectedDevice) {
        manager.cancelDeviceConnection(connectedDevice.id).catch(() => {});
      }
      if (manager) {
        manager.destroy();
      }
    };
  }, []);

  const checkBluetoothState = async () => {
    if (!manager) {
      setIsBluetoothEnabled(false);
      return;
    }
    
    try {
      const state = await manager.state();
      setIsBluetoothEnabled(state === 'PoweredOn');
      
      manager.onStateChange((state) => {
        setIsBluetoothEnabled(state === 'PoweredOn');
      }, true);
    } catch (error) {
      console.log('Error checking Bluetooth state:', error);
      setIsBluetoothEnabled(false);
    }
  };

  const requestBluetoothPermissions = async () => {
    if (Platform.OS === 'android') {
      if (Platform.Version >= 31) {
        // Android 12 and above
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ]);
        
        return (
          granted['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED &&
          granted['android.permission.ACCESS_FINE_LOCATION'] === PermissionsAndroid.RESULTS.GRANTED
        );
      } else {
        // Android 11 and below
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    }
    return true; // iOS handles permissions through Info.plist
  };

  const scanForDevices = async () => {
    if (!manager) {
      Alert.alert(
        'BLE Not Available',
        'Bluetooth functionality requires a development build. You are currently running in Expo Go.\n\nTo use BLE features:\n1. Run: npx expo run:ios\n2. Or: npx expo run:android',
        [{ text: 'OK' }]
      );
      return;
    }
    
    const hasPermission = await requestBluetoothPermissions();
    
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Bluetooth permissions are required to scan for devices.'
      );
      return;
    }

    if (!isBluetoothEnabled) {
      Alert.alert(
        'Bluetooth Disabled',
        'Please enable Bluetooth to scan for devices.'
      );
      return;
    }

    setIsScanning(true);
    setDevices([]);

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Scan error:', error);
        setIsScanning(false);
        return;
      }

      if (device && device.name) {
        // Filter for Arduino Nicla Sense ME devices
        // You can adjust the filter based on your device's name or service UUIDs
        const isNiclaDevice = device.name.includes(DEVICE_NAME_PREFIX) || 
                             device.name.toLowerCase().includes('arduino') ||
                             device.name.toLowerCase().includes('nicla');
        
        if (isNiclaDevice) {
          setDevices((prevDevices) => {
            // Avoid duplicates
            const exists = prevDevices.find((d) => d.id === device.id);
            if (exists) return prevDevices;
            
            return [...prevDevices, {
              id: device.id,
              name: device.name,
              rssi: device.rssi,
            }];
          });
        }
      }
    });

    // Stop scanning after 10 seconds
    setTimeout(() => {
      stopScan();
    }, 10000);
  };

  const stopScan = () => {
    if (manager) {
      manager.stopDeviceScan();
    }
    setIsScanning(false);
  };

  const connectToDevice = async (deviceId, isRetry = false) => {
    if (!manager) {
      Alert.alert('BLE Not Available', 'Bluetooth functionality requires a development build.');
      return;
    }
    
    try {
      console.log(`${isRetry ? 'Retrying connection' : 'Connecting'} to device:`, deviceId);
      
      // Stop scanning before connecting
      if (isScanning) {
        manager.stopDeviceScan();
        setIsScanning(false);
      }
      
      const device = await manager.connectToDevice(deviceId, {
        timeout: 20000,
        requestMTU: 512,
        refreshGatt: 'OnConnected',
      });
      
      console.log('Connected to device:', device.name);
      
      // Discover all services and characteristics
      console.log('Discovering services and characteristics...');
      await device.discoverAllServicesAndCharacteristics();
      
      console.log('Discovery complete');
      
      setConnectedDevice({
        id: device.id,
        name: device.name,
      });
      
      // Reset retry count on successful connection
      setConnectionRetryCount(0);

      // Monitor device disconnection with auto-reconnect
      device.onDisconnected((error, disconnectedDevice) => {
        console.log('Device disconnected:', disconnectedDevice?.name);
        
        const wasConnected = connectedDevice !== null;
        setConnectedDevice(null);
        stopDataSimulation();
        stopKeepalive();
        
        if (error && wasConnected && connectionRetryCount < 3) {
          console.log(`Connection lost. Attempting reconnect (${connectionRetryCount + 1}/3)...`);
          setConnectionRetryCount(prev => prev + 1);
          
          // Attempt reconnection after 2 seconds
          reconnectTimeout.current = setTimeout(() => {
            connectToDevice(deviceId, true);
          }, 2000);
        } else if (connectionRetryCount >= 3) {
          Alert.alert(
            'Connection Lost', 
            'Unable to maintain connection after multiple attempts. Please try reconnecting manually.'
          );
          setConnectionRetryCount(0);
        } else if (error && !isRetry) {
          Alert.alert('Device Disconnected', 'Connection to device was lost.');
        }
      });

      // List available services and characteristics
      const services = await device.services();
      console.log('Available services:', services.map(s => s.uuid));
      
      for (const service of services) {
        const characteristics = await service.characteristics();
        console.log(`Service ${service.uuid} characteristics:`, 
                    characteristics.map(c => ({ 
                      uuid: c.uuid, 
                      properties: (c.isReadable ? 'R' : '') + (c.isWritableWithResponse ? 'W' : '') + (c.isNotifiable ? 'N' : '') 
                    })));
      }

      // Start keepalive mechanism
      startKeepalive(device);

      // Try to start monitoring real accelerometer data
      const monitoringStarted = await startMonitoringAccelerometer(device);
      
      // If monitoring fails or no data, start simulated data for debugging
      if (!monitoringStarted) {
        console.log('Starting simulated data stream for debugging...');
        startDataSimulation();
      }
      
      if (!isRetry) {
        Alert.alert('Success', `Connected to ${device.name}`);
      } else {
        console.log('Reconnected successfully');
      }
    } catch (error) {
      console.error('Connection error:', error);
      
      if (!isRetry && connectionRetryCount < 3) {
        setConnectionRetryCount(prev => prev + 1);
        Alert.alert(
          'Connection Failed', 
          `Attempting to retry connection (${connectionRetryCount + 1}/3)...`,
          [
            { text: 'Cancel', style: 'cancel', onPress: () => setConnectionRetryCount(0) },
            { text: 'Retry Now', onPress: () => connectToDevice(deviceId, true) }
          ]
        );
      } else {
        setConnectionRetryCount(0);
        Alert.alert(
          'Connection Failed', 
          `Could not connect to device: ${error.message}\n\nMake sure the Arduino is running the correct BLE code with services and characteristics.`
        );
      }
    }
  };

  const disconnectDevice = async () => {
    if (connectedDevice && manager) {
      try {
        stopDataSimulation();
        stopKeepalive();
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current);
        }
        setConnectionRetryCount(0);
        
        await manager.cancelDeviceConnection(connectedDevice.id);
        setConnectedDevice(null);
        setAccelerometerData({ x: 0, y: 0, z: 0 });
        setHeartRateData(72);
        Alert.alert('Disconnected', 'Device has been disconnected.');
      } catch (error) {
        console.error('Disconnect error:', error);
      }
    }
  };

  const startMonitoringAccelerometer = async (device) => {
    try {
      // This is a placeholder implementation
      // You'll need to adjust the service and characteristic UUIDs based on your Arduino firmware
      
      // First, list all services and characteristics to find the right ones
      const services = await device.services();
      console.log('Available services:', services.map(s => s.uuid));
      
      // Try to monitor the accelerometer characteristic
      // This assumes your Arduino is broadcasting accelerometer data
      // Format: typically 6 bytes (3 x 2 bytes for x, y, z as int16)
      
      device.monitorCharacteristicForService(
        NICLA_SENSE_SERVICE_UUID,
        ACCELEROMETER_CHAR_UUID,
        (error, characteristic) => {
          if (error) {
            console.error('Monitor error:', error);
            // Don't alert here as the UUID might not match - just log
            console.log('Could not monitor accelerometer. Make sure the UUIDs match your Arduino firmware.');
            return false;
          }

          if (characteristic?.value) {
            // Stop simulated data if real data is coming in
            if (isSimulatingData) {
              stopDataSimulation();
            }
            
            // Decode the base64 value
            const rawData = characteristic.value;
            const buffer = Buffer.from(rawData, 'base64');
            
            // Parse accelerometer data (adjust based on your data format)
            // Assuming 3 float values (12 bytes) or 3 int16 values (6 bytes)
            if (buffer.length >= 6) {
              const x = buffer.readInt16LE(0) / 1000; // Convert to g-force
              const y = buffer.readInt16LE(2) / 1000;
              const z = buffer.readInt16LE(4) / 1000;
              
              setAccelerometerData({ x, y, z });
            }
          }
        }
      );
      return true;
    } catch (error) {
      console.error('Error starting accelerometer monitoring:', error);
      console.log('Note: Update the service and characteristic UUIDs in BluetoothContext.js to match your Arduino firmware.');
      return false;
    }
  };

  // Simulated data generation for debugging/proof-of-concept
  const startDataSimulation = () => {
    if (dataSimulationInterval.current) return;
    
    setIsSimulatingData(true);
    console.log('Starting simulated data stream...');
    
    dataSimulationInterval.current = setInterval(() => {
      // Simulate realistic accelerometer data (gravity + small movements)
      const baseX = 0;
      const baseY = 0;
      const baseZ = 1.0; // Gravity when device is flat
      
      setAccelerometerData({
        x: baseX + (Math.random() - 0.5) * 0.2,
        y: baseY + (Math.random() - 0.5) * 0.2,
        z: baseZ + (Math.random() - 0.5) * 0.1,
      });
      
      // Simulate heart rate (60-100 bpm with variation)
      setHeartRateData(prev => {
        const change = (Math.random() - 0.5) * 4;
        const newRate = prev + change;
        return Math.max(60, Math.min(100, newRate));
      });
    }, 100); // Update 10 times per second
  };

  const stopDataSimulation = () => {
    if (dataSimulationInterval.current) {
      clearInterval(dataSimulationInterval.current);
      dataSimulationInterval.current = null;
      setIsSimulatingData(false);
      console.log('Stopped simulated data stream');
    }
  };

  // Keepalive mechanism to maintain connection
  const startKeepalive = (device) => {
    if (keepaliveInterval.current) return;
    
    keepaliveInterval.current = setInterval(async () => {
      try {
        // Check if device is still connected
        const isConnected = await device.isConnected();
        if (!isConnected) {
          console.log('Device not connected, stopping keepalive');
          stopKeepalive();
        }
      } catch (error) {
        console.log('Keepalive check failed:', error.message);
      }
    }, 5000); // Check every 5 seconds
  };

  const stopKeepalive = () => {
    if (keepaliveInterval.current) {
      clearInterval(keepaliveInterval.current);
      keepaliveInterval.current = null;
    }
  };

  const readAccelerometerData = async () => {
    if (!connectedDevice || !manager) return null;
    
    try {
      const characteristic = await manager.readCharacteristicForDevice(
        connectedDevice.id,
        NICLA_SENSE_SERVICE_UUID,
        ACCELEROMETER_CHAR_UUID
      );
      
      if (characteristic?.value) {
        const buffer = Buffer.from(characteristic.value, 'base64');
        
        if (buffer.length >= 6) {
          const x = buffer.readInt16LE(0) / 1000;
          const y = buffer.readInt16LE(2) / 1000;
          const z = buffer.readInt16LE(4) / 1000;
          
          return { x, y, z };
        }
      }
    } catch (error) {
      console.error('Error reading accelerometer:', error);
    }
    
    return null;
  };

  return (
    <BluetoothContext.Provider
      value={{
        devices,
        connectedDevice,
        isScanning,
        isBluetoothEnabled,
        accelerometerData,
        heartRateData,
        isSimulatingData,
        bleNotAvailable,
        scanForDevices,
        stopScan,
        connectToDevice,
        disconnectDevice,
        readAccelerometerData,
      }}
    >
      {children}
    </BluetoothContext.Provider>
  );
};

export const useBluetooth = () => {
  const context = useContext(BluetoothContext);
  if (!context) {
    throw new Error('useBluetooth must be used within a BluetoothProvider');
  }
  return context;
};
