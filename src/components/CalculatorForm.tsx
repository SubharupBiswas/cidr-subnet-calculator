"use client";

import { useState, useEffect, KeyboardEvent, Fragment } from 'react';
import { Globe, Sliders } from 'lucide-react';
import { isValidIp } from '../utils/ipv4Utils';

interface CalculatorFormProps {
  ip: string;
  setIp: (ip: string) => void;
  prefix: number;
  setPrefix: (prefix: number) => void;
}

export const CalculatorForm = ({ ip, setIp, prefix, setPrefix }: CalculatorFormProps) => {
  const isIpValid = isValidIp(ip) || ip === '';
  const commonPrefixes = [8, 16, 20, 22, 24, 26, 28, 30];

  const [octets, setOctets] = useState<string[]>(() => {
    const parts = ip.split('.');
    return parts.length === 4 ? parts : ['', '', '', ''];
  });

  useEffect(() => {
    const parts = ip.split('.');
    if (parts.length === 4) setOctets(parts);
    else if (ip === '') setOctets(['', '', '', '']);
  }, [ip]);

  const handlePrefixChange = (val: number) => {
    if (val >= 1 && val <= 32) setPrefix(val);
  };

  const handleOctetChange = (index: number, val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '').slice(0, 3);
    if (cleaned && parseInt(cleaned, 10) > 255) return;
    const newOctets = [...octets];
    newOctets[index] = cleaned;
    setOctets(newOctets);
    setIp(newOctets.join('.'));
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '.' || e.key === ' ' || e.key === 'ArrowRight') {
      if (e.key === '.' || e.key === ' ') e.preventDefault();
      if (e.currentTarget.selectionStart === e.currentTarget.value.length || e.key === '.' || e.key === ' ') {
        (document.getElementById(`octet-${index + 1}`) as HTMLInputElement | null)?.focus();
      }
    } else if (e.key === 'Backspace' && octets[index] === '') {
      e.preventDefault();
      (document.getElementById(`octet-${index - 1}`) as HTMLInputElement | null)?.focus();
    } else if (e.key === 'ArrowLeft' && e.currentTarget.selectionStart === 0) {
      (document.getElementById(`octet-${index - 1}`) as HTMLInputElement | null)?.focus();
    }
  };

  // Per-octet accent colors
  const octetColors = [
    { text: 'text-emerald-600 dark:text-emerald-400', ring: 'focus:shadow-[0_0_0_2px_rgba(52,211,153,0.25)]', placeholder: '#88' },
    { text: 'text-amber-600 dark:text-amber-400',   ring: 'focus:shadow-[0_0_0_2px_rgba(251,191,36,0.25)]',  placeholder: '168' },
    { text: 'text-sky-600 dark:text-sky-400',     ring: 'focus:shadow-[0_0_0_2px_rgba(56,189,248,0.25)]',  placeholder: '1' },
    { text: 'text-fuchsia-600 dark:text-fuchsia-400', ring: 'focus:shadow-[0_0_0_2px_rgba(232,121,249,0.25)]', placeholder: '1' },
  ];

  // Compute slider fill percentage for CSS custom property
  const sliderPct = Math.round(((prefix - 1) / 31) * 100);

  return (
    <div className="bento-card bento-card-hover p-5 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight font-mono uppercase tracking-widest">Configuration</h2>
        </div>
        {!isIpValid && ip !== '' && (
          <span className="text-[10px] text-rose-400 font-mono animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block" />
            Invalid Format
          </span>
        )}
      </div>

      {/* IP Input Group */}
      <div className="flex flex-col gap-2">
        <label className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 font-mono flex items-center gap-1.5">
          <Globe className="w-3 h-3" />
          IPv4 Address / CIDR
        </label>

        {/* Unified pill input row */}
        <div className={`flex flex-wrap sm:flex-nowrap items-center gap-2 bg-zinc-100/70 dark:bg-zinc-950/70 border rounded-xl px-3 py-2.5 transition-all duration-200 ${!isIpValid && ip !== '' ? 'border-rose-500/40' : 'border-zinc-200 dark:border-zinc-800 focus-within:border-zinc-350 dark:focus-within:border-zinc-700'}`}>
          {/* Octets */}
          <div className="flex items-center gap-0.5 flex-1">
            {[0, 1, 2, 3].map((index) => (
              <Fragment key={`octet-wrapper-${index}`}>
                <input
                  id={`octet-${index}`}
                  type="text"
                  inputMode="numeric"
                  value={octets[index]}
                  onChange={(e) => handleOctetChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-10 bg-transparent text-center font-mono text-base font-bold rounded-lg py-0.5 focus:outline-none transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${octetColors[index].text} ${octetColors[index].ring}`}
                  placeholder={['192', '168', '1', '1'][index]}
                  maxLength={3}
                  aria-label={`IP Address Octet ${index + 1}`}
                />
                {index < 3 && (
                  <span className="text-zinc-600 font-mono font-bold text-sm select-none">.</span>
                )}
              </Fragment>
            ))}
          </div>

          {/* CIDR divider + prefix */}
          <div className="flex items-center gap-1.5 pl-2 border-l border-zinc-200 dark:border-zinc-800 shrink-0">
            <span className="text-zinc-500 font-mono text-base font-bold">/</span>
            <input
              type="number"
              min="1"
              max="32"
              value={prefix}
              onChange={(e) => handlePrefixChange(parseInt(e.target.value, 10) || 1)}
              className="w-8 bg-transparent text-center font-mono text-base font-bold text-cyan-400 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              aria-label="CIDR Prefix Length"
            />
          </div>
        </div>
      </div>

      {/* Prefix Slider */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 font-mono">Prefix Length</span>
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">/{prefix}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-zinc-600 font-mono">/1</span>
          <input
            type="range"
            min="1"
            max="32"
            value={prefix}
            onChange={(e) => handlePrefixChange(parseInt(e.target.value, 10))}
            className="flex-1"
            style={{ '--slider-pct': `${sliderPct}%` } as React.CSSProperties}
            aria-label="CIDR Prefix Slider"
          />
          <span className="text-[10px] text-zinc-600 font-mono">/32</span>
        </div>
      </div>

      {/* Quick Presets */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 font-mono">Quick Presets</span>
        <div className="flex flex-wrap gap-1.5">
          {commonPrefixes.map((p) => (
            <button
              key={p}
              onClick={() => handlePrefixChange(p)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono border transition-all duration-150 cursor-pointer ${
                prefix === p
                  ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-600 dark:text-cyan-400 shadow-[0_4px_12px_rgba(34,211,238,0.08)] dark:shadow-[0_0_12px_rgba(34,211,238,0.12)]'
                  : 'bg-zinc-100 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800/60'
              }`}
            >
              /{p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
