import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { useWorkouts } from '../context/WorkoutContext';
import StatCard from '../components/StatCard';

const StatsScreen = () => {
  const { workouts, getTotalStats } = useWorkouts();
  const stats = getTotalStats();

  // Calculate workout type breakdown
  const workoutBreakdown = workouts.reduce((acc, workout) => {
    acc[workout.type] = (acc[workout.type] || 0) + 1;
    return acc;
  }, {});

  // Calculate average values
  const avgCalories = workouts.length > 0
    ? Math.round(stats.totalCalories / workouts.length)
    : 0;
  const avgDuration = workouts.length > 0
    ? Math.round(stats.totalDuration / workouts.length)
    : 0;

  // Get recent workout streak
  const streak = workouts.length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Overall Statistics</Text>
        <StatCard
          icon="flame"
          title="Total Calories Burned"
          value={stats.totalCalories}
          unit="kcal"
          color="#FF6B35"
        />
        <StatCard
          icon="time"
          title="Total Workout Time"
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
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📈 Averages</Text>
        <StatCard
          icon="analytics"
          title="Average Calories per Workout"
          value={avgCalories}
          unit="kcal"
          color="#FF9500"
        />
        <StatCard
          icon="timer"
          title="Average Duration"
          value={avgDuration}
          unit="min"
          color="#5856D6"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🏆 Achievements</Text>
        <View style={styles.achievementCard}>
          <Text style={styles.achievementEmoji}>🔥</Text>
          <Text style={styles.achievementTitle}>Workout Streak</Text>
          <Text style={styles.achievementValue}>{streak} workouts logged</Text>
        </View>
      </View>

      {Object.keys(workoutBreakdown).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💪 Workout Types</Text>
          <View style={styles.breakdownCard}>
            {Object.entries(workoutBreakdown).map(([type, count]) => (
              <View key={type} style={styles.breakdownRow}>
                <Text style={styles.breakdownType}>{type}</Text>
                <Text style={styles.breakdownCount}>{count} sessions</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.motivationSection}>
        <Text style={styles.motivationText}>
          "The only bad workout is the one that didn't happen!"
        </Text>
        <Text style={styles.motivationAuthor}>- Unknown</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  achievementCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  achievementValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  breakdownCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  breakdownType: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  breakdownCount: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  motivationSection: {
    backgroundColor: '#007AFF',
    margin: 20,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  motivationText: {
    fontSize: 18,
    color: '#fff',
    fontStyle: 'italic',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  motivationAuthor: {
    fontSize: 14,
    color: '#E3F2FF',
  },
});

export default StatsScreen;
