import whisper
import os

file_path="audio_files/streamed_audio.mp3"

def stt_whisper(language:str) -> str:
    # Load Whisper model with FP32 precision on CPU
    model = whisper.load_model("base", device="cpu")
    
    # Ensure the file exists
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    # Transcribe the audio file
    result = model.transcribe(file_path, fp16=False,language=language)
    
    return result["text"]


