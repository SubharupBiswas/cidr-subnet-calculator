import React, { useState } from 'react';
import { Copy, Check, Info, Server, Network, Radio, Users, Award, ShieldAlert } from 'lucide-react';
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
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          : 'bg-zinc-900/40 hover:bg-zinc-800/60 border-zinc-800 text-zinc-400 hover:text-zinc-200'
      }`}
      title="Copy to clipboard"
    >
      {copiedKey === key ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );

  const formatHosts = (num: number) => {
    return num.toLocaleString();
  };

  const getMetric = (label: string, value: string, icon: React.ReactNode, key: string) => (
    <div className="glass-panel glass-card-hover rounded-xl p-5 relative flex flex-col gap-1 overflow-hidden group">
      {/* Visual background glow element on hover */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/10 transition-all pointer-events-none" />
      
      <span className="text-xs font-semibold text-zinc-500 tracking-wide uppercase flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      <span className="text-lg font-bold text-zinc-100 font-mono pr-10 mt-1 select-all break-all tracking-tight">
        {value}
      </span>
      {copyButton(value, key)}
    </div>
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
        <Server className="w-5 h-5 text-cyan-400" />
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Live Calculation Matrix</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {getMetric(
          'Subnet Mask',
          result?.subnetMask || '255.255.255.0',
          <Network className="w-3.5 h-3.5 text-zinc-500" />,
          'mask'
        )}
        {getMetric(
          'Network Address',
          result?.networkAddress || '192.168.1.0',
          <Info className="w-3.5 h-3.5 text-zinc-500" />,
          'network'
        )}
        {getMetric(
          'Broadcast Address',
          result?.broadcastAddress || '192.168.1.255',
          <Radio className="w-3.5 h-3.5 text-zinc-500" />,
          'broadcast'
        )}
        {getMetric(
          'Usable Host Range',
          result?.usableHostRange || '192.168.1.1 - 192.168.1.254',
          <Users className="w-3.5 h-3.5 text-zinc-500" />,
          'range'
        )}
        {getMetric(
          'Total Usable Hosts',
          result ? formatHosts(result.totalUsableHosts) : '254',
          <Users className="w-3.5 h-3.5 text-zinc-500" />,
          'hosts'
        )}
        {getMetric(
          'IP Class',
          result?.ipClass || 'Class C',
          <Award className="w-3.5 h-3.5 text-zinc-500" />,
          'class'
        )}
      </div>

      {/* Scope Badge & Type Section */}
      {result && (
        <div className="glass-panel rounded-xl p-4 flex items-center justify-between border border-zinc-800">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-4 h-4 text-zinc-400" />
            <div className="flex flex-col">
              <span className="text-xs text-zinc-500 font-semibold uppercase tracking-wider">Address Scope</span>
              <span className="text-sm text-zinc-300 font-medium">{result.ipType.description}</span>
            </div>
          </div>
          <span className={`px-2.5 py-1 rounded-md text-xs font-bold font-mono uppercase border ${result.ipType.badgeColor}`}>
            {result.ipType.type}
          </span>
        </div>
      )}
    </div>
  );
};
