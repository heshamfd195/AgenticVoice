'use client'

import { useEffect, useState, useRef } from "react";
import io, { Socket } from "socket.io-client";

const SERVER_URL = "http://localhost:8000";

export default function Home() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [recording, setRecording] = useState(false);
  const [timer, setTimer] = useState(0);
  const [audioLevel, setAudioLevel] = useState<number[]>(Array(30).fill(3));
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    // Connect to FastAPI WebSocket via Socket.IO
    const socketInstance = io(SERVER_URL);
    setSocket(socketInstance);

    socketInstance.on("connect", () => {
      console.log("Connected to FastAPI WebSocket");
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => {
        setTimer(prev => prev + 0.1);
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setTimer(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [recording]);

  const updateAudioLevel = () => {
    if (analyserRef.current) {
      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      
      const normalizedData = Array.from({ length: 30 }, (_, i) => {
        const index = Math.floor(i * dataArray.length / 30);
        return (dataArray[index] / 255) * 50;
      });
      
      setAudioLevel(normalizedData);
      animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
    }
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;
    
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);
    analyserRef.current = analyser;
    
    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: "audio/webm" });

    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data.size > 0 && socket) {
        socket.emit("audio_stream", event.data);
      }
    };

    mediaRecorderRef.current.start(500);
    setRecording(true);
    updateAudioLevel();
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setRecording(false);
    setAudioLevel(Array(30).fill(3));
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-8 text-center">Voice Assistant</h1>
        
        {/* Audio Visualization */}
        <div className="flex items-center justify-center h-24 mb-8">
          <div className="flex items-center space-x-1">
            {audioLevel.map((level, index) => (
              <div
                key={index}
                className="w-1.5 bg-cyan-500/80 rounded-full transition-all duration-75"
                style={{
                  height: `${Math.max(3, level)}px`,
                  opacity: recording ? '1' : '0.5'
                }}
              />
            ))}
          </div>
        </div>

        {/* Timer */}
        <div className="text-center mb-8">
          <span className="text-cyan-400 font-mono text-xl">
            {timer.toFixed(1)}s
          </span>
        </div>

        {/* Record Button */}
        <button
          onClick={recording ? stopRecording : startRecording}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
            recording
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-cyan-500 hover:bg-cyan-600 text-white'
          }`}
        >
          {recording ? 'Stop Recording' : 'Start Recording'}
        </button>
      </div>
    </div>
  );
}
