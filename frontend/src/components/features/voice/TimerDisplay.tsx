import React, { FC } from "react";

type TimerDisplayProps={
    timer:number;
}
export const TimerDisplay:FC<TimerDisplayProps> = ({timer}) => {
  return (
    <div className="text-center mb-8">
      <span className="text-cyan-400 font-mono text-xl">
        {timer.toFixed(1)}s
      </span>
    </div>
  );
};
