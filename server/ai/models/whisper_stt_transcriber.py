import whisper
import os

def transcribe_audio(file_path: str) -> str:
    # Load Whisper model with FP32 precision on CPU
    model = whisper.load_model("base", device="cpu")
    
    # Ensure the file exists
    if not os.path.exists(file_path):
        raise FileNotFoundError(f"File not found: {file_path}")
    
    # Transcribe the audio file
    result = model.transcribe(file_path, fp16=False)

    print(result["text"])
    
    return result["text"]


