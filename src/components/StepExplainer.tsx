import React from 'react';
import type { ProtocolStep, TopologyNode } from '../types/protocol';
import { ArrowRight, BookOpen, Layers } from 'lucide-react';

interface StepExplainerProps {
  step: ProtocolStep;
  nodes: TopologyNode[];
}

export const StepExplainer: React.FC<StepExplainerProps> = ({ step, nodes }) => {
  const fromNode = nodes.find((n) => n.id === step.from);
  const toNode = nodes.find((n) => n.id === step.to);

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 shadow-lg relative overflow-hidden backdrop-blur-md">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header with tags and path */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {step.phase}
          </span>
          <span className="text-xs text-slate-400 font-mono">Step #{step.stepIndex + 1}</span>
        </div>

        {/* Sender -> Receiver flow pill */}
        <div className="flex items-center gap-2 bg-slate-950/80 border border-slate-800 px-3 py-1 rounded-full text-xs font-mono">
          <span className="text-cyan-400 font-semibold">{fromNode?.label || step.from}</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-emerald-400 font-semibold">{toNode?.label || step.to}</span>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base font-bold text-slate-100 mb-2 flex items-center gap-2">
        <span>{step.title}</span>
      </h3>

      {/* Plain-English summary */}
      <p className="text-sm text-slate-300 leading-relaxed mb-4">
        {step.explanation}
      </p>

      {/* RFC Note & Metadata */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-slate-800/70 text-xs">
        {step.rfcNote && (
          <div className="flex items-start gap-2 text-slate-400 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/50">
            <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-300/90 block">Specification Insight:</span>
              <span className="text-slate-300">{step.rfcNote}</span>
            </div>
          </div>
        )}

        <div className="flex items-start gap-2 text-slate-400 bg-slate-950/50 p-2.5 rounded-xl border border-slate-800/50">
          <Layers className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-cyan-300/90 block">On-The-Wire Packet:</span>
            <span className="font-mono text-cyan-200">{step.packetSummary}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
