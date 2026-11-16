import React from 'react';
import type { ProtocolId } from '../types/protocol';
import { getProtocol } from '../data/protocols';
import { Network, GraduationCap, Eye, Menu, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface NavbarProps {
  currentProtocolId: ProtocolId;
  onSelectProtocol: (id: ProtocolId) => void;
  mode: 'visualizer' | 'exam';
  onSetMode: (mode: 'visualizer' | 'exam') => void;
  activeView: 'split' | 'topology' | 'sequence' | 'inspector';
  onSetActiveView: (view: 'split' | 'topology' | 'sequence' | 'inspector') => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isSidebarDocked: boolean;
  onToggleDock: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentProtocolId,
  mode,
  onSetMode,
  activeView,
  onSetActiveView,
  isSidebarOpen,
  onToggleSidebar,
  isSidebarDocked,
  onToggleDock,
}) => {
  const activeScenario = getProtocol(currentProtocolId);

  return (
    <header className="border-b border-slate-800 bg-[#070d18]/90 backdrop-blur-md sticky top-0 z-50 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Brand & Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {/* Sidebar Drawer Toggle Button */}
          <button
            onClick={onToggleSidebar}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold shadow-sm transition cursor-pointer ${
              isSidebarOpen || isSidebarDocked
                ? 'bg-[#16274a] border-blue-400 text-cyan-200'
                : 'bg-[#0f1b33] hover:bg-[#16274a] border-[#21355c] text-cyan-300'
            }`}
            title="Browse all 39 network protocols"
          >
            <Menu className="w-4 h-4 text-cyan-400" />
            <span className="font-mono">Protocols (39)</span>
          </button>

          {/* Desktop dock pin toggle */}
          <button
            onClick={onToggleDock}
            className="hidden lg:flex p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition cursor-pointer"
            title={isSidebarDocked ? 'Undock sidebar' : 'Pin sidebar to layout'}
          >
            {isSidebarDocked ? (
              <PanelLeftClose className="w-4 h-4 text-cyan-400" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" />
            )}
          </button>

          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-fuchsia-600 p-[1.5px] shadow-md shadow-cyan-500/20">
              <div className="h-full w-full bg-[#080d1a] rounded-[10px] flex items-center justify-center">
                <Network className="w-4 h-4 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                  PROTOCOL EXPLORER
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.2 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/60 hidden sm:inline-block">
                  39 Protocols
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Active Protocol Pill */}
        <div className="flex items-center gap-2 bg-[#091122] border border-[#1b2b4d] px-3 py-1 rounded-xl text-xs">
          <span className="text-slate-400">Current:</span>
          <span className="font-mono font-bold text-cyan-300">{activeScenario.name}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 uppercase font-mono">
            {activeScenario.group}
          </span>
        </div>

        {/* Mode & View Toggles */}
        <div className="flex items-center gap-2">
          {/* Mode switch */}
          <div className="flex bg-slate-900 border border-slate-800 p-0.5 rounded-lg">
            <button
              onClick={() => onSetMode('visualizer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                mode === 'visualizer'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Explore</span>
            </button>
            <button
              onClick={() => onSetMode('exam')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer ${
                mode === 'exam'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Exam Mode</span>
            </button>
          </div>

          {/* View filter (only when in visualizer mode) */}
          {mode === 'visualizer' && (
            <div className="hidden xl:flex bg-slate-900 border border-slate-800 p-0.5 rounded-lg text-xs">
              <button
                onClick={() => onSetActiveView('split')}
                className={`px-2.5 py-1 rounded cursor-pointer ${
                  activeView === 'split' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Split View"
              >
                Split
              </button>
              <button
                onClick={() => onSetActiveView('topology')}
                className={`px-2.5 py-1 rounded cursor-pointer ${
                  activeView === 'topology' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Topology View"
              >
                Topology
              </button>
              <button
                onClick={() => onSetActiveView('sequence')}
                className={`px-2.5 py-1 rounded cursor-pointer ${
                  activeView === 'sequence' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Sequence Diagram"
              >
                Sequence
              </button>
              <button
                onClick={() => onSetActiveView('inspector')}
                className={`px-2.5 py-1 rounded cursor-pointer ${
                  activeView === 'inspector' ? 'bg-slate-800 text-cyan-300' : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Packet Byte Inspector"
              >
                Inspector
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
