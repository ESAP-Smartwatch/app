import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { useWorkouts } from '../context/WorkoutContext';
import WorkoutItem from '../components/WorkoutItem';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';

const WorkoutScreen = () => {
  const { workouts, addWorkout, deleteWorkout } = useWorkouts();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState('Running');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');

  const workoutTypes = ['Running', 'Cycling', 'Swimming', 'Gym', 'Yoga', 'Walking'];

  const handleAddWorkout = () => {
    if (duration && calories) {
      addWorkout({
        type: selectedType,
        duration: parseInt(duration),
        calories: parseInt(calories),
      });
      setDuration('');
      setCalories('');
      setModalVisible(false);
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
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Workout</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

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
              keyboardType="numeric"
              value={duration}
              onChangeText={setDuration}
            />

            <Text style={styles.label}>Calories Burned</Text>
            <TextInput
              style={styles.input}
              placeholder="250"
              keyboardType="numeric"
              value={calories}
              onChangeText={setCalories}
            />

            <Button
              title="Add Workout"
              onPress={handleAddWorkout}
              style={styles.submitButton}
              disabled={!duration || !calories}
            />
          </View>
        </View>
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
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
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
  submitButton: {
    marginTop: 20,
  },
});

export default WorkoutScreen;
