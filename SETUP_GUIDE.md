# WebSocket Face Liveness Detection - Setup Guide

Complete guide to run both backend (FastAPI) and frontend (React) for real-time face liveness detection.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│ React Frontend (localhost:3000)                             │
│ ├─ WebcamCapture: Captures webcam frames every 500ms       │
│ ├─ WebSocketClient: Sends base64 frames via WebSocket       │
│ └─ ResultDisplay: Shows Live ✓ or Spoof ✗ verdict          │
└──────────────────────┬──────────────────────────────────────┘
                       │
                   WebSocket
                   (JSON frames)
                       │
┌──────────────────────▼──────────────────────────────────────┐
│ FastAPI Backend (localhost:8000)                            │
│ ├─ CORS Middleware: Allow frontend origin                   │
│ ├─ WebSocket Endpoint: /api/anti-spoof/ws                   │
│ ├─ AntiSpoofModel: EfficientNet-B3 (PyTorch)               │
│ └─ Response: Prediction + confidence + probabilities        │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start (5 minutes)

### Terminal 1: Start FastAPI Backend

```bash
cd services
source .venv/Scripts/activate    # Windows with venv
# OR
conda activate biometric-2026.2  # If using conda

# Install new dependencies
pip install websockets

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Expected output:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

### Terminal 2: Start React Frontend

```bash
cd clients

# First time only: install dependencies
npm install

# Start dev server
npm run dev
```

**Expected output:**
```
VITE v4.3.9  ready in 123 ms

➜  Local:   http://localhost:3000/
➜  Press h to show help
```

Browser will open at `http://localhost:3000` → **Allow camera access**

## Detailed Setup

### Backend Setup

#### 1. Check Python Environment

```bash
cd services

# Activate virtual environment
source .venv/Scripts/activate        # Windows
source .venv/bin/activate            # macOS/Linux
conda activate biometric-2026.2      # Conda users

# Verify Python version (should be 3.8+)
python --version
```

#### 2. Install WebSocket Support

```bash
pip install websockets
# Verify
pip list | grep websockets
```

#### 3. Verify Model File

```bash
# Check if model weights exist
ls model/eff_b3_final.pth

# If missing, model will fall back to None (dev mode)
# Backend will return HTTP 503 if model not loaded
```

#### 4. Start Backend Server

```bash
uvicorn app.main:app --reload
```

This will:
- Load FastAPI app from `app/main.py`
- Enable CORS for `http://localhost:3000`
- Start WebSocket listener on `/api/anti-spoof/ws`
- Auto-reload on code changes (--reload flag)

#### 5. Test Backend

```bash
# In another terminal
curl http://localhost:8000/
# Should return: {"messages": "Welcome to your FastAPI Project!"}
```

---

### Frontend Setup

#### 1. Install Node.js Dependencies

```bash
cd clients
npm install
```

This installs:
- React 18.2.0
- React DOM 18.2.0
- React Webcam 7.1.0
- Vite 4.3.9 (dev server)
- @vitejs/plugin-react 4.0.0

#### 2. Start Development Server

```bash
npm run dev
```

This will:
- Start Vite dev server on `http://localhost:3000`
- Open browser automatically
- Enable hot module replacement (HMR) for code changes

#### 3. Grant Camera Permissions

When browser opens, you'll see a permission prompt:
- Click **Allow** to enable camera access
- If you accidentally block it, go to browser settings → Camera → Allow localhost:3000

---

## Verification Checklist

### ✅ Backend

- [ ] Server running on `http://localhost:8000`
- [ ] GET `http://localhost:8000/` returns welcome message
- [ ] CORS middleware loaded (check terminal logs)
- [ ] WebSocket listener ready on `/api/anti-spoof/ws`

### ✅ Frontend

- [ ] React app running on `http://localhost:3000`
- [ ] Camera permission granted
- [ ] Webcam preview visible on left side
- [ ] "Waiting for connection..." status in webcam box

### ✅ Connection

- [ ] Status indicator in header turns **green** (Connected)
- [ ] Debug footer shows: `Status: connected`
- [ ] No console errors (F12 → Console tab)

### ✅ Real-time Predictions

1. Show a printed photo of a face to webcam → Should see **Red ✗ SPOOF**
2. Show your real face → Should see **Green ✓ LIVE**
3. Check debug footer: `Frames processed: N` (should increase every 500ms)

---

## Troubleshooting

### Backend Issues

#### Port 8000 Already in Use

```bash
# Find what's using port 8000
lsof -i :8000              # macOS/Linux
netstat -ano | grep :8000  # Windows

# Kill the process (on Windows)
taskkill /PID <PID> /F

# Or use a different port
uvicorn app.main:app --port 8001
```

#### Module Import Error: `No module named 'websockets'`

```bash
pip install websockets
pip list | grep websockets
```

#### Model Weights Not Found

Backend will work in dev mode without model weights:
- Returns HTTP 503 "Model weights not loaded"
- Place model file at `services/model/eff_b3_final.pth`

### Frontend Issues

#### Camera Permission Denied

- Check browser settings → Privacy → Camera → Allow localhost:3000
- Or try in an incognito window

#### WebSocket Connection Failed

1. **Backend not running?**
   ```bash
   curl http://localhost:8000/
   ```
   Should return welcome message

2. **Wrong server URL?**
   Edit `src/components/WebSocketClient.jsx` line ~12:
   ```javascript
   const wsUrl = `ws://localhost:8000/api/anti-spoof/ws`;
   ```

3. **CORS issue?**
   Backend `app/main.py` should have CORSMiddleware for `http://localhost:3000`

4. **Browser DevTools > Network > WS tab:**
   - Should see WebSocket connection upgrade
   - Check for green arrows (sent/received messages)

#### No Frames Sent

- Check Connection Status indicator (should be green)
- Check browser console (F12) for errors
- Verify webcam is working in other apps first

#### Predictions Always Return Error

1. Check backend logs for Python errors
2. Check if model file exists: `services/model/eff_b3_final.pth`
3. Try backend test: Send a frame manually via curl/Postman

### Common Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `Connection refused` | Backend not running | Start backend with `uvicorn` |
| `503 Model weights not loaded` | Model file missing | Place `.pth` file in `services/model/` |
| `CORS error` | Frontend origin not allowed | Check `FRONTEND_ORIGIN` in `services/app/core/config.py` |
| `Camera access denied` | Browser blocked camera | Allow in browser settings |
| `WebSocket error 1006` | Connection closed unexpectedly | Check backend logs for errors |

---

## Performance Monitoring

### Frontend (Browser DevTools)

1. Open **F12** → **Network** tab
2. Filter by "WS" (WebSocket)
3. Watch messages being sent/received:
   - Each message should be ~50-100 KB (base64 image)
   - Interval should be ~500ms
   - Response time typically <500ms

### Backend (Server Logs)

```
✓ WebSocket connected
- Received: {"type": "predict", "image": "...", "timestamp": 1683350400000}
- Prediction result: {"prediction": "Live", "confidence": 0.95}
```

### Performance Targets

- **Frame latency**: <1 second (typically 200-500ms)
- **Frame rate**: ~2 frames/sec (500ms intervals)
- **Bandwidth**: ~50-100 KB/sec
- **Backend CPU**: <200ms per prediction

---

## Development Workflow

### Making Changes

**Backend**
```bash
# Edit services/app/**/*.py
# Server auto-reloads with --reload flag
# No manual restart needed
```

**Frontend**
```bash
# Edit clients/src/**/*.jsx or clients/src/**/*.css
# Vite auto-reloads in browser (HMR)
# No manual refresh needed
```

### Common Tasks

| Task | Command |
|------|---------|
| Add backend dependency | `pip install <package>` → add to `services/requirement.txt` |
| Add frontend dependency | `npm install <package>` |
| Build frontend for production | `npm run build` → output in `clients/dist/` |
| Stop backend | Ctrl+C in terminal |
| Stop frontend | Ctrl+C in terminal |
| Test backend only (no frontend) | Use curl or Postman to test `/api/anti-spoof/predict` endpoint |

---

## Project Structure

```
biometric-2026.2/
├── services/                          # Backend (FastAPI)
│   ├── app/
│   │   ├── main.py                   # FastAPI app with CORS
│   │   ├── core/
│   │   │   └── config.py             # Settings + FRONTEND_ORIGIN
│   │   ├── api/
│   │   │   ├── api.py                # Router aggregator
│   │   │   └── endpoints/
│   │   │       ├── anti_spoof.py     # REST endpoint
│   │   │       └── anti_spoof_ws.py  # WebSocket endpoint [NEW]
│   │   └── services/
│   │       └── model.py              # AntiSpoofModel loader
│   ├── model/
│   │   └── eff_b3_final.pth          # Model weights
│   ├── requirement.txt                # Dependencies (+ websockets)
│   ├── pyrightconfig.json
│   ├── .venv/                         # Virtual environment
│   └── Dockerfile
│
├── clients/                           # Frontend (React) [NEW]
│   ├── public/
│   │   └── index.html                 # HTML entry point
│   ├── src/
│   │   ├── components/
│   │   │   ├── WebcamCapture.jsx      # Webcam capture logic
│   │   │   ├── WebSocketClient.jsx    # WebSocket manager
│   │   │   └── ResultDisplay.jsx      # Result display
│   │   ├── App.jsx                    # Main component
│   │   ├── App.css                    # App styling
│   │   ├── index.jsx                  # React entry
│   │   └── index.css                  # Global styles
│   ├── package.json
│   ├── vite.config.js
│   ├── .gitignore
│   └── README.md
│
└── docs/
```

---

## Testing E2E (End-to-End)

### Step-by-Step Test

1. **Backend + Frontend Running**
   - Terminal 1: Backend on `http://localhost:8000` ✓
   - Terminal 2: Frontend on `http://localhost:3000` ✓

2. **Open App in Browser**
   - Navigate to `http://localhost:3000`
   - Grant camera permission
   - Wait 2-3 seconds for WebSocket connection

3. **Connection Established**
   - Header status dot: **Green** (Connected)
   - Webcam preview: Shows live video
   - Footer: `Status: connected`

4. **Test with Spoof Image**
   - Print a photo of a face
   - Hold it to webcam
   - Wait ~1 second for prediction
   - Result should show: **Red ✗ SPOOF**

5. **Test with Real Face**
   - Move printout away
   - Show your real face to webcam
   - Wait ~1 second for prediction
   - Result should show: **Green ✓ LIVE**

6. **Check Debug Info**
   - Footer `Frames processed: N` should keep increasing (~2/sec)
   - Footer `Last prediction: Live` or `Spoof` updates

### Manual WebSocket Test (curl)

If frontend not working, test backend directly:

```bash
# Install websocat (WebSocket client)
# macOS: brew install websocat
# Windows: choco install websocat
# Ubuntu: cargo install websocat

# Connect to WebSocket
websocat ws://localhost:8000/api/anti-spoof/ws

# Send test message (paste this):
{"type": "predict", "image": "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==", "timestamp": 1683350400000}

# Should receive response:
{"type": "prediction", "prediction": "Spoof", "confidence": 0.98, ...}
```

---

## Deployment

### Local Development
- Backend: `localhost:8000` (FastAPI with auto-reload)
- Frontend: `localhost:3000` (Vite with HMR)

### Production
- Backend: Deploy Docker container to cloud (AWS, GCP, Azure)
- Frontend: Build with `npm run build`, deploy to CDN (Vercel, Netlify, S3+CloudFront)
- Update `FRONTEND_ORIGIN` in config to production domain
- Add TLS/SSL certificates for secure WebSocket (wss://)

---

## Next Steps

1. ✅ Run both servers locally
2. ✅ Test with your webcam
3. ✅ Verify predictions are accurate
4. 🔄 Fine-tune model confidence threshold
5. 🔄 Add database logging (Phase 2)
6. 🔄 Deploy to production

---

## Support & Documentation

- **Backend Docs**: See `services/docs/model.md`
- **Frontend Docs**: See `clients/README.md`
- **API Spec**: FastAPI auto-docs at `http://localhost:8000/docs`
- **WebSocket Frames**: See `clients/src/components/WebSocketClient.jsx` for protocol details

---

**🎉 Ready to detect faces in real-time!**
