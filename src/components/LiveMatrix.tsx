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
    label, value, id
  }: { label: string; value: string; id: string }) => (
    <div className="flex flex-col gap-1 w-full text-center">
      <div className="flex items-center justify-center gap-3">
        <span className="whitespace-nowrap uppercase tracking-wider text-sm font-bold text-slate-500 dark:text-zinc-500">
          {label}
        </span>
        <CopyBtn text={value} id={id} />
      </div>
      <span className="font-mono text-lg sm:text-xl md:text-lg lg:text-xl xl:text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 break-all w-full" title={value}>
        {value}
      </span>
    </div>
  );

  // Hero-sized metric row (2× emphasis)
  const HeroRow = ({
    label, value, id, sublabel
  }: { label: string; value: string; id: string; sublabel?: string }) => (
    <div className="flex flex-col gap-1 w-full text-center">
      <div className="flex items-center justify-center gap-3">
        <span className="whitespace-nowrap uppercase tracking-wider text-sm font-bold text-slate-500 dark:text-zinc-500">
          {label}
        </span>
        <CopyBtn text={value} id={id} />
      </div>
      <div className="flex flex-col">
        <span className="font-mono text-lg sm:text-xl md:text-lg lg:text-xl xl:text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 break-all w-full" title={value}>
          {value}
        </span>
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
        />
        <HeroRow
          label="Total Usable Hosts"
          value={result ? formatHosts(result.totalUsableHosts) : '254'}
          id="hosts"
          sublabel={result ? `2^${32 - result.prefix} − 2 endpoints` : '2^8 − 2 endpoints'}
        />
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-10 gap-x-6">
        <MetricRow
          label="Network Address"
          value={result?.networkAddress || '192.168.1.0'}
          id="network"
        />
        <MetricRow
          label="Broadcast Address"
          value={result?.broadcastAddress || '192.168.1.255'}
          id="broadcast"
        />
        <MetricRow
          label="Subnet Mask"
          value={result?.subnetMask || '255.255.255.0'}
          id="mask"
        />
        <MetricRow
          label="Wildcard Mask"
          value={result?.wildcardMask || '0.0.0.255'}
          id="wildcard"
        />
        <MetricRow
          label="Hex IP Value"
          value={hexIp}
          id="hexip"
        />
        <MetricRow
          label="IP Class"
          value={result?.ipClass || 'Class C'}
          id="class"
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
