import React, { useState, useEffect } from 'react';
import type { ProtocolId } from './types/protocol';
import { PROTOCOL_REGISTRY, getProtocol } from './data/protocols';
import { Navbar } from './components/Navbar';
import { ProtocolSidebar } from './components/ProtocolSidebar';
import { TimelineController } from './components/TimelineController';
import { StepExplainer } from './components/StepExplainer';
import { NetworkTopology } from './components/NetworkTopology';
import { SequenceDiagram } from './components/SequenceDiagram';
import { PacketInspector } from './components/PacketInspector';
import { ExamMode } from './components/ExamMode';
import { Layers } from 'lucide-react';

export const App: React.FC = () => {
  const [currentProtocolId, setCurrentProtocolId] = useState<ProtocolId>('https');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [mode, setMode] = useState<'visualizer' | 'exam'>('visualizer');
  const [activeView, setActiveView] = useState<'split' | 'topology' | 'sequence' | 'inspector'>('split');

  // Sidebar states
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSidebarDocked, setIsSidebarDocked] = useState<boolean>(true);

  // Load protocol scenario from URL or default
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pParam = params.get('p') as ProtocolId;
    if (pParam && PROTOCOL_REGISTRY[pParam]) {
      setCurrentProtocolId(pParam);
    }
  }, []);

  const scenario = getProtocol(currentProtocolId);
  const currentStep = scenario.steps[currentStepIndex] || scenario.steps[0];

  // Handle switching protocols
  const handleSelectProtocol = (id: ProtocolId) => {
    setCurrentProtocolId(id);
    setCurrentStepIndex(0);
    setIsPlaying(false);

    // Update browser URL query param without reload
    const url = new URL(window.location.href);
    url.searchParams.set('p', id);
    window.history.pushState({}, '', url.toString());
  };

  return (
    <div className="min-h-screen bg-[#060a14] text-slate-100 flex flex-col font-sans selection:bg-blue-500/30 selection:text-blue-200">
      {/* Navigation Bar */}
      <Navbar
        currentProtocolId={currentProtocolId}
        onSelectProtocol={handleSelectProtocol}
        mode={mode}
        onSetMode={setMode}
        activeView={activeView}
        onSetActiveView={setActiveView}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isSidebarDocked={isSidebarDocked}
        onToggleDock={() => setIsSidebarDocked(!isSidebarDocked)}
      />

      {/* Main Container with Optional Docked Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Docked Left Sidebar (Desktop) */}
        {isSidebarDocked && (
          <div className="hidden lg:block shrink-0">
            <ProtocolSidebar
              currentProtocolId={currentProtocolId}
              onSelectProtocol={handleSelectProtocol}
              isOpen={true}
              isDocked={true}
            />
          </div>
        )}

        {/* Slide-out Mobile/Overlay Drawer */}
        {isSidebarOpen && !isSidebarDocked && (
          <>
            <div
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
            />
            <ProtocolSidebar
              currentProtocolId={currentProtocolId}
              onSelectProtocol={handleSelectProtocol}
              isOpen={true}
              isDocked={false}
              onClose={() => setIsSidebarOpen(false)}
            />
          </>
        )}

        {/* Center Application Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
          {mode === 'exam' ? (
            <ExamMode
              scenario={scenario}
              onExitExam={() => setMode('visualizer')}
            />
          ) : (
            <>
              {/* Protocol Meta Banner */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#091122]/80 border border-[#1b2b4d] rounded-2xl p-5 backdrop-blur-md">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/70 uppercase tracking-wider font-mono">
                      {scenario.group}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {scenario.standard}
                    </span>
                  </div>
                  <h1 className="text-2xl font-black tracking-tight text-white">
                    {scenario.name}
                  </h1>
                  <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
                    {scenario.description}
                  </p>
                </div>

                <div className="flex md:flex-col items-center md:items-end gap-2 shrink-0">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono bg-[#050a14] px-3 py-1.5 rounded-xl border border-[#16233d]">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>{scenario.nodes.length} Nodes</span>
                    <span className="text-slate-600">·</span>
                    <span>{scenario.steps.length} Packets</span>
                  </div>
                </div>
              </div>

              {/* Playback & Step Explainer Deck */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                <div className="lg:col-span-7">
                  <TimelineController
                    scenario={scenario}
                    currentStepIndex={currentStepIndex}
                    onStepChange={setCurrentStepIndex}
                    isPlaying={isPlaying}
                    onTogglePlay={() => setIsPlaying(!isPlaying)}
                    speed={speed}
                    onSpeedChange={setSpeed}
                  />
                </div>

                <div className="lg:col-span-5">
                  <StepExplainer
                    step={currentStep}
                    nodes={scenario.nodes}
                  />
                </div>
              </div>

              {/* Interactive Visualizations Canvas */}
              <div className="space-y-6">
                {/* Split View: Topology (Left) + Sequence Diagram (Right) */}
                {(activeView === 'split' || activeView === 'topology' || activeView === 'sequence') && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {(activeView === 'split' || activeView === 'topology') && (
                      <div className={activeView === 'topology' ? 'lg:col-span-12' : 'lg:col-span-7'}>
                        <NetworkTopology
                          nodes={scenario.nodes}
                          links={scenario.links}
                          currentStep={currentStep}
                          isPlaying={isPlaying}
                        />
                      </div>
                    )}

                    {(activeView === 'split' || activeView === 'sequence') && (
                      <div className={activeView === 'sequence' ? 'lg:col-span-12' : 'lg:col-span-5'}>
                        <SequenceDiagram
                          nodes={scenario.nodes}
                          steps={scenario.steps}
                          currentStepIndex={currentStepIndex}
                          onSelectStep={setCurrentStepIndex}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Wireshark Packet Byte Inspector (Hex Dump + Dissector) */}
                {(activeView === 'split' || activeView === 'inspector') && (
                  <div className="w-full">
                    <PacketInspector step={currentStep} />
                  </div>
                )}
              </div>
            </>
          )}

          {/* Footer */}
          <footer className="border-t border-[#121c33] bg-[#050a14]/80 px-4 py-6 mt-12 text-slate-500 text-xs rounded-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-300">Protocol Explorer</span>
                <span>—</span>
                <span>39 Protocols Visual Simulation Platform</span>
              </div>
              <div className="flex items-center gap-4 text-slate-400">
                <span>All 39 Protocols Unlocked</span>
                <span>·</span>
                <span>RFC Specs / IEEE 802.11 / Wireshark Hex</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
