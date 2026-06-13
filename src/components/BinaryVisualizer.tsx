import React from 'react';
import { HelpCircle, Activity } from 'lucide-react';
import { SubnetResult } from '../utils/ipv4Utils';

interface BinaryVisualizerProps {
  result: SubnetResult | null;
  ip: string;
  setIp: (ip: string) => void;
}

export const BinaryVisualizer: React.FC<BinaryVisualizerProps> = ({ result, ip, setIp }) => {
  const prefix = result?.prefix ?? 24;
  
  const rawBinary = result?.binaryIp?.replace(/\./g, '') || '11000000101010000000000100000001';

  const handleBitToggle = (bitIndex: number) => {
    if (!result && ip !== '') return;
    
    const chars = rawBinary.split('');
    chars[bitIndex] = chars[bitIndex] === '1' ? '0' : '1';
    const newBinary = chars.join('');

    const octet1 = parseInt(newBinary.substring(0, 8), 2);
    const octet2 = parseInt(newBinary.substring(8, 16), 2);
    const octet3 = parseInt(newBinary.substring(16, 24), 2);
    const octet4 = parseInt(newBinary.substring(24, 32), 2);
    
    setIp(`${octet1}.${octet2}.${octet3}.${octet4}`);
  };

  const renderInteractiveBits = () => {
    const bits = rawBinary.split('');
    const octetGroups = [];
    
    for (let i = 0; i < 4; i++) {
      const octetBits = bits.slice(i * 8, i * 8 + 8);
      octetGroups.push(
        <div key={`octet-${i}`} className="grid grid-cols-8 gap-1 w-full">
          {octetBits.map((bit, bitIndexWithinOctet) => {
            const absoluteBitIndex = i * 8 + bitIndexWithinOctet;
            const isNetworkBit = absoluteBitIndex < prefix;
            const isActive = bit === '1';
            
            let btnClasses = '';
            if (isActive) {
              if (isNetworkBit) {
                // Active Network Bit (1)
                btnClasses = 'bg-emerald-50 border-emerald-300 text-emerald-700 shadow-sm dark:bg-emerald-500/10 dark:border-emerald-500/40 dark:text-emerald-400 dark:shadow-[0_0_12px_rgba(16,185,129,0.15)]';
              } else {
                // Active Host Bit (1)
                btnClasses = 'bg-amber-50 border-amber-300 text-amber-700 shadow-sm dark:bg-amber-500/10 dark:border-amber-500/40 dark:text-amber-400 dark:shadow-[0_0_12px_rgba(245,158,11,0.15)]';
              }
            } else {
              // Inactive Bit (0)
              btnClasses = 'bg-zinc-50 border-zinc-200 text-zinc-400 hover:border-zinc-300 hover:bg-zinc-100 hover:text-zinc-600 dark:bg-zinc-900/80 dark:border-zinc-800/80 dark:text-zinc-600 dark:hover:border-zinc-700 dark:hover:text-zinc-400';
            }

            return (
              <button
                key={absoluteBitIndex}
                onClick={() => handleBitToggle(absoluteBitIndex)}
                // min-h-[44px] / min-w-[44px] on mobile for thumb-friendly touch targets
                className={`w-full min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:aspect-square border rounded flex items-center justify-center font-mono text-xs sm:text-sm font-bold transition-all cursor-pointer active:scale-95 ${btnClasses}`}
                title={`Toggle bit ${absoluteBitIndex} (Value: ${Math.pow(2, 7 - bitIndexWithinOctet)})`}
              >
                {bit}
              </button>
            );
          })}
        </div>
      );
    }

    return (
      // 1-col on xs, 2-col from sm — gives 4×8 and 2×16 layouts for thumb navigation
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2 w-full">
        {octetGroups[0]}
        {octetGroups[1]}
        {octetGroups[2]}
        {octetGroups[3]}
      </div>
    );
  };

  const containerClasses = "bg-white border border-zinc-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:bg-[#0d0e15]/80 dark:border-white/[0.04] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)] rounded-2xl p-4 sm:p-6 md:p-8 transition-all duration-300 hover:border-zinc-300 dark:hover:border-zinc-700/60 flex flex-col gap-6";

  return (
    <div className={containerClasses}>
      <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-4">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Interactive Binary Stream</h2>
        </div>
        <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 sm:gap-4 text-xs">
          <span className="flex items-center gap-1.5 font-semibold">
            <span className="w-2.5 h-2.5 rounded bg-emerald-100 border border-emerald-300 dark:bg-emerald-400/20 dark:border-emerald-500/30 inline-block" />
            <span className="text-emerald-700 dark:text-emerald-400">Network ({prefix})</span>
          </span>
          <span className="flex items-center gap-1.5 font-semibold">
            <span className="w-2.5 h-2.5 rounded bg-amber-100 border border-amber-300 dark:bg-amber-400/20 dark:border-amber-400/30 inline-block" />
            <span className="text-amber-700 dark:text-amber-400">Host ({32 - prefix})</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {renderInteractiveBits()}
      </div>

      {/* Informational Note */}
      <div className="bg-zinc-50 border border-zinc-200 dark:bg-zinc-900/40 dark:backdrop-blur-md dark:border-zinc-800/50 rounded-xl p-4 flex gap-3 mt-2">
        <HelpCircle className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
        <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
          Click any bit to toggle its boolean state. The master IP state will dynamically recalculate. <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">Network bits</strong> define the boundary, while <strong className="text-amber-700 dark:text-amber-400 font-semibold">Host bits</strong> identify endpoints within the subnet.
        </p>
      </div>
    </div>
  );
};
