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
  const sliderRef = useRef<HTMLInputElement>(null);
  
  // Use a ref to hold latest state to avoid reattaching wheel listeners
  const stateRef = useRef({ octets, prefix });
  useEffect(() => {
    stateRef.current = { octets, prefix };
  }, [octets, prefix]);

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
        const { octets: currentOctets } = stateRef.current;
        const current = parseInt(currentOctets[index] || '0', 10);
        const delta = e.deltaY < 0 ? 1 : -1;
        const next = Math.min(255, Math.max(0, current + delta));
        const newOctets = [...currentOctets];
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
        const { prefix: currentPrefix } = stateRef.current;
        const delta = e.deltaY < 0 ? 1 : -1;
        setPrefix(Math.min(32, Math.max(1, currentPrefix + delta)));
      };
      prefixEl.addEventListener('wheel', onPrefixWheel, { passive: false });
      handlers.push(() => prefixEl.removeEventListener('wheel', onPrefixWheel));
    }

    // Wheel listener for Slider
    const sliderEl = sliderRef.current;
    if (sliderEl) {
      const onSliderWheel = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const { prefix: currentPrefix } = stateRef.current;
        const delta = e.deltaY < 0 ? 1 : -1;
        setPrefix(Math.min(32, Math.max(1, currentPrefix + delta)));
      };
      sliderEl.addEventListener('wheel', onSliderWheel, { passive: false });
      handlers.push(() => sliderEl.removeEventListener('wheel', onSliderWheel));
    }

    return () => handlers.forEach(cleanup => cleanup());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount!

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


  const octetColors = [
    'text-pink-700 dark:text-pink-400 bg-pink-50 dark:bg-pink-500/10 border-pink-200 dark:border-pink-500/30 focus:border-pink-500 focus:shadow-[0_0_15px_rgba(236,72,153,0.3)]',
    'text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border-violet-200 dark:border-violet-500/30 focus:border-violet-500 focus:shadow-[0_0_15px_rgba(139,92,246,0.3)]',
    'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30 focus:border-blue-500 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)]',
    'text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-500/10 border-teal-200 dark:border-teal-500/30 focus:border-teal-500 focus:shadow-[0_0_15px_rgba(20,184,166,0.3)]',
  ];

  return (
    <div className="flex flex-col space-y-8 border-b border-[var(--color-border)] pb-6 w-full">
      
      {/* IP + CIDR Input Row */}
      <div className={`flex flex-row flex-nowrap items-center justify-center gap-1 w-full min-w-0 my-2 sm:my-6 font-mono transition-colors duration-300 ${!isIpValid && ip !== '' ? 'text-rose-500' : 'text-zinc-900 dark:text-zinc-100'}`}>
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
              className={`w-12 h-12 sm:w-16 sm:h-16 text-center text-base sm:text-2xl font-semibold rounded-lg min-w-0 border border-slate-200 focus:outline-none transition-all duration-200 touch-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${octetColors[index]}`}
              placeholder={['192', '168', '1', '1'][index]}
              maxLength={3}
              aria-label={`IP Address Octet ${index + 1}`}
              title="Scroll to adjust value"
            />
            {index < 3 && (
              <span className="flex-shrink-0 select-none text-slate-300 text-2xl sm:text-4xl font-bold translate-y-1 sm:translate-y-2">.</span>
            )}
          </Fragment>
        ))}

        {/* CIDR */}
        <div className="flex items-center ml-1 sm:ml-4 pl-1 sm:pl-4 border-l-2 border-[var(--color-border)]">
          <span className="flex-shrink-0 select-none text-slate-300 text-2xl sm:text-4xl font-bold translate-y-1 sm:translate-y-2 mr-1 sm:mr-4">/</span>
          <input
            ref={prefixRef}
            type="number"
            min="1"
            max="32"
            value={prefix}
            onChange={(e) => handlePrefixChange(parseInt(e.target.value, 10) || 1)}
            onKeyDown={handlePrefixKeyDown}
            className="w-12 h-12 sm:w-16 sm:h-16 text-center text-base sm:text-2xl font-semibold rounded-lg min-w-0 border border-slate-200 text-cyan-700 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-500/10 focus:border-cyan-500 focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] focus:outline-none transition-all duration-200 touch-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
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
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-md mx-auto px-2 text-sm text-slate-500 shrink-0">
          {commonPrefixes.map((p) => (
            <button
              key={p}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePrefixChange(p);
              }}
              className={`min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg text-sm font-mono transition-colors duration-150 cursor-pointer ${
                prefix === p
                  ? 'text-[var(--color-text-main)] font-bold bg-[var(--color-border)]/50 dark:bg-[var(--color-border)]/30'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-border)]/30 dark:hover:bg-[var(--color-border)]/20'
              }`}
            >
              /{p}
            </button>
          ))}
        </div>

        {/* Slider */}
        <div className="flex-1 w-full flex items-center gap-3">
          <input
            ref={sliderRef}
            type="range"
            min="1"
            max="32"
            value={prefix}
            onChange={(e) => handlePrefixChange(parseInt(e.target.value, 10))}
            className="w-full max-w-sm touch-none"
            style={{
              background: `linear-gradient(to right, #a855f7 ${((prefix - 1) / 31) * 100}%, var(--color-border) ${((prefix - 1) / 31) * 100}%)`
            }}
            aria-label="CIDR Prefix Slider"
          />
        </div>
      </div>
    </div>
  );
};
