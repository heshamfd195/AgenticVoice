import socketio
from fastapi import FastAPI
import asyncio
from datetime import datetime
import os

app = FastAPI()
sio = socketio.AsyncServer(async_mode='asgi', cors_allowed_origins="*")
sio_app = socketio.ASGIApp(socketio_server=sio, other_asgi_app=app)

# Create audio directory if it doesn't exist
AUDIO_DIR = "audio_files"
os.makedirs(AUDIO_DIR, exist_ok=True)

# Handle incoming audio data
@sio.on("audio_stream")
async def handle_audio(sid, data):
    print(f"Received {len(data)} bytes of audio from {sid}")

    # Optional: Save audio file
    with open("received_audio.webm", "ab") as f:
        f.write(data)

# Attach the Socket.IO app to FastAPI
app.mount("/", sio_app)
