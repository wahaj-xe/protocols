import React, { useEffect, useRef } from 'react';
import type { ProtocolScenario } from '../types/protocol';
import { Play, Pause, SkipBack, SkipForward, ChevronLeft, ChevronRight, Gauge } from 'lucide-react';

interface TimelineControllerProps {
  scenario: ProtocolScenario;
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const TimelineController: React.FC<TimelineControllerProps> = ({
  scenario,
  currentStepIndex,
  onStepChange,
  isPlaying,
  onTogglePlay,
  speed,
  onSpeedChange,
}) => {
  const totalSteps = scenario.steps.length;
  const currentStep = scenario.steps[currentStepIndex];
  const stepRef = useRef(currentStepIndex);
  stepRef.current = currentStepIndex;

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = Math.max(1200 / speed, 400);
    const timer = setInterval(() => {
      const nextStep = stepRef.current + 1;
      if (nextStep >= totalSteps) {
        onTogglePlay(); // stop at end
      } else {
        onStepChange(nextStep);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, speed, totalSteps, onStepChange, onTogglePlay]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.code === 'Space') {
        e.preventDefault();
        onTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        if (currentStepIndex < totalSteps - 1) onStepChange(currentStepIndex + 1);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        if (currentStepIndex > 0) onStepChange(currentStepIndex - 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex, totalSteps, onStepChange, onTogglePlay]);

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-md">
      {/* Top row: controls + phase tag */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onStepChange(0)}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            title="Jump to beginning"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          <button
            onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            title="Previous step (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={onTogglePlay}
            className={`px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-2 shadow-lg transition cursor-pointer ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
            }`}
            title="Play/Pause (Spacebar)"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play Simulation</span>
              </>
            )}
          </button>

          <button
            onClick={() => onStepChange(Math.min(totalSteps - 1, currentStepIndex + 1))}
            disabled={currentStepIndex === totalSteps - 1}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            title="Next step (Right Arrow)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onStepChange(totalSteps - 1)}
            disabled={currentStepIndex === totalSteps - 1}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
            title="Jump to final step"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Phase Badge & Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-slate-950/80 rounded-lg border border-slate-800 text-xs">
            <span className="text-slate-400">Phase:</span>
            <span className="font-semibold text-cyan-400">{currentStep?.phase || 'Running'}</span>
          </div>
          <div className="text-xs font-mono px-2.5 py-1 bg-cyan-950/50 text-cyan-300 border border-cyan-800/60 rounded-lg">
            Step {currentStepIndex + 1} / {totalSteps}
          </div>
        </div>

        {/* Speed toggle */}
        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs">
          <Gauge className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
          {[0.5, 1, 2].map((s) => (
            <button
              key={s}
              onClick={() => onSpeedChange(s)}
              className={`px-2 py-0.5 rounded-lg text-xs font-mono font-medium transition cursor-pointer ${
                speed === s
                  ? 'bg-cyan-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Scrubbable Multi-Step Timeline Bar */}
      <div className="space-y-1.5">
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${totalSteps}, minmax(0, 1fr))` }}>
          {scenario.steps.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isCompleted = idx < currentStepIndex;
            return (
              <button
                key={step.stepIndex}
                onClick={() => onStepChange(idx)}
                className={`group relative h-2.5 rounded-full transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-400 ring-2 ring-cyan-400/50 ring-offset-2 ring-offset-slate-900 shadow-md shadow-cyan-400/50 scale-y-125'
                    : isCompleted
                    ? 'bg-indigo-500/70 hover:bg-indigo-400'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
                title={`Step ${idx + 1}: ${step.title}`}
              >
                {/* Step tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-30">
                  <div className="bg-slate-950 text-slate-200 text-[11px] py-1 px-2.5 rounded-lg shadow-xl border border-slate-800 whitespace-nowrap">
                    <span className="font-semibold text-cyan-400">Step {idx + 1}:</span> {step.packetName}
                  </div>
                  <div className="w-2 h-2 bg-slate-950 border-r border-b border-slate-800 rotate-45 -mt-1" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Phase labels beneath the track */}
        <div className="flex justify-between items-center text-[10px] text-slate-400 px-1 pt-1">
          <span>Start ({scenario.phases[0]})</span>
          <span className="text-slate-400">Press Space to play · Arrow keys to step</span>
          <span>End ({scenario.phases[scenario.phases.length - 1]})</span>
        </div>
      </div>
    </div>
  );
};
