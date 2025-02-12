"use client";

import { useState } from "react";
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
  const { recording, startRecording, stopRecording } = useAudioRecorder({
    socket,
    onAudioLevelUpdate: setAudioLevel,
  });
  const timer = useTimer(recording);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-8 text-center">
          Voice Assistant
        </h1>

        {/* Audio Visualization */}
        <AudioVisualizer audioLevel={audioLevel} recording={false}/>

        {/* Timer Display */}
        <TimerDisplay timer={timer}/>

        {/* Record Button */}
        <RecordButton
          recording={recording}
          startRecording={startRecording}
          stopRecording={stopRecording}
        />
      </div>
    </div>
  );
}
