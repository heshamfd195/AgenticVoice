import React, { FC } from "react";

type AudioVisualizerProps={
    audioLevel:number[];
    recording:boolean
}
export const AudioVisualizer:FC<AudioVisualizerProps> = ({audioLevel,recording}) => {
  return (
    <div className="flex items-center justify-center h-24 mb-8">
      <div className="flex items-center space-x-1">
        {audioLevel.map((level:number, index:number) => (
          <div
            key={index}
            className="w-1.5 bg-cyan-500/80 rounded-full transition-all duration-75"
            style={{
              height: `${Math.max(3, level)}px`,
              opacity: recording ? "1" : "0.5",
            }}
          />
        ))}
      </div>
    </div>
  );
};
