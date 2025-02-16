import socketio
from fastapi import FastAPI
from api.v1.router import router  # Import API v1 router

# Initialize FastAPI app
app = FastAPI()

# Register the API router for versioning
app.include_router(router, prefix="/api/v1")

# Initialize Socket.IO with ASGI mode
sio = socketio.AsyncServer(async_mode="asgi", cors_allowed_origins="*")

# Mount Socket.IO app onto FastAPI
sio_app = socketio.ASGIApp(socketio_server=sio, other_asgi_app=app)

# Expose app and sio
__all__ = ["app", "sio", "sio_app"]
