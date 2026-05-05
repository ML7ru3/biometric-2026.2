import asyncio
import json
import base64
import os
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.model import AntiSpoofModel

router = APIRouter()

# Global model instance
model_path = "model/eff_b3_final.pth"
if not os.path.exists(model_path):
    print(f"Warning: Model weights not found at {model_path}")
    model = None
else:
    model = AntiSpoofModel(model_path)


class WebSocketConnectionManager:
    """Manages WebSocket connections with heartbeat and reconnection support."""
    
    def __init__(self):
        self.active_connections: list[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    async def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
    
    async def send_message(self, websocket: WebSocket, message: dict):
        """Send JSON message to client."""
        try:
            await websocket.send_json(message)
        except Exception as e:
            print(f"Error sending message: {e}")
            await self.disconnect(websocket)


manager = WebSocketConnectionManager()


def decode_base64_image(image_data: str) -> bytes:
    """Safely decode base64-encoded image data."""
    try:
        return base64.b64decode(image_data)
    except Exception as e:
        raise ValueError(f"Invalid base64 encoding: {e}")


def predict_with_retry(image_bytes: bytes, max_retries: int = 2) -> dict:
    """Predict with automatic retry logic."""
    if model is None:
        raise Exception("Model weights not loaded")
    
    for attempt in range(max_retries + 1):
        try:
            result = model.predict(image_bytes)
            return result
        except Exception as e:
            if attempt < max_retries:
                # Wait before retry
                asyncio.sleep(0.1)
                continue
            else:
                raise e


@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    """
    WebSocket endpoint for real-time face liveness detection.
    
    Message format from client:
    {
        "type": "predict",
        "image": "<base64_encoded_image>",
        "timestamp": <milliseconds>
    }
    
    Message format to client:
    {
        "type": "prediction",
        "prediction": "Live" | "Spoof",
        "confidence": <float 0-1>,
        "timestamp": <milliseconds>
    }
    
    Error format:
    {
        "type": "error",
        "message": "<error_description>",
        "timestamp": <milliseconds>
    }
    """
    await manager.connect(websocket)
    
    try:
        # Main message processing loop
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            
            try:
                message = json.loads(data)
            except json.JSONDecodeError:
                await manager.send_message(
                    websocket,
                    {
                        "type": "error",
                        "message": "Invalid JSON format",
                        "timestamp": None,
                    }
                )
                continue
            
            # Validate message structure
            if message.get("type") != "predict":
                await manager.send_message(
                    websocket,
                    {
                        "type": "error",
                        "message": f"Unknown message type: {message.get('type')}",
                        "timestamp": message.get("timestamp"),
                    }
                )
                continue
            
            if "image" not in message:
                await manager.send_message(
                    websocket,
                    {
                        "type": "error",
                        "message": "Missing 'image' field",
                        "timestamp": message.get("timestamp"),
                    }
                )
                continue
            
            # Process prediction
            try:
                # Decode base64 image
                image_bytes = decode_base64_image(message["image"])
                
                # Run prediction with retry logic
                result = predict_with_retry(image_bytes)
                
                # Send prediction result back to client
                await manager.send_message(
                    websocket,
                    {
                        "type": "prediction",
                        "prediction": result.get("prediction"),
                        "confidence": result.get("confidence"),
                        "probabilities": result.get("probabilities"),
                        "timestamp": message.get("timestamp"),
                    }
                )
            
            except ValueError as e:
                # Invalid base64 encoding
                await manager.send_message(
                    websocket,
                    {
                        "type": "error",
                        "message": str(e),
                        "timestamp": message.get("timestamp"),
                    }
                )
            
            except Exception as e:
                # Model prediction error
                print(f"Prediction error: {e}")
                await manager.send_message(
                    websocket,
                    {
                        "type": "error",
                        "message": f"Prediction failed: {str(e)}",
                        "timestamp": message.get("timestamp"),
                    }
                )
    
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
        print("Client disconnected")
    
    except Exception as e:
        print(f"WebSocket error: {e}")
        await manager.disconnect(websocket)
