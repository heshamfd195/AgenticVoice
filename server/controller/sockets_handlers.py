from controller.processor import on_audio_complete, on_audio_recieved
from core.app import sio


# Register WebSocket event handlers
sio.on("audio_stream", handler=on_audio_recieved)
sio.on('audio_complete', handler=on_audio_complete)
