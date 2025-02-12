import React, { FC } from "react";

type RecordButtonProps={
   recording:boolean;
   stopRecording:()=>void;
   startRecording:() => Promise<void>;
}

export const RecordButton:FC<RecordButtonProps> = ({recording,startRecording,stopRecording}) => {
  return (
    <button
      onClick={recording ? stopRecording : startRecording}
      className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
        recording
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-cyan-500 hover:bg-cyan-600 text-white"
      }`}
    >
      {recording ? "Stop Recording" : "Start Recording"}
    </button>
  );
};
