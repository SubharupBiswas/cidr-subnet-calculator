"use client";

import { useState, useEffect, KeyboardEvent, Fragment } from 'react';
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

  // Compute slider fill percentage for CSS custom property
  const sliderPct = Math.round(((prefix - 1) / 31) * 100);

  return (
    <div className="flex flex-col space-y-8 border-b border-zinc-200 dark:border-zinc-800 pb-6 w-full">
      
      {/* IP + CIDR Input Row */}
      <div className={`flex items-center justify-start gap-1 font-mono transition-colors duration-300 w-fit px-4 py-2 border border-zinc-200 dark:border-zinc-800/60 rounded-xl bg-zinc-50 dark:bg-zinc-950/20 ${!isIpValid && ip !== '' ? 'text-rose-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
        {[0, 1, 2, 3].map((index) => (
          <Fragment key={`octet-wrapper-${index}`}>
            <input
              id={`octet-${index}`}
              type="text"
              inputMode="numeric"
              value={octets[index]}
              onChange={(e) => handleOctetChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="text-xl font-bold p-1 bg-transparent w-12 text-center focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] focus:bg-white dark:focus:bg-[var(--color-surface)] rounded-md transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              placeholder={['192', '168', '1', '1'][index]}
              maxLength={3}
              aria-label={`IP Address Octet ${index + 1}`}
            />
            {index < 3 && (
              <span className="text-zinc-300 dark:text-zinc-700 text-xl font-bold">.</span>
            )}
          </Fragment>
        ))}

        {/* CIDR */}
        <div className="flex items-center pl-2 md:pl-4 border-l border-zinc-200 dark:border-zinc-800 ml-2 md:ml-4">
          <span className="text-zinc-300 dark:text-zinc-700 text-xl font-bold">/</span>
          <input
            type="number"
            min="1"
            max="32"
            value={prefix}
            onChange={(e) => handlePrefixChange(parseInt(e.target.value, 10) || 1)}
            className="text-xl font-bold p-1 bg-transparent w-12 text-center focus:outline-none focus:ring-1 focus:ring-[var(--color-accent)] focus:bg-white dark:focus:bg-[var(--color-surface)] rounded-md transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-label="CIDR Prefix Length"
          />
        </div>
      </div>

      {/* Invalid Message */}
      {!isIpValid && ip !== '' && (
        <span className="text-xs text-rose-500 font-mono">Invalid IPv4 format</span>
      )}

      {/* Slider & Presets Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-start gap-6 md:gap-12">
        
        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 shrink-0">
          {commonPrefixes.map((p) => (
            <button
              key={p}
              onClick={() => handlePrefixChange(p)}
              className={`px-2 py-1 text-[11px] font-mono transition-colors duration-150 cursor-pointer ${
                prefix === p
                  ? 'text-zinc-900 dark:text-zinc-100 font-bold'
                  : 'text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              /{p}
            </button>
          ))}
        </div>

        {/* Slider */}
        <div className="flex-1 w-full flex items-center gap-3">
          <input
            type="range"
            min="1"
            max="32"
            value={prefix}
            onChange={(e) => handlePrefixChange(parseInt(e.target.value, 10))}
            className="w-full max-w-sm"
            style={{ '--slider-pct': `${sliderPct}%` } as React.CSSProperties}
            aria-label="CIDR Prefix Slider"
          />
        </div>
      </div>
    </div>
  );
};
