import React, { FC } from "react";

interface RecordButtonProps {
  recording: boolean;
  startRecording: () => void;
  stopRecording: () => void;
  disabled?: boolean;
}

export const RecordButton: FC<RecordButtonProps> = ({
  recording,
  startRecording,
  stopRecording,
  disabled = false
}) => {
  return (
    <button
      onClick={recording ? stopRecording : startRecording}
      disabled={disabled}
      className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
        disabled
          ? "bg-gray-500 cursor-not-allowed opacity-50"
          : recording
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-cyan-500 hover:bg-cyan-600 text-white"
      }`}
    >
      {disabled
        ? "Processing..."
        : recording
        ? "Stop Recording"
        : "Start Recording"}
    </button>
  );
};
