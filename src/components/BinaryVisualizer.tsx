"use client";

import { FC, Fragment, useRef } from 'react';
import { Activity } from 'lucide-react';
import { SubnetResult } from '../utils/ipv4Utils';

interface BinaryVisualizerProps {
  result: SubnetResult | null;
  ip: string;
  setIp: (ip: string) => void;
}

export const BinaryVisualizer: FC<BinaryVisualizerProps> = ({ result, ip, setIp }) => {
  const prefix = result?.prefix ?? 24;
  const rawBinary = result?.binaryIp?.replace(/\./g, '') || '11000000101010000000000100000001';
  const binaryScrollRef = useRef<HTMLDivElement>(null);

  const handleBitToggle = (e: React.MouseEvent<HTMLButtonElement>, bitIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    const chars = rawBinary.split('');
    chars[bitIndex] = chars[bitIndex] === '1' ? '0' : '1';
    const newBinary = chars.join('');
    const o1 = parseInt(newBinary.substring(0, 8), 2);
    const o2 = parseInt(newBinary.substring(8, 16), 2);
    const o3 = parseInt(newBinary.substring(16, 24), 2);
    const o4 = parseInt(newBinary.substring(24, 32), 2);
    setIp(`${o1}.${o2}.${o3}.${o4}`);
  };

  const bits = rawBinary.split('');

  // Build flattened stream with octet separators
  const stream: Array<{ type: 'bit'; index: number; value: string } | { type: 'sep'; id: string }> = [];
  for (let i = 0; i < 32; i++) {
    stream.push({ type: 'bit', index: i, value: bits[i] });
    if (i < 31 && (i + 1) % 8 === 0) {
      stream.push({ type: 'sep', id: `sep-${i}` });
    }
  }

  return (
    <div className="bento-card bento-card-hover p-4 md:p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-zinc-900 dark:text-[var(--color-text-main)] tracking-tight font-mono uppercase tracking-widest">Binary Stream</h2>
        </div>
        {/* Desktop carousel navigation — hidden on touch devices */}
        <div className="flex items-center gap-1 p-0.5 bg-blue-50/80 dark:bg-[var(--color-surface)] border border-blue-100 dark:border-[var(--color-border)] rounded-xl">
          <button
            type="button"
            aria-label="Scroll left"
            onClick={() => {
              if (binaryScrollRef.current) {
                binaryScrollRef.current.scrollBy({ left: -160, behavior: 'smooth' });
              }
            }}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center px-3 py-1.5 text-xs font-mono font-semibold rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-white dark:hover:bg-zinc-800/80 border border-transparent hover:border-blue-200 dark:hover:border-zinc-700/50 transition-all duration-200 cursor-pointer"
          >
            ◀
          </button>
          <button
            type="button"
            aria-label="Scroll right"
            onClick={() => {
              if (binaryScrollRef.current) {
                binaryScrollRef.current.scrollBy({ left: 160, behavior: 'smooth' });
              }
            }}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center px-3 py-1.5 text-xs font-mono font-semibold rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-white dark:hover:bg-zinc-800/80 border border-transparent hover:border-blue-200 dark:hover:border-zinc-700/50 transition-all duration-200 cursor-pointer"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Bit Stream & Labels */}
      <div ref={binaryScrollRef} className="flex items-center overflow-x-auto whitespace-nowrap scrollbar-none touch-pan-x pb-2 select-none gap-2" role="group" aria-label="32-bit binary representation">
        {[0, 1, 2, 3].map((octetIndex) => {
          const octetValue = parseInt(rawBinary.substring(octetIndex * 8, octetIndex * 8 + 8), 2);
          const label = ip.split('.')[octetIndex] || String(octetValue);

          return (
            <Fragment key={octetIndex}>
              {octetIndex > 0 && (
                <div className="w-px h-12 bg-zinc-300 dark:bg-zinc-700/60 self-center rounded-full shrink-0 mx-1" aria-hidden />
              )}
              <div className="flex flex-col items-center gap-3 shrink-0">
                {/* 8 Bits */}
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 8 }).map((_, bitOffset) => {
                    const index = octetIndex * 8 + bitOffset;
                    const value = bits[index] || '0';
                    const isNetBit = index < prefix;
                    const isOne = value === '1';

                    let bitClass = '';
                    if (isOne && isNetBit) {
                      bitClass = 'bg-emerald-500/15 dark:bg-emerald-500/25 border-emerald-500/30 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-300 shadow-sm dark:shadow-[0_0_8px_rgba(16,185,129,0.2)]';
                    } else if (isOne && !isNetBit) {
                      bitClass = 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/30 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 shadow-sm dark:shadow-[0_0_8px_rgba(245,158,11,0.15)]';
                    } else if (!isOne && isNetBit) {
                      bitClass = 'bg-emerald-100/50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/30 text-emerald-800 dark:text-emerald-750 hover:bg-emerald-200/50 dark:hover:bg-emerald-950/60 hover:border-emerald-300 dark:hover:border-emerald-700/40 hover:text-emerald-800';
                    } else {
                      bitClass = 'bg-[var(--color-inner-surface)] border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-inner-surface-hover)] hover:border-[var(--color-accent)] hover:text-[var(--color-text-main)] dark:bg-[var(--color-surface)] dark:border-[var(--color-border)] dark:hover:bg-zinc-800/80 dark:hover:border-zinc-700';
                    }

                    const bitWeight = Math.pow(2, 7 - bitOffset);

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={(e) => handleBitToggle(e, index)}
                        title={`Bit ${index} | Weight: ${bitWeight} | ${isNetBit ? 'Network' : 'Host'} bit`}
                        aria-label={`Bit ${index}, value ${value}, ${isNetBit ? 'network' : 'host'} bit`}
                        className={`w-7 h-8 sm:w-6 sm:h-7 rounded-sm border font-mono text-xs font-bold transition-all duration-100 cursor-pointer active:scale-90 flex items-center justify-center shrink-0 ${bitClass}`}
                      >
                        {value}
                      </button>
                    );
                  })}
                </div>

                {/* Octet Label */}
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[9px] font-mono text-zinc-700 dark:text-zinc-600 uppercase tracking-widest">oct {octetIndex + 1}</span>
                  <span className="text-xs font-mono font-bold text-zinc-700 dark:text-[var(--color-text-muted)]">{label}</span>
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>

      {/* Info note */}
      <p className="text-[10px] font-mono text-zinc-700 dark:text-zinc-600 leading-relaxed border-t border-zinc-200 dark:border-[var(--color-border)] pt-3">
        Click any bit to toggle. <span className="text-emerald-650 dark:text-emerald-500">Network bits</span> define the boundary — <span className="text-amber-650 dark:text-amber-500">Host bits</span> address endpoints.
      </p>
    </div>
  );
};
