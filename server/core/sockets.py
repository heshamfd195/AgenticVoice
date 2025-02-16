from core.app import sio
from sockets.audio_handler import handle_audio, on_audio_complete  # Import the event handler

# Register WebSocket event handlers
sio.on("audio_stream", handler=handle_audio)
sio.on('audio_complete', handler=on_audio_complete)
