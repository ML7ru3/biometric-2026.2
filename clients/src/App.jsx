import React, { useState, useCallback, useEffect } from 'react';
import WebcamCapture from './components/WebcamCapture';
import ResultDisplay from './components/ResultDisplay';
import { useWebSocketClient } from './components/WebSocketClient';
import './App.css';

function App() {
  const [currentPrediction, setCurrentPrediction] = useState(null);
  const [currentConfidence, setCurrentConfidence] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [frameCount, setFrameCount] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // Handle prediction received from WebSocket
  const handlePredictionReceived = useCallback((message) => {
    console.log('Prediction received:', message);
    setCurrentPrediction(message.prediction);
    setCurrentConfidence(message.confidence);
    setIsLoading(false);
    setErrorMessage(null);
  }, []);

  // Handle errors from WebSocket
  const handleErrorReceived = useCallback((message) => {
    console.error('Error received:', message);
    setErrorMessage(message.message || 'Unknown error');
    setIsLoading(false);
  }, []);

  // Handle connection status change
  const handleConnectionStatusChange = useCallback((isConnected) => {
    setConnectionStatus(isConnected ? 'connected' : 'disconnected');
    if (isConnected) {
      setErrorMessage(null);
    }
  }, []);

  // Initialize WebSocket client
  const { isConnected, sendFrame } = useWebSocketClient(
    handlePredictionReceived,
    handleErrorReceived,
    handleConnectionStatusChange
  );

  // Handle frame capture from webcam
  const handleFrameCapture = useCallback(
    (base64ImageData) => {
      if (isConnected && base64ImageData) {
        setIsLoading(true);
        setFrameCount((prev) => prev + 1);
        sendFrame(base64ImageData);
      }
    },
    [isConnected, sendFrame]
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🔐 Face Liveness Detection</h1>
        <div className={`connection-status ${connectionStatus}`}>
          <div className={`status-dot ${connectionStatus}`}></div>
          <span>{connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}</span>
        </div>
      </header>

      <main className="app-main">
        <div className="webcam-section">
          <WebcamCapture
            onFrameCapture={handleFrameCapture}
            isConnected={isConnected}
          />
        </div>

        <div className="result-section">
          <ResultDisplay
            prediction={currentPrediction}
            isLoading={isLoading}
            error={errorMessage}
            confidence={currentConfidence}
          />
        </div>
      </main>

      <footer className="app-footer">
        <div className="debug-info">
          <p>Frames processed: {frameCount}</p>
          <p>Status: {connectionStatus}</p>
          <p>Last prediction: {currentPrediction || 'None'}</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
