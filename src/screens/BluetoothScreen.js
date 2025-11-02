import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { useWiFiHealth } from '../context/WiFiHealthContext';

const BluetoothScreen = () => {
  const { 
    isConnected, 
    heartRate, 
    spo2, 
    lis3dh, 
    steps, 
    lastUpdate, 
    connect, 
    disconnect 
  } = useWiFiHealth();
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  // Parse accelerometer data
  const parseAccelerometer = (lis3dhString) => {
    if (!lis3dhString) return { x: 0, y: 0, z: 0 };
    const match = lis3dhString.match(/X:(-?\d+)\s+Y:(-?\d+)\s+Z:(-?\d+)/);
    if (match) {
      return {
        x: parseInt(match[1]),
        y: parseInt(match[2]),
        z: parseInt(match[3])
      };
    }
    return { x: 0, y: 0, z: 0 };
  };

  const accelData = parseAccelerometer(lis3dh);

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionError(null);

    const success = await connect();

    if (!success) {
      setConnectionError('Failed to fetch data');
      Alert.alert(
        'Connection Failed',
        'Could not connect to HealthNode. Please ensure:\n\n' +
        '1. The ESP32C3 is powered on\n' +
        '2. You are connected to the "HealthNode" WiFi network\n' +
        '3. The device is within range',
        [{ text: 'OK' }]
      );
    }

    setIsConnecting(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setConnectionError(null);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>WiFi Connection</Text>
        <Text style={styles.subtitle}>
          Connect to Xiao ESP32C3 for real-time health monitoring
        </Text>
      </View>

      <View style={styles.connectionSection}>
        <View style={styles.connectionCard}>
          <View style={styles.deviceRow}>
            <View style={styles.deviceIconContainer}>
              <Ionicons
                name="hardware-chip"
                size={28}
                color={isConnected ? '#34C759' : '#007AFF'}
              />
            </View>
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>Xiao ESP32C3</Text>
              <Text style={[
                styles.deviceStatus,
                { color: isConnected ? '#34C759' : '#666' }
              ]}>
                {isConnected ? 'Connected & Receiving Data' : 'Not Connected'}
              </Text>
            </View>
            {isConnected && (
              <View style={styles.statusIndicator}>
                <View style={styles.connectedDot} />
              </View>
            )}
          </View>

          {connectionError && (
            <View style={styles.errorContainer}>
              <Ionicons name="warning" size={16} color="#FF3B30" />
              <Text style={styles.errorText}>{connectionError}</Text>
            </View>
          )}

          {!isConnected ? (
            <Button
              title={isConnecting ? 'Connecting...' : 'Connect to Device'}
              onPress={handleConnect}
              style={[styles.connectButton, isConnecting && styles.connectButtonDisabled]}
              disabled={isConnecting}
            />
          ) : (
            <Button
              title="Disconnect"
              onPress={handleDisconnect}
              style={styles.disconnectButton}
              textStyle={styles.disconnectButtonText}
            />
          )}
        </View>
      </View>

      {isConnected && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Health Data</Text>
          <View style={styles.dataCard}>
            <View style={styles.dataSection}>
              <Text style={styles.dataTitle}>Heart Rate</Text>
              <View style={styles.heartRateContainer}>
                <Ionicons name="heart" size={32} color="#FF3B30" />
                <Text style={styles.heartRateValue}>{heartRate ?? '--'}</Text>
                <Text style={styles.heartRateUnit}>BPM</Text>
              </View>
            </View>

            <View style={styles.dataSection}>
              <Text style={styles.dataTitle}>Blood Oxygen (SpO2)</Text>
              <View style={styles.spo2Container}>
                <Ionicons name="water" size={32} color="#007AFF" />
                <Text style={styles.spo2Value}>{spo2 ?? '--'}</Text>
                <Text style={styles.spo2Unit}>%</Text>
              </View>
            </View>

            <View style={styles.dataSection}>
              <Text style={styles.dataTitle}>Step Count</Text>
              <View style={styles.stepsContainer}>
                <Ionicons name="footsteps" size={32} color="#34C759" />
                <Text style={styles.stepsValue}>{steps ?? '--'}</Text>
                <Text style={styles.stepsUnit}>steps</Text>
              </View>
            </View>

            <View style={styles.dataSection}>
              <Text style={styles.dataTitle}>Accelerometer (LIS3DH)</Text>
              <View style={styles.accelerometerGrid}>
                <View style={styles.accelItem}>
                  <Text style={styles.accelLabel}>X-Axis</Text>
                  <Text style={styles.accelValue}>{accelData.x}</Text>
                </View>
                <View style={styles.accelItem}>
                  <Text style={styles.accelLabel}>Y-Axis</Text>
                  <Text style={styles.accelValue}>{accelData.y}</Text>
                </View>
                <View style={styles.accelItem}>
                  <Text style={styles.accelLabel}>Z-Axis</Text>
                  <Text style={styles.accelValue}>{accelData.z}</Text>
                </View>
              </View>
              <View style={styles.magnitudeContainer}>
                <Text style={styles.magnitudeLabel}>Magnitude:</Text>
                <Text style={styles.magnitudeValue}>
                  {Math.round(Math.sqrt(accelData.x ** 2 + accelData.y ** 2 + accelData.z ** 2))}
                </Text>
              </View>
            </View>

            {lastUpdate && (
              <View style={styles.lastUpdateContainer}>
                <Ionicons name="time-outline" size={14} color="#999" />
                <Text style={styles.lastUpdateText}>
                  Last updated: {lastUpdate.toLocaleTimeString()}
                </Text>
              </View>
            )}
          </View>
        </View>
      )}

      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>ESP32C3 WiFi Setup</Text>
            <Text style={styles.infoText}>
              1. Power on the Xiao ESP32C3 device
            </Text>
            <Text style={styles.infoText}>
              2. Connect to WiFi network: HealthNode
            </Text>
            <Text style={styles.infoText}>
              3. Password: 12345678
            </Text>
            <Text style={styles.infoText}>
              4. Tap "Connect to Device" above
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.technicalCard}>
          <Ionicons name="settings-outline" size={24} color="#666" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Technical Information</Text>
            <Text style={styles.technicalText}>
              Network SSID: HealthNode
            </Text>
            <Text style={styles.technicalText}>
              Device IP: 192.168.4.1
            </Text>
            <Text style={styles.technicalText}>
              Update Interval: 1 second
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  devBuildNotice: {
    backgroundColor: '#FFF3E0',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: '#FF9500',
  },
  devBuildContent: {
    flex: 1,
    marginLeft: 12,
  },
  devBuildTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  devBuildText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    lineHeight: 20,
  },
  devBuildCommand: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  codeText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    color: '#007AFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  connectionSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  connectionCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginLeft: 8,
    flex: 1,
  },
  connectButton: {
    marginTop: 16,
    backgroundColor: '#007AFF',
  },
  connectButtonDisabled: {
    opacity: 0.6,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  dataCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  deviceInfo: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  deviceStatus: {
    fontSize: 14,
    color: '#34C759',
    fontWeight: '500',
  },
  statusIndicator: {
    marginLeft: 12,
  },
  connectedDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#34C759',
  },
  dataSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  heartRateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  heartRateValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FF3B30',
    marginHorizontal: 12,
  },
  heartRateUnit: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  spo2Container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  spo2Value: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#007AFF',
    marginHorizontal: 12,
  },
  spo2Unit: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  stepsValue: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#34C759',
    marginHorizontal: 12,
  },
  stepsUnit: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  accelerometerGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 12,
  },
  accelItem: {
    alignItems: 'center',
  },
  accelLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  accelValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  magnitudeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  magnitudeLabel: {
    fontSize: 14,
    color: '#666',
    marginRight: 8,
  },
  magnitudeValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF9500',
  },
  lastUpdateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  lastUpdateText: {
    fontSize: 12,
    color: '#999',
    marginLeft: 6,
  },
  disconnectButton: {
    marginTop: 16,
    backgroundColor: '#FF3B30',
  },
  disconnectButtonText: {
    color: '#fff',
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  infoCard: {
    backgroundColor: '#E3F2FF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
  technicalCard: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    marginTop: 12,
  },
  technicalText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
});

export default BluetoothScreen;
