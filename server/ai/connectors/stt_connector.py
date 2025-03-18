
from ai.models.stt_whisper import stt_whisper
from .base_connector import BaseConnector

class STTConnector(BaseConnector):
    def __init__(self, config: dict):
        super().__init__(config)
    
    def run(self):
        language = self.config.get("language")
        return stt_whisper(language)
    
