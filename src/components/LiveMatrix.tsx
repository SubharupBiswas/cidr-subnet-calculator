"use client";

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
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
      className={`shrink-0 flex items-center justify-center min-w-[40px] min-h-[40px] rounded-md border transition-all duration-150 ${
        copiedKey === id
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25'
          : 'bg-zinc-100 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700/60 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700/80 hover:border-zinc-300 dark:hover:border-zinc-600'
      }`}
    >
      {copiedKey === id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
    </button>
  );

  const formatHosts = (num: number) => num.toLocaleString('en-US');

  const MetricRow = ({
    label, value, id, colorClass
  }: { label: string; value: string; id: string; colorClass?: string }) => (
    <div className="flex flex-col gap-1 w-full text-center min-w-0">
      <div className="flex items-center justify-center gap-3 min-w-0">
        <span className="truncate block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase">
          {label}
        </span>
        <CopyBtn text={value} id={id} />
      </div>
      <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-none px-1">
        <span className={`inline-block text-sm sm:text-base font-bold text-slate-800 tabular-nums ${colorClass || ''}`} title={value}>
          {value}
        </span>
      </div>
    </div>
  );

  // Hero-sized metric row (2× emphasis)
  const HeroRow = ({
    label, value, id, sublabel, colorClass
  }: { label: string; value: string; id: string; sublabel?: string; colorClass?: string }) => (
    <div className="flex flex-col gap-1 w-full text-center min-w-0">
      <div className="flex items-center justify-center gap-3 min-w-0">
        <span className="truncate block text-xs font-semibold tracking-wider text-slate-600 dark:text-slate-400 uppercase">
          {label}
        </span>
        <CopyBtn text={value} id={id} />
      </div>
      <div className="flex flex-col items-center w-full min-w-0">
        <div className="w-full overflow-x-auto whitespace-nowrap scrollbar-none px-1">
          <span className={`inline-block text-sm sm:text-base font-bold text-slate-800 tabular-nums ${colorClass || ''}`} title={value}>
            {value}
          </span>
        </div>
        {sublabel && (
          <span className="text-sm font-mono text-[var(--color-text-muted)] mt-1">{sublabel}</span>
        )}
      </div>
    </div>
  );

  const hexIp = result
    ? `0x${ipToLong(result.ip).toString(16).toUpperCase().padStart(8, '0')}`
    : '0xC0A80101';

  return (
    <div className="flex flex-col gap-10 py-6 w-full">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-y-12 gap-x-6">
        <HeroRow
          label="Usable Host Range"
          value={result?.usableHostRange || '192.168.1.1 – 192.168.1.254'}
          id="range"
          colorClass="text-emerald-600 dark:text-emerald-400"
        />
        <HeroRow
          label="Total Usable Hosts"
          value={result ? formatHosts(result.totalUsableHosts) : '254'}
          id="hosts"
          sublabel={result ? `2^${32 - result.prefix} − 2 endpoints` : '2^8 − 2 endpoints'}
          colorClass="text-cyan-600 dark:text-cyan-400"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3 w-full">
        <MetricRow
          label="Network Address"
          value={result?.networkAddress || '192.168.1.0'}
          id="network"
          colorClass="text-blue-600 dark:text-blue-400"
        />
        <MetricRow
          label="Broadcast Address"
          value={result?.broadcastAddress || '192.168.1.255'}
          id="broadcast"
          colorClass="text-amber-600 dark:text-amber-400"
        />
        <MetricRow
          label="Subnet Mask"
          value={result?.subnetMask || '255.255.255.0'}
          id="mask"
          colorClass="text-purple-600 dark:text-purple-400"
        />
        <MetricRow
          label="Wildcard Mask"
          value={result?.wildcardMask || '0.0.0.255'}
          id="wildcard"
          colorClass="text-fuchsia-600 dark:text-fuchsia-400"
        />
        <MetricRow
          label="Hex IP Value"
          value={hexIp}
          id="hexip"
          colorClass="text-slate-700 dark:text-slate-300"
        />
        <MetricRow
          label="IP Class"
          value={result?.ipClass || 'Class C'}
          id="class"
          colorClass="text-indigo-600 dark:text-indigo-400"
        />
      </div>

      {result && (
        <div className="w-full flex flex-col items-center justify-center gap-2 mt-4 text-center">
          <span className="whitespace-nowrap uppercase tracking-wider text-sm font-bold text-[var(--color-text-muted)]">Address Scope</span>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span className="font-mono text-xl md:text-2xl font-bold tracking-tight text-[var(--color-text-main)] uppercase">
              {result.ipType.type}
            </span>
            <span className="font-sans text-base text-[var(--color-text-muted)]">{result.ipType.description}</span>
          </div>
        </div>
      )}
    </div>
  );
};
