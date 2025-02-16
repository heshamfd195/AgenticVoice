import { useState, useRef, useCallback } from 'react';
import { Socket } from 'socket.io-client';

interface AudioRecorderHookProps {
  socket: Socket | null;
  onAudioLevelUpdate: (levels: number[]) => void;
}

export const useAudioRecorder = ({ socket, onAudioLevelUpdate }: AudioRecorderHookProps) => {
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

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
      
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0 && socket) {
          socket.emit('audio_stream', event.data);
        }
      };

      mediaRecorderRef.current.start(500);
      setRecording(true);
      updateAudioLevel();
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  // Stop recording function
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      
      // Add event listener for when recording actually stops
      mediaRecorderRef.current.addEventListener('stop', () => {
        if (socket) {
          socket.emit('audio_complete');
        }
      });
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setRecording(false);
  }, [socket]);

  return {
    recording,
    startRecording,
    stopRecording
  };
};