import React, { useState, useMemo } from 'react';
import type { ProtocolStep, PacketField } from '../types/protocol';
import { Binary, Layers, ChevronDown, ChevronRight, Copy, Check } from 'lucide-react';

interface PacketInspectorProps {
  step: ProtocolStep;
}

export const PacketInspector: React.FC<PacketInspectorProps> = ({ step }) => {
  const [hoveredFieldId, setHoveredFieldId] = useState<string | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expandedLayers, setExpandedLayers] = useState<Record<string, boolean>>({
    '0': true,
    '1': true,
    '2': true,
    '3': true,
  });

  // Parse raw hex string into array of 2-char hex bytes
  const hexBytes = useMemo(() => {
    // Remove bracketed descriptions e.g. [Encrypted...] or comments
    const cleanHex = step.rawHex.replace(/\[.*?\]/g, '').trim();
    return cleanHex.split(/\s+/).filter((b) => /^[0-9a-fA-F]{2}$/.test(b));
  }, [step.rawHex]);

  // Find active field
  const activeField = useMemo(() => {
    const targetId = hoveredFieldId || selectedFieldId;
    if (!targetId) return null;
    for (const layer of step.layers) {
      const f = layer.fields.find((field) => field.id === targetId);
      if (f) return f;
    }
    return null;
  }, [hoveredFieldId, selectedFieldId, step.layers]);

  // Check if a byte index is inside active field range
  const isByteActive = (byteIndex: number) => {
    if (!activeField) return false;
    return byteIndex >= activeField.byteRange[0] && byteIndex <= activeField.byteRange[1];
  };

  // Find which field owns this byte
  const getFieldForByte = (byteIndex: number): PacketField | null => {
    for (const layer of step.layers) {
      for (const field of layer.fields) {
        if (byteIndex >= field.byteRange[0] && byteIndex <= field.byteRange[1]) {
          return field;
        }
      }
    }
    return null;
  };

  const toggleLayer = (index: number) => {
    setExpandedLayers((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const handleCopyHex = () => {
    navigator.clipboard.writeText(step.rawHex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format bytes into 16-byte chunks for the hex dump
  const rows = useMemo(() => {
    const result: { offset: string; bytes: string[]; ascii: string; startIndex: number }[] = [];
    for (let i = 0; i < hexBytes.length; i += 16) {
      const slice = hexBytes.slice(i, i + 16);
      const offset = i.toString(16).padStart(4, '0');
      const ascii = slice
        .map((hex) => {
          const code = parseInt(hex, 16);
          return code >= 32 && code <= 126 ? String.fromCharCode(code) : '.';
        })
        .join('');

      result.push({ offset, bytes: slice, ascii, startIndex: i });
    }
    return result;
  }, [hexBytes]);

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 shadow-xl backdrop-blur-md flex flex-col h-full min-h-[480px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/70 mb-3">
        <div className="flex items-center gap-2">
          <Binary className="w-4 h-4 text-cyan-400" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Wireshark Packet Dissector & Hex View
          </h4>
        </div>

        <button
          onClick={handleCopyHex}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 transition cursor-pointer"
          title="Copy raw hex packet dump"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy Hex'}</span>
        </button>
      </div>

      {/* Main split grid: Protocol Tree (left) vs Hex Viewer (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 overflow-hidden">
        {/* Left: Collapsible Layer Tree (5 cols) */}
        <div className="lg:col-span-5 flex flex-col overflow-y-auto pr-1 max-h-[400px] lg:max-h-full scrollbar-thin space-y-2">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 px-1">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>Encapsulation Layers ({step.layers.length})</span>
          </div>

          {step.layers.map((layer, lIdx) => {
            const isExpanded = expandedLayers[lIdx] ?? true;

            return (
              <div
                key={layer.name}
                className="border border-slate-800/90 rounded-xl overflow-hidden bg-slate-950/60"
              >
                {/* Layer Title Bar */}
                <button
                  onClick={() => toggleLayer(lIdx)}
                  className="w-full flex items-center justify-between px-3 py-2 bg-slate-900/80 hover:bg-slate-800/60 transition text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: layer.color }}
                    />
                    <span className="text-xs font-bold text-slate-200">
                      {layer.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                    {layer.protocol}
                  </span>
                </button>

                {/* Layer Fields */}
                {isExpanded && (
                  <div className="p-2 space-y-1 bg-slate-950/40">
                    {layer.fields.map((field) => {
                      const isHovered = hoveredFieldId === field.id || selectedFieldId === field.id;
                      return (
                        <div
                          key={field.id}
                          onMouseEnter={() => setHoveredFieldId(field.id)}
                          onMouseLeave={() => setHoveredFieldId(null)}
                          onClick={() => setSelectedFieldId(field.id === selectedFieldId ? null : field.id)}
                          className={`p-2 rounded-lg transition-all cursor-pointer text-xs ${
                            isHovered
                              ? 'bg-cyan-950/70 border border-cyan-500/60 shadow-sm'
                              : 'bg-slate-900/40 hover:bg-slate-800/50 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                              <span
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: field.color }}
                              />
                              {field.name}
                            </span>
                            <span className="font-mono text-[10px] text-slate-400">
                              bytes [{field.byteRange[0]}..{field.byteRange[1]}]
                            </span>
                          </div>

                          <div className="font-mono text-cyan-300 text-[11px] truncate">
                            {field.value}
                          </div>

                          {isHovered && (
                            <p className="text-[10px] text-slate-300 mt-1 leading-normal border-t border-slate-800/60 pt-1">
                              {field.description}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right: Hex Dump (7 cols) */}
        <div className="lg:col-span-7 flex flex-col bg-slate-950 rounded-xl border border-slate-800 p-3 overflow-hidden">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
            <span className="font-mono">Offset (Hex)</span>
            <span className="font-mono hidden sm:inline">00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F</span>
            <span className="font-mono">Decoded ASCII</span>
          </div>

          {/* Hex Lines */}
          <div className="flex-1 overflow-y-auto font-mono text-[11px] sm:text-xs leading-relaxed space-y-1 scrollbar-thin pr-1 select-text">
            {rows.map((row) => (
              <div key={row.offset} className="flex items-center justify-between gap-2 hover:bg-slate-900/60 rounded px-1">
                {/* Offset column */}
                <span className="text-slate-500 font-bold select-none w-10">
                  {row.offset}
                </span>

                {/* Hex Bytes column */}
                <div className="flex-1 grid grid-cols-16 gap-1 text-center">
                  {row.bytes.map((hex, bIdx) => {
                    const absIndex = row.startIndex + bIdx;
                    const active = isByteActive(absIndex);
                    const ownerField = getFieldForByte(absIndex);

                    return (
                      <span
                        key={absIndex}
                        onMouseEnter={() => ownerField && setHoveredFieldId(ownerField.id)}
                        onMouseLeave={() => setHoveredFieldId(null)}
                        className={`inline-block px-0.5 rounded cursor-pointer transition-all ${
                          active
                            ? 'bg-cyan-500 text-slate-950 font-bold scale-110 shadow-sm shadow-cyan-400'
                            : ownerField
                            ? 'text-slate-300 hover:bg-slate-800'
                            : 'text-slate-600'
                        }`}
                        title={ownerField ? `${ownerField.name}: ${ownerField.value}` : `Byte ${absIndex}`}
                      >
                        {hex}
                      </span>
                    );
                  })}
                </div>

                {/* ASCII preview */}
                <span className="text-slate-400 tracking-wider w-20 text-right truncate">
                  {row.ascii}
                </span>
              </div>
            ))}
          </div>

          {/* Bottom active field tooltip */}
          {activeField ? (
            <div className="mt-3 p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-between text-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeField.color }} />
                <span className="font-semibold text-cyan-300">{activeField.name}:</span>
                <span className="font-mono text-slate-200">{activeField.value}</span>
              </div>
              <span className="text-[10px] font-mono text-cyan-400/80">
                Offsets {activeField.byteRange[0]}-{activeField.byteRange[1]}
              </span>
            </div>
          ) : (
            <div className="mt-3 text-[11px] text-slate-500 text-center italic">
              Hover over any protocol field or hex byte to inspect its boundaries
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
