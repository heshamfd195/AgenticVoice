from fastapi import APIRouter


conversation_router = APIRouter()

@conversation_router.get("/")
async def get_audio_status():
    """Check if the audio API is running."""
    return {"status": "Audio API is running"}

@conversation_router.post("/process")
async def process_audio():
    """Placeholder for audio processing logic."""
    return {"message": "Audio processing started"}