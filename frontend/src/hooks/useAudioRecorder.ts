import { useState, useRef, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import { VoiceController } from '@/modules/voice';

/**
 * Props interface for the useAudioRecorder hook
 * @interface AudioRecorderHookProps
 * @property {Socket | null} socket - Socket.io client instance for real-time communication
 * @property {Function} onAudioLevelUpdate - Callback function to handle audio level updates for visualization
 */
interface AudioRecorderHookProps {
  socket: Socket | null;
  onAudioLevelUpdate: (levels: number[]) => void;
}

/**
 * Custom hook for managing audio recording and processing state
 * @param {AudioRecorderHookProps} props - The hook's configuration props
 * @returns {Object} An object containing recording state and control functions
 */
export const useAudioRecorder = ({ socket, onAudioLevelUpdate }: AudioRecorderHookProps) => {
  const voiceControllerRef = useRef<VoiceController | null>(null);
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [synthAudio, setSynthAudio] = useState<HTMLAudioElement | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');

  /**
   * Effect hook to initialize VoiceController and setup subscriptions
   * Handles cleanup on unmount or socket changes
   */
  useEffect(() => {
    if (!socket) return;
    
    voiceControllerRef.current = new VoiceController(socket);
    
    const subscription = voiceControllerRef.current.state$.subscribe(state => {
      setRecording(state.isRecording);
      setTranscription(state.transcription);
      setIsProcessing(state.processingStatus.isProcessing);
      setProcessingStatus(state.processingStatus.status);
      onAudioLevelUpdate(state.audioLevels);
      
      if (state.audioUrl) {
        setSynthAudio(new Audio(state.audioUrl));
      }
    });

    return () => {
      subscription.unsubscribe();
      voiceControllerRef.current?.dispose();
    };
  }, [socket, onAudioLevelUpdate]);

  /**
   * Initiates audio recording
   * @async
   * @throws {Error} When recording fails to start
   */
  const startRecording = async () => {
    try {
      await voiceControllerRef.current?.startRecording();
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  /**
   * Stops the current audio recording session
   */
  const stopRecording = () => {
    voiceControllerRef.current?.stopRecording();
  };

  return {
    recording,
    startRecording,
    stopRecording,
    transcription,
    synthAudio,
    isProcessing,
    processingStatus
  };
};