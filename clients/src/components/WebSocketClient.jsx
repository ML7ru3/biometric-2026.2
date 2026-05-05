import { useEffect, useRef, useState } from 'react';

/**
 * WebSocketClient Hook
 * Manages WebSocket connection, auto-reconnect, and message handling
 */
export const useWebSocketClient = (
  onPredictionReceived,
  onErrorReceived,
  onConnectionStatusChange
) => {
  const wsRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);
  const heartbeatIntervalRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 16000]; // exponential backoff

  // Initialize WebSocket connection
  const connect = () => {
    try {
      const wsUrl = `ws://localhost:8000/api/anti-spoof/ws`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        reconnectAttemptsRef.current = 0;
        onConnectionStatusChange?.(true);

        // Start heartbeat
        heartbeatIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: 'ping' }));
          }
        }, 10000); // ping every 10 seconds
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);

          if (message.type === 'prediction') {
            onPredictionReceived?.(message);
          } else if (message.type === 'error') {
            onErrorReceived?.(message);
          } else if (message.type === 'pong') {
            // Heartbeat response, do nothing
          }
        } catch (error) {
          console.error('Error parsing message:', error);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        onErrorReceived?.({
          message: 'WebSocket connection error',
          timestamp: Date.now(),
        });
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        onConnectionStatusChange?.(false);

        // Clear heartbeat
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }

        // Attempt reconnect with exponential backoff
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          const delay =
            RECONNECT_DELAYS[
              Math.min(reconnectAttemptsRef.current, RECONNECT_DELAYS.length - 1)
            ];
          console.log(
            `Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current + 1}/${MAX_RECONNECT_ATTEMPTS})`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connect();
          }, delay);
        } else {
          console.error('Max reconnection attempts reached');
          onErrorReceived?.({
            message: 'Failed to reconnect after maximum attempts',
            timestamp: Date.now(),
          });
        }
      };

      wsRef.current = ws;
    } catch (error) {
      console.error('Error creating WebSocket:', error);
      onErrorReceived?.({
        message: 'Failed to create WebSocket connection',
        timestamp: Date.now(),
      });
    }
  };

  // Send prediction request
  const sendFrame = (base64ImageData) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(
          JSON.stringify({
            type: 'predict',
            image: base64ImageData,
            timestamp: Date.now(),
          })
        );
      } catch (error) {
        console.error('Error sending frame:', error);
        onErrorReceived?.({
          message: 'Failed to send frame to server',
          timestamp: Date.now(),
        });
      }
    } else {
      console.warn('WebSocket not connected, frame dropped');
    }
  };

  // Cleanup and disconnect
  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  // Initialize connection on mount
  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, []);

  return {
    isConnected,
    sendFrame,
    disconnect,
  };
};

export default useWebSocketClient;
