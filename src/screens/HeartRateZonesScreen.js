import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

const HeartRateZonesScreen = ({ navigation }) => {
  const [age, setAge] = useState('30');
  const [restingHR, setRestingHR] = useState('60');
  const [maxHR, setMaxHR] = useState('190');

  const calculateZones = () => {
    const max = parseInt(maxHR) || 190;
    return {
      zone1: { min: Math.round(max * 0.50), max: Math.round(max * 0.60), name: 'Zone 1: Recovery', color: '#5AC8FA' },
      zone2: { min: Math.round(max * 0.60), max: Math.round(max * 0.70), name: 'Zone 2: Aerobic', color: '#30D158' },
      zone3: { min: Math.round(max * 0.70), max: Math.round(max * 0.80), name: 'Zone 3: Tempo', color: '#FFD60A' },
      zone4: { min: Math.round(max * 0.80), max: Math.round(max * 0.90), name: 'Zone 4: Threshold', color: '#FF9F0A' },
      zone5: { min: Math.round(max * 0.90), max: max, name: 'Zone 5: Maximum', color: '#FF453A' },
    };
  };

  const zones = calculateZones();

  return (
    <ScrollView style={styles.container}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Customize Your Zones</Text>
          <Text style={styles.infoText}>
            Enter your details to calculate personalized heart rate training zones.
          </Text>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Age</Text>
            <TextInput
              style={styles.input}
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
              placeholder="30"
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Resting Heart Rate (BPM)</Text>
            <TextInput
              style={styles.input}
              value={restingHR}
              onChangeText={setRestingHR}
              keyboardType="numeric"
              placeholder="60"
            />
          </View>

          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Max Heart Rate (BPM)</Text>
            <TextInput
              style={styles.input}
              value={maxHR}
              onChangeText={setMaxHR}
              keyboardType="numeric"
              placeholder="190"
            />
          </View>
        </View>

        <View style={styles.zonesSection}>
          <Text style={styles.sectionTitle}>Your Training Zones</Text>
          
          {Object.values(zones).map((zone, index) => (
            <View key={index} style={[styles.zoneCard, { borderLeftColor: zone.color, borderLeftWidth: 4 }]}>
              <View style={styles.zoneHeader}>
                <Text style={styles.zoneName}>{zone.name}</Text>
                <Text style={styles.zoneRange}>{zone.min} - {zone.max} BPM</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.tipCard}>
          <Ionicons name="bulb" size={24} color="#FFD60A" />
          <Text style={styles.tipText}>
            Train in different zones for different fitness goals. Lower zones build endurance, higher zones improve speed and power.
          </Text>
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 20,
  },
  infoCard: {
    backgroundColor: '#007AFF',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 20,
  },
  inputSection: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  inputRow: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  zonesSection: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 12,
    padding: 16,
  },
  zoneCard: {
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  zoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zoneName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  zoneRange: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  tipCard: {
    backgroundColor: '#FFF9E6',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
});

export default HeartRateZonesScreen;
