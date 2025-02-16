from fastapi import FastAPI, HTTPException, Form
from fastapi.responses import FileResponse
import torch
from TTS.api import TTS
import uuid
import os

app = FastAPI()

tts_model = "tts_models/en/ljspeech/tacotron2-DDC"
tts = TTS(tts_model).to(torch.device("cpu"))  # Change to "cuda" if using a GPU

audio_dir = "generated_audio"
os.makedirs(audio_dir, exist_ok=True)

@app.post("/synthesize/")
def synthesize_text(text: str = Form(...)):
    if not text:
        raise HTTPException(status_code=400, detail="Text input is required")
    
    audio_file = f"{audio_dir}/{uuid.uuid4()}.wav"
    
    try:
        tts.tts_to_file(text=text, file_path=audio_file)
        return FileResponse(audio_file, media_type="audio/wav", filename=os.path.basename(audio_file))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
