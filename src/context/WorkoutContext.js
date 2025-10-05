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

  const addWorkout = (workout) => {
    const newWorkout = {
      ...workout,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setWorkouts([newWorkout, ...workouts]);
  };

  const deleteWorkout = (id) => {
    setWorkouts(workouts.filter((workout) => workout.id !== id));
  };

  const getTotalStats = () => {
    const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
    const totalDuration = workouts.reduce((sum, w) => sum + w.duration, 0);
    const totalWorkouts = workouts.length;

    return {
      totalCalories,
      totalDuration,
      totalWorkouts,
    };
  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        addWorkout,
        deleteWorkout,
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
