# Face Liveness Detection - React Client

Real-time face liveness detection with WebSocket streaming. Shows whether a face is "Live" or "Spoof" (fake/spoofed).

## Features

✅ **Real-time Webcam Capture** - 1080p webcam at 30fps, frame extraction every 500ms  
✅ **WebSocket Streaming** - Efficient base64 frame transmission to server  
✅ **Binary Verdict Display** - Large green ✓ (Live) or red ✗ (Spoof) result  
✅ **Auto-Reconnect** - Exponential backoff reconnection strategy  
✅ **Error Handling** - Automatic retry on failures, user-friendly error messages  
✅ **Connection Status Indicator** - Real-time connection status with visual feedback  
✅ **Debug Info** - Frame count, connection status, and last prediction in footer  

## Prerequisites

- **Node.js** v16+ (download from https://nodejs.org/)
- **npm** or **yarn** package manager
- **FastAPI Server** running on `http://localhost:8000` with WebSocket endpoint at `/api/anti-spoof/ws`

## Installation

1. **Install Dependencies**

```bash
cd clients
npm install
```

This will install:
- React 18
- React DOM 18
- React Webcam 7
- Vite 4 (dev server)

## Development

Start the development server on `http://localhost:3000`:

```bash
npm run dev
```

The browser will open automatically. When prompted, **allow camera access**.

### Expected Behavior

1. **Connection**: Watch the header status indicator turn green when connected to backend
2. **Webcam**: Video preview appears on the left side
3. **Streaming**: Frames automatically sent every ~500ms when connected
4. **Results**: Verdict appears on the right:
   - **Green ✓ LIVE** - Real face detected, not spoofed
   - **Red ✗ SPOOF** - Fake/spoofed face detected (printed photo, screen, mask, etc.)
5. **Debug Info**: Bottom footer shows frame count, connection status, and last prediction

## Message Protocol

### Client → Server

```json
{
  "type": "predict",
  "image": "<base64_encoded_jpeg_image>",
  "timestamp": <milliseconds_since_epoch>
}
```

Frame rate: ~2 frames/sec (500ms interval)

### Server → Client

```json
{
  "type": "prediction",
  "prediction": "Live" | "Spoof",
  "confidence": <float_0_to_1>,
  "probabilities": {
    "Spoof": <float>,
    "Live": <float>
  },
  "timestamp": <milliseconds>
}
```

### Errors

```json
{
  "type": "error",
  "message": "<error_description>",
  "timestamp": <milliseconds>
}
```

## Configuration

Edit `src/components/WebSocketClient.jsx` to change:

- **WebSocket URL**: Line ~12 — `ws://localhost:8000/api/anti-spoof/ws`
- **Frame Capture Interval**: `src/components/WebcamCapture.jsx` line ~32 — currently `500ms`
- **Webcam Resolution**: `src/components/WebcamCapture.jsx` line ~55 — currently `1080×1920` capture, `640×480` display

## Troubleshooting

### Camera Permission Denied

- **Check browser permission**: Go to browser settings → Camera → Allow this site
- **Clear cache**: Ctrl+Shift+Delete → Clear browsing data → Cookies and cached images

### WebSocket Connection Failed

- **Check backend**: Ensure FastAPI server is running on `http://localhost:8000`
- **Check CORS**: Backend should have CORS middleware configured for `http://localhost:3000`
- **Browser console**: Open DevTools (F12) → Console tab → check for error messages

### No Predictions Appearing

1. Check **Connection Status** indicator (top-right)
2. Open **Browser DevTools** (F12) → **Network** tab → **WS** (WebSocket)
3. Look for messages being sent (green arrow up) and received (green arrow down)
4. If no messages: backend may not be receiving frames
5. If messages sent but no response: backend model may have an error

### Predictions Always Show "Spoof"

- Ensure lighting is good and face is clearly visible
- Move closer to camera
- Ensure webcam captures face properly in preview

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder. Deploy to a static hosting service like:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## Project Structure

```
clients/
├── public/
│   └── index.html              # HTML entry point
├── src/
│   ├── components/
│   │   ├── WebcamCapture.jsx   # Webcam frame capture logic
│   │   ├── WebSocketClient.jsx # WebSocket connection manager
│   │   └── ResultDisplay.jsx   # Result verdict display
│   ├── App.jsx                 # Main orchestrator component
│   ├── App.css                 # App styling
│   ├── index.jsx               # React entry point
│   └── index.css               # Global styles
├── package.json                # Dependencies
├── vite.config.js              # Vite dev server config
├── .gitignore
└── README.md                   # This file
```

## Key Components

### WebcamCapture.jsx

Handles webcam access and frame capture:
- Requests camera permissions via `navigator.mediaDevices.getUserMedia()`
- Captures frames at 500ms intervals using `Webcam.getScreenshot()`
- Encodes frames to base64 for WebSocket transmission
- Shows status: "🎥 Recording..." or "⏸️ Waiting for connection..."

### WebSocketClient.jsx (Hook)

`useWebSocketClient()` hook manages WebSocket lifecycle:
- Auto-connect on mount to `ws://localhost:8000/api/anti-spoof/ws`
- **Heartbeat**: Sends ping every 10 seconds to detect stale connections
- **Auto-Reconnect**: Exponential backoff delays: 1s → 2s → 4s → 8s → 16s
- **Max Retries**: 5 reconnection attempts before giving up
- **Error Handling**: Structured error messages and recovery

### ResultDisplay.jsx

Displays prediction results:
- **Live**: Green ✓ badge (face is real)
- **Spoof**: Red ✗ badge (face is fake/spoofed)
- Shows confidence percentage (0-100%)
- Shows loading spinner during processing
- Shows error messages if prediction fails

### App.jsx

Main orchestrator:
- State management for predictions, errors, connection status
- Bridges WebcamCapture → WebSocketClient → ResultDisplay
- Displays debug info (frame count, connection, last prediction)
- Responsive layout: webcam on left, results on right

## Performance Targets

- **Frame-to-Result Latency**: <1 second (typically 200-500ms)
- **Frame Rate**: ~2 frames/sec (500ms interval)
- **Bandwidth**: ~50-100 KB/sec per stream
- **Backend CPU**: Model prediction <200ms per frame

## Future Enhancements

- [ ] Database logging of predictions
- [ ] Multi-device support with session management
- [ ] Confidence threshold adjustment UI
- [ ] Historical prediction analytics
- [ ] TLS/SSL support for production
- [ ] Mobile app version (React Native)

## Support

For issues:
1. Check browser console (F12)
2. Check backend server logs
3. Verify WebSocket connection in Network tab
4. Ensure CORS is properly configured
