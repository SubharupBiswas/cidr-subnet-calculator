import React, { useState } from 'react';
import { Copy, Check, Server, Network, Radio, Users, Award, ShieldAlert } from 'lucide-react';
import { SubnetResult } from '../utils/ipv4Utils';

interface LiveMatrixProps {
  result: SubnetResult | null;
}

export const LiveMatrix: React.FC<LiveMatrixProps> = ({ result }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    if (!text || text.includes('—')) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const copyButton = (text: string, key: string) => (
    <button
      onClick={() => handleCopy(text, key)}
      disabled={!text || text.includes('—')}
      className={`absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg border transition-all ${
        copiedKey === key
          ? 'bg-emerald-100 text-emerald-600 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
          : 'bg-zinc-50 border-zinc-200 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 dark:bg-zinc-900/40 dark:hover:bg-zinc-800/60 dark:border-zinc-800 dark:text-zinc-500 dark:hover:text-zinc-200 opacity-0 group-hover:opacity-100'
      }`}
      title="Copy to clipboard"
    >
      {copiedKey === key ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );

  const formatHosts = (num: number) => {
    return num.toLocaleString();
  };

  // Base card wrapper that adapts to light/dark
  const cardClasses = "bg-white border-zinc-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:bg-[#0d0e15]/80 dark:border-white/[0.04] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)] rounded-2xl p-6 transition-all duration-300 flex flex-col gap-6 h-full";
  const internalCardClasses = "bg-white border border-zinc-200/80 shadow-sm dark:bg-zinc-950/40 dark:border-white/[0.04] rounded-xl p-5 dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)] transition-all duration-300 relative flex flex-col justify-center overflow-hidden group hover:border-zinc-300 dark:hover:border-zinc-800/80";

  return (
    <div className={cardClasses}>
      <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800/60 pb-4">
        <Server className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Performance Analytics Matrix</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Subnet Mask - Deep Purple */}
        <div className={internalCardClasses}>
          <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase flex items-center gap-1.5">
            <Network className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
            Subnet Mask
          </span>
          <span className="font-mono text-xl lg:text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2 tracking-tight tabular-nums pr-10">
            {result?.subnetMask || '255.255.255.0'}
          </span>
          {copyButton(result?.subnetMask || '255.255.255.0', 'mask')}
        </div>

        {/* Network Address - Radiant Cyan */}
        <div className={internalCardClasses}>
          <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase flex items-center gap-1.5">
            <Server className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
            Network Address
          </span>
          <span className="font-mono text-xl lg:text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-2 tracking-tight tabular-nums pr-10">
            {result?.networkAddress || '192.168.1.0'}
          </span>
          {copyButton(result?.networkAddress || '192.168.1.0', 'network')}
        </div>

        {/* Broadcast Address - Warm Amber */}
        <div className={internalCardClasses}>
          <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
            Broadcast Address
          </span>
          <span className="font-mono text-xl lg:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2 tracking-tight tabular-nums pr-10">
            {result?.broadcastAddress || '192.168.1.255'}
          </span>
          {copyButton(result?.broadcastAddress || '192.168.1.255', 'broadcast')}
        </div>

        {/* Usable Host Range - Vivid Emerald (No Truncation) */}
        <div className={internalCardClasses}>
          <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase flex items-center gap-1.5">
            <Users className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
            Usable Host Range
          </span>
          <span className="text-md sm:text-lg font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-tight break-words block w-full mt-1 pr-10">
            {result?.usableHostRange || '192.168.1.1 - 192.168.1.254'}
          </span>
          {copyButton(result?.usableHostRange || '192.168.1.1 - 192.168.1.254', 'range')}
        </div>

        {/* Total Usable Hosts - Neutral Base */}
        <div className={internalCardClasses}>
          <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase flex items-center gap-1.5">
            <Users className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
            Total Usable Hosts
          </span>
          <span className="font-mono text-xl lg:text-2xl font-bold text-zinc-800 dark:text-zinc-100 mt-2 tracking-tight tabular-nums pr-10">
            {result ? formatHosts(result.totalUsableHosts) : '254'}
          </span>
          {copyButton(result ? formatHosts(result.totalUsableHosts) : '254', 'hosts')}
        </div>

        {/* IP Class - Neutral Base */}
        <div className={internalCardClasses}>
          <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase flex items-center gap-1.5">
            <Award className="w-3 h-3 text-zinc-400 dark:text-zinc-500" />
            IP Class
          </span>
          <span className="font-mono text-xl lg:text-2xl font-bold text-zinc-800 dark:text-zinc-100 mt-2 tracking-tight tabular-nums pr-10">
            {result?.ipClass || 'Class C'}
          </span>
          {copyButton(result?.ipClass || 'Class C', 'class')}
        </div>
      </div>

      {/* Scope Badge & Type Section */}
      {result && (
        <div className="bg-white border border-zinc-200/80 shadow-sm dark:bg-zinc-950/40 dark:border-white/[0.04] rounded-xl p-5 dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)] hover:border-zinc-300 dark:hover:border-zinc-800/80 transition-all duration-300 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 text-zinc-400 dark:text-zinc-500" />
            <div className="flex flex-col">
              <span className="font-mono text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase">Address Scope</span>
              <span className="font-mono text-base font-bold text-zinc-800 dark:text-zinc-300 mt-1">{result.ipType.description}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Glowing Diagnostic Neon Dot */}
            {(result.ipType.type === 'Private' || result.ipType.type === 'Loopback') && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] dark:shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              </span>
            )}
            {result.ipType.type === 'Link-Local' && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] dark:shadow-[0_0_8px_rgba(245,158,11,0.8)]"></span>
              </span>
            )}
            {result.ipType.type === 'Public' && (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-400 dark:bg-zinc-200 shadow-[0_0_8px_rgba(161,161,170,0.5)] dark:shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
            )}
            
            <span className={`px-2.5 py-1 rounded-md font-mono text-[10px] font-bold tracking-wider uppercase border ${result.ipType.badgeColor}`}>
              {result.ipType.type}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
