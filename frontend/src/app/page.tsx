"use client";

import { useState, useEffect } from "react";
import { useSocketConnection } from "../hooks/useSocketConnection";
import { useTimer } from "@/hooks/useTimer";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import { RecordButton } from "@/components/features/voice/RecordButton";
import { TimerDisplay } from "@/components/features/voice/TimerDisplay";
import { AudioVisualizer } from "@/components/features/voice/AudioVisualizer";

export default function Home() {
  // State for audio visualization
  const [audioLevel, setAudioLevel] = useState<number[]>(Array(30).fill(3));

  // Custom hooks
  const socket = useSocketConnection();
  const { 
    recording, 
    startRecording, 
    stopRecording, 
    transcription, 
    synthAudio,
    isProcessing,
    processingStatus 
  } = useAudioRecorder({
    socket,
    onAudioLevelUpdate: setAudioLevel,
  });
  const timer = useTimer(recording);

  // Add loading state for synthesis
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  // Update audio visualization when synthesis is playing
  useEffect(() => {
    if (synthAudio) {
      setIsSynthesizing(true);
      synthAudio.onended = () => {
        setIsSynthesizing(false);
      };
    }
  }, [synthAudio]);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-8 text-center">
          Voice Assistant
        </h1>

        {/* Audio Visualization - now shows for both recording and synthesis */}
        <AudioVisualizer 
          audioLevel={audioLevel} 
          recording={recording || isProcessing}
        />

        {/* Transcription Display */}
        {transcription && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg mb-4">
            <p className="text-white">{transcription}</p>
          </div>
        )}

        {/* Timer Display */}
        <TimerDisplay timer={timer}/>

        {/* Record Button - disabled during synthesis */}
        <RecordButton
          recording={recording}
          startRecording={startRecording}
          stopRecording={stopRecording}
          disabled={isProcessing}
        />

        {/* Optional: Synthesis Status */}
        {isProcessing && (
          <div className="mt-2 text-center text-blue-400">
            {processingStatus}
          </div>
        )}
      </div>
    </div>
  );
}
