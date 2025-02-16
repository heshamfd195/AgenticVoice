import { SOCKET_EVENTS } from '@/sockets/events';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Socket } from 'socket.io-client';

interface AudioRecorderHookProps {
  socket: Socket | null;
  onAudioLevelUpdate: (levels: number[]) => void;
}


export const useAudioRecorder = ({ socket, onAudioLevelUpdate }: AudioRecorderHookProps) => {
  const [recording, setRecording] = useState(false);
  const [transcription, setTranscription] = useState<string>('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  const setupAudioAnalyser = useCallback((stream: MediaStream) => {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;
  }, []);

  const setupMediaRecorder = useCallback((stream: MediaStream) => {
    const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0 && socket) {
        socket.emit(SOCKET_EVENTS.AUDIO_STREAM, event.data);
      }
    };

    mediaRecorderRef.current = mediaRecorder;
  }, [socket]);

  // Function to update audio levels for visualization
  const updateAudioLevel = useCallback(() => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      const normalizedData = Array.from({ length: 30 }, (_, i) => {
        const index = Math.floor(i * dataArray.length / 30);
        return (dataArray[index] / 255) * 50;
      });
      
      onAudioLevelUpdate(normalizedData);
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    }
  }, [onAudioLevelUpdate]);

  // Start recording function
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      setupAudioAnalyser(stream);
      setupMediaRecorder(stream);

      mediaRecorderRef.current?.start(500);
      setRecording(true);
      updateAudioLevel();
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const cleanupResources = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setRecording(false);
  }, []);

  // Stop recording function
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      
      mediaRecorderRef.current.addEventListener('stop', () => {
        if (socket) {
          socket.emit(SOCKET_EVENTS.AUDIO_COMPLETE);
        }
      });
    }
    cleanupResources();
  }, [socket, cleanupResources]);

  // Add useEffect to listen for transcription
  useEffect(() => {
    if (!socket) return;

    socket.on('transcription_complete', (text: string) => {
      console.log('Transcription received:', text);
      setTranscription(text);
    });

    return () => {
      socket.off('transcription_complete');
    };
  }, [socket]);

  return {
    recording,
    startRecording,
    stopRecording,
    transcription
  };
};