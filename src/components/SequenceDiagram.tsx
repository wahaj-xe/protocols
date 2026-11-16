import React, { useRef, useEffect } from 'react';
import type { TopologyNode, ProtocolStep } from '../types/protocol';
import { GitCommit, ArrowRight, ArrowLeft } from 'lucide-react';

interface SequenceDiagramProps {
  nodes: TopologyNode[];
  steps: ProtocolStep[];
  currentStepIndex: number;
  onSelectStep: (index: number) => void;
}

export const SequenceDiagram: React.FC<SequenceDiagramProps> = ({
  nodes,
  steps,
  currentStepIndex,
  onSelectStep,
}) => {
  const activeStepRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to active step
  useEffect(() => {
    if (activeStepRef.current) {
      activeStepRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [currentStepIndex]);

  // Compute column index for each node
  const nodeIndexMap = new Map(nodes.map((node, i) => [node.id, i]));
  const totalNodes = nodes.length;

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col h-full min-h-[380px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/70 mb-3">
        <div className="flex items-center gap-2">
          <GitCommit className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Sequence Flow (Lifelines)
          </h4>
        </div>
        <span className="text-[11px] text-slate-400">Click any message to jump</span>
      </div>

      {/* Lifeline Headers (Actor Nodes) */}
      <div className="grid border-b border-slate-800/80 pb-2 mb-2 sticky top-0 bg-slate-900/95 z-10" style={{ gridTemplateColumns: `repeat(${totalNodes}, minmax(0, 1fr))` }}>
        {nodes.map((node) => (
          <div key={node.id} className="text-center px-1">
            <span className="block text-[11px] font-bold text-slate-200 truncate">
              {node.label}
            </span>
            <span className="text-[9px] font-mono text-slate-500 truncate block">
              {node.ip}
            </span>
          </div>
        ))}
      </div>

      {/* Messages Flow Container */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
        {steps.map((step, idx) => {
          const isActive = idx === currentStepIndex;
          const fromIdx = nodeIndexMap.get(step.from) ?? 0;
          const toIdx = nodeIndexMap.get(step.to) ?? 1;
          const isLeftToRight = fromIdx < toIdx;

          // Calculate percentage span across columns
          const colWidth = 100 / totalNodes;
          const startLeft = (Math.min(fromIdx, toIdx) + 0.5) * colWidth;
          const endLeft = (Math.max(fromIdx, toIdx) + 0.5) * colWidth;
          const arrowWidth = Math.abs(endLeft - startLeft);

          return (
            <div
              key={step.stepIndex}
              ref={isActive ? activeStepRef : null}
              onClick={() => onSelectStep(idx)}
              className={`relative py-2.5 px-2 rounded-xl transition-all cursor-pointer group ${
                isActive
                  ? 'bg-slate-800/90 border border-cyan-500/50 shadow-md shadow-cyan-500/10'
                  : 'hover:bg-slate-800/40 border border-transparent'
              }`}
            >
              {/* Background vertical lifeline guides */}
              <div className="absolute inset-0 grid pointer-events-none" style={{ gridTemplateColumns: `repeat(${totalNodes}, minmax(0, 1fr))` }}>
                {nodes.map((node) => (
                  <div key={node.id} className="flex justify-center h-full">
                    <div className={`w-[1px] ${isActive ? 'bg-cyan-500/20' : 'bg-slate-800/50'}`} />
                  </div>
                ))}
              </div>

              {/* Message metadata top row */}
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 relative z-10 px-1">
                <div className="flex items-center gap-1.5 font-mono">
                  <span className={`px-1.5 py-0.2 rounded font-bold ${
                    isActive ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-400'
                  }`}>
                    #{idx + 1}
                  </span>
                  <span className="text-slate-300 font-semibold">{step.packetName}</span>
                </div>
                <span className="text-slate-500 text-[9px]">{step.phase}</span>
              </div>

              {/* Graphical Arrow */}
              <div className="relative h-6 flex items-center z-10">
                <div
                  className="absolute flex items-center"
                  style={{
                    left: `${startLeft}%`,
                    width: `${arrowWidth}%`,
                  }}
                >
                  {/* Arrow stem line */}
                  <div className={`flex-1 h-[2px] transition-colors ${
                    isActive ? 'bg-cyan-400 shadow-sm shadow-cyan-400' : 'bg-slate-600 group-hover:bg-slate-400'
                  }`} />

                  {/* Arrowhead */}
                  {isLeftToRight ? (
                    <ArrowRight className={`w-3.5 h-3.5 -ml-2 transition-colors ${
                      isActive ? 'text-cyan-400 fill-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`} />
                  ) : (
                    <ArrowLeft className={`w-3.5 h-3.5 -mr-2 order-first transition-colors ${
                      isActive ? 'text-cyan-400 fill-cyan-400' : 'text-slate-500 group-hover:text-slate-300'
                    }`} />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
