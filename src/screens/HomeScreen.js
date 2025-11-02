import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWorkouts } from '../context/WorkoutContext';
import { useWiFiHealth } from '../context/WiFiHealthContext';
import StatCard from '../components/StatCard';

const HomeScreen = ({ navigation }) => {
  const { getTotalStats } = useWorkouts();
  const stats = getTotalStats();
  const { isConnected, heartRate, lastUpdate } = useWiFiHealth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.welcomeSection}>
        <Text style={styles.title}>Fitness Summary</Text>
        <Text style={styles.subtitle}>Your daily activity overview</Text>
      </View>

      {isConnected && heartRate && (
        <View style={styles.heartRateWidget}>
          <View style={styles.heartRateHeader}>
            <View style={styles.heartRateIconContainer}>
              <Ionicons name="heart" size={24} color="#FF3B30" />
            </View>
            <View style={styles.heartRateInfo}>
              <Text style={styles.heartRateLabel}>Current Heart Rate</Text>
              <Text style={styles.heartRateSubtitle}>Live from ESP32C3</Text>
            </View>
            <View style={styles.liveIndicator}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
          <View style={styles.heartRateDisplay}>
            <Text style={styles.heartRateValue}>{heartRate}</Text>
            <Text style={styles.heartRateUnit}>BPM</Text>
          </View>
          {lastUpdate && (
            <Text style={styles.lastUpdateText}>
              Updated {lastUpdate.toLocaleTimeString()}
            </Text>
          )}
        </View>
      )}

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
        <Text style={styles.tipsTitle}>Quick Tips</Text>
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
  welcomeSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    marginBottom: 16,
    marginTop: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#86868B',
  },
  heartRateWidget: {
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
    borderLeftWidth: 4,
    borderLeftColor: '#FF3B30',
  },
  heartRateHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  heartRateIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  heartRateInfo: {
    flex: 1,
  },
  heartRateLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 2,
  },
  heartRateSubtitle: {
    fontSize: 12,
    color: '#86868B',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF3B30',
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FF3B30',
    letterSpacing: 0.5,
  },
  heartRateDisplay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  heartRateValue: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FF3B30',
  },
  heartRateUnit: {
    fontSize: 18,
    fontWeight: '600',
    color: '#86868B',
    marginLeft: 8,
  },
  lastUpdateText: {
    fontSize: 11,
    color: '#86868B',
    textAlign: 'center',
    marginTop: 4,
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
