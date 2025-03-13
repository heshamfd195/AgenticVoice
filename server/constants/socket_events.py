from enum import Enum

class SocketEvents(str, Enum):
    # Audio Recording Events
    AUDIO_STREAM = 'AUDIO_STREAM'
    AUDIO_COMPLETE = 'AUDIO_COMPLETE'
    
    # Processing Status Events
    PROCESSING_START = 'PROCESSING_START'
    PROCESSING_STATUS = 'PROCESSING_STATUS'
    PROCESSING_ERROR = 'PROCESSING_ERROR'
    
    # Transcription Events
    TRANSCRIPTION_START = 'TRANSCRIPTION_START'
    TRANSCRIPTION_COMPLETE = 'TRANSCRIPTION_COMPLETE'
    
    # AI Response Events
    AI_RESPONSE_START = 'AI_RESPONSE_START'
    AI_RESPONSE_COMPLETE = 'AI_RESPONSE_COMPLETE'
    
    # Speech Synthesis Events
    SYNTHESIS_START = 'SYNTHESIS_START'
    SYNTHESIS_CHUNK = 'SYNTHESIS_CHUNK'
    SYNTHESIS_COMPLETE = 'SYNTHESIS_COMPLETE'

class ProcessingStatus(str, Enum):
    TRANSCRIBING = 'Transcribing audio...'
    GENERATING = 'Generating AI response...'
    SYNTHESIZING = 'Converting response to speech...' 