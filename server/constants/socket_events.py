from enum import Enum

class SocketEvents(str, Enum):
    # Audio Recording Events
    AUDIO_STREAM = 'audio_stream'
    AUDIO_COMPLETE = 'audio_complete'
    AUDIO_PROCESSING = 'audio_processing'
    
    # Processing Status Events
    PROCESSING_START = 'processing_start'
    PROCESSING_STATUS = 'processing_status'
    PROCESSING_ERROR = 'processing_error'
    
    # Transcription Events
    TRANSCRIPTION_START = 'transcription_start'
    TRANSCRIPTION_COMPLETE = 'transcription_complete'
    
    # AI Response Events
    AGENT_RESPONSE_START = 'agent_response_start'
    AGENT_RESPONSE_PROCESSING = 'agent_response_processing'
    AGENT_RESPONSE_COMPLETE = 'agent_response_complete'
    
    # Speech Synthesis Events
    SYNTHESIS_START = 'sythesis_start'
    SYNTHESIS_CHUNK = 'sythesis_chunk'
    SYNTHESIS_COMPLETE = 'sythesis_complete'

class ProcessingStatus(str, Enum):
    TRANSCRIBING = 'Transcribing audio...'
    GENERATING = 'Generating AI response...'
    SYNTHESIZING = 'Converting response to speech...' 