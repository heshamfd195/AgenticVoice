import os
from modules.audio.audio_service import save_audio_chunk
from ai.models.whisper_stt_transcriber import transcribe_audio

AUDIO_DIR = "audio_files"
os.makedirs(AUDIO_DIR, exist_ok=True)


async def handle_audio(sid, data):
    """Handles incoming audio stream from WebSocket."""
    print(f"Received {len(data)} bytes of audio from {sid}")
    
    # Check if this is the first chunk for this session
    is_first_chunk = not hasattr(handle_audio, f'started_{sid}')
    if is_first_chunk:
        setattr(handle_audio, f'started_{sid}', True)
    
    audio_path = "streamed_audio.mp3"
    save_audio_chunk(data, audio_path, is_first_chunk=is_first_chunk)

async def on_audio_complete(sid):
    """Event handler triggered when audio streaming is complete."""
    # Clear the started flag for next recording
    if hasattr(handle_audio, f'started_{sid}'):
        delattr(handle_audio, f'started_{sid}')
    
    audio_path = f'{AUDIO_DIR}/streamed_audio.mp3'
    transcription = transcribe_audio(audio_path)
    return transcription




