import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { useWorkouts } from '../context/WorkoutContext';
import { useUserProfile } from '../context/UserProfileContext';
import { useCalorieHistory } from '../context/CalorieHistoryContext';
import { useWiFiHealth } from '../context/WiFiHealthContext';
import WorkoutItem from '../components/WorkoutItem';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';

const WorkoutScreen = () => {
  const { workouts, addWorkout, deleteWorkout } = useWorkouts();
  const { profile, calculateCaloriesBurned } = useUserProfile();
  const { addCalorieEntry } = useCalorieHistory();
  const { heartRate } = useWiFiHealth();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('Running');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [workoutDate, setWorkoutDate] = useState(new Date());
  const [autoCalculateCalories, setAutoCalculateCalories] = useState(true);

  const workoutTypes = ['Running', 'Cycling', 'Swimming', 'Gym', 'Yoga', 'Walking'];

  // Auto-calculate calories when duration changes
  const handleDurationChange = (value) => {
    // Sanitize input - only allow numbers
    const sanitized = value.replace(/[^0-9]/g, '');
    setDuration(sanitized);
    
    if (autoCalculateCalories && sanitized && profile.age && profile.weight) {
      const durationNum = parseInt(sanitized);
      if (durationNum > 0) {
        // Use current heart rate if available, otherwise estimate based on activity
        const estimatedHR = heartRate || getEstimatedHeartRate(selectedType);
        const calculatedCalories = calculateCaloriesBurned(durationNum, estimatedHR);
        setCalories(Math.round(calculatedCalories).toString());
      }
    }
  };

  // Estimate heart rate based on workout type
  const getEstimatedHeartRate = (type) => {
    const estimates = {
      'Running': 145,
      'Cycling': 130,
      'Swimming': 135,
      'Gym': 125,
      'Yoga': 90,
      'Walking': 100,
    };
    return estimates[type] || 120;
  };

  const handleAddWorkout = async () => {
    try {
      const durationNum = parseInt(duration);
      const caloriesNum = parseInt(calories);
      
      // Validation
      if (!duration || !calories) {
        Alert.alert('Missing Information', 'Please enter both duration and calories.');
        return;
      }
      
      if (isNaN(durationNum) || durationNum <= 0) {
        Alert.alert('Invalid Duration', 'Please enter a valid duration greater than 0.');
        return;
      }
      
      if (isNaN(caloriesNum) || caloriesNum <= 0) {
        Alert.alert('Invalid Calories', 'Please enter a valid calorie amount greater than 0.');
        return;
      }
      
      addWorkout({
        type: selectedType,
        duration: durationNum,
        calories: caloriesNum,
        date: workoutDate.toISOString(),
      });

      // Save to calorie history
      await addCalorieEntry({
        calories: caloriesNum,
        source: 'workout',
        heartRate: heartRate || getEstimatedHeartRate(selectedType),
        duration: durationNum,
        metadata: {
          workoutType: selectedType,
        },
      });

      setDuration('');
      setCalories('');
      setWorkoutDate(new Date());
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding workout:', error);
      Alert.alert('Error', 'Failed to save workout. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Your Workouts</Text>
          <Button
            title="+ Add Workout"
            onPress={() => setModalVisible(true)}
            style={styles.addButton}
          />
        </View>

        {workouts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="fitness-outline" size={64} color="#ccc" />
            <Text style={styles.emptyText}>No workouts yet</Text>
            <Text style={styles.emptySubtext}>Tap the button above to add your first workout</Text>
          </View>
        ) : (
          <View style={styles.workoutList}>
            {workouts.map((workout) => (
              <WorkoutItem
                key={workout.id}
                workout={workout}
                onDelete={deleteWorkout}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <TouchableWithoutFeedback>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Add Workout</Text>
                    <TouchableOpacity onPress={() => {
                      Keyboard.dismiss();
                      setModalVisible(false);
                    }}>
                      <Ionicons name="close" size={28} color="#333" />
                    </TouchableOpacity>
                  </View>

                  <ScrollView 
                    style={styles.modalScrollView}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                  >
                    <Text style={styles.label}>Workout Type</Text>
                    <View style={styles.typesContainer}>
                      {workoutTypes.map((type) => (
                        <TouchableOpacity
                          key={type}
                          style={[
                            styles.typeButton,
                            selectedType === type && styles.typeButtonSelected,
                          ]}
                          onPress={() => setSelectedType(type)}
                        >
                          <Text
                            style={[
                              styles.typeButtonText,
                              selectedType === type && styles.typeButtonTextSelected,
                            ]}
                          >
                            {type}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>

                    <Text style={styles.label}>Duration (minutes)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="30"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      value={duration}
                      onChangeText={handleDurationChange}
                      returnKeyType="next"
                      onSubmitEditing={() => Keyboard.dismiss()}
                    />
                    
                    {duration && (
                      <View style={styles.previewContainer}>
                        <Text style={styles.previewText}>Duration: {duration} minutes</Text>
                      </View>
                    )}

                    <View style={styles.labelWithToggle}>
                      <Text style={styles.label}>Calories Burned</Text>
                      {profile.age && profile.weight && (
                        <TouchableOpacity
                          style={styles.autoCalcToggle}
                          onPress={() => {
                            setAutoCalculateCalories(!autoCalculateCalories);
                            if (!autoCalculateCalories && duration) {
                              handleDurationChange(duration);
                            }
                          }}
                        >
                          <Ionicons 
                            name={autoCalculateCalories ? "calculator" : "pencil"} 
                            size={14} 
                            color="#007AFF" 
                          />
                          <Text style={styles.autoCalcText}>
                            {autoCalculateCalories ? "Auto" : "Manual"}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="250"
                      placeholderTextColor="#999"
                      keyboardType="numeric"
                      value={calories}
                      onChangeText={(value) => {
                        // Sanitize input - only allow numbers
                        const sanitized = value.replace(/[^0-9]/g, '');
                        setCalories(sanitized);
                      }}
                      returnKeyType="done"
                      onSubmitEditing={Keyboard.dismiss}
                    />
                    
                    {calories && (
                      <View style={styles.previewContainer}>
                        <Text style={styles.previewText}>Calories: {calories} kcal</Text>
                      </View>
                    )}

                    {/* Date and Time Section */}
                    <Text style={styles.label}>Date & Time</Text>
                    <View style={styles.dateTimeContainer}>
                      <View style={styles.dateTimeRow}>
                        <Ionicons name="calendar-outline" size={20} color="#333" />
                        <TextInput
                          style={styles.dateInput}
                          placeholder="MM/DD/YYYY"
                          placeholderTextColor="#999"
                          value={`${String(workoutDate.getMonth() + 1).padStart(2, '0')}/${String(workoutDate.getDate()).padStart(2, '0')}/${workoutDate.getFullYear()}`}
                          onChangeText={(text) => {
                            const parts = text.split('/');
                            if (parts.length === 3) {
                              const month = parseInt(parts[0]) - 1;
                              const day = parseInt(parts[1]);
                              const year = parseInt(parts[2]);
                              if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
                                const newDate = new Date(workoutDate);
                                newDate.setFullYear(year, month, day);
                                setWorkoutDate(newDate);
                              }
                            }
                          }}
                          keyboardType="numeric"
                          returnKeyType="done"
                        />
                      </View>
                      <View style={styles.dateTimeRow}>
                        <Ionicons name="time-outline" size={20} color="#333" />
                        <TextInput
                          style={styles.dateInput}
                          placeholder="HH:MM"
                          placeholderTextColor="#999"
                          value={`${String(workoutDate.getHours()).padStart(2, '0')}:${String(workoutDate.getMinutes()).padStart(2, '0')}`}
                          onChangeText={(text) => {
                            const parts = text.split(':');
                            if (parts.length === 2) {
                              const hours = parseInt(parts[0]);
                              const minutes = parseInt(parts[1]);
                              if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
                                const newDate = new Date(workoutDate);
                                newDate.setHours(hours, minutes);
                                setWorkoutDate(newDate);
                              }
                            }
                          }}
                          keyboardType="numeric"
                          returnKeyType="done"
                        />
                      </View>
                      <TouchableOpacity 
                        style={styles.resetDateButton}
                        onPress={() => setWorkoutDate(new Date())}
                      >
                        <Ionicons name="refresh" size={16} color="#007AFF" />
                        <Text style={styles.resetDateText}>Reset to Now</Text>
                      </TouchableOpacity>
                    </View>

                    {duration && calories && (
                      <View style={styles.fullPreviewContainer}>
                        <Text style={styles.fullPreviewLabel}>Workout Preview:</Text>
                        <Text style={styles.fullPreviewText}>
                          {selectedType} • {duration} min • {calories} kcal
                        </Text>
                        <Text style={styles.fullPreviewDate}>
                          {workoutDate.toLocaleString()}
                        </Text>
                      </View>
                    )}

                    <Button
                      title="Add Workout"
                      onPress={handleAddWorkout}
                      style={styles.submitButton}
                      disabled={!duration || !calories}
                    />
                    
                    <TouchableOpacity 
                      style={styles.dismissKeyboardButton}
                      onPress={Keyboard.dismiss}
                    >
                      <Ionicons name="chevron-down" size={20} color="#007AFF" />
                      <Text style={styles.dismissKeyboardText}>Hide Keyboard</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  addButton: {
    width: '100%',
  },
  workoutList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#999',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  modalScrollView: {
    flexGrow: 0,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  labelWithToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  autoCalcToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  autoCalcText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
    marginRight: 8,
    marginBottom: 8,
  },
  typeButtonSelected: {
    backgroundColor: '#007AFF',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#666',
  },
  typeButtonTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#F5F5F7',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  previewContainer: {
    backgroundColor: '#E3F2FF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '500',
  },
  submitButton: {
    marginTop: 20,
    marginBottom: 12,
  },
  dismissKeyboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  dismissKeyboardText: {
    fontSize: 16,
    color: '#007AFF',
    marginLeft: 6,
    fontWeight: '500',
  },
  dateTimeContainer: {
    backgroundColor: '#F5F5F7',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    marginBottom: 8,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  resetDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginTop: 8,
    gap: 6,
  },
  resetDateText: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  fullPreviewContainer: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  fullPreviewLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fullPreviewText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '700',
    marginBottom: 4,
  },
  fullPreviewDate: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
});

export default WorkoutScreen;
