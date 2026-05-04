from fastapi import APIRouter
from app.api.endpoints import anti_spoof

api_router = APIRouter()
api_router.include_router(anti_spoof.router, prefix="/anti-spoof", tags=["anti-spoof"])
