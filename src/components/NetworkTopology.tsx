import React, { useMemo } from 'react';
import type { TopologyNode, TopologyLink, ProtocolStep } from '../types/protocol';
import { Laptop, Router, Server, Globe, Shield, Wifi, Radio } from 'lucide-react';

interface NetworkTopologyProps {
  nodes: TopologyNode[];
  links: TopologyLink[];
  currentStep: ProtocolStep;
  isPlaying: boolean;
}

export const NetworkTopology: React.FC<NetworkTopologyProps> = ({
  nodes,
  links,
  currentStep,
  isPlaying,
}) => {
  // Find coordinates for from and to nodes
  const fromNode = useMemo(() => nodes.find((n) => n.id === currentStep.from), [nodes, currentStep.from]);
  const toNode = useMemo(() => nodes.find((n) => n.id === currentStep.to), [nodes, currentStep.to]);

  const getNodeIcon = (role: string) => {
    switch (role) {
      case 'client':
        return <Laptop className="w-5 h-5 text-cyan-400" />;
      case 'gateway':
        return <Router className="w-5 h-5 text-amber-400" />;
      case 'dns':
        return <Globe className="w-5 h-5 text-purple-400" />;
      case 'server':
        return <Server className="w-5 h-5 text-emerald-400" />;
      case 'ca':
        return <Shield className="w-5 h-5 text-rose-400" />;
      default:
        return <Radio className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-xl relative overflow-hidden backdrop-blur-md flex flex-col h-full min-h-[380px]">
      {/* Title bar */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/70 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Network Topology & Wire Simulation
          </h4>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-slate-400">
          <Wifi className="w-3.5 h-3.5 text-cyan-400" />
          <span>Interactive Packet Flow</span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative flex-1 w-full min-h-[300px]">
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.4" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Link Wires */}
          {links.map((link) => {
            const src = nodes.find((n) => n.id === link.source);
            const tgt = nodes.find((n) => n.id === link.target);
            if (!src || !tgt) return null;

            return (
              <g key={link.id}>
                {/* Background base wire */}
                <line
                  x1={`${src.x}%`}
                  y1={`${src.y}%`}
                  x2={`${tgt.x}%`}
                  y2={`${tgt.y}%`}
                  stroke="#1e293b"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                {/* Active gradient wire */}
                <line
                  x1={`${src.x}%`}
                  y1={`${src.y}%`}
                  x2={`${tgt.x}%`}
                  y2={`${tgt.y}%`}
                  stroke="url(#wireGradient)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
              </g>
            );
          })}

          {/* Active Packet Transmission Beam */}
          {fromNode && toNode && (
            <g>
              {/* Highlight path wire */}
              <line
                x1={`${fromNode.x}%`}
                y1={`${fromNode.y}%`}
                x2={`${toNode.x}%`}
                y2={`${toNode.y}%`}
                stroke="#38bdf8"
                strokeWidth="3"
                strokeOpacity="0.8"
                filter="url(#glow)"
              />

              {/* Animated packet traveling ball */}
              <circle r="7" fill="#38bdf8" filter="url(#glow)">
                <animate
                  attributeName="cx"
                  from={`${fromNode.x}%`}
                  to={`${toNode.x}%`}
                  dur={isPlaying ? "0.9s" : "1.4s"}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="cy"
                  from={`${fromNode.y}%`}
                  to={`${toNode.y}%`}
                  dur={isPlaying ? "0.9s" : "1.4s"}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          )}
        </svg>

        {/* Nodes Layer (DOM elements positioned over SVG) */}
        {nodes.map((node) => {
          const isFrom = node.id === currentStep.from;
          const isTo = node.id === currentStep.to;
          const isActive = isFrom || isTo;

          return (
            <div
              key={node.id}
              className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center group transition-transform duration-300"
              style={{ left: `${node.x}%`, top: `${node.y}%` }}
            >
              {/* Node Card */}
              <div
                className={`relative p-3 rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
                  isActive
                    ? 'bg-slate-900 border-2 border-cyan-400 shadow-lg shadow-cyan-500/30 scale-110 z-20'
                    : 'bg-slate-950/90 border border-slate-800 shadow-md hover:border-slate-700 z-10'
                }`}
              >
                {/* Node icon with ring */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center mb-1.5 transition-colors ${
                    isActive ? 'bg-cyan-950/80 text-cyan-300' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {getNodeIcon(node.role)}
                </div>

                {/* Node Label */}
                <span className="text-[11px] font-bold text-slate-200 text-center max-w-[110px] truncate leading-tight">
                  {node.label}
                </span>

                {/* Node IP Badge */}
                <span className="text-[9px] font-mono text-slate-400 mt-0.5">
                  {node.ip}
                </span>

                {/* Active Transmitter / Receiver Indicator */}
                {isFrom && (
                  <span className="absolute -top-2 px-1.5 py-0.2 rounded-full text-[9px] font-bold tracking-wider bg-cyan-500 text-slate-950 uppercase shadow-md">
                    TX (Sender)
                  </span>
                )}
                {isTo && (
                  <span className="absolute -top-2 px-1.5 py-0.2 rounded-full text-[9px] font-bold tracking-wider bg-emerald-500 text-slate-950 uppercase shadow-md">
                    RX (Target)
                  </span>
                )}
              </div>

              {/* Status pill beneath */}
              {node.activeState && (
                <div className="mt-1 px-2 py-0.5 rounded-md bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-cyan-400 animate-pulse' : 'bg-slate-600'}`} />
                  <span>{node.activeState}</span>
                </div>
              )}
            </div>
          );
        })}

        {/* Floating Active Packet Badge traveling in mid-air */}
        <div className="absolute bottom-2 left-3 right-3 bg-slate-950/90 border border-cyan-500/30 rounded-xl p-2.5 flex items-center justify-between shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-cyan-400">Current Packet:</span>
            <span className="text-xs font-mono font-medium text-slate-200">
              {currentStep.packetName}
            </span>
          </div>
          <div className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
            {currentStep.from} &rarr; {currentStep.to}
          </div>
        </div>
      </div>
    </div>
  );
};
