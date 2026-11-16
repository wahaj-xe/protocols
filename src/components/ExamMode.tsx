import React, { useState } from 'react';
import type { ProtocolScenario } from '../types/protocol';
import { GraduationCap, CheckCircle2, XCircle, ArrowUp, ArrowDown, Trash2, RotateCcw, Award, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

interface ExamModeProps {
  scenario: ProtocolScenario;
  onExitExam: () => void;
}

export const ExamMode: React.FC<ExamModeProps> = ({ scenario, onExitExam }) => {
  const exam = scenario.exam;
  const [userSequence, setUserSequence] = useState<typeof exam.availablePool>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [showReference, setShowReference] = useState(false);

  // Add packet to sequence
  const handleAdd = (item: (typeof exam.availablePool)[0]) => {
    if (isSubmitted) return;
    setUserSequence((prev) => [...prev, item]);
  };

  // Remove packet from sequence
  const handleRemove = (index: number) => {
    if (isSubmitted) return;
    setUserSequence((prev) => prev.filter((_, i) => i !== index));
  };

  // Move packet up
  const handleMoveUp = (index: number) => {
    if (isSubmitted || index === 0) return;
    setUserSequence((prev) => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Move packet down
  const handleMoveDown = (index: number) => {
    if (isSubmitted || index >= userSequence.length - 1) return;
    setUserSequence((prev) => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  // Reset exam
  const handleReset = () => {
    setUserSequence([]);
    setIsSubmitted(false);
    setScore(null);
    setShowReference(false);
  };

  // Submit and grade
  const handleSubmit = () => {
    const expected = exam.expectedSequence;

    // Check message match
    let correctCount = 0;
    userSequence.forEach((item, idx) => {
      if (idx < expected.length && item.packetName === expected[idx].packetName && item.from === expected[idx].from) {
        correctCount++;
      }
    });

    const accuracyRate = expected.length > 0 ? (correctCount / expected.length) : 0;
    // Penalty for length discrepancy
    const lengthPenalty = Math.abs(userSequence.length - expected.length) * 10;

    const earned = Math.max(0, Math.round(accuracyRate * 100 - lengthPenalty));
    setScore(earned);
    setIsSubmitted(true);

    if (earned >= 80) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 py-4 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-2xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <GraduationCap className="w-5 h-5 text-indigo-400" />
              <span className="text-xs font-bold tracking-wider uppercase text-indigo-400">
                Protocol Challenge Exam
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-100">{exam.title}</h2>
            <p className="text-sm text-slate-300 mt-1">{exam.instruction}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-medium transition cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
            <button
              onClick={onExitExam}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-lg shadow-cyan-600/20 transition cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>Back to Explorer</span>
            </button>
          </div>
        </div>

        {/* Results Banner if submitted */}
        {isSubmitted && (
          <div className="mt-6 p-4 rounded-xl bg-slate-950/90 border border-indigo-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${score! >= 80 ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/50' : 'bg-rose-950 text-rose-400 border border-rose-500/50'}`}>
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-100">
                  {score! >= 80 ? 'Exam Passed! Exceptional Understanding.' : 'Review Needed — Try Again!'}
                </h4>
                <p className="text-xs text-slate-400">
                  Target passing threshold: 80/100 · Your score: <span className="font-bold text-indigo-300">{score}/100</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowReference(!showReference)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition cursor-pointer"
            >
              {showReference ? 'Show My Answer' : 'Show Reference Solution'}
            </button>
          </div>
        )}
      </div>

      {/* Main Exam Grid: Available Packets vs User Submission */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Available Packets Pool (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Packet Cards Pool
            </h4>
            <span className="text-[11px] text-slate-400">Click to add to sequence</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            {exam.availablePool.map((item) => (
              <div
                key={item.id}
                onClick={() => handleAdd(item)}
                className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-indigo-500/60 hover:bg-slate-900 transition-all cursor-pointer group flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60">
                      {item.protocol}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {item.from} &rarr; {item.to}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors">
                    {item.packetName}
                  </span>
                </div>

                <span className="text-xs font-bold text-indigo-400 group-hover:scale-125 transition-transform">
                  +
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Your Ordered Sequence Workspace (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-[520px]">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {showReference ? 'Reference Solution' : 'Your Chronological Sequence'}
            </h4>
            <span className="text-[11px] text-slate-400">
              {showReference ? `${exam.expectedSequence.length} items` : `${userSequence.length} items added`}
            </span>
          </div>

          {/* Sequence cards */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
            {showReference ? (
              // Reference solution display
              exam.expectedSequence.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/80 border border-emerald-500/40 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mb-0.5">
                        <span className="text-emerald-400 font-bold">{item.protocol}</span>
                        <span>{item.from} &rarr; {item.to}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-200">
                        {item.packetName}
                      </span>
                    </div>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              ))
            ) : userSequence.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-center p-6 border-2 border-dashed border-slate-800/80 rounded-xl">
                <GraduationCap className="w-10 h-10 text-slate-600 mb-2" />
                <p className="text-sm font-medium text-slate-400">Sequence is currently empty</p>
                <p className="text-xs text-slate-500 mt-1 max-w-sm">
                  Click packet cards from the pool on the left to reconstruct the conversation from start to finish.
                </p>
              </div>
            ) : (
              // User sequence items
              userSequence.map((item, idx) => {
                const isCorrect = isSubmitted && idx < exam.expectedSequence.length && item.packetName === exam.expectedSequence[idx].packetName;
                return (
                  <div
                    key={`${item.id}-${idx}`}
                    className={`p-3 rounded-xl flex items-center justify-between gap-3 transition-all ${
                      isSubmitted
                        ? isCorrect
                          ? 'bg-emerald-950/40 border border-emerald-500/50'
                          : 'bg-rose-950/40 border border-rose-500/50'
                        : 'bg-slate-950/90 border border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-bold flex items-center justify-center font-mono shrink-0">
                        {idx + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 mb-0.5">
                          <span className="text-indigo-400 font-semibold">{item.protocol}</span>
                          <span>{item.from} &rarr; {item.to}</span>
                        </div>
                        <span className="text-xs font-semibold text-slate-200 truncate block">
                          {item.packetName}
                        </span>
                      </div>
                    </div>

                    {/* Ordering / action buttons */}
                    {!isSubmitted && (
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => handleMoveUp(idx)}
                          disabled={idx === 0}
                          className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveDown(idx)}
                          disabled={idx === userSequence.length - 1}
                          className="p-1 rounded bg-slate-800 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemove(idx)}
                          className="p-1 rounded bg-rose-950/60 text-rose-400 hover:bg-rose-900 cursor-pointer ml-1"
                          title="Delete Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    {isSubmitted && (
                      <div>
                        {isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-rose-400" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom Submit Action */}
          {!showReference && (
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                {userSequence.length} / {exam.expectedSequence.length} expected steps
              </span>

              <button
                onClick={handleSubmit}
                disabled={userSequence.length === 0 || isSubmitted}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white shadow-lg shadow-indigo-600/30 transition cursor-pointer"
              >
                {isSubmitted ? 'Exam Submitted' : 'Grade My Sequence'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
