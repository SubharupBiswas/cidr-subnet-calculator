import React from 'react';
import { Globe, Hash, Sliders, X } from 'lucide-react';
import { isValidIp } from '../utils/ipv4Utils';

interface CalculatorFormProps {
  ip: string;
  setIp: (ip: string) => void;
  prefix: number;
  setPrefix: (prefix: number) => void;
}

export const CalculatorForm: React.FC<CalculatorFormProps> = ({
  ip,
  setIp,
  prefix,
  setPrefix,
}) => {
  const isIpValid = isValidIp(ip) || ip === '';
  const commonPrefixes = [8, 16, 22, 24, 28, 30];

  const handleIpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Filter characters to allow only digits and dots
    const val = e.target.value.replace(/[^0-9.]/g, '');
    setIp(val);
  };

  const handlePrefixChange = (val: number) => {
    if (val >= 1 && val <= 32) {
      setPrefix(val);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 glass-panel-glow flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
        <Sliders className="w-5 h-5 text-cyan-400" />
        <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Configuration</h2>
      </div>

      {/* IP Input */}
      <div className="flex flex-col gap-2">
        <label htmlFor="ip-address" className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
          <Globe className="w-4 h-4 text-zinc-500" />
          IP Address
        </label>
        <div className="relative">
          <input
            id="ip-address"
            type="text"
            value={ip}
            onChange={handleIpChange}
            placeholder="e.g. 192.168.1.1"
            className={`w-full bg-zinc-900/50 border rounded-xl px-4 py-3 pl-4 pr-10 text-zinc-100 focus:outline-none focus:ring-2 transition-all font-mono text-base ${
              ip === ''
                ? 'border-zinc-700/50 focus:ring-cyan-500/30 focus:border-cyan-500/50'
                : isIpValid
                ? 'border-emerald-500/30 focus:ring-emerald-500/20 focus:border-emerald-500/50'
                : 'border-red-500/30 focus:ring-red-500/20 focus:border-red-500/50'
            }`}
          />
          {ip && (
            <button
              onClick={() => setIp('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 transition-colors p-1 rounded-full hover:bg-zinc-800/50"
              title="Clear IP Address"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {!isIpValid && ip !== '' && (
          <span className="text-xs text-red-400 flex items-center gap-1.5 mt-1 animate-pulse">
            ⚠️ Invalid IPv4 address format (must be 4 octets between 0-255)
          </span>
        )}
      </div>

      {/* CIDR Mask Input */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <label htmlFor="cidr-prefix" className="text-sm font-semibold text-zinc-400 flex items-center gap-2">
            <Hash className="w-4 h-4 text-zinc-500" />
            CIDR Subnet Prefix
          </label>
          <div className="flex items-center gap-1 bg-zinc-900/60 border border-zinc-800 rounded-lg px-2.5 py-1">
            <span className="text-zinc-500 text-xs font-mono font-bold">/</span>
            <input
              id="cidr-prefix"
              type="number"
              min="1"
              max="32"
              value={prefix}
              onChange={(e) => handlePrefixChange(parseInt(e.target.value, 10) || 1)}
              className="w-8 bg-transparent text-cyan-400 focus:outline-none font-mono text-right font-bold text-sm"
            />
          </div>
        </div>

        {/* Range Slider */}
        <div className="flex items-center gap-4 py-2">
          <span className="text-xs text-zinc-600 font-mono">/1</span>
          <input
            type="range"
            min="1"
            max="32"
            value={prefix}
            onChange={(e) => handlePrefixChange(parseInt(e.target.value, 10))}
            className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />
          <span className="text-xs text-zinc-600 font-mono">/32</span>
        </div>

        {/* Presets */}
        <div className="flex flex-col gap-2 mt-1">
          <span className="text-xs font-semibold text-zinc-500">Quick CIDR Presets</span>
          <div className="flex flex-wrap gap-2">
            {commonPrefixes.map((p) => (
              <button
                key={p}
                onClick={() => handlePrefixChange(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all border ${
                  prefix === p
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-semibold'
                    : 'bg-zinc-900/30 hover:bg-zinc-800/40 text-zinc-400 border-zinc-800/50 hover:text-zinc-300'
                }`}
              >
                /{p}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
