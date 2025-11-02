import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CalorieHistoryContext = createContext();

const CALORIE_HISTORY_KEY = '@calorie_history';

export const CalorieHistoryProvider = ({ children }) => {
  const [calorieHistory, setCalorieHistory] = useState([]);
  // Structure: { date: 'YYYY-MM-DD', calories: number, source: 'wifi'|'workout', heartRate: number, duration: number }

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    saveHistory();
  }, [calorieHistory]);

  const loadHistory = async () => {
    try {
      if (!AsyncStorage) {
        console.warn('AsyncStorage not available');
        return;
      }
      const stored = await AsyncStorage.getItem(CALORIE_HISTORY_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setCalorieHistory(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading calorie history:', error);
    }
  };

  const saveHistory = async () => {
    try {
      if (!AsyncStorage) {
        console.warn('AsyncStorage not available');
        return;
      }
      await AsyncStorage.setItem(CALORIE_HISTORY_KEY, JSON.stringify(calorieHistory));
    } catch (error) {
      console.error('Error saving calorie history:', error);
    }
  };

  const addCalorieEntry = async (entry) => {
    try {
      if (!entry || !entry.calories || entry.calories <= 0) {
        console.warn('Invalid calorie entry:', entry);
        return;
      }
      
      const newEntry = {
        ...entry,
        timestamp: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0],
        calories: Math.round(entry.calories), // Ensure integer
      };
      setCalorieHistory(prev => [...prev, newEntry]);
    } catch (error) {
      console.error('Error adding calorie entry:', error);
    }
  };

  const getCaloriesForDate = (date) => {
    const dateStr = typeof date === 'string' ? date : date.toISOString().split('T')[0];
    return calorieHistory
      .filter(entry => entry.date === dateStr)
      .reduce((sum, entry) => sum + entry.calories, 0);
  };

  const getCaloriesForDateRange = (startDate, endDate) => {
    const start = typeof startDate === 'string' ? startDate : startDate.toISOString().split('T')[0];
    const end = typeof endDate === 'string' ? endDate : endDate.toISOString().split('T')[0];
    
    return calorieHistory
      .filter(entry => entry.date >= start && entry.date <= end)
      .reduce((sum, entry) => sum + entry.calories, 0);
  };

  const getDailyCaloriesForWeek = (weekOffset = 0) => {
    try {
      const today = new Date();
      const endDate = new Date(today);
      endDate.setDate(endDate.getDate() - (weekOffset * 7));
      const startDate = new Date(endDate);
      startDate.setDate(startDate.getDate() - 6);

      const dailyData = [];
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const calories = getCaloriesForDate(dateStr);
        dailyData.push({
          label: dateStr,
          value: calories,
          date: dateStr,
          dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        });
      }
      return dailyData;
    } catch (error) {
      console.error('Error getting weekly calories:', error);
      return [];
    }
  };

  const getDailyCaloriesForMonth = (monthOffset = 0) => {
    try {
      const today = new Date();
      const targetDate = new Date(today.getFullYear(), today.getMonth() - monthOffset, 1);
      const year = targetDate.getFullYear();
      const month = targetDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const dailyData = [];

      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toISOString().split('T')[0];
        const calories = getCaloriesForDate(dateStr);
        dailyData.push({
          label: dateStr,
          value: calories,
          date: dateStr,
          day,
        });
      }
      return dailyData;
    } catch (error) {
      console.error('Error getting monthly calories:', error);
      return [];
    }
  };

  const getTodayCalories = () => {
    return getCaloriesForDate(new Date());
  };

  const getWeekCalories = () => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);
    return getCaloriesForDateRange(weekAgo, today);
  };

  const getMonthCalories = () => {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    return getCaloriesForDateRange(monthStart, today);
  };

  const clearHistory = async () => {
    try {
      setCalorieHistory([]);
      if (AsyncStorage) {
        await AsyncStorage.removeItem(CALORIE_HISTORY_KEY);
      }
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  return (
    <CalorieHistoryContext.Provider
      value={{
        calorieHistory,
        addCalorieEntry,
        getCaloriesForDate,
        getCaloriesForDateRange,
        getDailyCaloriesForWeek,
        getDailyCaloriesForMonth,
        getTodayCalories,
        getWeekCalories,
        getMonthCalories,
        clearHistory,
      }}
    >
      {children}
    </CalorieHistoryContext.Provider>
  );
};

export const useCalorieHistory = () => {
  const context = useContext(CalorieHistoryContext);
  if (!context) {
    throw new Error('useCalorieHistory must be used within a CalorieHistoryProvider');
  }
  return context;
};
