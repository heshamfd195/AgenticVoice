from fastapi import FastAPI, UploadFile, File, HTTPException
import whisper
import tempfile
import os

app = FastAPI()

# Load Whisper model (choose from: tiny, base, small, medium, large)
model = whisper.load_model("base")

@app.post("/transcribe/")
async def transcribe_audio(file: UploadFile = File(...)):
    try:
        # Save the uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as temp_audio:
            temp_audio.write(file.file.read())
            temp_audio_path = temp_audio.name
        
        # Transcribe audio
        result = model.transcribe(temp_audio_path)
        
        # Remove the temporary file
        os.remove(temp_audio_path)
        
        return {"transcription": result["text"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
