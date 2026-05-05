from fastapi import APIRouter
from app.api.endpoints import anti_spoof, anti_spoof_ws

api_router = APIRouter()
api_router.include_router(anti_spoof.router, prefix="/anti-spoof", tags=["anti-spoof"])
api_router.include_router(anti_spoof_ws.router, prefix="/anti-spoof", tags=["anti-spoof"])
