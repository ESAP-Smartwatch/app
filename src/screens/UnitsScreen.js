import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

const UnitsScreen = ({ navigation }) => {
  const [distanceUnit, setDistanceUnit] = useState('metric'); // 'metric' or 'imperial'
  const [weightUnit, setWeightUnit] = useState('metric');
  const [heightUnit, setHeightUnit] = useState('metric');
  const [temperatureUnit, setTemperatureUnit] = useState('celsius');

  const UnitOption = ({ title, options, selectedValue, onSelect }) => (
    <View style={styles.unitSection}>
      <Text style={styles.unitTitle}>{title}</Text>
      {options.map((option) => (
        <TouchableOpacity
          key={option.value}
          style={styles.optionRow}
          onPress={() => onSelect(option.value)}
        >
          <View style={styles.optionLeft}>
            <Text style={styles.optionLabel}>{option.label}</Text>
            <Text style={styles.optionSubtitle}>{option.subtitle}</Text>
          </View>
          {selectedValue === option.value && (
            <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
          )}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
        <UnitOption
          title="Distance"
          options={[
            { value: 'metric', label: 'Kilometers', subtitle: 'km' },
            { value: 'imperial', label: 'Miles', subtitle: 'mi' },
          ]}
          selectedValue={distanceUnit}
          onSelect={setDistanceUnit}
        />

        <UnitOption
          title="Weight"
          options={[
            { value: 'metric', label: 'Kilograms', subtitle: 'kg' },
            { value: 'imperial', label: 'Pounds', subtitle: 'lbs' },
          ]}
          selectedValue={weightUnit}
          onSelect={setWeightUnit}
        />

        <UnitOption
          title="Height"
          options={[
            { value: 'metric', label: 'Centimeters', subtitle: 'cm' },
            { value: 'imperial', label: 'Feet/Inches', subtitle: 'ft/in' },
          ]}
          selectedValue={heightUnit}
          onSelect={setHeightUnit}
        />

        <UnitOption
          title="Temperature"
          options={[
            { value: 'celsius', label: 'Celsius', subtitle: '°C' },
            { value: 'fahrenheit', label: 'Fahrenheit', subtitle: '°F' },
          ]}
          selectedValue={temperatureUnit}
          onSelect={setTemperatureUnit}
        />
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 20,
  },
  unitSection: {
    backgroundColor: COLORS.surface,
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  unitTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  optionLeft: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  optionSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
});

export default UnitsScreen;
