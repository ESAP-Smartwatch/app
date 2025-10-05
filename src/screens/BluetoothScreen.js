import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/Button';

const BluetoothScreen = () => {
  const [bluetoothEnabled, setBluetoothEnabled] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState(null);

  // Mock devices for display purposes
  const [availableDevices] = useState([
    {
      id: '1',
      name: 'Fitness Tracker Pro',
      type: 'tracker',
      signalStrength: 'strong',
    },
    {
      id: '2',
      name: 'SmartWatch Ultra',
      type: 'watch',
      signalStrength: 'medium',
    },
    {
      id: '3',
      name: 'Heart Rate Monitor',
      type: 'sensor',
      signalStrength: 'weak',
    },
    {
      id: '4',
      name: 'Running Pod',
      type: 'sensor',
      signalStrength: 'strong',
    },
  ]);

  const handleToggleBluetooth = () => {
    setBluetoothEnabled(!bluetoothEnabled);
    if (bluetoothEnabled) {
      setIsScanning(false);
      setConnectedDevice(null);
    }
  };

  const handleScanDevices = () => {
    setIsScanning(true);
    // Simulate scanning for 2 seconds
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  const handleConnectDevice = (device) => {
    // Mock connection - just for UI
    setConnectedDevice(device);
  };

  const handleDisconnectDevice = () => {
    setConnectedDevice(null);
  };

  const getDeviceIcon = (type) => {
    const icons = {
      tracker: 'fitness',
      watch: 'watch',
      sensor: 'pulse',
    };
    return icons[type] || 'bluetooth';
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
          Connect your fitness devices to sync data
        </Text>
      </View>

      <View style={styles.toggleSection}>
        <View style={styles.toggleRow}>
          <View style={styles.toggleInfo}>
            <Ionicons name="bluetooth" size={24} color="#007AFF" />
            <Text style={styles.toggleLabel}>Bluetooth</Text>
          </View>
          <Switch
            value={bluetoothEnabled}
            onValueChange={handleToggleBluetooth}
            trackColor={{ false: '#D1D1D6', true: '#34C759' }}
            thumbColor="#fff"
          />
        </View>
      </View>

      {bluetoothEnabled && (
        <>
          {connectedDevice && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Connected Device</Text>
              <View style={styles.connectedCard}>
                <View style={styles.deviceRow}>
                  <View style={styles.deviceIconContainer}>
                    <Ionicons
                      name={getDeviceIcon(connectedDevice.type)}
                      size={28}
                      color="#34C759"
                    />
                  </View>
                  <View style={styles.deviceInfo}>
                    <Text style={styles.deviceName}>{connectedDevice.name}</Text>
                    <Text style={styles.deviceStatus}>Connected</Text>
                  </View>
                  <View style={styles.statusIndicator}>
                    <View style={styles.connectedDot} />
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
              <Text style={styles.sectionTitle}>Available Devices</Text>
              {isScanning ? (
                <View style={styles.scanningIndicator}>
                  <ActivityIndicator size="small" color="#007AFF" />
                  <Text style={styles.scanningText}>Scanning...</Text>
                </View>
              ) : (
                <TouchableOpacity onPress={handleScanDevices}>
                  <Text style={styles.refreshText}>Refresh</Text>
                </TouchableOpacity>
              )}
            </View>

            {!isScanning && availableDevices.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="bluetooth-outline" size={64} color="#ccc" />
                <Text style={styles.emptyText}>No devices found</Text>
                <Text style={styles.emptySubtext}>
                  Make sure your device is turned on and nearby
                </Text>
              </View>
            ) : (
              <View style={styles.deviceList}>
                {availableDevices.map((device) => (
                  <TouchableOpacity
                    key={device.id}
                    style={[
                      styles.deviceCard,
                      connectedDevice?.id === device.id && styles.deviceCardConnected,
                    ]}
                    onPress={() => handleConnectDevice(device)}
                    disabled={connectedDevice?.id === device.id}
                  >
                    <View style={styles.deviceRow}>
                      <View style={styles.deviceIconContainer}>
                        <Ionicons
                          name={getDeviceIcon(device.type)}
                          size={28}
                          color={
                            connectedDevice?.id === device.id ? '#34C759' : '#007AFF'
                          }
                        />
                      </View>
                      <View style={styles.deviceInfo}>
                        <Text style={styles.deviceName}>{device.name}</Text>
                        <View style={styles.deviceMeta}>
                          <Ionicons
                            name={getSignalIcon(device.signalStrength)}
                            size={14}
                            color="#666"
                          />
                          <Text style={styles.deviceMetaText}>
                            {device.signalStrength} signal
                          </Text>
                        </View>
                      </View>
                      {connectedDevice?.id === device.id ? (
                        <View style={styles.connectedBadge}>
                          <Text style={styles.connectedBadgeText}>Connected</Text>
                        </View>
                      ) : (
                        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoCard}>
              <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>Pairing Tips</Text>
                <Text style={styles.infoText}>
                  • Keep your device within 10 meters
                </Text>
                <Text style={styles.infoText}>
                  • Make sure device Bluetooth is enabled
                </Text>
                <Text style={styles.infoText}>
                  • Some devices may require a PIN code
                </Text>
              </View>
            </View>
          </View>
        </>
      )}

      {!bluetoothEnabled && (
        <View style={styles.disabledState}>
          <Ionicons name="bluetooth-outline" size={80} color="#ccc" />
          <Text style={styles.disabledText}>Bluetooth is turned off</Text>
          <Text style={styles.disabledSubtext}>
            Enable Bluetooth to connect to fitness devices
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
  deviceCardConnected: {
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
  connectedBadge: {
    backgroundColor: '#34C759',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  connectedBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  disconnectButton: {
    marginTop: 16,
    backgroundColor: '#FF3B30',
  },
  disconnectButtonText: {
    color: '#fff',
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
