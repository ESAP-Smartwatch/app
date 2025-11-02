import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const CalorieBarChart = ({ data, maxValue, height = 200, period = 'week' }) => {
  // Validate inputs
  if (!data || !Array.isArray(data) || data.length === 0) {
    return (
      <View style={[styles.chartContainer, { height }]}>
        <Text style={styles.noDataText}>No data available</Text>
      </View>
    );
  }

  const getBarHeight = (value) => {
    try {
      if (!maxValue || maxValue === 0 || !value || value <= 0) return 0;
      const calculatedHeight = (value / maxValue) * (height - 40);
      return Math.max(0, Math.min(calculatedHeight, height - 40)); // Clamp to valid range
    } catch (error) {
      console.error('Error calculating bar height:', error);
      return 0;
    }
  };

  const formatLabel = (label, period) => {
    try {
      if (period === 'week') {
        // Show day abbreviation (M, T, W, etc.)
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const date = new Date(label);
        if (isNaN(date.getTime())) return '?';
        return days[date.getDay()].charAt(0);
      } else {
        // Show date number for monthly view
        const date = new Date(label);
        if (isNaN(date.getTime())) return '?';
        return date.getDate();
      }
    } catch (error) {
      console.error('Error formatting label:', error);
      return '?';
    }
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={[styles.chartContainer, { height }]}>
        {/* Y-axis labels */}
        <View style={styles.yAxisContainer}>
          <Text style={styles.yAxisLabel}>{maxValue}</Text>
          <Text style={styles.yAxisLabel}>{Math.round(maxValue * 0.5)}</Text>
          <Text style={styles.yAxisLabel}>0</Text>
        </View>

        {/* Bars */}
        <View style={styles.barsContainer}>
          {data.map((item, index) => (
            <View key={index} style={styles.barWrapper}>
              <View style={styles.barContainer}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: getBarHeight(item.value),
                      backgroundColor: item.value > 0 ? '#FF9500' : '#E5E5E5',
                    },
                  ]}
                >
                  {item.value > 0 && (
                    <Text style={styles.barValue}>
                      {Math.round(item.value)}
                    </Text>
                  )}
                </View>
              </View>
              <Text style={styles.barLabel}>
                {formatLabel(item.label, period)}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 10,
  },
  chartContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  yAxisContainer: {
    width: 40,
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  yAxisLabel: {
    fontSize: 10,
    color: '#86868B',
    textAlign: 'right',
  },
  barsContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'flex-end',
    gap: 8,
  },
  barWrapper: {
    alignItems: 'center',
    minWidth: 32,
  },
  barContainer: {
    height: '100%',
    justifyContent: 'flex-end',
    paddingBottom: 20,
  },
  bar: {
    width: 28,
    borderRadius: 4,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 4,
    minHeight: 2,
  },
  barValue: {
    fontSize: 9,
    fontWeight: '600',
    color: '#fff',
  },
  barLabel: {
    fontSize: 10,
    color: '#86868B',
    marginTop: 4,
    fontWeight: '500',
  },
  noDataText: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 80,
  },
});

export default CalorieBarChart;
