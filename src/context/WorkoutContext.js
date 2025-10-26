import React, { createContext, useState, useContext } from 'react';

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([
    {
      id: '1',
      type: 'Running',
      duration: 30,
      calories: 300,
      date: new Date().toISOString(),
    },
    {
      id: '2',
      type: 'Gym',
      duration: 45,
      calories: 250,
      date: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  // Health metrics data
  const [healthData, setHealthData] = useState({
    steps: generateStepsData(),
    heartRate: generateHeartRateData(),
    weight: 70, // kg
    height: 175, // cm
  });

  // Generate simulated steps data for the past 7 days
  function generateStepsData() {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      data.push({
        date: date.toISOString().split('T')[0],
        steps: Math.floor(5000 + Math.random() * 7000),
      });
    }
    return data;
  }

  // Generate simulated heart rate data for today
  function generateHeartRateData() {
    const data = [];
    const now = new Date();
    for (let i = 0; i < 24; i++) {
      const time = new Date(now);
      time.setHours(i, 0, 0, 0);
      // Simulate heart rate pattern (lower at night, higher during day)
      const baseRate = i < 6 || i > 22 ? 60 : 75;
      const variation = Math.random() * 20;
      data.push({
        time: time.toISOString(),
        bpm: Math.round(baseRate + variation),
      });
    }
    return data;
  }

  const addWorkout = (workout) => {
    const newWorkout = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      ...workout,
    };
    setWorkouts([newWorkout, ...workouts]);
  };

  const updateWorkout = (id, updatedData) => {
    setWorkouts(workouts.map(workout => 
      workout.id === id ? { ...workout, ...updatedData } : workout
    ));
  };

  const deleteWorkout = (id) => {
    setWorkouts(workouts.filter((workout) => workout.id !== id));
  };

  const addHealthMetric = (type, value, date = new Date()) => {
    if (type === 'steps') {
      const dateStr = date.toISOString().split('T')[0];
      setHealthData(prev => ({
        ...prev,
        steps: [...prev.steps.filter(s => s.date !== dateStr), { date: dateStr, steps: value }]
          .sort((a, b) => new Date(a.date) - new Date(b.date)),
      }));
    } else if (type === 'heartRate') {
      const timeStr = date.toISOString();
      setHealthData(prev => ({
        ...prev,
        heartRate: [...prev.heartRate, { time: timeStr, bpm: value }]
          .sort((a, b) => new Date(a.time) - new Date(b.time)),
      }));
    } else if (type === 'weight' || type === 'height') {
      setHealthData(prev => ({
        ...prev,
        [type]: value,
      }));
    }
  };

  const getTotalStats = () => {
    const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
    const totalWorkouts = workouts.length;

    // Get today's steps
    const today = new Date().toISOString().split('T')[0];
    const todaySteps = healthData.steps.find(s => s.date === today)?.steps || 0;

    // Get average heart rate for today
    const avgHeartRate = healthData.heartRate.length > 0
      ? Math.round(healthData.heartRate.reduce((sum, hr) => sum + hr.bpm, 0) / healthData.heartRate.length)
      : 0;

    return {
      totalCalories,
      totalDuration,
      totalWorkouts,
      todaySteps,
      avgHeartRate,
    };
  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        healthData,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        addHealthMetric,
        getTotalStats,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};

export const useWorkouts = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error('useWorkouts must be used within a WorkoutProvider');
  }
  return context;
};
