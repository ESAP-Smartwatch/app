import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useWorkouts } from '../context/WorkoutContext';
import { useWiFiHealth } from '../context/WiFiHealthContext';
import { useCalorieHistory } from '../context/CalorieHistoryContext';
import StatCard from '../components/StatCard';
import LineChart from '../components/LineChart';
import { CONTENT_PADDING, CARD_MARGIN, getContainerStyle, getResponsiveFontSize } from '../utils/responsive';

const HomeScreen = ({ navigation }) => {
  const { getTotalStats } = useWorkouts();
  const stats = getTotalStats();
  const { 
    isConnected, 
    heartRate, 
    spo2, 
    lis3dh, 
    steps, 
    lastUpdate,
    heartRateHistory,
    sessionCalories 
  } = useWiFiHealth();
  const { getTodayCalories } = useCalorieHistory();
  
  const [todayCalories, setTodayCalories] = useState(0);

  useEffect(() => {
    const loadTodayCalories = async () => {
      try {
        const calories = await getTodayCalories();
        setTodayCalories(calories || 0);
      } catch (error) {
        console.error('Error loading today calories:', error);
        setTodayCalories(0);
      }
    };
    
    loadTodayCalories();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadTodayCalories, 30000);
    return () => clearInterval(interval);
  }, [getTodayCalories]);

  // Parse accelerometer data
  const parseAccelerometer = (lis3dhString) => {
    try {
      if (!lis3dhString) return { x: 0, y: 0, z: 0 };
      const match = lis3dhString.match(/X:(-?\d+)\s+Y:(-?\d+)\s+Z:(-?\d+)/);
      if (match) {
        return {
          x: parseInt(match[1]) || 0,
          y: parseInt(match[2]) || 0,
          z: parseInt(match[3]) || 0
        };
      }
      return { x: 0, y: 0, z: 0 };
    } catch (error) {
      console.error('Error parsing accelerometer data:', error);
      return { x: 0, y: 0, z: 0 };
    }
  };

  const accelData = parseAccelerometer(lis3dh);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.welcomeSection}>
        <Text style={styles.title}>Fitness Summary</Text>
        <Text style={styles.subtitle}>Your daily activity overview</Text>
      </View>

      {isConnected && (
        <>
          {/* Live Health Metrics Grid */}
          <View style={styles.liveMetricsContainer}>
            <Text style={styles.sectionTitle}>Live Health Data</Text>
            
            <View style={styles.metricsGrid}>
              {/* Heart Rate */}
              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Ionicons name="heart" size={20} color="#FF3B30" />
                  <View style={styles.liveIndicator}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE</Text>
                  </View>
                </View>
                <Text style={styles.metricValue}>{heartRate ?? '--'}</Text>
                <Text style={styles.metricUnit}>BPM</Text>
                <Text style={styles.metricLabel}>Heart Rate</Text>
              </View>

              {/* SpO2 */}
              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Ionicons name="water" size={20} color="#007AFF" />
                  <View style={styles.liveIndicator}>
                    <View style={[styles.liveDot, { backgroundColor: '#007AFF' }]} />
                    <Text style={[styles.liveText, { color: '#007AFF' }]}>LIVE</Text>
                  </View>
                </View>
                <Text style={[styles.metricValue, { color: '#007AFF' }]}>{spo2 ?? '--'}</Text>
                <Text style={styles.metricUnit}>%</Text>
                <Text style={styles.metricLabel}>Blood Oxygen</Text>
              </View>

              {/* Steps */}
              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Ionicons name="footsteps" size={20} color="#34C759" />
                  <View style={styles.liveIndicator}>
                    <View style={[styles.liveDot, { backgroundColor: '#34C759' }]} />
                    <Text style={[styles.liveText, { color: '#34C759' }]}>LIVE</Text>
                  </View>
                </View>
                <Text style={[styles.metricValue, { color: '#34C759' }]}>{steps ?? '--'}</Text>
                <Text style={styles.metricUnit}>steps</Text>
                <Text style={styles.metricLabel}>Step Count</Text>
              </View>

              {/* Accelerometer Magnitude */}
              <View style={styles.metricCard}>
                <View style={styles.metricHeader}>
                  <Ionicons name="pulse" size={20} color="#FF9500" />
                  <View style={styles.liveIndicator}>
                    <View style={[styles.liveDot, { backgroundColor: '#FF9500' }]} />
                    <Text style={[styles.liveText, { color: '#FF9500' }]}>LIVE</Text>
                  </View>
                </View>
                <Text style={[styles.metricValue, { color: '#FF9500', fontSize: 24 }]}>
                  {Math.round(Math.sqrt(accelData.x ** 2 + accelData.y ** 2 + accelData.z ** 2))}
                </Text>
                <Text style={styles.metricUnit}>g</Text>
                <Text style={styles.metricLabel}>Acceleration</Text>
              </View>
            </View>

            {/* Accelerometer Details */}
            <View style={styles.accelerometerCard}>
              <View style={styles.accelerometerHeader}>
                <Ionicons name="hardware-chip" size={20} color="#666" />
                <Text style={styles.accelerometerTitle}>LIS3DH Accelerometer</Text>
              </View>
              <View style={styles.accelerometerGrid}>
                <View style={styles.accelAxis}>
                  <Text style={styles.accelAxisLabel}>X-Axis</Text>
                  <Text style={styles.accelAxisValue}>{accelData.x}</Text>
                </View>
                <View style={styles.accelAxis}>
                  <Text style={styles.accelAxisLabel}>Y-Axis</Text>
                  <Text style={styles.accelAxisValue}>{accelData.y}</Text>
                </View>
                <View style={styles.accelAxis}>
                  <Text style={styles.accelAxisLabel}>Z-Axis</Text>
                  <Text style={styles.accelAxisValue}>{accelData.z}</Text>
                </View>
              </View>
            </View>

            {/* Heart Rate Trend Chart */}
            {heartRateHistory.length > 1 && (
              <View style={styles.chartCard}>
                <Text style={styles.chartTitle}>Heart Rate Trend</Text>
                <LineChart
                  data={heartRateHistory}
                  color="#FF3B30"
                  height={180}
                />
              </View>
            )}

            {lastUpdate && (
              <Text style={styles.lastUpdateText}>
                Last updated: {lastUpdate.toLocaleTimeString()}
              </Text>
            )}
          </View>

          {/* Today's Calories Section */}
          <View style={styles.caloriesSection}>
            <Text style={styles.sectionTitle}>Today's Calories</Text>
            
            <View style={styles.caloriesCard}>
              <View style={styles.calorieMainContainer}>
                <Ionicons name="flame" size={40} color="#FF9500" />
                <View style={styles.calorieMainInfo}>
                  <Text style={styles.calorieMainValue}>
                    {Math.round(todayCalories || 0)}
                  </Text>
                  <Text style={styles.calorieMainLabel}>Total Calories</Text>
                </View>
              </View>

              {isConnected && (
                <View style={styles.calorieBreakdown}>
                  <View style={styles.calorieBreakdownItem}>
                    <View style={styles.calorieBreakdownIconContainer}>
                      <Ionicons name="wifi" size={16} color="#007AFF" />
                    </View>
                    <View style={styles.calorieBreakdownInfo}>
                      <Text style={styles.calorieBreakdownValue}>
                        {Math.round(sessionCalories || 0)}
                      </Text>
                      <Text style={styles.calorieBreakdownLabel}>Live Session</Text>
                    </View>
                  </View>

                  <View style={styles.calorieBreakdownItem}>
                    <View style={styles.calorieBreakdownIconContainer}>
                      <Ionicons name="fitness" size={16} color="#34C759" />
                    </View>
                    <View style={styles.calorieBreakdownInfo}>
                      <Text style={styles.calorieBreakdownValue}>
                        {Math.round(Math.max(0, (todayCalories || 0) - (sessionCalories || 0)))}
                      </Text>
                      <Text style={styles.calorieBreakdownLabel}>Workouts</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        </>
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
    paddingHorizontal: CONTENT_PADDING.horizontal,
    paddingTop: CONTENT_PADDING.top,
    paddingBottom: CONTENT_PADDING.vertical,
    backgroundColor: '#fff',
    marginBottom: CARD_MARGIN,
    marginTop: 0,
    ...getContainerStyle(),
  },
  title: {
    fontSize: getResponsiveFontSize(32),
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: getResponsiveFontSize(15),
    color: '#86868B',
  },
  liveMetricsContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1D1D1F',
    marginBottom: 12,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricCard: {
    backgroundColor: '#fff',
    width: '48%',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFE5E5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FF3B30',
    marginRight: 3,
  },
  liveText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FF3B30',
    letterSpacing: 0.5,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FF3B30',
    marginBottom: 2,
  },
  metricUnit: {
    fontSize: 12,
    color: '#86868B',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#1D1D1F',
  },
  accelerometerCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accelerometerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  accelerometerTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1D1D1F',
    marginLeft: 8,
  },
  accelerometerGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  accelAxis: {
    alignItems: 'center',
  },
  accelAxisLabel: {
    fontSize: 12,
    color: '#86868B',
    marginBottom: 4,
  },
  accelAxisValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  chartCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1D1D1F',
    marginBottom: 12,
  },
  lastUpdateText: {
    fontSize: 11,
    color: '#86868B',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  caloriesSection: {
    padding: 20,
  },
  caloriesCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  calorieMainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  calorieMainInfo: {
    marginLeft: 16,
  },
  calorieMainValue: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FF9500',
  },
  calorieMainLabel: {
    fontSize: 14,
    color: '#86868B',
    marginTop: 2,
  },
  calorieBreakdown: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
    paddingTop: 16,
    gap: 16,
  },
  calorieBreakdownItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  calorieBreakdownIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F5F5F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  calorieBreakdownInfo: {
    flex: 1,
  },
  calorieBreakdownValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1D1D1F',
  },
  calorieBreakdownLabel: {
    fontSize: 11,
    color: '#86868B',
    marginTop: 2,
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
