from fastapi import APIRouter
from modules.audio.audio_router import audio_router

# Create a router for API v1
router = APIRouter()

# Include individual endpoint routers
router.include_router(audio_router, prefix="/audio", tags=["Audio"])

