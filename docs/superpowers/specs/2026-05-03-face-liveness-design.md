# Design Doc: Face Liveness Detection and Security Evaluation

**Date:** 2026-05-03
**Status:** Approved
**Topic:** Real-time biometric security system with hybrid liveness detection.

## 1. Objective
Develop a lightweight, real-time face liveness detection system using a hybrid approach (CNN + Traditional CV) to defend against presentation attacks (printed photos, screen replays).

## 2. System Architecture
The system follows a Client-Server model optimized for real-time video processing.

### 2.1 Frontend (React)
- **Technology:** React, `react-webcam`.
- **Communication:** WebSockets for bidirectional frame streaming.
- **Responsibilities:**
    - Capture webcam stream.
    - Sample frames at ~10-15 FPS.
    - Convert frames to Base64/Binary and transmit via WebSocket.
    - Render a real-time UI overlay (bounding boxes, liveness score, blink count).

### 2.2 Backend (FastAPI)
- **Technology:** FastAPI, OpenCV, TensorFlow/PyTorch, MediaPipe/dlib.
- **Communication:** WebSocket endpoint.
- **Responsibilities:**
    - Decode incoming frames.
    - **Blink Detection Service:** Calculate Eye Aspect Ratio (EAR) using facial landmarks. Maintain a temporal buffer to confirm a blink event.
    - **Liveness CNN Service:** Run inference on the face region using a lightweight CNN (e.g., MobileNetV2) trained on CASIA-FASD.
    - **Aggregator:** Combine spatial (CNN) and temporal (Blink) results to determine final "Live" status.

## 3. Data Flow
1. **Frame Capture:** Browser captures a frame and sends it over WebSocket.
2. **Preprocessing:** FastAPI receives frame -> OpenCV converts to grayscale/RGB -> Face detection identifies the region of interest (ROI).
3. **Parallel Inference:**
    - **CNN Path:** ROI is resized and fed to the liveness model. Returns `liveness_score`.
    - **CV Path:** Facial landmarks are extracted. EAR is calculated. If EAR falls below threshold and rises, `blink_detected` = true.
4. **Result Aggregation:**
    - `Verified_Live = (liveness_score > 0.8) AND (session_blink_count > 0)`
5. **UI Update:** Backend sends JSON result back to Frontend -> React updates the display.

## 4. Components & Tools
- **Model:** MobileNetV2 (fine-tuned for FAS).
- **Face/Landmarks:** MediaPipe Face Mesh (efficient for real-time).
- **API:** FastAPI (Asynchronous WebSocket handling).
- **Frontend:** React + TailwindCSS (for UI styling).

## 5. Security Evaluation Metrics
- **Accuracy:** Percentage of correctly classified samples.
- **FAR (False Acceptance Rate):** Rate at which spoofs are accepted as live.
- **FRR (False Rejection Rate):** Rate at which live users are rejected.
- **Dataset:** Primary: CASIA-FASD. Recommended Supplementary: OULU-NPU.

## 6. Implementation Stages
1. **Backend Core:** Implement face detection and the blink detection algorithm.
2. **Model Training:** Prepare and fine-tune the MobileNet model on CASIA-FASD.
3. **WebSocket API:** Build the FastAPI server to handle real-time frame processing.
4. **Frontend:** Build the React UI with webcam integration and WebSocket bridge.
5. **Testing & Metrics:** Evaluate system against printed photos and screen replays.
