import os
from modules.audio.audio_service import save_audio_chunk
from ai.models.tts_synthesizer import synthesize_text
from ai.models.whisper_stt_transcriber import transcribe_audio
from core.app import sio
from ai.llm.ollama_generator import ollama_generate_text

AUDIO_DIR = "audio_files"
os.makedirs(AUDIO_DIR, exist_ok=True)

async def handle_audio(sid, data):
    """Handles incoming audio stream from WebSocket."""
    print(f"Received {len(data)} bytes of audio from {sid}")
    
    # Check if this is the first chunk for this session
    is_first_chunk = not hasattr(handle_audio, f'started_{sid}')
    if is_first_chunk:
        setattr(handle_audio, f'started_{sid}', True)
    
    audio_path = "streamed_audio.mp3"  # Just the filename
    save_audio_chunk(data, audio_path, is_first_chunk=is_first_chunk)

async def on_audio_complete(sid):
    """Event handler triggered when audio streaming is complete."""
    # Clear the started flag for next recording
    if hasattr(handle_audio, f'started_{sid}'):
        delattr(handle_audio, f'started_{sid}')
    
    audio_path = f'{AUDIO_DIR}/streamed_audio.mp3'
    try:
        # Send processing status
        await sio.emit('processing_status', 'Transcribing audio...', room=sid)
        transcription = transcribe_audio(audio_path)
        
        await sio.emit('transcription_complete', transcription, room=sid)
        await sio.emit('processing_status', 'Generating AI response...', room=sid)
        
        # Generate response using Ollama
        ai_response = ollama_generate_text(transcription)
        
        await sio.emit('processing_status', 'Converting response to speech...', room=sid)
        
        # Pass the AI response to speech synthesis
        await synthesize_text(ai_response, sio, sid)
        
    except Exception as e:
        print(f"Error processing audio: {str(e)}")
        await sio.emit('processing_error', str(e), room=sid)
    
    return transcription




