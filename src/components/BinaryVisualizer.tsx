"use client";

import { FC } from 'react';
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

  const handleBitToggle = (bitIndex: number) => {
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
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[var(--color-border)] pb-4">
        <div className="flex items-center gap-2.5">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-zinc-900 dark:text-[var(--color-text-main)] tracking-tight font-mono uppercase tracking-widest">Binary Stream</h2>
        </div>
        {/* Legend */}
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[10px] font-mono font-semibold">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/20 dark:bg-emerald-500/30 border border-emerald-500/40 dark:border-emerald-500/50 inline-block" />
            <span className="text-emerald-600 dark:text-emerald-400">Net /{prefix}</span>
          </span>
          <span className="flex items-center gap-1.5 text-[10px] font-mono font-semibold">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 dark:border-amber-500/40 inline-block" />
            <span className="text-amber-600 dark:text-amber-400">Host /{32 - prefix}</span>
          </span>
        </div>
      </div>

      {/* Bit Stream */}
      <div className="flex items-center overflow-x-auto whitespace-nowrap scrollbar-none touch-pan-x pb-2 select-none" role="group" aria-label="32-bit binary representation">
        {stream.map((item) => {
          if (item.type === 'sep') {
            return (
              <div key={item.id} className="w-px h-6 bg-zinc-300 dark:bg-zinc-700/60 mx-1.5 self-center rounded-full shrink-0" aria-hidden />
            );
          }

          const { index, value } = item;
          const isNetBit = index < prefix;
          const isOne = value === '1';

          let bitClass = '';
          if (isOne && isNetBit) {
            bitClass = 'bg-emerald-500/15 dark:bg-emerald-500/25 border-emerald-500/30 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-300 shadow-sm dark:shadow-[0_0_8px_rgba(16,185,129,0.2)]';
          } else if (isOne && !isNetBit) {
            bitClass = 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/30 dark:border-amber-500/40 text-amber-700 dark:text-amber-300 shadow-sm dark:shadow-[0_0_8px_rgba(245,158,11,0.15)]';
          } else if (!isOne && isNetBit) {
            bitClass = 'bg-emerald-100/50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/30 text-emerald-500 dark:text-emerald-700 hover:bg-emerald-200/50 dark:hover:bg-emerald-950/60 hover:border-emerald-300 dark:hover:border-emerald-700/40 hover:text-emerald-650 dark:hover:text-emerald-500';
          } else {
            bitClass = 'bg-zinc-100/60 dark:bg-[var(--color-surface)] border-zinc-200 dark:border-[var(--color-border)] text-[var(--color-text-muted)] dark:text-zinc-600 hover:bg-zinc-200/80 dark:hover:bg-zinc-800/80 hover:border-zinc-350 dark:hover:border-zinc-700 hover:text-zinc-700 dark:hover:text-[var(--color-text-muted)]';
          }

          const bitWeight = Math.pow(2, 7 - (index % 8));

          return (
            <button
              key={index}
              onClick={() => handleBitToggle(index)}
              title={`Bit ${index} | Weight: ${bitWeight} | ${isNetBit ? 'Network' : 'Host'} bit`}
              aria-label={`Bit ${index}, value ${value}, ${isNetBit ? 'network' : 'host'} bit`}
              className={`w-7 h-8 sm:w-6 sm:h-7 rounded-sm border font-mono text-xs font-bold transition-all duration-100 cursor-pointer active:scale-90 flex items-center justify-center shrink-0 ${bitClass}`}
            >
              {value}
            </button>
          );
        })}
      </div>

      {/* Octet labels */}
      <div className="flex flex-col md:flex-row md:justify-between gap-3 md:gap-1">
        {[0, 1, 2, 3].map(i => {
          const octetValue = parseInt(rawBinary.substring(i * 8, i * 8 + 8), 2);
          const label = ip.split('.')[i] || String(octetValue);
          return (
            <div key={i} className="flex flex-row md:flex-col items-center md:items-center justify-between md:justify-start gap-1 md:gap-0.5 border-b border-zinc-200 dark:border-zinc-800 md:border-transparent pb-1 md:pb-0">
              <span className="text-[9px] font-mono text-[var(--color-text-main)]0 dark:text-zinc-600 uppercase tracking-widest">oct {i + 1}</span>
              <span className="text-xs font-mono font-bold text-zinc-700 dark:text-[var(--color-text-muted)]">{label}</span>
            </div>
          );
        })}
      </div>

      {/* Info note */}
      <p className="text-[10px] font-mono text-[var(--color-text-main)]0 dark:text-zinc-600 leading-relaxed border-t border-zinc-200 dark:border-[var(--color-border)] pt-3">
        Click any bit to toggle. <span className="text-emerald-650 dark:text-emerald-500">Network bits</span> define the boundary — <span className="text-amber-650 dark:text-amber-500">Host bits</span> address endpoints.
      </p>
    </div>
  );
};
