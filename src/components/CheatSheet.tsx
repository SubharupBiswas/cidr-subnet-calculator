import React, { useState, useRef, useEffect } from 'react';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';
import { getMaskLong, longToIp } from '../utils/ipv4Utils';

interface CheatSheetProps {
  currentPrefix: number;
  onSelectPrefix: (prefix: number) => void;
}

interface SheetRow {
  prefix: number;
  mask: string;
  wildcard: string;
  hosts: number;
}

export const CheatSheet: React.FC<CheatSheetProps> = ({
  currentPrefix,
  onSelectPrefix,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeRowRef = useRef<HTMLTableRowElement | null>(null);

  // Generate cheat sheet data
  const cheatSheetData: SheetRow[] = [];
  for (let p = 1; p <= 32; p++) {
    const maskLong = getMaskLong(p);
    const wildcardLong = ~maskLong >>> 0;
    const hostsCount = p === 32 ? 1 : p === 31 ? 2 : Math.pow(2, 32 - p) - 2;

    cheatSheetData.push({
      prefix: p,
      mask: longToIp(maskLong),
      wildcard: longToIp(wildcardLong),
      hosts: hostsCount,
    });
  }

  // Scroll active prefix row into view inside scroll area when opened
  useEffect(() => {
    if (isOpen && activeRowRef.current) {
      activeRowRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [isOpen, currentPrefix]);

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group focus:outline-none"
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">CIDR Subnet Cheat Sheet</h2>
        </div>
        <div className="p-1 rounded-lg border border-zinc-800 bg-zinc-900/40 text-zinc-400 group-hover:text-zinc-200 transition-all">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {isOpen && (
        <div className="flex flex-col gap-4 mt-2 animate-fade-in">
          <p className="text-xs text-zinc-500">
            Click on any row prefix to load that mask size into the calculator. Active configuration is highlighted.
          </p>

          <div className="overflow-y-auto border border-zinc-800/80 rounded-xl bg-zinc-950/20 max-h-[400px]">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead className="sticky top-0 bg-zinc-900 z-10 border-b border-zinc-850 shadow-sm">
                <tr className="text-zinc-400 font-semibold tracking-wider text-[10px] uppercase">
                  <th className="py-2.5 px-4 w-16 text-center">CIDR</th>
                  <th className="py-2.5 px-4">Subnet Mask</th>
                  <th className="py-2.5 px-4">Wildcard Mask</th>
                  <th className="py-2.5 px-4 text-right">Usable Hosts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {cheatSheetData.map((row) => {
                  const isActive = row.prefix === currentPrefix;
                  return (
                    <tr
                      key={row.prefix}
                      ref={isActive ? activeRowRef : null}
                      onClick={() => onSelectPrefix(row.prefix)}
                      className={`cursor-pointer transition-all ${
                        isActive
                          ? 'bg-cyan-500/10 hover:bg-cyan-500/15 text-cyan-400 font-semibold'
                          : 'hover:bg-zinc-900/30 text-zinc-300'
                      }`}
                    >
                      <td className={`py-2.5 px-4 text-center font-bold font-mono ${isActive ? 'text-cyan-400' : 'text-zinc-500'}`}>
                        /{row.prefix}
                      </td>
                      <td className="py-2.5 px-4 font-medium">{row.mask}</td>
                      <td className="py-2.5 px-4 text-zinc-500">{row.wildcard}</td>
                      <td className="py-2.5 px-4 text-right font-bold pr-5">
                        {row.hosts.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
