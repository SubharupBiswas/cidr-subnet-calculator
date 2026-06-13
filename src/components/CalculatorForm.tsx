import React, { useState, useEffect } from 'react';
import { Globe, Sliders } from 'lucide-react';
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

  const [octets, setOctets] = useState<string[]>(() => {
    const parts = ip.split('.');
    return parts.length === 4 ? parts : ['', '', '', ''];
  });

  useEffect(() => {
    const parts = ip.split('.');
    if (parts.length === 4) {
      setOctets(parts);
    } else if (ip === '') {
      setOctets(['', '', '', '']);
    }
  }, [ip]);

  const handlePrefixChange = (val: number) => {
    if (val >= 1 && val <= 32) {
      setPrefix(val);
    }
  };

  const handleOctetChange = (index: number, val: string) => {
    const cleaned = val.replace(/[^0-9]/g, '').slice(0, 3);
    if (parseInt(cleaned, 10) > 255) return;
    
    const newOctets = [...octets];
    newOctets[index] = cleaned;
    setOctets(newOctets);
    setIp(newOctets.join('.'));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === '.' || e.key === ' ' || e.key === 'ArrowRight') {
      if (e.key === '.' || e.key === ' ') e.preventDefault();
      if (e.currentTarget.selectionStart === e.currentTarget.value.length || e.key === '.' || e.key === ' ') {
        const nextSibling = document.getElementById(`octet-${index + 1}`);
        if (nextSibling) {
          nextSibling.focus();
        }
      }
    } else if (e.key === 'Backspace' && octets[index] === '') {
      e.preventDefault();
      const prevSibling = document.getElementById(`octet-${index - 1}`);
      if (prevSibling) {
        prevSibling.focus();
      }
    } else if (e.key === 'ArrowLeft' && e.currentTarget.selectionStart === 0) {
      const prevSibling = document.getElementById(`octet-${index - 1}`);
      if (prevSibling) {
        prevSibling.focus();
      }
    }
  };

  const octetStyles = [
    'text-emerald-600 dark:text-emerald-400 focus:text-emerald-500 dark:focus:text-emerald-300 focus:shadow-[0_0_30px_-5px_rgba(52,211,153,0.15)] dark:focus:shadow-[0_0_30px_-5px_rgba(52,211,153,0.2)]',
    'text-amber-600 dark:text-amber-400 focus:text-amber-500 dark:focus:text-amber-300 focus:shadow-[0_0_30px_-5px_rgba(251,191,36,0.15)] dark:focus:shadow-[0_0_30px_-5px_rgba(251,191,36,0.2)]',
    'text-sky-600 dark:text-sky-400 focus:text-sky-500 dark:focus:focus:text-sky-300 focus:shadow-[0_0_30px_-5px_rgba(56,189,248,0.15)] dark:focus:shadow-[0_0_30px_-5px_rgba(56,189,248,0.2)]',
    'text-fuchsia-600 dark:text-fuchsia-400 focus:text-fuchsia-500 dark:focus:focus:text-fuchsia-300 focus:shadow-[0_0_30px_-5px_rgba(232,121,249,0.15)] dark:focus:shadow-[0_0_30px_-5px_rgba(232,121,249,0.2)]'
  ];

  return (
    <div className="bg-white border-zinc-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:bg-[#0d0e15]/80 dark:border-white/[0.04] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)] rounded-2xl p-6 transition-all duration-300 flex flex-col gap-6">
      <div className="flex items-center gap-3 border-b border-zinc-100 dark:border-zinc-800/60 pb-4">
        <Sliders className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Configuration</h2>
      </div>

      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
            <Globe className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            IP Address & Subnet
          </label>
          {!isIpValid && ip !== '' && (
            <span className="text-xs text-red-500 dark:text-red-400 flex items-center gap-1.5 animate-pulse">
              ⚠️ Invalid Format
            </span>
          )}
        </div>

        {/* 4-Octet Interactive Row + CIDR */}
        <div className={`flex flex-wrap md:flex-nowrap items-center justify-between gap-4`}>
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            {[0, 1, 2, 3].map((index) => (
              <React.Fragment key={index}>
                <input
                  id={`octet-${index}`}
                  type="text"
                  inputMode="numeric"
                  value={octets[index]}
                  onChange={(e) => handleOctetChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-14 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 text-center font-mono text-xl font-bold rounded-lg py-2 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-700 focus:bg-white dark:focus:bg-zinc-900 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${octetStyles[index]}`}
                  placeholder={['192', '168', '1', '1'][index]}
                  maxLength={3}
                />
                {index < 3 && (
                  <span className="text-zinc-400 dark:text-zinc-500 font-bold font-mono">.</span>
                )}
              </React.Fragment>
            ))}
          </div>
          
          <div className="flex items-center gap-2 bg-zinc-50 dark:bg-zinc-900/80 border border-zinc-200 dark:border-zinc-800 rounded-lg px-3 py-2 focus-within:border-zinc-400 dark:focus-within:border-zinc-700 focus-within:bg-white dark:focus-within:bg-zinc-900 transition-all">
            <span className="text-zinc-400 dark:text-zinc-500 font-mono text-xl font-medium">/</span>
            <input
              type="number"
              min="1"
              max="32"
              value={prefix}
              onChange={(e) => handlePrefixChange(parseInt(e.target.value, 10) || 1)}
              className="w-10 bg-transparent text-center font-mono text-xl font-bold text-zinc-900 dark:text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        </div>

        {/* Range Slider */}
        <div className="flex flex-col gap-2 mt-4">
          <div className="flex items-center gap-4 py-2">
            <span className="text-xs text-zinc-500 dark:text-zinc-600 font-mono">/1</span>
            <input
              type="range"
              min="1"
              max="32"
              value={prefix}
              onChange={(e) => handlePrefixChange(parseInt(e.target.value, 10))}
              className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer focus:outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-500 dark:[&::-webkit-slider-thumb]:bg-cyan-400 [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(6,182,212,0.4)] dark:[&::-webkit-slider-thumb]:shadow-[0_0_12px_#22d3ee] [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:scale-125"
            />
            <span className="text-xs text-zinc-500 dark:text-zinc-600 font-mono">/32</span>
          </div>
        </div>

        {/* Presets */}
        <div className="flex flex-col gap-2 mt-2">
          <span className="text-xs font-semibold text-zinc-500">Quick CIDR Presets</span>
          <div className="flex flex-wrap gap-2">
            {commonPrefixes.map((p) => (
              <button
                key={p}
                onClick={() => handlePrefixChange(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono border transition-all duration-200 ${
                  prefix === p
                    ? 'bg-teal-50 border-teal-200 text-teal-700 shadow-sm dark:bg-teal-500/10 dark:border-teal-500/50 dark:text-teal-400 dark:shadow-[0_0_15px_rgba(20,184,166,0.15)]'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-400 hover:bg-zinc-50 dark:bg-zinc-900/50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:border-zinc-700'
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
