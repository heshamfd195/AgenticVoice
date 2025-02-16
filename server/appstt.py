import whisper
import os

# Load Whisper model (choose from: tiny, base, small, medium, large)
model = whisper.load_model("base",device="cpu")

# Define the path to the audio file
audio_path = "audio_files/streamed_audio.mp3"

# Ensure the file exists
if not os.path.exists(audio_path):
    raise FileNotFoundError(f"File not found: {audio_path}")

# Transcribe the audio file
result = model.transcribe(audio_path, fp16=False)

# Print the transcription
print("Transcription:")
print(result["text"])
