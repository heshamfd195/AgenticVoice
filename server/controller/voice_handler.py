from controller.utils import save_audio_chunk
from core.app import sio
from ai.chains.conversation_chain import conversation_chain
from ai.connectors.stt_connector import STTConnector
from ai.models.tts_synthesizer import synthesize_text

AUDIO_DIR = "audio_files"

class VoiceHandler:
    conversation_config:dict

    def __init__(self):
        """Initialize the voice handler."""
        self.started_sessions = set()  # Track active sessions

    def setup(self,config:dict):
        self.conversation_config=config
        return
    
    def set_agent(conversation_config):
        return
    
    async def on_received(self,sid,data):
            # Check if this is the first chunk for this session
            is_first_chunk = sid not in self.started_sessions
            if is_first_chunk:
                self.started_sessions.add(sid)
                
            audio_path = "streamed_audio.mp3"  
            # Just the filename
            save_audio_chunk(data, audio_path, is_first_chunk=is_first_chunk)

    
    async def on_processing(self,sid):
        pass
    
    async def on_complete(self,sid):
            """Event handler triggered when audio streaming is complete."""
            # Clear the started flag for next recording
            if sid in self.started_sessions:
                self.started_sessions.remove(sid)
    

            try:
                # Send processing status
                await sio.emit('processing_status', 'Transcribing audio...', room=sid)
                transcription = STTConnector(self.conversation_config).run()
                print("trans",transcription)
                
                await sio.emit('transcription_complete', transcription, room=sid)
                await sio.emit('processing_status', 'Generating AI response...', room=sid)
                
                # Generate response using Ollama
                
                # ai_response = ollama_generate_text(transcription)
                ai_response = conversation_chain(transcription)
                await sio.emit('processing_status', 'Converting response to speech...', room=sid)
                
                # Pass the AI response to speech synthesis
                await synthesize_text(ai_response, sio, sid)
                
            except Exception as e:
                print(f"Error processing audio: {str(e)}")
                await sio.emit('processing_error', str(e), room=sid)
                
            return transcription

    
    def __dir(self):
        return
    
    def __transcribe(self,model):
        return

    def __synthesize(self,model):
        return
    
    def __agent(self,model):
        return
    

