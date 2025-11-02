import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

const WiFiHealthContext = createContext();

export const WiFiHealthProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [heartRate, setHeartRate] = useState(null);
  const [spo2, setSpo2] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const pollingIntervalRef = useRef(null);

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
      setHeartRate(data.hr);
      setSpo2(data.spo2);
      setLastUpdate(new Date());

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
    setLastUpdate(null);
  };

  return (
    <WiFiHealthContext.Provider
      value={{
        isConnected,
        heartRate,
        spo2,
        lastUpdate,
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
