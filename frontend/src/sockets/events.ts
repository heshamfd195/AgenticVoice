/**
 * Enum for Socket.IO event names used in voice communication
 * @enum {string}
 */
export enum SOCKET_EVENTS {
    // Client -> Server events
    AUDIO_STREAM = 'audio_stream',
    AUDIO_COMPLETE = 'audio_complete',

    // Server -> Client events
    TRANSCRIPTION_COMPLETE = 'transcription_complete',
    PROCESSING_STATUS = 'processing_status',
    AUDIO_START = 'audio_start',
    SYNTHESIZED_AUDIO_CHUNK = 'synthesized_audio_chunk',
    AUDIO_COMPLETE_RESPONSE = 'audio_complete'
}