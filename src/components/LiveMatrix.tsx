"use client";

import { useState } from 'react';
import { Copy, Check, Server, Network, Radio, Users, Award, ShieldAlert, ShieldCheck, Globe2 } from 'lucide-react';
import { SubnetResult, ipToLong } from '../utils/ipv4Utils';

interface LiveMatrixProps {
  result: SubnetResult | null;
}

export const LiveMatrix = ({ result }: LiveMatrixProps) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    if (!text || text.includes('—')) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const CopyBtn = ({ text, id }: { text: string; id: string }) => (
    <button
      onClick={() => handleCopy(text, id)}
      disabled={!text || text.includes('—')}
      title="Copy to clipboard"
      aria-label={`Copy ${id}`}
      className={`shrink-0 p-1.5 rounded-md border transition-all duration-150 ${
        copiedKey === id
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
          : 'bg-zinc-800/80 border-zinc-700/60 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-700/80 hover:border-zinc-600'
      }`}
    >
      {copiedKey === id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </button>
  );

  const formatHosts = (num: number) => num.toLocaleString();

  // Standard metric card
  const MetricCard = ({
    label, value, color, icon, id
  }: { label: string; value: string; color: string; icon: React.ReactNode; id: string }) => (
    <div className="bento-inner-card p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-mono text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">
          {icon}
          {label}
        </span>
        <CopyBtn text={value} id={id} />
      </div>
      <span className={`font-mono text-lg font-bold tracking-tight tabular-nums ${color}`}>{value}</span>
    </div>
  );

  // Hero-sized metric card (2× emphasis)
  const HeroCard = ({
    label, value, color, accentColor, icon, id, sublabel
  }: { label: string; value: string; color: string; accentColor: string; icon: React.ReactNode; id: string; sublabel?: string }) => (
    <div className={`bento-inner-card p-5 flex flex-col gap-3 col-span-2 border-l-2 ${accentColor}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold tracking-[0.2em] text-zinc-500 uppercase">
          {icon}
          {label}
        </div>
        <CopyBtn text={value} id={id} />
      </div>
      <span className={`font-mono text-2xl sm:text-3xl font-bold tracking-tight tabular-nums break-all ${color}`}>
        {value}
      </span>
      {sublabel && (
        <span className="text-[10px] font-mono text-zinc-600">{sublabel}</span>
      )}
    </div>
  );

  const hexIp = result
    ? `0x${ipToLong(result.networkAddress).toString(16).toUpperCase().padStart(8, '0')}`
    : '0xC0A80100';

  return (
    <div className="bento-card p-5 flex flex-col gap-5 h-full">
      {/* Header */}
      <div className="flex items-center gap-2.5 border-b border-zinc-800 pb-4">
        <Server className="w-4 h-4 text-cyan-400" />
        <h2 className="text-sm font-bold text-zinc-100 tracking-tight font-mono uppercase tracking-widest">Network Matrix</h2>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 gap-3">
        {/* ── HERO CARDS ── */}
        <HeroCard
          label="Usable Host Range"
          value={result?.usableHostRange || '192.168.1.1 – 192.168.1.254'}
          color="text-emerald-400 glow-text-emerald"
          accentColor="border-l-emerald-500/60"
          icon={<Users className="w-3 h-3" />}
          id="range"
        />
        <HeroCard
          label="Total Usable Hosts"
          value={result ? formatHosts(result.totalUsableHosts) : '254'}
          color="text-cyan-300 glow-text-cyan"
          accentColor="border-l-cyan-500/60"
          icon={<Users className="w-3 h-3" />}
          id="hosts"
          sublabel={result ? `2^${32 - result.prefix} − 2 endpoints` : '2^8 − 2 endpoints'}
        />

        {/* ── STANDARD METRIC CARDS ── */}
        <MetricCard
          label="Network Address"
          value={result?.networkAddress || '192.168.1.0'}
          color="text-cyan-400"
          icon={<Server className="w-3 h-3" />}
          id="network"
        />
        <MetricCard
          label="Broadcast Address"
          value={result?.broadcastAddress || '192.168.1.255'}
          color="text-amber-400"
          icon={<Radio className="w-3 h-3" />}
          id="broadcast"
        />
        <MetricCard
          label="Subnet Mask"
          value={result?.subnetMask || '255.255.255.0'}
          color="text-purple-400"
          icon={<Network className="w-3 h-3" />}
          id="mask"
        />
        <MetricCard
          label="Wildcard Mask"
          value={result?.wildcardMask || '0.0.0.255'}
          color="text-rose-400"
          icon={<Network className="w-3 h-3" />}
          id="wildcard"
        />
        <MetricCard
          label="Hex IP Value"
          value={hexIp}
          color="text-zinc-400"
          icon={<Server className="w-3 h-3" />}
          id="hexip"
        />
        <MetricCard
          label="IP Class"
          value={result?.ipClass || 'Class C'}
          color="text-zinc-200"
          icon={<Award className="w-3 h-3" />}
          id="class"
        />
      </div>

      {/* ── Address Scope Badge ── */}
      {result && (
        <div className="bento-inner-card p-4 flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3">
            {result.ipType.type === 'Private' || result.ipType.type === 'Loopback' ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : result.ipType.type === 'Public' ? (
              <Globe2 className="w-4 h-4 text-zinc-400 shrink-0" />
            ) : (
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <div className="flex flex-col">
              <span className="font-mono text-[9px] font-bold tracking-[0.2em] text-zinc-600 uppercase">Address Scope</span>
              <span className="font-mono text-sm font-bold text-zinc-300 mt-0.5">{result.ipType.description}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            {(result.ipType.type === 'Private' || result.ipType.type === 'Loopback') && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              </span>
            )}
            {result.ipType.type === 'Link-Local' && (
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              </span>
            )}
            {result.ipType.type === 'Public' && (
              <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-400 shadow-[0_0_8px_rgba(161,161,170,0.5)]" />
            )}
            <span className={`px-2.5 py-1 rounded-md font-mono text-[9px] font-bold tracking-wider uppercase border ${result.ipType.badgeColor}`}>
              {result.ipType.type}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
