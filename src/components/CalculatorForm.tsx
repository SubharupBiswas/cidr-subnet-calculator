"use client";

import { useState, useEffect, useRef, KeyboardEvent, Fragment } from 'react';
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

  // Refs for wheel-event targets (passive: false required for preventDefault)
  const octetRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const prefixRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const parts = ip.split('.');
    if (parts.length === 4) setOctets(parts);
    else if (ip === '') setOctets(['', '', '', '']);
  }, [ip]);

  // Attach non-passive wheel listeners so we can preventDefault
  useEffect(() => {
    const handlers: (() => void)[] = [];

    octetRefs.forEach((ref, index) => {
      const el = ref.current;
      if (!el) return;

      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const current = parseInt(octets[index] || '0', 10);
        const delta = e.deltaY < 0 ? 1 : -1;
        const next = Math.min(255, Math.max(0, current + delta));
        const newOctets = [...octets];
        newOctets[index] = String(next);
        setOctets(newOctets);
        setIp(newOctets.join('.'));
      };

      el.addEventListener('wheel', onWheel, { passive: false });
      handlers.push(() => el.removeEventListener('wheel', onWheel));
    });

    // Wheel listener for CIDR prefix input
    const prefixEl = prefixRef.current;
    if (prefixEl) {
      const onPrefixWheel = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const delta = e.deltaY < 0 ? 1 : -1;
        setPrefix(Math.min(32, Math.max(1, prefix + delta)));
      };
      prefixEl.addEventListener('wheel', onPrefixWheel, { passive: false });
      handlers.push(() => prefixEl.removeEventListener('wheel', onPrefixWheel));
    }

    return () => handlers.forEach(cleanup => cleanup());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [octets, prefix]);

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
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const current = parseInt(octets[index] || '0', 10);
      const next = Math.min(255, current + 1);
      handleOctetChange(index, String(next));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const current = parseInt(octets[index] || '0', 10);
      const next = Math.max(0, current - 1);
      handleOctetChange(index, String(next));
    }
  };

  const handlePrefixKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setPrefix(Math.min(32, prefix + 1));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setPrefix(Math.max(1, prefix - 1));
    }
  };


  const octetColors = ['bg-[#f87171]', 'bg-[#34d399]', 'bg-[#fbbf24]', 'bg-[#a78bfa]'];

  return (
    <div className="flex flex-col space-y-8 border-b border-[var(--color-border)] pb-6 w-full">
      
      {/* IP + CIDR Input Row */}
      <div className={`flex items-center justify-start gap-1 font-mono transition-colors duration-300 w-fit px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm ${!isIpValid && ip !== '' ? 'text-rose-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
        {[0, 1, 2, 3].map((index) => (
          <Fragment key={`octet-wrapper-${index}`}>
            <input
              ref={octetRefs[index]}
              id={`octet-${index}`}
              type="text"
              inputMode="numeric"
              value={octets[index]}
              onChange={(e) => handleOctetChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={`text-[var(--color-text-main)] font-bold text-xl text-center p-2 rounded-xl shadow-sm w-14 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${octetColors[index]}`}
              placeholder={['192', '168', '1', '1'][index]}
              maxLength={3}
              aria-label={`IP Address Octet ${index + 1}`}
              title="Scroll to adjust value"
            />
            {index < 3 && (
              <span className="text-zinc-300 dark:text-zinc-700 text-xl font-bold">.</span>
            )}
          </Fragment>
        ))}

        {/* CIDR */}
        <div className="flex items-center pl-2 md:pl-4 border-l border-[var(--color-border)] ml-2 md:ml-4">
          <span className="text-[var(--color-text-muted)] text-xl font-bold">/</span>
          <input
            ref={prefixRef}
            type="number"
            min="1"
            max="32"
            value={prefix}
            onChange={(e) => handlePrefixChange(parseInt(e.target.value, 10) || 1)}
            onKeyDown={handlePrefixKeyDown}
            className="text-[var(--color-text-main)] font-bold text-xl text-center p-2 rounded-xl shadow-sm w-14 bg-[var(--color-inner-surface)] dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            aria-label="CIDR Prefix Length"
            title="Scroll to adjust prefix"
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
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePrefixChange(p);
              }}
              className={`px-2 py-1 text-[11px] font-mono transition-colors duration-150 cursor-pointer ${
                prefix === p
                  ? 'text-[var(--color-text-main)] font-bold'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
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
            style={{
              background: `linear-gradient(to right, var(--color-accent) ${((prefix - 1) / 31) * 100}%, var(--color-border) ${((prefix - 1) / 31) * 100}%)`
            }}
            aria-label="CIDR Prefix Slider"
          />
        </div>
      </div>
    </div>
  );
};
