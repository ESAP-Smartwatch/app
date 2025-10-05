import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const WorkoutItem = ({ workout, onDelete }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getWorkoutIcon = (type) => {
    const icons = {
      'Running': 'walk',
      'Cycling': 'bicycle',
      'Swimming': 'water',
      'Gym': 'barbell',
      'Yoga': 'body',
      'Walking': 'walk-outline',
    };
    return icons[type] || 'fitness';
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={getWorkoutIcon(workout.type)} size={24} color="#007AFF" />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.type}>{workout.type}</Text>
        <Text style={styles.details}>
          {workout.duration} min • {workout.calories} cal
        </Text>
        <Text style={styles.date}>{formatDate(workout.date)}</Text>
      </View>
      {onDelete && (
        <TouchableOpacity onPress={() => onDelete(workout.id)} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
  },
  type: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#999',
  },
  deleteButton: {
    padding: 8,
  },
});

export default WorkoutItem;
