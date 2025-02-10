# AgenticVoice


1️⃣ **Install Python Dependencies**
`pip install fastapi uvicorn openai-whisper torch coqui-tts`


2️⃣ **(Optional) Install ffmpeg**


Whisper requires `ffmpeg` for audio processing. Install it based on your OS:

#### **Linux (Ubuntu/Debian)**


`sudo apt update && sudo apt install ffmpeg`

#### **Mac (Homebrew)**


`brew install ffmpeg`

#### **Windows**

1. Download from [https://ffmpeg.org/download.html](https://ffmpeg.org/download.html)
2. Add it to system PATH

#### **Run**
Run the server:
`uvicorn filename:app --host 0.0.0.0 --port 8000`