import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../theme/colors';

const GoalSettingsScreen = ({ navigation }) => {
  const [dailySteps, setDailySteps] = useState('10000');
  const [weeklyWorkouts, setWeeklyWorkouts] = useState('5');
  const [dailyCalories, setDailyCalories] = useState('500');
  const [weeklyDistance, setWeeklyDistance] = useState('25');

  const GoalCard = ({ icon, title, value, unit, onChange, iconColor }) => (
    <View style={styles.goalCard}>
      <View style={styles.goalHeader}>
        <View style={[styles.iconCircle, { backgroundColor: iconColor + '20' }]}>
          <Ionicons name={icon} size={24} color={iconColor} />
        </View>
        <Text style={styles.goalTitle}>{title}</Text>
      </View>
      <View style={styles.goalInput}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          keyboardType="numeric"
          placeholder="0"
        />
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Set Your Daily & Weekly Goals</Text>
          <Text style={styles.infoText}>
            Stay motivated by setting achievable fitness goals. We'll help you track your progress.
          </Text>
        </View>

        <View style={styles.goalsSection}>
          <Text style={styles.sectionTitle}>Daily Goals</Text>
          
          <GoalCard
            icon="footsteps"
            title="Steps"
            value={dailySteps}
            unit="steps"
            onChange={setDailySteps}
            iconColor="#007AFF"
          />

          <GoalCard
            icon="flame"
            title="Calories Burned"
            value={dailyCalories}
            unit="kcal"
            onChange={setDailyCalories}
            iconColor="#FF9F0A"
          />
        </View>

        <View style={styles.goalsSection}>
          <Text style={styles.sectionTitle}>Weekly Goals</Text>
          
          <GoalCard
            icon="fitness"
            title="Workouts"
            value={weeklyWorkouts}
            unit="workouts"
            onChange={setWeeklyWorkouts}
            iconColor="#30D158"
          />

          <GoalCard
            icon="map"
            title="Distance"
            value={weeklyDistance}
            unit="km"
            onChange={setWeeklyDistance}
            iconColor="#5856D6"
          />
        </View>

        <View style={styles.tipCard}>
          <Ionicons name="star" size={24} color="#FFD60A" />
          <Text style={styles.tipText}>
            Tip: Start with achievable goals and gradually increase them as you build your fitness level.
          </Text>
        </View>
      </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 20,
  },
  infoCard: {
    backgroundColor: '#30D158',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 20,
  },
  goalsSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },
  goalCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  goalInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 24,
    fontWeight: '700',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  unit: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginLeft: 12,
  },
  tipCard: {
    backgroundColor: '#FFF9E6',
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: COLORS.text,
    lineHeight: 20,
  },
});

export default GoalSettingsScreen;
