from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services.model import AntiSpoofModel
import os

router = APIRouter()

# Global model instance
model_path = "model/eff_b3_final.pth"
if not os.path.exists(model_path):
    # Fallback for development if weights are missing
    print(f"Warning: Model weights not found at {model_path}")
    model = None
else:
    model = AntiSpoofModel(model_path)

@router.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model weights not loaded")
    
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        contents = await file.read()
        result = model.predict(contents)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
