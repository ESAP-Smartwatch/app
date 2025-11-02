import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUserProfile } from '../context/UserProfileContext';
import { useWiFiHealth } from '../context/WiFiHealthContext';
import Button from '../components/Button';

const UserProfileScreen = ({ navigation }) => {
  const { userProfile, updateProfile, calculateVO2Max, autoCalculateVO2Max } = useUserProfile();
  const { heartRateHistory } = useWiFiHealth();
  
  const [localProfile, setLocalProfile] = useState({
    gender: userProfile.gender,
    age: userProfile.age.toString(),
    weight: userProfile.weight.toString(),
    restingHeartRate: userProfile.restingHeartRate.toString(),
    vo2Max: userProfile.vo2Max ? userProfile.vo2Max.toString() : '',
    vo2MaxManual: userProfile.vo2MaxManual,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleFieldChange = (field, value) => {
    // Sanitize numeric inputs - only allow numbers and decimal point
    if (['age', 'weight', 'restingHeartRate', 'vo2Max'].includes(field)) {
      // Remove any non-numeric characters except decimal point
      const sanitized = value.replace(/[^0-9.]/g, '');
      // Ensure only one decimal point
      const parts = sanitized.split('.');
      const cleanValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : sanitized;
      setLocalProfile(prev => ({ ...prev, [field]: cleanValue }));
    } else {
      setLocalProfile(prev => ({ ...prev, [field]: value }));
    }
    setHasChanges(true);
  };

  const handleCalculateVO2Max = () => {
    const age = parseInt(localProfile.age);
    const rhr = parseInt(localProfile.restingHeartRate);
    
    // Validate before calculation
    if (isNaN(age) || age < 1 || age > 120) {
      Alert.alert('Invalid Age', 'Please enter a valid age before calculating VO2 Max.');
      return;
    }
    
    if (isNaN(rhr) || rhr < 30 || rhr > 200) {
      Alert.alert('Invalid Heart Rate', 'Please enter a valid resting heart rate before calculating VO2 Max.');
      return;
    }
    
    // Pass heart rate history if available for more accurate calculation
    const calculatedVO2 = calculateVO2Max(heartRateHistory && heartRateHistory.length > 0 ? heartRateHistory : null);
    
    if (parseFloat(calculatedVO2) === 0) {
      Alert.alert('Calculation Error', 'Could not calculate VO2 Max. Please check your inputs.');
      return;
    }
    
    const usingRealData = heartRateHistory && heartRateHistory.length > 0;
    setLocalProfile(prev => ({ ...prev, vo2Max: calculatedVO2, vo2MaxManual: false }));
    setHasChanges(true);
    Alert.alert(
      'VO2 Max Calculated',
      `Your estimated VO2 Max is ${calculatedVO2} ml/kg/min${usingRealData ? '\n\nCalculation used your actual heart rate data for improved accuracy.' : ''}`,
      [{ text: 'OK' }]
    );
  };

  const validateAndSave = () => {
    const age = parseInt(localProfile.age);
    const weight = parseFloat(localProfile.weight);
    const rhr = parseInt(localProfile.restingHeartRate);
    const vo2 = localProfile.vo2Max ? parseFloat(localProfile.vo2Max) : null;

    // Validation
    if (isNaN(age) || age < 1 || age > 120) {
      Alert.alert('Invalid Age', 'Please enter a valid age between 1 and 120.');
      return;
    }

    if (isNaN(weight) || weight < 20 || weight > 300) {
      Alert.alert('Invalid Weight', 'Please enter a valid weight between 20 and 300 kg.');
      return;
    }

    if (isNaN(rhr) || rhr < 30 || rhr > 200) {
      Alert.alert('Invalid Heart Rate', 'Please enter a valid resting heart rate between 30 and 200 bpm.');
      return;
    }

    if (vo2 && (isNaN(vo2) || vo2 < 10 || vo2 > 100)) {
      Alert.alert('Invalid VO2 Max', 'Please enter a valid VO2 Max between 10 and 100 ml/kg/min.');
      return;
    }

    // Save to context
    updateProfile({
      gender: localProfile.gender,
      age,
      weight,
      restingHeartRate: rhr,
      vo2Max: vo2,
      vo2MaxManual: localProfile.vo2MaxManual,
    });

    setHasChanges(false);
    Alert.alert(
      'Profile Saved',
      'Your profile has been updated successfully.',
      [{ text: 'OK' }]
    );
  };

  const maxHeartRate = 220 - parseInt(localProfile.age || 25);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>User Profile</Text>
        <Text style={styles.subtitle}>
          Set your information for accurate calorie calculations
        </Text>
      </View>

      {/* Gender Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gender</Text>
        <View style={styles.genderContainer}>
          <TouchableOpacity
            style={[
              styles.genderButton,
              localProfile.gender === 'male' && styles.genderButtonActive
            ]}
            onPress={() => handleFieldChange('gender', 'male')}
          >
            <Ionicons 
              name="male" 
              size={32} 
              color={localProfile.gender === 'male' ? '#007AFF' : '#999'} 
            />
            <Text style={[
              styles.genderText,
              localProfile.gender === 'male' && styles.genderTextActive
            ]}>
              Male
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.genderButton,
              localProfile.gender === 'female' && styles.genderButtonActive
            ]}
            onPress={() => handleFieldChange('gender', 'female')}
          >
            <Ionicons 
              name="female" 
              size={32} 
              color={localProfile.gender === 'female' ? '#FF2D55' : '#999'} 
            />
            <Text style={[
              styles.genderText,
              localProfile.gender === 'female' && styles.genderTextActive
            ]}>
              Female
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Age */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Age</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="calendar" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={localProfile.age}
            onChangeText={(value) => handleFieldChange('age', value)}
            keyboardType="number-pad"
            placeholder="Enter your age"
            placeholderTextColor="#999"
          />
          <Text style={styles.inputUnit}>years</Text>
        </View>
        <Text style={styles.helperText}>Max Heart Rate: {maxHeartRate} bpm</Text>
      </View>

      {/* Weight */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Weight</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="fitness" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={localProfile.weight}
            onChangeText={(value) => handleFieldChange('weight', value)}
            keyboardType="decimal-pad"
            placeholder="Enter your weight"
            placeholderTextColor="#999"
          />
          <Text style={styles.inputUnit}>kg</Text>
        </View>
      </View>

      {/* Resting Heart Rate */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Resting Heart Rate</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="heart" size={20} color="#FF3B30" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={localProfile.restingHeartRate}
            onChangeText={(value) => handleFieldChange('restingHeartRate', value)}
            keyboardType="number-pad"
            placeholder="Enter resting heart rate"
            placeholderTextColor="#999"
          />
          <Text style={styles.inputUnit}>bpm</Text>
        </View>
        <Text style={styles.helperText}>
          Measure your heart rate when you first wake up
        </Text>
      </View>

      {/* VO2 Max Section */}
      <View style={styles.section}>
        <View style={styles.vo2Header}>
          <Text style={styles.sectionTitle}>VO2 Max</Text>
          <TouchableOpacity
            style={styles.calculateButton}
            onPress={handleCalculateVO2Max}
          >
            <Ionicons name="calculator" size={16} color="#007AFF" />
            <Text style={styles.calculateButtonText}>Calculate</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="speedometer" size={20} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            value={localProfile.vo2Max}
            onChangeText={(value) => {
              handleFieldChange('vo2Max', value);
              handleFieldChange('vo2MaxManual', true);
            }}
            keyboardType="decimal-pad"
            placeholder="Enter or calculate VO2 Max"
            placeholderTextColor="#999"
          />
          <Text style={styles.inputUnit}>ml/kg/min</Text>
        </View>
        <Text style={styles.helperText}>
          {localProfile.vo2MaxManual 
            ? 'Manually entered value' 
            : 'Auto-calculated from age and resting heart rate'}
        </Text>
      </View>

      {/* Info Card */}
      <View style={styles.infoCard}>
        <Ionicons name="information-circle" size={24} color="#007AFF" />
        <View style={styles.infoContent}>
          <Text style={styles.infoTitle}>About VO2 Max</Text>
          <Text style={styles.infoText}>
            VO2 Max is the maximum rate of oxygen consumption during exercise. 
            It's a key indicator of cardiovascular fitness and is used for accurate 
            calorie burn calculations.
          </Text>
          <Text style={styles.infoFormula}>
            Formula: VO₂max = 15.3 × (MHR / RHR)
          </Text>
        </View>
      </View>

      {/* Save Button */}
      <View style={styles.saveSection}>
        <Button
          title="Save Profile"
          onPress={validateAndSave}
          style={[styles.saveButton, !hasChanges && styles.saveButtonDisabled]}
          disabled={!hasChanges}
        />
        {hasChanges && (
          <Text style={styles.unsavedText}>You have unsaved changes</Text>
        )}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
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
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  genderButton: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    marginHorizontal: 6,
  },
  genderButtonActive: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  genderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginTop: 8,
  },
  genderTextActive: {
    color: '#007AFF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  inputUnit: {
    fontSize: 14,
    color: '#999',
    fontWeight: '600',
    marginLeft: 8,
  },
  helperText: {
    fontSize: 13,
    color: '#999',
    marginTop: 8,
    fontStyle: 'italic',
  },
  vo2Header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  calculateButtonText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 4,
  },
  infoCard: {
    backgroundColor: '#E3F2FF',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
  },
  infoContent: {
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
    lineHeight: 20,
    marginBottom: 8,
  },
  infoFormula: {
    fontSize: 13,
    color: '#007AFF',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: 4,
  },
  saveSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  saveButton: {
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  unsavedText: {
    fontSize: 13,
    color: '#FF9500',
    textAlign: 'center',
    marginTop: 12,
    fontStyle: 'italic',
  },
});

export default UserProfileScreen;
