import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfileContext = createContext();

const USER_PROFILE_KEY = '@user_profile';

export const UserProfileProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState({
    gender: 'male', // 'male' or 'female'
    age: 25,
    weight: 70, // kg
    restingHeartRate: 60,
    vo2Max: null, // Will be calculated or manually entered
    vo2MaxManual: false, // Whether user manually set VO2 max
  });

  // Load profile from storage on mount
  useEffect(() => {
    loadProfile();
  }, []);

  // Save profile to storage whenever it changes
  useEffect(() => {
    saveProfile();
  }, [userProfile]);

  const loadProfile = async () => {
    try {
      if (!AsyncStorage) {
        console.warn('AsyncStorage not available');
        return;
      }
      const storedProfile = await AsyncStorage.getItem(USER_PROFILE_KEY);
      if (storedProfile) {
        const parsed = JSON.parse(storedProfile);
        setUserProfile(parsed);
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const saveProfile = async () => {
    try {
      if (!AsyncStorage) {
        console.warn('AsyncStorage not available');
        return;
      }
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(userProfile));
    } catch (error) {
      console.error('Error saving user profile:', error);
    }
  };

  const updateProfile = (updates) => {
    setUserProfile(prev => ({ ...prev, ...updates }));
  };

  const calculateVO2Max = (heartRateHistory = null) => {
    try {
      const { age, restingHeartRate } = userProfile;
      
      // Validation
      if (!age || age <= 0 || age > 120) return '0';
      if (!restingHeartRate || restingHeartRate <= 0 || restingHeartRate > 200) return '0';
      
      let maxHeartRate;
      
      // If we have actual heart rate history, use the max observed HR
      if (heartRateHistory && Array.isArray(heartRateHistory) && heartRateHistory.length > 0) {
        const hrValues = heartRateHistory.map(item => item.value || item).filter(v => v > 0);
        if (hrValues.length > 0) {
          maxHeartRate = Math.max(...hrValues);
          // Sanity check - if observed max is unrealistically high or low, fall back to formula
          if (maxHeartRate < 100 || maxHeartRate > 220) {
            maxHeartRate = 220 - age;
          }
        } else {
          maxHeartRate = 220 - age;
        }
      } else {
        // Fall back to age-predicted max heart rate
        maxHeartRate = 220 - age;
      }
      
      // VO2 Max estimation using heart rate ratio method
      // Based on the relationship between HR reserve and VO2 max
      const vo2Max = 15.3 * (maxHeartRate / restingHeartRate);
      
      // Ensure reasonable range (10-100 ml/kg/min)
      const clampedVO2 = Math.max(10, Math.min(100, vo2Max));
      return clampedVO2.toFixed(2);
    } catch (error) {
      if (__DEV__) console.error('Error calculating VO2 Max:', error);
      return '0';
    }
  };

  const autoCalculateVO2Max = (heartRateHistory = null) => {
    if (!userProfile.vo2MaxManual) {
      const calculated = calculateVO2Max(heartRateHistory);
      updateProfile({ vo2Max: parseFloat(calculated) });
    }
  };

  // Calculate calories burned based on heart rate data
  const calculateCaloriesBurned = (durationMinutes, averageHeartRate, useVO2 = true) => {
    try {
      const { gender, age, weight, vo2Max } = userProfile;
      
      // Validate inputs
      if (!durationMinutes || durationMinutes <= 0) return 0;
      if (!averageHeartRate || averageHeartRate <= 0) return 0;
      if (!age || age <= 0) return 0;
      if (!weight || weight <= 0) return 0;
      
      let caloriesBurned = 0;

      if (useVO2 && vo2Max && vo2Max > 0) {
        // Using VO2 max formula
        if (gender === 'female') {
          caloriesBurned = durationMinutes * 
            (0.45 * averageHeartRate + 0.380 * vo2Max + 0.103 * weight + 0.274 * age - 59.3954) / 4.184;
        } else {
          caloriesBurned = durationMinutes * 
            (0.634 * averageHeartRate + 0.404 * vo2Max + 0.394 * weight + 0.271 * age - 95.7735) / 4.184;
        }
      } else {
        // Without VO2 max
        if (gender === 'female') {
          caloriesBurned = durationMinutes * 
            (0.4472 * averageHeartRate - 0.1263 * weight + 0.074 * age - 20.4022) / 4.184;
        } else {
          caloriesBurned = durationMinutes * 
            (0.6309 * averageHeartRate + 0.1988 * weight + 0.2017 * age - 55.0969) / 4.184;
        }
      }

      return Math.max(0, Math.round(caloriesBurned)); // Ensure non-negative and rounded
    } catch (error) {
      if (__DEV__) console.error('Error calculating calories:', error);
      return 0;
    }
  };

  return (
    <UserProfileContext.Provider
      value={{
        profile: userProfile, // Alias for consistency
        userProfile,
        updateProfile,
        calculateVO2Max,
        autoCalculateVO2Max,
        calculateCaloriesBurned,
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};
