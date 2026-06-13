import React from 'react';
import { Binary, HelpCircle } from 'lucide-react';
import { SubnetResult } from '../utils/ipv4Utils';

interface BinaryVisualizerProps {
  result: SubnetResult | null;
}

export const BinaryVisualizer: React.FC<BinaryVisualizerProps> = ({ result }) => {
  // Fallback defaults
  const prefix = result?.prefix ?? 24;
  const binaryIp = result?.binaryIp ?? '11000000.10101000.00000001.00000001';
  const binaryMask = result?.binaryMask ?? '11111111.11111111.11111111.00000000';
  const binaryNetwork = result?.binaryNetwork ?? '11000000.10101000.00000001.00000000';
  const binaryBroadcast = result?.binaryBroadcast ?? '11000000.10101000.00000001.11111111';

  const renderBinaryBits = (binaryStr: string) => {
    let bitCount = 0;
    return (
      <span className="font-mono tracking-wider break-all select-all">
        {binaryStr.split('').map((char, index) => {
          if (char === '.') {
            return (
              <span key={index} className="text-zinc-700 mx-0.5 font-bold">
                .
              </span>
            );
          }
          bitCount++;
          const isNetworkBit = bitCount <= prefix;
          return (
            <span
              key={index}
              className={
                isNetworkBit
                  ? 'text-emerald-400 font-bold glow-text-emerald'
                  : 'text-amber-500 font-medium glow-text-amber'
              }
            >
              {char}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <Binary className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Binary Breakdown</h2>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 font-semibold">
            <span className="w-2.5 h-2.5 rounded bg-emerald-400/20 border border-emerald-500/30 inline-block" />
            <span className="text-emerald-400">Network Portion ({prefix} bits)</span>
          </span>
          <span className="flex items-center gap-1.5 font-semibold">
            <span className="w-2.5 h-2.5 rounded bg-amber-500/20 border border-amber-500/30 inline-block" />
            <span className="text-amber-500">Host Portion ({32 - prefix} bits)</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Table layout for align-right / tabular alignment */}
        <div className="grid grid-cols-[110px_1fr] md:grid-cols-[140px_1fr] items-center gap-x-4 gap-y-4 border-b border-zinc-900 pb-2">
          
          <span className="text-xs font-semibold text-zinc-500 uppercase">IP Address</span>
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-lg px-3.5 py-2">
            {renderBinaryBits(binaryIp)}
          </div>

          <span className="text-xs font-semibold text-zinc-500 uppercase">Subnet Mask</span>
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-lg px-3.5 py-2">
            {renderBinaryBits(binaryMask)}
          </div>

          <span className="text-xs font-semibold text-zinc-500 uppercase">Network Addr</span>
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-lg px-3.5 py-2">
            {renderBinaryBits(binaryNetwork)}
          </div>

          <span className="text-xs font-semibold text-zinc-500 uppercase">Broadcast Addr</span>
          <div className="bg-zinc-950/40 border border-zinc-900 rounded-lg px-3.5 py-2">
            {renderBinaryBits(binaryBroadcast)}
          </div>

        </div>

        {/* Informational Note */}
        <div className="bg-zinc-950/30 border border-zinc-900/60 rounded-xl p-4 flex gap-3">
          <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-400 leading-relaxed">
            The <strong className="text-emerald-400 font-semibold">Network bits</strong> are masked by the subnet mask and determine the network boundary. The <strong className="text-amber-500 font-semibold">Host bits</strong> are available for assigning to endpoints. In a subnet, the first address (all host bits <span className="font-mono text-amber-300">0</span>) is the Network address, and the last address (all host bits <span className="font-mono text-amber-300">1</span>) is the Broadcast address.
          </p>
        </div>
      </div>
    </div>
  );
};
