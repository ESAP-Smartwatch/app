import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';
import { useBluetooth } from '../context/BluetoothContext';

const BluetoothScreen = () => {
  const {
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
  } = useBluetooth();

  const handleScanDevices = () => {
    if (isScanning) {
      stopScan();
    } else {
      scanForDevices();
    }
  };

  const handleConnectDevice = async (device) => {
    if (connectedDevice?.id === device.id) return;
    await connectToDevice(device.id);
  };

  const handleDisconnectDevice = async () => {
    await disconnectDevice();
  };

  const getSignalStrength = (rssi) => {
    if (rssi > -60) return 'strong';
    if (rssi > -80) return 'medium';
    return 'weak';
  };

  const getDeviceIcon = (deviceName) => {
    const nameLower = deviceName.toLowerCase();
    if (nameLower.includes('nicla') || nameLower.includes('arduino')) return 'hardware-chip';
    if (nameLower.includes('watch')) return 'watch';
    if (nameLower.includes('heart')) return 'heart';
    return 'bluetooth';
  };

  const getSignalIcon = (strength) => {
    if (strength === 'strong') return 'wifi';
    if (strength === 'medium') return 'wifi-outline';
    return 'cellular-outline';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Bluetooth Pairing</Text>
        <Text style={styles.subtitle}>
          Connect to Arduino Nicla Sense ME for real-time tracking
        </Text>
      </View>

      {bleNotAvailable && (
        <View style={styles.devBuildNotice}>
          <Ionicons name="information-circle" size={32} color="#FF9500" />
          <View style={styles.devBuildContent}>
            <Text style={styles.devBuildTitle}>Development Build Required</Text>
            <Text style={styles.devBuildText}>
              Bluetooth functionality requires a development build. You're currently running in Expo Go.
            </Text>
            <Text style={styles.devBuildCommand}>
              To enable BLE, run:{'\n'}
              <Text style={styles.codeText}>npx expo run:ios</Text> or{' '}
              <Text style={styles.codeText}>npx expo run:android</Text>
            </Text>
          </View>
        </View>
      )}

      <View style={styles.toggleSection}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Ionicons 
              name="bluetooth" 
              size={24} 
              color={isBluetoothEnabled ? '#007AFF' : '#999'} 
            />
            <Text style={styles.toggleLabel}>
              Bluetooth {isBluetoothEnabled ? 'Enabled' : 'Disabled'}
            </Text>
          </View>
          <View style={[
            styles.statusBadge,
            { backgroundColor: isBluetoothEnabled ? '#34C759' : '#FF3B30' }
          ]}>
            <Text style={styles.statusText}>
              {isBluetoothEnabled ? 'ON' : 'OFF'}
            </Text>
          </View>
        </View>
        {!isBluetoothEnabled && (
          <Text style={styles.warningText}>
            Please enable Bluetooth in your device settings to scan for devices.
          </Text>
        )}
      </View>

      {isBluetoothEnabled && (
        <>
          {connectedDevice && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Connected Device</Text>
              <View style={styles.connectedCard}>
                <View style={styles.deviceRow}>
                  <View style={styles.deviceIconContainer}>
                    <Ionicons
                      name={getDeviceIcon(connectedDevice.name)}
                      size={28}
                      color="#34C759"
                    />
                  </View>
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{connectedDevice.name}</Text>
                    <Text style={styles.deviceStatus}>
                      {isSimulatingData ? 'Connected • Simulated Data' : 'Connected & Receiving Data'}
                    </Text>
                  </View>
                  <View style={styles.statusIndicator}>
                    <View style={styles.connectedDot} />
                  </View>
                </View>

                {/* Heart Rate Display */}
                <View style={styles.dataSection}>
                  <Text style={styles.dataTitle}>Heart Rate</Text>
                  <View style={styles.heartRateContainer}>
                    <Ionicons name="heart" size={32} color="#FF3B30" />
                    <Text style={styles.heartRateValue}>{Math.round(heartRateData)}</Text>
                    <Text style={styles.heartRateUnit}>BPM</Text>
                  </View>
                </View>

                {/* Accelerometer Data Display */}
                <View style={styles.dataSection}>
                  <Text style={styles.dataTitle}>Accelerometer Data</Text>
                  <View style={styles.dataGrid}>
                    <View style={styles.dataItem}>
                      <Text style={styles.dataLabel}>X-Axis</Text>
                      <Text style={styles.dataValue}>{accelerometerData.x.toFixed(3)}</Text>
                      <Text style={styles.dataUnit}>g</Text>
                    </View>
                    <View style={styles.dataItem}>
                      <Text style={styles.dataLabel}>Y-Axis</Text>
                      <Text style={styles.dataValue}>{accelerometerData.y.toFixed(3)}</Text>
                      <Text style={styles.dataUnit}>g</Text>
                    </View>
                    <View style={styles.dataItem}>
                      <Text style={styles.dataLabel}>Z-Axis</Text>
                      <Text style={styles.dataValue}>{accelerometerData.z.toFixed(3)}</Text>
                      <Text style={styles.dataUnit}>g</Text>
                    </View>
                  </View>
                </View>

                <Button
                  title="Disconnect"
                  onPress={handleDisconnectDevice}
                  style={styles.disconnectButton}
                  textStyle={styles.disconnectButtonText}
                />
              </View>
            </View>
          )}

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {connectedDevice ? 'Other Devices' : 'Available Devices'}
              </Text>
              {isScanning ? (
                <View style={styles.scanningIndicator}>
                  <ActivityIndicator size="small" color="#007AFF" />
                  <Text style={styles.scanningText}>Scanning...</Text>
                </View>
              ) : (
                <TouchableOpacity onPress={handleScanDevices}>
                  <Text style={styles.refreshText}>
                    {devices.length > 0 ? 'Refresh' : 'Scan'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {!isScanning && devices.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="bluetooth-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>No devices found</Text>
                <Text style={styles.emptySubtext}>
                  Make sure your Arduino Nicla Sense ME is powered on and nearby
                </Text>
                <Button
                  title="Start Scanning"
                  onPress={handleScanDevices}
                  style={styles.scanButton}
                />
              </View>
            ) : (
              <View style={styles.deviceList}>
                {devices
                  .filter(device => !connectedDevice || device.id !== connectedDevice.id)
                  .map((device) => {
                    const signalStrength = getSignalStrength(device.rssi);
                    return (
                      <TouchableOpacity
                        key={device.id}
                        style={styles.deviceCard}
                        onPress={() => handleConnectDevice(device)}
                        disabled={isScanning}
                      >
                        <View style={styles.deviceRow}>
                          <View style={styles.deviceIconContainer}>
                            <Ionicons
                              name={getDeviceIcon(device.name)}
                              size={28}
                              color="#007AFF"
                            />
                          </View>
                          <View style={styles.deviceInfo}>
                            <Text style={styles.deviceName}>{device.name}</Text>
                            <View style={styles.deviceMeta}>
                              <Ionicons
                                name={getSignalIcon(signalStrength)}
                                size={14}
                                color="#666"
                              />
                              <Text style={styles.deviceMetaText}>
                                {signalStrength} signal • {device.rssi} dBm
                              </Text>
                            </View>
                          </View>
                          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
              </View>
            )}
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Arduino Nicla Sense ME Setup</Text>
                <Text style={styles.infoText}>
                  • Ensure your Arduino is programmed with BLE firmware
                </Text>
                <Text style={styles.infoText}>
                  • Keep the device within 10 meters
                </Text>
                <Text style={styles.infoText}>
                  • Make sure Bluetooth is enabled on your phone
                </Text>
                <Text style={styles.infoText}>
                  • Update UUIDs in BluetoothContext.js to match your firmware
                </Text>
              </View>
            </View>
          </View>
        </>
      )}

      {!isBluetoothEnabled && (
        <View style={styles.disabledState}>
          <Ionicons name="bluetooth-outline" size={80} color="#ccc" />
          <Text style={styles.disabledText}>Bluetooth is turned off</Text>
          <Text style={styles.disabledSubtext}>
            Enable Bluetooth in your device settings to connect to fitness devices
          </Text>
        </View>
      )}
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
  toggleSection: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  toggleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginLeft: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  warningText: {
    fontSize: 14,
    color: '#FF9500',
    marginTop: 12,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  scanningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanningText: {
    fontSize: 14,
    color: '#007AFF',
    marginLeft: 8,
  },
  refreshText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  connectedCard: {
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
  deviceList: {
    gap: 12,
  },
  deviceCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  deviceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deviceMetaText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
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
  dataGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dataItem: {
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  dataUnit: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
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
  disconnectButton: {
    marginTop: 16,
    backgroundColor: '#FF3B30',
  },
  disconnectButtonText: {
    color: '#fff',
  },
  scanButton: {
    marginTop: 20,
    width: '100%',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  disabledState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  disabledText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
    marginTop: 20,
  },
  disabledSubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
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
});

export default BluetoothScreen;
