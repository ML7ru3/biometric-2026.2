import React, { useRef, useEffect, useState } from 'react';
import Webcam from 'react-webcam';

/**
 * WebcamCapture Component
 * Handles webcam capture and frame extraction at 500ms intervals
 */
export const WebcamCapture = ({ onFrameCapture, isConnected }) => {
  const webcamRef = useRef(null);
  const [hasCamera, setHasCamera] = useState(true);
  const captureIntervalRef = useRef(null);

  useEffect(() => {
    // Request camera permissions
    navigator.mediaDevices
      .getUserMedia({ video: { width: 1080, height: 1920, facingMode: 'user' } })
      .catch(() => {
        setHasCamera(false);
      });
  }, []);

  useEffect(() => {
    // Start capturing frames at 500ms intervals when connected
    if (isConnected && webcamRef.current && hasCamera) {
      captureIntervalRef.current = setInterval(() => {
        const imageSrc = webcamRef.current?.getScreenshot();
        if (imageSrc && onFrameCapture) {
          // Remove data:image/jpeg;base64, prefix to get just the base64 data
          const base64Data = imageSrc.split(',')[1];
          onFrameCapture(base64Data);
        }
      }, 500); // 500ms interval = ~2 fps
    }

    return () => {
      if (captureIntervalRef.current) {
        clearInterval(captureIntervalRef.current);
      }
    };
  }, [isConnected, hasCamera, onFrameCapture]);

  if (!hasCamera) {
    return (
      <div className="webcam-container error">
        <p>Camera access denied. Please allow camera access to continue.</p>
      </div>
    );
  }

  return (
    <div className="webcam-container">
      <Webcam
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
        width={640}
        height={480}
        videoConstraints={{
          width: { ideal: 1080 },
          height: { ideal: 1920 },
          facingMode: 'user',
        }}
      />
      <div className="webcam-status">
        {isConnected ? '🎥 Recording...' : '⏸️ Waiting for connection...'}
      </div>
    </div>
  );
};

export default WebcamCapture;
