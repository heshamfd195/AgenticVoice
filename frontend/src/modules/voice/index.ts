import { Socket } from 'socket.io-client';
import { Subject, Observable, fromEvent, BehaviorSubject } from 'rxjs';
import { SOCKET_EVENTS } from '@/sockets/events';

/**
 * Interface representing the status of audio processing
 * @interface AudioProcessingStatus
 * @property {boolean} isProcessing - Indicates if audio is currently being processed
 * @property {string} status - Current status message of the processing
 */
export interface AudioProcessingStatus {
  isProcessing: boolean;
  status: string;
}

/**
 * Interface representing the complete audio state
 * @interface AudioState
 * @property {boolean} isRecording - Indicates if recording is in progress
 * @property {string} transcription - Current transcription text
 * @property {string | null} audioUrl - URL for the synthesized audio
 * @property {AudioProcessingStatus} processingStatus - Current processing status
 * @property {number[]} audioLevels - Array of audio level values for visualization
 */
export interface AudioState {
  isRecording: boolean;
  transcription: string;
  audioUrl: string | null;
  processingStatus: AudioProcessingStatus;
  audioLevels: number[];
}

/**
 * Controller class for managing voice recording, processing, and audio analysis
 * @class VoiceController
 */
export class VoiceController {
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;
  private socket: Socket;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private animationFrameId: number | undefined;
  
  private stateSubject = new BehaviorSubject<AudioState>({
    isRecording: false,
    transcription: '',
    audioUrl: null,
    processingStatus: {
      isProcessing: false,
      status: ''
    },
    audioLevels: Array(30).fill(0)
  });

  /**
   * Creates an instance of VoiceController
   * @param {Socket} socket - Socket.io client instance for real-time communication
   */
  constructor(socket: Socket) {
    this.socket = socket;
    this.setupSocketListeners();
  }

  /**
   * Sets up WebSocket event listeners for audio processing
   * @private
   */
  private setupSocketListeners(): void {
    this.socket.on(SOCKET_EVENTS.TRANSCRIPTION_COMPLETE, (text: string) => {
      this.updateState({ transcription: text });
    });

    this.socket.on(SOCKET_EVENTS.PROCESSING_STATUS, (status: string) => {
      this.updateState({
        processingStatus: {
          isProcessing: true,
          status
        }
      });
    });

    let chunks: Blob[] = [];

    this.socket.on(SOCKET_EVENTS.AUDIO_START, () => {
      chunks = [];
      this.updateState({
        processingStatus: {
          isProcessing: true,
          status: 'Receiving audio...'
        }
      });
    });

    this.socket.on(SOCKET_EVENTS.SYNTHESIZED_AUDIO_CHUNK, (audioChunk: ArrayBuffer) => {
      chunks.push(new Blob([audioChunk], { type: 'audio/mp3' }));
    });

    this.socket.on(SOCKET_EVENTS.AUDIO_COMPLETE_RESPONSE, () => {
      const audioBlob = new Blob(chunks, { type: 'audio/mp3' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      this.updateState({
        audioUrl,
        processingStatus: {
          isProcessing: false,
          status: ''
        }
      });

      const audio = new Audio(audioUrl);
      audio.oncanplaythrough = () => audio.play();
      audio.onerror = () => {
        this.updateState({
          processingStatus: {
            isProcessing: false,
            status: 'Error playing audio'
          }
        });
      };
    });
  }

  /**
   * Updates the current state with partial updates
   * @private
   * @param {Partial<AudioState>} partial - Partial state update
   */
  private updateState(partial: Partial<AudioState>): void {
    this.stateSubject.next({
      ...this.stateSubject.value,
      ...partial
    });
  }

  /**
   * Sets up audio analysis for visualization
   * @private
   * @param {MediaStream} stream - Media stream to analyze
   */
  private setupAudioAnalyser(stream: MediaStream): void {
    this.audioContext = new AudioContext();
    const source = this.audioContext.createMediaStreamSource(stream);
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    source.connect(this.analyser);
    this.startAudioLevelMonitoring();
  }

  /**
   * Starts monitoring audio levels for visualization
   * @private
   */
  private startAudioLevelMonitoring(): void {
    const updateAudioLevel = () => {
      if (this.analyser) {
        const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.analyser.getByteFrequencyData(dataArray);
        
        const normalizedData = Array.from({ length: 30 }, (_, i) => {
          const index = Math.floor(i * dataArray.length / 30);
          return (dataArray[index] / 255) * 50;
        });
        
        this.updateState({ audioLevels: normalizedData });
      }
      this.animationFrameId = requestAnimationFrame(updateAudioLevel);
    };

    updateAudioLevel();
  }

  /**
   * Starts audio recording and streaming
   * @public
   * @async
   * @throws {Error} When unable to access microphone or start recording
   */
  public async startRecording(): Promise<void> {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.stream, { mimeType: 'audio/webm' });

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.socket.emit(SOCKET_EVENTS.AUDIO_STREAM, event.data);
        }
      };

      this.setupAudioAnalyser(this.stream);
      this.mediaRecorder.start(500);
      this.updateState({ isRecording: true });
    } catch (error) {
      console.error('Error starting recording:', error);
      throw error;
    }
  }

  /**
   * Stops current recording session and cleans up resources
   * @public
   */
  public stopRecording(): void {
    if (this.mediaRecorder) {
      this.mediaRecorder.stop();
      this.mediaRecorder.addEventListener('stop', () => {
        this.socket.emit(SOCKET_EVENTS.AUDIO_COMPLETE);
      });
    }

    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.analyser = null;
    }

    this.updateState({ 
      isRecording: false,
      audioLevels: Array(30).fill(0)
    });
  }

  /**
   * Observable stream of the current audio state
   * @public
   * @returns {Observable<AudioState>} Stream of audio state updates
   */
  public get state$(): Observable<AudioState> {
    return this.stateSubject.asObservable();
  }

  /**
   * Cleans up resources and removes event listeners
   * @public
   */
  public dispose(): void {
    this.stopRecording();
    this.stateSubject.complete();
    this.socket.off(SOCKET_EVENTS.TRANSCRIPTION_COMPLETE);
    this.socket.off(SOCKET_EVENTS.PROCESSING_STATUS);
    this.socket.off(SOCKET_EVENTS.AUDIO_START);
    this.socket.off(SOCKET_EVENTS.SYNTHESIZED_AUDIO_CHUNK);
    this.socket.off(SOCKET_EVENTS.AUDIO_COMPLETE_RESPONSE);
  }
}
