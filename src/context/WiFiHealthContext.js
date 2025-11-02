import React, { createContext, useState, useContext, useRef, useEffect } from 'react';
import { useUserProfile } from './UserProfileContext';
import { useCalorieHistory } from './CalorieHistoryContext';

const WiFiHealthContext = createContext();

export const WiFiHealthProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [heartRate, setHeartRate] = useState(null);
  const [spo2, setSpo2] = useState(null);
  const [lis3dh, setLis3dh] = useState(null);
  const [steps, setSteps] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  // Historical data for graphs (keep last 40 readings)
  const [heartRateHistory, setHeartRateHistory] = useState([]);
  const [spo2History, setSpo2History] = useState([]);
  const [stepsHistory, setStepsHistory] = useState([]);
  
  // Calorie tracking
  const [sessionCalories, setSessionCalories] = useState(0);
  const lastCalorieLogRef = useRef(null);
  
  const pollingIntervalRef = useRef(null);
  const MAX_HISTORY_POINTS = 40;
  
  const { profile, calculateCaloriesBurned } = useUserProfile();
  const { addCalorieEntry } = useCalorieHistory();

  const ESP32_IP = '192.168.4.1';
  const READINGS_ENDPOINT = `http://${ESP32_IP}/readings`;

  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  const fetchHealthData = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(READINGS_ENDPOINT, {
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Validate data
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid data format');
      }
      
      const timestamp = new Date();
      
      // Set values with validation
      setHeartRate(data.hr && data.hr > 0 ? data.hr : null);
      setSpo2(data.spo2 && data.spo2 >= 0 && data.spo2 <= 100 ? data.spo2 : null);
      setLis3dh(data.lis3dh || null);
      setSteps(data.steps && data.steps >= 0 ? data.steps : null);
      setLastUpdate(timestamp);

      // Update history arrays (only if values are valid)
      if (data.hr && data.hr > 0) {
        setHeartRateHistory(prev => {
          const newHistory = [...prev, { value: data.hr, time: timestamp }];
          return newHistory.slice(-MAX_HISTORY_POINTS);
        });
      }

      if (data.spo2 && data.spo2 >= 0 && data.spo2 <= 100) {
        setSpo2History(prev => {
          const newHistory = [...prev, { value: data.spo2, time: timestamp }];
          return newHistory.slice(-MAX_HISTORY_POINTS);
        });
      }

      if (data.steps && data.steps >= 0) {
        setStepsHistory(prev => {
          const newHistory = [...prev, { value: data.steps, time: timestamp }];
          return newHistory.slice(-MAX_HISTORY_POINTS);
        });
      }

      // Calculate and log calories every 60 seconds if profile is complete
      if (profile.age && profile.weight && profile.gender && data.hr > 0) {
        const now = Date.now();
        if (!lastCalorieLogRef.current || (now - lastCalorieLogRef.current) >= 60000) {
          // Calculate calories for 1 minute
          const calories = calculateCaloriesBurned(1, data.hr);
          
          if (calories > 0) {
            await addCalorieEntry({
              calories,
              source: 'wifi',
              heartRate: data.hr,
              duration: 1, // 1 minute
            });
            
            setSessionCalories(prev => prev + calories);
            lastCalorieLogRef.current = now;
          }
        }
      }

      return true;
    } catch (error) {
      console.error('Error fetching health data:', error);
      return false;
    }
  };

  const connect = async () => {
    const success = await fetchHealthData();
    if (success) {
      setIsConnected(true);
      pollingIntervalRef.current = setInterval(fetchHealthData, 1000);
    }
    return success;
  };

  const disconnect = () => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
    setIsConnected(false);
    setHeartRate(null);
    setSpo2(null);
    setLis3dh(null);
    setSteps(null);
    setLastUpdate(null);
    setHeartRateHistory([]);
    setSpo2History([]);
    setStepsHistory([]);
    setSessionCalories(0);
    lastCalorieLogRef.current = null;
  };

  return (
    <WiFiHealthContext.Provider
      value={{
        isConnected,
        heartRate,
        spo2,
        lis3dh,
        steps,
        lastUpdate,
        heartRateHistory,
        spo2History,
        stepsHistory,
        sessionCalories,
        connect,
        disconnect,
        fetchHealthData,
      }}
    >
      {children}
    </WiFiHealthContext.Provider>
  );
};

export const useWiFiHealth = () => {
  const context = useContext(WiFiHealthContext);
  if (!context) {
    throw new Error('useWiFiHealth must be used within a WiFiHealthProvider');
  }
  return context;
};
