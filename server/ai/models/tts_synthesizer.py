import torch
from TTS.api import TTS
import uuid
import os

tts_model = "tts_models/en/ljspeech/tacotron2-DDC"
tts = TTS(tts_model).to(torch.device("cpu"))  # Change to "cuda" if using a GPU

audio_dir = "generated_audio"
os.makedirs(audio_dir, exist_ok=True)

def synthesize_text(text: str):
    if not text:
        raise ValueError("Text input is required")
    
    audio_file = f"{audio_dir}/{uuid.uuid4()}.mp3"
    
    try:
        tts.tts_to_file(text=text, file_path=audio_file)
        print(f"Audio file saved: {audio_file}")
        return audio_file
    except Exception as e:
        raise RuntimeError(f"Error generating speech: {str(e)}")

# Example usage
if __name__ == "__main__":
    text = "Hello, this is a test synthesis."
    output_file = synthesize_text(text)
    print(f"Generated speech saved at: {output_file}")
