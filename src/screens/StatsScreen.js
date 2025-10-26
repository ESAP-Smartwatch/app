import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Dimensions,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useWorkouts } from '../context/WorkoutContext';
import { Ionicons } from '@expo/vector-icons';
import StatCard from '../components/StatCard';
import Button from '../components/Button';
import COLORS from '../theme/colors';

const screenWidth = Dimensions.get('window').width;

const StatsScreen = () => {
  const { workouts, healthData, getTotalStats, addHealthMetric, deleteWorkout } = useWorkouts();
  const stats = getTotalStats();
  
  const [selectedGraph, setSelectedGraph] = useState(null);
  const [showAddDataModal, setShowAddDataModal] = useState(false);
  const [dataType, setDataType] = useState('steps');
  const [dataValue, setDataValue] = useState('');
  const [dataDate, setDataDate] = useState(new Date());
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('day'); // 'day' or 'week'

  // Refs for scrolling to the right (most recent data)
  const stepsScrollRef = useRef(null);
  const heartRateScrollRef = useRef(null);

  // Scroll to the far right when data changes
  useEffect(() => {
    if (selectedGraph) {
      setTimeout(() => {
        if (selectedGraph.type === 'steps' && stepsScrollRef.current && viewMode === 'day') {
          stepsScrollRef.current.scrollToEnd({ animated: false });
        }
        if (selectedGraph.type === 'heartRate' && heartRateScrollRef.current) {
          heartRateScrollRef.current.scrollToEnd({ animated: false });
        }
      }, 100);
    }
  }, [selectedGraph, selectedDate, viewMode]);

  // Helper function to filter data based on selected date and view mode
  const getFilteredStepsData = () => {
    if (viewMode === 'day') {
      // Get hourly data for the selected day only
      const dateStr = selectedDate.toISOString().split('T')[0];
      return healthData.hourlySteps ? healthData.hourlySteps.filter(s => {
        const stepDate = new Date(s.time).toISOString().split('T')[0];
        return stepDate === dateStr;
      }) : [];
    } else {
      // Get daily data for the week ending on selected date
      const endDate = new Date(selectedDate);
      const startDate = new Date(selectedDate);
      startDate.setDate(startDate.getDate() - 6);
      
      return healthData.steps.filter(s => {
        const date = new Date(s.date);
        return date >= startDate && date <= endDate;
      });
    }
  };

  const getFilteredHeartRateData = () => {
    if (viewMode === 'day') {
      // Get heart rate data for the selected day only
      const dateStr = selectedDate.toISOString().split('T')[0];
      return healthData.heartRate.filter(hr => {
        const hrDate = new Date(hr.time).toISOString().split('T')[0];
        return hrDate === dateStr;
      });
    } else {
      // Get heart rate data for the week ending on selected date
      const endDate = new Date(selectedDate);
      endDate.setHours(23, 59, 59, 999);
      const startDate = new Date(selectedDate);
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      
      return healthData.heartRate.filter(hr => {
        const date = new Date(hr.time);
        return date >= startDate && date <= endDate;
      });
    }
  };

  const getFilteredWorkoutsData = () => {
    if (viewMode === 'day') {
      // Get workouts for the selected day only
      const dateStr = selectedDate.toISOString().split('T')[0];
      return workouts.filter(w => {
        const workoutDate = new Date(w.date).toISOString().split('T')[0];
        return workoutDate === dateStr;
      });
    } else {
      // Get workouts for the week ending on selected date
      const endDate = new Date(selectedDate);
      endDate.setHours(23, 59, 59, 999);
      const startDate = new Date(selectedDate);
      startDate.setDate(startDate.getDate() - 6);
      startDate.setHours(0, 0, 0, 0);
      
      return workouts.filter(w => {
        const date = new Date(w.date);
        return date >= startDate && date <= endDate;
      });
    }
  };

  // Get filtered data based on selected date/view mode (for modal only)
  const filteredStepsData = getFilteredStepsData();
  const filteredHeartRateData = getFilteredHeartRateData();
  const filteredWorkoutsData = getFilteredWorkoutsData();

  // Get TODAY's data for main stats page (always show today only)
  const todayStr = new Date().toISOString().split('T')[0];
  const todayHourlySteps = healthData.hourlySteps ? healthData.hourlySteps.filter(s => {
    const stepDate = new Date(s.time).toISOString().split('T')[0];
    return stepDate === todayStr;
  }) : [];
  
  const todayHeartRate = healthData.heartRate ? healthData.heartRate.filter(hr => {
    const hrDate = new Date(hr.time).toISOString().split('T')[0];
    return hrDate === todayStr;
  }) : [];

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

  // Main page chart data (TODAY ONLY - show labels every 4 hours)
  const mainStepsChartData = {
    labels: todayHourlySteps.map((s, index) => {
      const time = new Date(s.time);
      const hours = time.getHours();
      // Only show label every 4 hours (0, 4, 8, 12, 16, 20)
      if (hours % 4 === 0) {
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}${period}`;
      }
      return ''; // Empty string for non-labeled hours
    }),
    datasets: [{
      data: todayHourlySteps.length > 0 ? todayHourlySteps.map(s => s.steps) : [0],
      color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
      strokeWidth: 3,
    }],
  };

  const mainHeartRateChartData = {
    labels: todayHeartRate.map((hr, index) => {
      const time = new Date(hr.time);
      const hours = time.getHours();
      // Only show label every 4 hours (0, 4, 8, 12, 16, 20)
      if (hours % 4 === 0) {
        const period = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours}${period}`;
      }
      return ''; // Empty string for non-labeled hours
    }),
    datasets: [{
      data: todayHeartRate.length > 0 ? todayHeartRate.map(hr => hr.bpm) : [0],
      color: (opacity = 1) => `rgba(255, 45, 85, ${opacity})`,
      strokeWidth: 2,
    }],
  };

  // Modal chart data (filtered by selected date and view mode)
  const stepsChartData = {
    labels: filteredStepsData.map(s => {
      if (viewMode === 'day') {
        // Hourly view - show time every 4 hours
        const time = new Date(s.time);
        const hours = time.getHours();
        if (hours % 4 === 0) {
          const period = hours >= 12 ? 'PM' : 'AM';
          const displayHours = hours % 12 || 12;
          return `${displayHours}${period}`;
        }
        return '';
      } else {
        // Weekly view - show date
        const date = new Date(s.date);
        return `${date.getMonth() + 1}/${date.getDate()}`;
      }
    }),
    datasets: [{
      data: filteredStepsData.length > 0 ? filteredStepsData.map(s => s.steps) : [0],
      color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`, // iOS blue
      strokeWidth: 3,
    }],
  };

  // Improved heart rate chart - make it scrollable with wider width
  const heartRateChartData = {
    labels: filteredHeartRateData.map(hr => {
      const time = new Date(hr.time);
      if (viewMode === 'day') {
        const hours = time.getHours();
        // Show label every 4 hours
        if (hours % 4 === 0) {
          const period = hours >= 12 ? 'PM' : 'AM';
          const displayHours = hours % 12 || 12;
          return `${displayHours}${period}`;
        }
        return '';
      } else {
        return `${time.getMonth() + 1}/${time.getDate()}`;
      }
    }),
    datasets: [{
      data: filteredHeartRateData.length > 0 ? filteredHeartRateData.map(hr => hr.bpm) : [0],
      color: (opacity = 1) => `rgba(255, 45, 85, ${opacity})`, // iOS pink
      strokeWidth: 2,
    }],
  };
  
  // Calculate chart width based on data points (50px per data point for readability)
  const heartRateChartWidth = Math.max(screenWidth - 40, filteredHeartRateData.length * 50);

  const caloriesChartData = {
    labels: filteredWorkoutsData.slice(0, 10).reverse().map((w, i) => {
      const date = new Date(w.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [{
      data: filteredWorkoutsData.length > 0 ? filteredWorkoutsData.slice(0, 10).reverse().map(w => w.calories) : [0],
    }],
  };

  const chartConfig = {
    backgroundGradientFrom: COLORS.surface,
    backgroundGradientTo: COLORS.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(88, 86, 214, ${opacity})`, // iOS purple
    labelColor: (opacity = 1) => `rgba(60, 60, 67, ${opacity})`, // iOS label gray
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: 'rgba(88, 86, 214, 1)', // iOS purple
      fill: '#FFFFFF',
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      strokeWidth: 1,
      stroke: 'rgba(0, 0, 0, 0.05)', // Very subtle grid lines
    },
  };

  const renderExpandedGraph = () => {
    if (!selectedGraph) return null;

    // Helper functions for date navigation
    const goToPreviousDay = () => {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 1);
      setSelectedDate(newDate);
    };

    const goToNextDay = () => {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 1);
      setSelectedDate(newDate);
    };

    const goToPreviousWeek = () => {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() - 7);
      setSelectedDate(newDate);
    };

    const goToNextWeek = () => {
      const newDate = new Date(selectedDate);
      newDate.setDate(newDate.getDate() + 7);
      setSelectedDate(newDate);
    };

    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
      <Modal
        visible={!!selectedGraph}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setSelectedGraph(null)}
      >
        <SafeAreaView style={styles.modalSafeArea} edges={['left', 'right', 'bottom']}>
          {/* Fixed Header positioned well below dynamic island */}
          <View style={styles.fixedModalHeader}>
            <Text style={styles.expandedGraphTitle}>{selectedGraph.title}</Text>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setSelectedGraph(null)}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={36} color="#FF3B30" />
            </TouchableOpacity>
          </View>

          {/* Date Picker Controls */}
          <View style={styles.datePickerContainer}>
            <View style={styles.viewModeToggle}>
              <TouchableOpacity
                style={[styles.viewModeButton, viewMode === 'day' && styles.viewModeButtonActive]}
                onPress={() => setViewMode('day')}
              >
                <Text style={[styles.viewModeText, viewMode === 'day' && styles.viewModeTextActive]}>Day</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.viewModeButton, viewMode === 'week' && styles.viewModeButtonActive]}
                onPress={() => setViewMode('week')}
              >
                <Text style={[styles.viewModeText, viewMode === 'week' && styles.viewModeTextActive]}>Week</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.dateNavigation}>
              <TouchableOpacity 
                style={styles.dateNavButton}
                onPress={viewMode === 'day' ? goToPreviousDay : goToPreviousWeek}
              >
                <Ionicons name="chevron-back" size={24} color="#007AFF" />
              </TouchableOpacity>
              
              <Text style={styles.dateText}>{formatDate(selectedDate)}</Text>
              
              <TouchableOpacity 
                style={styles.dateNavButton}
                onPress={viewMode === 'day' ? goToNextDay : goToNextWeek}
                disabled={selectedDate >= new Date()}
              >
                <Ionicons 
                  name="chevron-forward" 
                  size={24} 
                  color={selectedDate >= new Date() ? '#C7C7CC' : '#007AFF'} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Scrollable Content */}
          <ScrollView 
            style={styles.expandedGraphContent}
            contentContainerStyle={styles.expandedGraphContentContainer}
          >
            {selectedGraph.type === 'steps' && (
              <>
                {viewMode === 'day' ? (
                  // Hourly view - horizontally scrollable
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={true}
                    style={styles.chartScrollContainer}
                    ref={stepsScrollRef}
                  >
                    <LineChart
                      data={stepsChartData}
                      width={Math.max(screenWidth - 40, filteredStepsData.length * 60)}
                      height={300}
                      chartConfig={chartConfig}
                      bezier
                      style={styles.expandedChart}
                    />
                  </ScrollView>
                ) : (
                  // Weekly view - horizontally scrollable for better label spacing
                  <ScrollView 
                    horizontal 
                    showsHorizontalScrollIndicator={true}
                    style={styles.chartScrollContainer}
                  >
                    <LineChart
                      data={stepsChartData}
                      width={Math.max(screenWidth - 40, filteredStepsData.length * 80)}
                      height={300}
                      chartConfig={chartConfig}
                      bezier
                      style={styles.expandedChart}
                    />
                  </ScrollView>
                )}
                <View style={styles.detailsSection}>
                  <Text style={styles.detailsTitle}>
                    {viewMode === 'day' ? 'Hourly Breakdown' : 'Daily Breakdown'}
                  </Text>
                  {filteredStepsData.map((item, index) => (
                    <View key={index} style={styles.detailRow}>
                      <Text style={styles.detailDate}>
                        {viewMode === 'day' 
                          ? new Date(item.time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
                          : new Date(item.date).toLocaleDateString()
                        }
                      </Text>
                      <Text style={styles.detailValue}>{item.steps.toLocaleString()} steps</Text>
                    </View>
                  ))}
                  {filteredStepsData.length > 0 && (
                    <View style={styles.summaryBox}>
                      <Text style={styles.summaryLabel}>
                        {viewMode === 'day' ? 'Total Steps Today' : 'Week Average'}
                      </Text>
                      <Text style={styles.summaryValue}>
                        {viewMode === 'day' 
                          ? filteredStepsData.reduce((sum, d) => sum + d.steps, 0).toLocaleString()
                          : Math.round(filteredStepsData.reduce((sum, d) => sum + d.steps, 0) / filteredStepsData.length).toLocaleString()
                        } steps
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )}

            {selectedGraph.type === 'heartRate' && (
              <>
                {/* Horizontally scrollable heart rate chart with wider width */}
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={true}
                  style={styles.chartScrollContainer}
                  ref={heartRateScrollRef}
                >
                  <LineChart
                    data={heartRateChartData}
                    width={Math.max(screenWidth - 40, filteredHeartRateData.length * 80)} 
                    height={300}
                    chartConfig={{
                      ...chartConfig,
                      color: (opacity = 1) => `rgba(255, 59, 48, ${opacity})`,
                    }}
                    bezier
                    style={styles.expandedChart}
                  />
                </ScrollView>
                <View style={styles.detailsSection}>
                  <Text style={styles.detailsTitle}>
                    {viewMode === 'day' ? 'Heart Rate Summary' : 'Weekly Heart Rate'}
                  </Text>
                  {filteredHeartRateData.length > 0 && (
                    <View style={styles.summaryBox}>
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Average</Text>
                        <Text style={styles.summaryValue}>
                          {Math.round(filteredHeartRateData.reduce((sum, hr) => sum + hr.bpm, 0) / filteredHeartRateData.length)} BPM
                        </Text>
                      </View>
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Minimum</Text>
                        <Text style={styles.summaryValue}>
                          {Math.min(...filteredHeartRateData.map(hr => hr.bpm))} BPM
                        </Text>
                      </View>
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Maximum</Text>
                        <Text style={styles.summaryValue}>
                          {Math.max(...filteredHeartRateData.map(hr => hr.bpm))} BPM
                        </Text>
                      </View>
                    </View>
                  )}
                  {filteredHeartRateData.length === 0 && (
                    <Text style={styles.noDataText}>No heart rate data for this period</Text>
                  )}
                </View>
              </>
            )}

            {selectedGraph.type === 'calories' && filteredWorkoutsData.length > 0 && (
              <>
                <BarChart
                  data={caloriesChartData}
                  width={screenWidth - 40}
                  height={300}
                  chartConfig={{
                    ...chartConfig,
                    color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
                  }}
                  style={styles.expandedChart}
                  showValuesOnTopOfBars
                />
                <View style={styles.detailsSection}>
                  <Text style={styles.detailsTitle}>
                    {viewMode === 'day' ? 'Workouts This Day' : 'Workouts This Week'}
                  </Text>
                  {filteredWorkoutsData.slice(0, 10).map((workout, index) => (
                    <View key={workout.id} style={styles.detailRow}>
                      <View>
                        <Text style={styles.detailType}>{workout.type}</Text>
                        <Text style={styles.detailDate}>
                          {new Date(workout.date).toLocaleDateString()}
                        </Text>
                      </View>
                      <Text style={styles.detailValue}>{workout.calories} kcal</Text>
                    </View>
                  ))}
                  {filteredWorkoutsData.length > 0 && (
                    <View style={styles.summaryBox}>
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Total Calories</Text>
                        <Text style={styles.summaryValue}>
                          {filteredWorkoutsData.reduce((sum, w) => sum + w.calories, 0)} kcal
                        </Text>
                      </View>
                    </View>
                  )}
                </View>
              </>
            )}
            {selectedGraph.type === 'calories' && filteredWorkoutsData.length === 0 && (
              <View style={styles.detailsSection}>
                <Text style={styles.noDataText}>No workouts for this period</Text>
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    );
  };

  const handleAddData = () => {
    const value = parseInt(dataValue);
    if (isNaN(value) || value <= 0) {
      Alert.alert('Invalid Value', 'Please enter a valid positive number');
      return;
    }

    addHealthMetric(dataType, value, dataDate);
    setDataValue('');
    setDataDate(new Date());
    setShowAddDataModal(false);
    Alert.alert('Success', 'Health data added successfully');
  };

  const handleDeleteWorkout = (id) => {
    Alert.alert(
      'Delete Workout',
      'Are you sure you want to delete this workout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteWorkout(id);
            Alert.alert('Success', 'Workout deleted');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Health & Fitness</Text>
        <Text style={styles.headerSubtitle}>Your wellness at a glance</Text>
      </View>

      {/* Quick Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowAddDataModal(true)}
        >
          <Ionicons name="add-circle" size={24} color="#5856D6" />
          <Text style={styles.actionButtonText}>Add Data</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => setShowManageModal(true)}
        >
          <Ionicons name="create" size={24} color="#007AFF" />
          <Text style={styles.actionButtonText}>Manage</Text>
        </TouchableOpacity>
      </View>

      {/* Today's Summary */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Ionicons name="walk" size={32} color="#007AFF" />
            <Text style={styles.summaryCardValue}>{stats.todaySteps.toLocaleString()}</Text>
            <Text style={styles.summaryCardLabel}>Steps</Text>
          </View>
          <View style={styles.summaryCard}>
            <Ionicons name="heart" size={32} color="#FF2D55" />
            <Text style={styles.summaryCardValue}>{stats.avgHeartRate}</Text>
            <Text style={styles.summaryCardLabel}>Avg BPM</Text>
          </View>
          <View style={styles.summaryCard}>
            <Ionicons name="flame" size={32} color="#FF9500" />
            <Text style={styles.summaryCardValue}>{stats.totalCalories}</Text>
            <Text style={styles.summaryCardLabel}>Calories</Text>
          </View>
        </View>
      </View>

      {/* Steps Chart */}
      <View style={styles.section}>
        <View style={styles.chartHeader}>
          <Text style={styles.sectionTitle}>Steps</Text>
          <TouchableOpacity 
            onPress={() => setSelectedGraph({ type: 'steps', title: 'Steps Analysis' })}
          >
            <Ionicons name="expand" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          onPress={() => setSelectedGraph({ type: 'steps', title: 'Steps Analysis' })}
          activeOpacity={0.8}
        >
          <LineChart
            data={mainStepsChartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
        </TouchableOpacity>
      </View>

      {/* Heart Rate Chart */}
      <View style={styles.section}>
        <View style={styles.chartHeader}>
          <Text style={styles.sectionTitle}>Heart Rate</Text>
          <TouchableOpacity 
            onPress={() => setSelectedGraph({ type: 'heartRate', title: 'Heart Rate Analysis' })}
          >
            <Ionicons name="expand" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          onPress={() => setSelectedGraph({ type: 'heartRate', title: 'Heart Rate Analysis' })}
          activeOpacity={0.8}
        >
          <LineChart
            data={mainHeartRateChartData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(255, 45, 85, ${opacity})`, // iOS pink
                propsForDots: {
                  r: '5',
                  strokeWidth: '2',
                  stroke: 'rgba(255, 45, 85, 1)',
                  fill: '#FFFFFF',
                },
              }}
              bezier
              style={styles.chart}
              withHorizontalLabels={true}
              withVerticalLabels={true}
              fromZero={false}
            />
        </TouchableOpacity>
      </View>

      {/* Calories Burned Chart */}
      {workouts.length > 0 && (
        <View style={styles.section}>
          <View style={styles.chartHeader}>
            <Text style={styles.sectionTitle}>Calories Burned (Recent)</Text>
            <TouchableOpacity 
              onPress={() => setSelectedGraph({ type: 'calories', title: 'Calories Analysis' })}
            >
              <Ionicons name="expand" size={24} color="#007AFF" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            onPress={() => setSelectedGraph({ type: 'calories', title: 'Calories Analysis' })}
            activeOpacity={0.8}
          >
            <BarChart
              data={caloriesChartData}
              width={screenWidth - 40}
              height={220}
              chartConfig={{
                ...chartConfig,
                color: (opacity = 1) => `rgba(255, 149, 0, ${opacity})`, // iOS orange
              }}
              style={styles.chart}
              showValuesOnTopOfBars
            />
          </TouchableOpacity>
        </View>
      )}

      {/* Overall Statistics */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Overall Statistics</Text>
        <StatCard
          icon="flame"
          title="Total Calories Burned"
          value={stats.totalCalories}
          unit="kcal"
          color="#FF9500"
        />
        <StatCard
          icon="time"
          title="Total Workout Time"
          value={stats.totalDuration}
          unit="min"
          color="#5856D6"
        />
        <StatCard
          icon="fitness"
          title="Total Workouts"
          value={stats.totalWorkouts}
          unit="sessions"
          color="#007AFF"
        />
      </View>

      {/* Workout Types */}
      {Object.keys(workoutBreakdown).length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Workout Types</Text>
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

      {/* Add Data Modal */}
      <Modal
        visible={showAddDataModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddDataModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Add Health Data</Text>
                  <TouchableOpacity onPress={() => setShowAddDataModal(false)}>
                    <Ionicons name="close" size={28} color="#333" />
                  </TouchableOpacity>
                </View>

                <ScrollView 
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ paddingBottom: 20 }}
                >
                  <Text style={styles.label}>Data Type</Text>
                  <View style={styles.dataTypeButtons}>
                    {['steps', 'heartRate', 'weight', 'height'].map((type) => (
                      <TouchableOpacity
                        key={type}
                        style={[
                          styles.dataTypeButton,
                          dataType === type && styles.dataTypeButtonSelected,
                        ]}
                        onPress={() => setDataType(type)}
                      >
                        <Text
                          style={[
                            styles.dataTypeButtonText,
                            dataType === type && styles.dataTypeButtonTextSelected,
                          ]}
                        >
                          {type === 'heartRate' ? 'Heart Rate' : type.charAt(0).toUpperCase() + type.slice(1)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  <Text style={styles.label}>
                    Value {dataType === 'heartRate' ? '(BPM)' : dataType === 'weight' ? '(kg)' : dataType === 'height' ? '(cm)' : ''}
                  </Text>
                  <TextInput
                    style={styles.input}
                    placeholder={dataType === 'steps' ? '10000' : dataType === 'heartRate' ? '72' : dataType === 'weight' ? '70' : '175'}
                    placeholderTextColor="#999"
                    keyboardType="numeric"
                    value={dataValue}
                    onChangeText={setDataValue}
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                  />

                  {/* Date and Time Section */}
                  <Text style={styles.label}>Date & Time</Text>
                  <View style={styles.dateTimeContainer}>
                    <View style={styles.dateTimeRow}>
                      <Ionicons name="calendar-outline" size={20} color={COLORS.text} />
                      <TextInput
                        style={styles.dateInput}
                        placeholder="MM/DD/YYYY"
                        placeholderTextColor="#999"
                        value={`${String(dataDate.getMonth() + 1).padStart(2, '0')}/${String(dataDate.getDate()).padStart(2, '0')}/${dataDate.getFullYear()}`}
                        onChangeText={(text) => {
                          const parts = text.split('/');
                          if (parts.length === 3) {
                            const month = parseInt(parts[0]) - 1;
                            const day = parseInt(parts[1]);
                            const year = parseInt(parts[2]);
                            if (!isNaN(month) && !isNaN(day) && !isNaN(year)) {
                              const newDate = new Date(dataDate);
                              newDate.setFullYear(year, month, day);
                              setDataDate(newDate);
                            }
                          }
                        }}
                        keyboardType="numeric"
                        returnKeyType="done"
                      />
                    </View>
                    <View style={styles.dateTimeRow}>
                      <Ionicons name="time-outline" size={20} color={COLORS.text} />
                      <TextInput
                        style={styles.dateInput}
                        placeholder="HH:MM"
                        placeholderTextColor="#999"
                        value={`${String(dataDate.getHours()).padStart(2, '0')}:${String(dataDate.getMinutes()).padStart(2, '0')}`}
                        onChangeText={(text) => {
                          const parts = text.split(':');
                          if (parts.length === 2) {
                            const hours = parseInt(parts[0]);
                            const minutes = parseInt(parts[1]);
                            if (!isNaN(hours) && !isNaN(minutes) && hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
                              const newDate = new Date(dataDate);
                              newDate.setHours(hours, minutes);
                              setDataDate(newDate);
                            }
                          }
                        }}
                        keyboardType="numeric"
                        returnKeyType="done"
                      />
                    </View>
                    <TouchableOpacity 
                      style={styles.resetDateButton}
                      onPress={() => setDataDate(new Date())}
                    >
                      <Ionicons name="refresh" size={16} color="#007AFF" />
                      <Text style={styles.resetDateText}>Reset to Now</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Preview Box */}
                  {dataValue && (
                    <View style={styles.previewBox}>
                      <Text style={styles.previewLabel}>Preview:</Text>
                      <Text style={styles.previewValue}>
                        {dataValue} {dataType === 'heartRate' ? 'BPM' : dataType === 'weight' ? 'kg' : dataType === 'height' ? 'cm' : 'steps'}
                      </Text>
                      <Text style={styles.previewDate}>
                        {dataDate.toLocaleString()}
                      </Text>
                    </View>
                  )}

                  <TouchableOpacity 
                    style={styles.hideKeyboardButton}
                    onPress={Keyboard.dismiss}
                  >
                    <Ionicons name="chevron-down" size={20} color="#007AFF" />
                    <Text style={styles.hideKeyboardText}>Hide Keyboard</Text>
                  </TouchableOpacity>

                  <Button
                    title="Add Data"
                    onPress={handleAddData}
                    style={styles.submitButton}
                    disabled={!dataValue}
                  />
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>

      {/* Manage Data Modal */}
      <Modal
        visible={showManageModal}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setShowManageModal(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
          <View style={styles.manageContainer}>
            <View style={styles.manageHeader}>
              <Text style={styles.manageTitle}>Manage Workouts</Text>
            </View>

            {/* Floating Close Button */}
            <TouchableOpacity 
              style={styles.floatingCloseButton}
              onPress={() => setShowManageModal(false)}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>

            <ScrollView style={styles.manageContent}>
            {workouts.length === 0 ? (
              <Text style={styles.emptyText}>No workouts to manage</Text>
            ) : (
              workouts.map((workout) => (
                <View key={workout.id} style={styles.manageItem}>
                  <View style={styles.manageItemInfo}>
                    <Text style={styles.manageItemType}>{workout.type}</Text>
                    <Text style={styles.manageItemDetails}>
                      {workout.duration} min • {workout.calories} kcal
                    </Text>
                    <Text style={styles.manageItemDate}>
                      {new Date(workout.date).toLocaleString()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteWorkout(workout.id)}
                  >
                    <Ionicons name="trash" size={24} color="#FF3B30" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </ScrollView>
        </View>
        </SafeAreaView>
      </Modal>

      {renderExpandedGraph()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: COLORS.surface,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '400',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 6,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3C3C43',
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  chartScrollView: {
    marginVertical: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryCardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 8,
    letterSpacing: -0.5,
  },
  summaryCardLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  breakdownCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  breakdownType: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '600',
  },
  breakdownCount: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '700',
  },
  expandedGraphContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 60, // Add significant top padding to clear dynamic island
  },
  fixedModalHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    position: 'relative',
  },
  expandedGraphTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  modalCloseButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
    backgroundColor: 'transparent',
    borderRadius: 22,
  },
  datePickerContainer: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  viewModeToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  viewModeButtonActive: {
    backgroundColor: '#007AFF',
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  viewModeTextActive: {
    color: '#FFFFFF',
  },
  dateNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateNavButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: COLORS.background,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  chartScrollContainer: {
    marginVertical: 8,
  },
  floatingCloseButton: {
    position: 'absolute',
    top: 10,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `rgba(240, 81, 56, 0.9)`,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  expandedGraphContent: {
    flex: 1,
    padding: 20,
  },
  expandedChart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  detailsSection: {
    marginTop: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  noDataText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    paddingVertical: 20,
    fontStyle: 'italic',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  detailDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  detailType: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  detailValue: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '700',
  },
  summaryBox: {
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.primary,
    letterSpacing: -0.3,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: COLORS.overlay,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
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
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 12,
  },
  dataTypeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  dataTypeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: COLORS.surfaceSecondary,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  dataTypeButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dataTypeButtonText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  dataTypeButtonTextSelected: {
    color: COLORS.surface,
    fontWeight: '600',
  },
  input: {
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
  },
  submitButton: {
    marginTop: 20,
  },
  manageContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  manageHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  manageTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  manageContent: {
    flex: 1,
    padding: 20,
  },
  manageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: COLORS.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  manageItemInfo: {
    flex: 1,
  },
  manageItemType: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  manageItemDetails: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
    fontWeight: '500',
  },
  manageItemDate: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
  },
  emptyText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 40,
    fontWeight: '500',
  },
  dateTimeContainer: {
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.text,
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
  previewBox: {
    backgroundColor: COLORS.primary + '15',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
  },
  previewLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  previewValue: {
    fontSize: 20,
    color: COLORS.text,
    fontWeight: '700',
    marginBottom: 4,
  },
  previewDate: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  hideKeyboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 12,
    backgroundColor: COLORS.surfaceSecondary,
    borderRadius: 12,
    gap: 8,
  },
  hideKeyboardText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default StatsScreen;
