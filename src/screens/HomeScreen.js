import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useWorkouts } from '../context/WorkoutContext';
import StatCard from '../components/StatCard';

const HomeScreen = () => {
  const { getTotalStats } = useWorkouts();
  const stats = getTotalStats();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Fitness Tracker</Text>
        <Text style={styles.subtitle}>Track your daily fitness activities</Text>
      </View>

      <View style={styles.statsContainer}>
        <StatCard
          icon="flame"
          title="Total Calories Burned"
          value={stats.totalCalories}
          unit="kcal"
          color="#FF6B35"
        />
        <StatCard
          icon="time"
          title="Total Duration"
          value={stats.totalDuration}
          unit="min"
          color="#007AFF"
        />
        <StatCard
          icon="fitness"
          title="Total Workouts"
          value={stats.totalWorkouts}
          unit="sessions"
          color="#34C759"
        />
        <StatCard
          icon="walk"
          title="Daily Steps"
          value="8,432"
          unit="steps"
          color="#AF52DE"
        />
      </View>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Quick Tips</Text>
        <Text style={styles.tipText}>• Stay hydrated during workouts</Text>
        <Text style={styles.tipText}>• Aim for 30 minutes of activity daily</Text>
        <Text style={styles.tipText}>• Don't forget to warm up and cool down</Text>
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
  statsContainer: {
    paddingHorizontal: 20,
  },
  tipsContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default HomeScreen;
