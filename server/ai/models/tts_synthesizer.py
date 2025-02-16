import torch
from TTS.api import TTS
import os

tts_model = "tts_models/en/ljspeech/tacotron2-DDC"
tts = TTS(tts_model).to(torch.device("cpu"))

audio_dir = "generated_audio"
os.makedirs(audio_dir, exist_ok=True)

async def synthesize_text(text: str, sio=None, sid=None):
    if not text:
        raise ValueError("Text input is required")
    
    audio_file = f"{audio_dir}/synthesized_audio.mp3"
    
    try:
        # Generate audio
        tts.tts_to_file(text=text, file_path=audio_file)
        
        # If socket is provided, stream the audio
        if sio and sid:
            chunk_size = 64 * 1024  # Increased chunk size to 64KB
            with open(audio_file, 'rb') as f:
                # First, send the total file size
                file_size = os.path.getsize(audio_file)
                await sio.emit('audio_start', {'size': file_size}, room=sid)
                
                # Then stream the chunks
                while chunk := f.read(chunk_size):
                    await sio.emit('synthesized_audio_chunk', chunk, room=sid)
                
                # Signal completion
                await sio.emit('audio_complete', room=sid)
        
        return audio_file
    except Exception as e:
        raise RuntimeError(f"Error generating speech: {str(e)}")

# # Example usage
# if __name__ == "__main__":
#     text = "Hello, this is a test synthesis."
#     output_file = synthesize_text(text)
#     print(f"Generated speech saved at: {output_file}")
