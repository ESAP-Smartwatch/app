import React, { createContext, useState, useContext, useEffect } from 'react';

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState([]);
  const [healthData, setHealthData] = useState({
    steps: [],
    hourlySteps: [],
    heartRate: [],
    weight: 70,
    height: 175,
  });

  // Generate comprehensive random test data on startup
  useEffect(() => {
    setWorkouts(generateRandomWorkouts());
    setHealthData({
      steps: generateStepsData(),
      hourlySteps: generateHourlyStepsData(),
      heartRate: generateHeartRateData(),
      weight: Math.floor(60 + Math.random() * 40), // 60-100 kg
      height: Math.floor(160 + Math.random() * 30), // 160-190 cm
    });
  }, []);

  // Generate random workouts for the past 30 days
  function generateRandomWorkouts() {
    const workoutTypes = ['Running', 'Cycling', 'Swimming', 'Gym', 'Yoga', 'Walking'];
    const workouts = [];
    const numWorkouts = Math.floor(25 + Math.random() * 25); // 25-50 workouts over 30 days

    for (let i = 0; i < numWorkouts; i++) {
      const daysAgo = Math.floor(Math.random() * 30); // Past 30 days
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      date.setHours(Math.floor(6 + Math.random() * 14), Math.floor(Math.random() * 60), 0, 0);

      const type = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
      let duration, calories;

      // More realistic workout durations and calorie burns
      switch (type) {
        case 'Running':
          duration = Math.floor(20 + Math.random() * 40); // 20-60 min
          calories = Math.floor(duration * 9); // ~9 cal/min
          break;
        case 'Cycling':
          duration = Math.floor(30 + Math.random() * 45); // 30-75 min
          calories = Math.floor(duration * 7);
          break;
        case 'Swimming':
          duration = Math.floor(20 + Math.random() * 40); // 20-60 min
          calories = Math.floor(duration * 10);
          break;
        case 'Gym':
          duration = Math.floor(30 + Math.random() * 45); // 30-75 min
          calories = Math.floor(duration * 6);
          break;
        case 'Yoga':
          duration = Math.floor(30 + Math.random() * 45); // 30-75 min
          calories = Math.floor(duration * 3);
          break;
        case 'Walking':
          duration = Math.floor(20 + Math.random() * 40); // 20-60 min
          calories = Math.floor(duration * 4);
          break;
        default:
          duration = 30;
          calories = 200;
      }

      workouts.push({
        id: `workout_${i}_${Date.now()}`,
        type,
        duration,
        calories,
        date: date.toISOString(),
      });
    }

    // Sort by date, most recent first
    return workouts.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  // Generate simulated steps data for the past 30 days (daily totals)
  function generateStepsData() {
    const data = [];
    for (let i = 29; i >= 0; i--) { // 30 days of data
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // More realistic step patterns - weekends typically have different patterns
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const baseSteps = isWeekend ? 5000 : 7500;
      const variation = Math.random() * 4000;
      
      data.push({
        date: date.toISOString().split('T')[0],
        steps: Math.floor(baseSteps + variation),
      });
    }
    return data;
  }

  // Generate hourly steps data for the past 30 days
  function generateHourlyStepsData() {
    const data = [];
    const now = new Date();
    
    // Generate data for the past 30 days
    for (let daysAgo = 29; daysAgo >= 0; daysAgo--) {
      const targetDate = new Date();
      targetDate.setDate(now.getDate() - daysAgo);
      
      // For today, only go up to current hour; for past days, full 24 hours
      const maxHour = daysAgo === 0 ? now.getHours() : 23;
      
      for (let hour = 0; hour <= maxHour; hour++) {
        const date = new Date(targetDate);
        date.setHours(hour, 0, 0, 0);
        
        // Simulate realistic hourly step patterns
        let baseSteps;
        if (hour < 6) {
          baseSteps = 0; // Sleep: no steps
        } else if (hour < 8) {
          baseSteps = 200 + Math.random() * 300; // Morning routine: 200-500
        } else if (hour < 12) {
          baseSteps = 400 + Math.random() * 600; // Active morning: 400-1000
        } else if (hour < 14) {
          baseSteps = 300 + Math.random() * 400; // Lunch time: 300-700
        } else if (hour < 18) {
          baseSteps = 500 + Math.random() * 700; // Active afternoon: 500-1200
        } else if (hour < 22) {
          baseSteps = 300 + Math.random() * 500; // Evening: 300-800
        } else {
          baseSteps = 50 + Math.random() * 150; // Pre-sleep: 50-200
        }
        
        data.push({
          time: date.toISOString(),
          steps: Math.round(baseSteps),
        });
      }
    }
    
    return data;
  }

  // Generate simulated heart rate data for the past 30 days (24 hours per day)
  function generateHeartRateData() {
    const data = [];
    const now = new Date();
    
    // Generate data for the past 30 days
    for (let daysAgo = 29; daysAgo >= 0; daysAgo--) {
      const targetDate = new Date();
      targetDate.setDate(now.getDate() - daysAgo);
      
      // For today, only go up to current hour; for past days, full 24 hours
      const maxHour = daysAgo === 0 ? now.getHours() : 23;
      
      for (let hour = 0; hour <= maxHour; hour++) {
        const date = new Date(targetDate);
        date.setHours(hour, 0, 0, 0);
        
        // Simulate realistic heart rate pattern
        let baseRate;
        if (hour < 6) {
          baseRate = 58 + Math.random() * 7; // Sleep: 58-65 BPM
        } else if (hour < 12) {
          baseRate = 68 + Math.random() * 10; // Morning: 68-78 BPM
        } else if (hour < 18) {
          baseRate = 72 + Math.random() * 13; // Afternoon: 72-85 BPM
        } else if (hour < 22) {
          baseRate = 70 + Math.random() * 10; // Evening: 70-80 BPM
        } else {
          baseRate = 62 + Math.random() * 8; // Pre-sleep: 62-70 BPM
        }
        
        data.push({
          time: date.toISOString(),
          bpm: Math.round(baseRate),
        });
      }
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
