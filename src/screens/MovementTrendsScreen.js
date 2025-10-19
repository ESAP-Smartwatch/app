import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { useWorkouts } from '../context/WorkoutContext';

const screenWidth = Dimensions.get('window').width;

const MovementTrendsScreen = () => {
  const { workouts } = useWorkouts();
  const [timeRange, setTimeRange] = useState('week'); // week, month, year

  // Generate mock movement data for visualization
  const generateMovementData = () => {
    const today = new Date();
    const data = [];
    
    if (timeRange === 'week') {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toLocaleDateString('en-US', { weekday: 'short' }),
          steps: Math.floor(Math.random() * 5000) + 6000,
          calories: Math.floor(Math.random() * 300) + 200,
          distance: (Math.random() * 3 + 2).toFixed(1),
          activeMinutes: Math.floor(Math.random() * 40) + 30,
        });
      }
    } else if (timeRange === 'month') {
      for (let i = 29; i >= 0; i -= 5) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          steps: Math.floor(Math.random() * 7000) + 5000,
          calories: Math.floor(Math.random() * 400) + 250,
          distance: (Math.random() * 4 + 2).toFixed(1),
          activeMinutes: Math.floor(Math.random() * 50) + 40,
        });
      }
    } else {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      for (let i = 11; i >= 0; i--) {
        const monthIndex = (today.getMonth() - i + 12) % 12;
        data.push({
          date: months[monthIndex],
          steps: Math.floor(Math.random() * 150000) + 100000,
          calories: Math.floor(Math.random() * 8000) + 6000,
          distance: (Math.random() * 80 + 60).toFixed(1),
          activeMinutes: Math.floor(Math.random() * 1000) + 800,
        });
      }
    }
    
    return data;
  };

  const movementData = generateMovementData();

  const chartConfig = {
    backgroundColor: '#007AFF',
    backgroundGradientFrom: '#007AFF',
    backgroundGradientTo: '#0051D5',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#fff',
    },
  };

  const renderTimeRangeSelector = () => (
    <View style={styles.timeRangeContainer}>
      {['week', 'month', 'year'].map((range) => (
        <TouchableOpacity
          key={range}
          style={[
            styles.timeRangeButton,
            timeRange === range && styles.timeRangeButtonActive,
          ]}
          onPress={() => setTimeRange(range)}
        >
          <Text
            style={[
              styles.timeRangeText,
              timeRange === range && styles.timeRangeTextActive,
            ]}
          >
            {range.charAt(0).toUpperCase() + range.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderMetricCard = (icon, title, value, unit, color, trend) => (
    <View style={[styles.metricCard, { borderLeftColor: color }]}>
      <View style={styles.metricHeader}>
        <Ionicons name={icon} size={24} color={color} />
        <View style={styles.trendContainer}>
          <Ionicons
            name={trend > 0 ? 'trending-up' : 'trending-down'}
            size={16}
            color={trend > 0 ? '#34C759' : '#FF3B30'}
          />
          <Text
            style={[
              styles.trendText,
              { color: trend > 0 ? '#34C759' : '#FF3B30' },
            ]}
          >
            {Math.abs(trend)}%
          </Text>
        </View>
      </View>
      <Text style={styles.metricTitle}>{title}</Text>
      <View style={styles.metricValueContainer}>
        <Text style={styles.metricValue}>{value}</Text>
        <Text style={styles.metricUnit}> {unit}</Text>
      </View>
    </View>
  );

  const avgSteps = Math.round(
    movementData.reduce((sum, d) => sum + d.steps, 0) / movementData.length
  );
  const avgCalories = Math.round(
    movementData.reduce((sum, d) => sum + d.calories, 0) / movementData.length
  );
  const totalDistance = movementData
    .reduce((sum, d) => sum + parseFloat(d.distance), 0)
    .toFixed(1);
  const avgActiveMinutes = Math.round(
    movementData.reduce((sum, d) => sum + d.activeMinutes, 0) / movementData.length
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Movement Trends</Text>
        <Text style={styles.subtitle}>Track your daily activity patterns</Text>
      </View>

      {renderTimeRangeSelector()}

      {/* Summary Cards */}
      <View style={styles.metricsGrid}>
        {renderMetricCard('walk', 'Avg Steps', avgSteps.toLocaleString(), 'steps', '#007AFF', 8)}
        {renderMetricCard('flame', 'Avg Calories', avgCalories.toLocaleString(), 'kcal', '#FF6B35', 12)}
        {renderMetricCard('map', 'Total Distance', totalDistance, 'km', '#34C759', 5)}
        {renderMetricCard('time', 'Avg Active', avgActiveMinutes, 'min', '#AF52DE', 15)}
      </View>

      {/* Steps Chart */}
      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <Ionicons name="walk" size={20} color="#007AFF" />
          <Text style={styles.chartTitle}>Daily Steps</Text>
        </View>
        <LineChart
          data={{
            labels: movementData.map((d) => d.date),
            datasets: [
              {
                data: movementData.map((d) => d.steps),
              },
            ],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
          withDots={true}
          withInnerLines={false}
          withOuterLines={true}
          withVerticalLabels={true}
          withHorizontalLabels={true}
          fromZero={false}
        />
      </View>

      {/* Calories Chart */}
      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <Ionicons name="flame" size={20} color="#FF6B35" />
          <Text style={styles.chartTitle}>Calories Burned</Text>
        </View>
        <BarChart
          data={{
            labels: movementData.map((d) => d.date),
            datasets: [
              {
                data: movementData.map((d) => d.calories),
              },
            ],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            ...chartConfig,
            backgroundGradientFrom: '#FF6B35',
            backgroundGradientTo: '#FF8C5A',
          }}
          style={styles.chart}
          withInnerLines={false}
          showBarTops={false}
          fromZero={true}
        />
      </View>

      {/* Active Minutes Chart */}
      <View style={styles.chartSection}>
        <View style={styles.chartHeader}>
          <Ionicons name="time" size={20} color="#AF52DE" />
          <Text style={styles.chartTitle}>Active Minutes</Text>
        </View>
        <LineChart
          data={{
            labels: movementData.map((d) => d.date),
            datasets: [
              {
                data: movementData.map((d) => d.activeMinutes),
              },
            ],
          }}
          width={screenWidth - 40}
          height={220}
          chartConfig={{
            ...chartConfig,
            backgroundGradientFrom: '#AF52DE',
            backgroundGradientTo: '#C77DFF',
          }}
          bezier
          style={styles.chart}
          withDots={true}
          withInnerLines={false}
          fromZero={false}
        />
      </View>

      {/* Insights Section */}
      <View style={styles.insightsSection}>
        <Text style={styles.sectionTitle}>Insights</Text>
        <View style={styles.insightCard}>
          <View style={styles.insightIconContainer}>
            <Ionicons name="bulb" size={24} color="#FF9500" />
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Great progress!</Text>
            <Text style={styles.insightText}>
              You're averaging {avgSteps.toLocaleString()} steps per day. Keep up the good work!
            </Text>
          </View>
        </View>
        <View style={styles.insightCard}>
          <View style={styles.insightIconContainer}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
          </View>
          <View style={styles.insightContent}>
            <Text style={styles.insightTitle}>Goal Achievement</Text>
            <Text style={styles.insightText}>
              You've been active for an average of {avgActiveMinutes} minutes daily.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomPadding} />
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
  timeRangeContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  timeRangeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  timeRangeButtonActive: {
    backgroundColor: '#007AFF',
  },
  timeRangeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  timeRangeTextActive: {
    color: '#fff',
  },
  metricsGrid: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  metricCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  metricTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  metricValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  metricUnit: {
    fontSize: 16,
    color: '#666',
  },
  chartSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  chart: {
    borderRadius: 16,
  },
  insightsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  insightCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FFF3E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  insightText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  bottomPadding: {
    height: 20,
  },
});

export default MovementTrendsScreen;
