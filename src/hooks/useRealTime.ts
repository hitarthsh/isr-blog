'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface RealTimeData {
  timestamp: string;
  type: string;
  data: {
    activeUsers: number;
    totalViews: number;
    newPosts: number;
    notifications: Array<{
      id: string;
      type: string;
      title: string;
      message: string;
      timestamp: string;
    }>;
  };
}

interface UseRealTimeOptions {
  interval?: number;
  enabled?: boolean;
  onUpdate?: (data: RealTimeData) => void;
}

export function useRealTime(options: UseRealTimeOptions = {}) {
  const {
    interval = 30000, // 30 seconds
    enabled = true,
    onUpdate,
  } = options;

  const [data, setData] = useState<RealTimeData | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchRealTimeData = useCallback(async () => {
    if (!enabled) return;

    try {
      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      
      const response = await fetch('/api/websocket?type=general', {
        signal: abortControllerRef.current.signal,
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const realTimeData: RealTimeData = await response.json();
      
      setData(realTimeData);
      setIsConnected(true);
      setError(null);
      setLastUpdate(new Date());
      
      if (onUpdate) {
        onUpdate(realTimeData);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled, don't update error state
        return;
      }
      
      console.error('Real-time data fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsConnected(false);
    }
  }, [enabled, onUpdate]);

  const startPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Initial fetch
    fetchRealTimeData();

    // Set up polling
    intervalRef.current = setInterval(fetchRealTimeData, interval);
  }, [fetchRealTimeData, interval]);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const reconnect = useCallback(() => {
    stopPolling();
    setError(null);
    startPolling();
  }, [stopPolling, startPolling]);

  // Start/stop polling based on enabled state
  useEffect(() => {
    if (enabled) {
      startPolling();
    } else {
      stopPolling();
    }

    return () => {
      stopPolling();
    };
  }, [enabled, startPolling, stopPolling]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
    };
  }, [stopPolling]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      if (enabled) {
        reconnect();
      }
    };

    const handleOffline = () => {
      setIsConnected(false);
      setError('Connection lost - you are offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [enabled, reconnect]);

  return {
    data,
    isConnected,
    error,
    lastUpdate,
    reconnect,
    startPolling,
    stopPolling,
  };
}
