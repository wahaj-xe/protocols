import React, { useState, useMemo } from 'react';
import type { ProtocolId, ProtocolGroup } from '../types/protocol';
import { PROTOCOL_CATALOG, GROUP_COUNTS } from '../data/catalog';
import { ChevronRight, Lock, Search, X, Radio } from 'lucide-react';

interface ProtocolSidebarProps {
  currentProtocolId: ProtocolId;
  onSelectProtocol: (id: ProtocolId) => void;
  isOpen: boolean;
  onClose?: () => void;
  isDocked?: boolean;
}

export const ProtocolSidebar: React.FC<ProtocolSidebarProps> = ({
  currentProtocolId,
  onSelectProtocol,
  isOpen,
  onClose,
  isDocked = false,
}) => {
  const [selectedGroup, setSelectedGroup] = useState<ProtocolGroup>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter items by category tab & search query
  const filteredList = useMemo(() => {
    return PROTOCOL_CATALOG.filter((item) => {
      // Group filter
      if (selectedGroup !== 'all' && item.group !== selectedGroup) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(query) ||
          item.full.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query) ||
          item.standard.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [selectedGroup, searchQuery]);

  if (!isOpen && !isDocked) return null;

  return (
    <aside
      className={`bg-[#080f1e] border-r border-[#1a2948] flex flex-col transition-all duration-300 z-40 ${
        isDocked
          ? 'w-80 shrink-0 h-[calc(100vh-65px)] sticky top-[65px]'
          : 'fixed inset-y-0 left-0 w-84 sm:w-96 shadow-2xl shadow-black/80'
      }`}
    >
      {/* Drawer Top Header (if mobile/overlay) */}
      {!isDocked && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#141f36] bg-[#060c18]">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Protocol Library (39)
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Category Tabs (Exact screenshot match) */}
      <div className="border-b border-[#16233d] bg-[#070d1a]">
        <div className="grid grid-cols-4 text-center">
          {/* ALL 39 */}
          <button
            onClick={() => setSelectedGroup('all')}
            className={`py-2.5 px-1 flex items-center justify-center gap-1.5 text-xs font-bold transition cursor-pointer border-b-2 ${
              selectedGroup === 'all'
                ? 'border-blue-500 text-white bg-[#0e1933]'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0b1429]'
            }`}
          >
            <span>ALL</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                selectedGroup === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#15213b] text-blue-400'
              }`}
            >
              {GROUP_COUNTS.all}
            </span>
          </button>

          {/* CORE 11 */}
          <button
            onClick={() => setSelectedGroup('core')}
            className={`py-2.5 px-1 flex items-center justify-center gap-1.5 text-xs font-bold transition cursor-pointer border-b-2 ${
              selectedGroup === 'core'
                ? 'border-blue-500 text-white bg-[#0e1933]'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0b1429]'
            }`}
          >
            <span>CORE</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                selectedGroup === 'core'
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#15213b] text-blue-400'
              }`}
            >
              {GROUP_COUNTS.core}
            </span>
          </button>

          {/* APPLICATION 19 */}
          <button
            onClick={() => setSelectedGroup('application')}
            className={`py-2.5 px-1 flex items-center justify-center gap-1.5 text-xs font-bold transition cursor-pointer border-b-2 ${
              selectedGroup === 'application'
                ? 'border-blue-500 text-white bg-[#0e1933]'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0b1429]'
            }`}
          >
            <span className="truncate">APP</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                selectedGroup === 'application'
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#15213b] text-blue-400'
              }`}
            >
              {GROUP_COUNTS.application}
            </span>
          </button>

          {/* SECURITY 9 */}
          <button
            onClick={() => setSelectedGroup('security')}
            className={`py-2.5 px-1 flex items-center justify-center gap-1.5 text-xs font-bold transition cursor-pointer border-b-2 ${
              selectedGroup === 'security'
                ? 'border-blue-500 text-white bg-[#0e1933]'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#0b1429]'
            }`}
          >
            <span className="truncate">SEC</span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                selectedGroup === 'security'
                  ? 'bg-blue-600 text-white'
                  : 'bg-[#15213b] text-blue-400'
              }`}
            >
              {GROUP_COUNTS.security}
            </span>
          </button>
        </div>

        {/* Real-time search filter */}
        <div className="p-2 border-t border-[#121b30]">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 39 protocols (e.g. WiFi, SSH)..."
              className="w-full bg-[#050a14] border border-[#1a2948] rounded-lg pl-8 pr-7 py-1 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-slate-500 hover:text-slate-300"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Protocols List View */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#10192e] scrollbar-thin">
        {filteredList.map((item) => {
          const isSelected = item.id === currentProtocolId;

          return (
            <div
              key={item.id}
              onClick={() => {
                onSelectProtocol(item.id);
                if (onClose && !isDocked) onClose();
              }}
              className={`group flex items-center justify-between px-3.5 py-3 transition-colors cursor-pointer select-none ${
                isSelected
                  ? 'bg-[#111e3b] border-l-2 border-blue-400'
                  : 'hover:bg-[#0d162b]'
              }`}
            >
              {/* Left Column: Radio Circle + Name/Description */}
              <div className="flex items-center gap-3 min-w-0">
                {/* Radio status ring */}
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected
                      ? 'border-blue-400 bg-blue-500/20 shadow-sm shadow-blue-500/50'
                      : 'border-[#263757] group-hover:border-[#3b517d]'
                  }`}
                >
                  {isSelected && (
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  )}
                </div>

                {/* Protocol Info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`font-mono text-xs font-bold tracking-tight truncate ${
                        isSelected
                          ? 'text-blue-300'
                          : 'text-slate-200 group-hover:text-white'
                      }`}
                    >
                      {item.name}
                    </span>

                    {/* Lock Icon */}
                    {item.isLocked && (
                      <Lock className="w-3 h-3 text-slate-500 shrink-0" />
                    )}
                  </div>

                  <p className="text-[11px] text-[#7187a8] truncate group-hover:text-slate-300 transition-colors">
                    {item.full}
                  </p>
                </div>
              </div>

              {/* Right Column: Chevron */}
              <div className="shrink-0 pl-2">
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    isSelected
                      ? 'text-blue-400 translate-x-0.5'
                      : 'text-[#3b4c6e] group-hover:text-slate-300 group-hover:translate-x-0.5'
                  }`}
                />
              </div>
            </div>
          );
        })}

        {filteredList.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            No protocols found matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Bottom Info Bar */}
      <div className="px-3.5 py-2.5 bg-[#050a14] border-t border-[#131d33] flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>All 39 Protocols Unlocked</span>
        </div>
        <span className="font-mono text-[10px] text-slate-500">{filteredList.length} shown</span>
      </div>
    </aside>
  );
};
