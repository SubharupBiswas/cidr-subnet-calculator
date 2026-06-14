"use client";

import { useState, useRef } from 'react';
import { Wifi, Search, ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react';

const OUI_DATABASE: Record<string, string> = {
  // Apple
  '000D93': 'Apple Inc.', '000A27': 'Apple Inc.', '0003FD': 'Apple Inc.',
  'ACDE48': 'Apple Inc.', '28CFE9': 'Apple Inc.', '000C76': 'Apple Inc.',

  // Cisco Systems
  '000001': 'Cisco Systems', '0000C0': 'Cisco Systems', '0001C7': 'Cisco Systems',
  '0009B7': 'Cisco Systems', '001BD4': 'Cisco Systems', '0021A1': 'Cisco Systems',
  'E8BA70': 'Cisco Systems', 'F07239': 'Cisco Systems',

  // Intel Corporation
  '001B21': 'Intel Corporation', '0002B3': 'Intel Corporation', '001F3B': 'Intel Corporation',
  '8086F2': 'Intel Corporation', 'A4C361': 'Intel Corporation', '8C8590': 'Intel Corporation',

  // Samsung Electronics
  '002454': 'Samsung Electronics', '0024E9': 'Samsung Electronics', 'A09131': 'Samsung Electronics',
  'B0D09C': 'Samsung Electronics', '5C0AEB': 'Samsung Electronics',

  // Dell Technologies
  '001A4B': 'Dell Technologies', '0021F6': 'Dell Technologies', 'D067E5': 'Dell Technologies',
  'F0761C': 'Dell Technologies', '18A99B': 'Dell Technologies',

  // Microsoft Corporation
  '000D3A': 'Microsoft Corporation', '0050F2': 'Microsoft Corporation', '28185E': 'Microsoft Corporation',
  'DC53C8': 'Microsoft Corporation', '48EFE9': 'Microsoft Corporation',

  // Huawei Technologies
  '001882': 'Huawei Technologies', '002568': 'Huawei Technologies', '0C96BF': 'Huawei Technologies',
  '3476C5': 'Huawei Technologies', 'A897DC': 'Huawei Technologies', 'E8088B': 'Huawei Technologies',

  // Hewlett-Packard Enterprise
  '00110A': 'Hewlett-Packard Enterprise', '001635': 'Hewlett-Packard Enterprise',
  '3C4A92': 'Hewlett-Packard Enterprise', '94E96A': 'Hewlett-Packard Enterprise',

  // TP-Link Technologies
  '0019E0': 'TP-Link Technologies', '14CC20': 'TP-Link Technologies',
  '50C7BF': 'TP-Link Technologies', 'B0487A': 'TP-Link Technologies',

  // Netgear
  '00146C': 'Netgear Inc.', '001E2A': 'Netgear Inc.', 'A02195': 'Netgear Inc.',

  // Broadcom
  '001018': 'Broadcom Corporation', 'E84E84': 'Broadcom Corporation',

  // VMware
  '000569': 'VMware Inc.', '000C29': 'VMware Inc.', '001C14': 'VMware Inc.', '005056': 'VMware Inc.',

  // Amazon AWS
  '0A5B87': 'Amazon Technologies', '400A3F': 'Amazon Technologies',

  // Google
  'F4F5E8': 'Google LLC', '3C5AB4': 'Google LLC', 'A47732': 'Google LLC',

  // Sony
  '00013A': 'Sony Corporation', '000AD9': 'Sony Corporation',

  // Aruba Networks (HP)
  '000B86': 'Aruba Networks', 'D8C7C8': 'Aruba Networks', '94B40F': 'Aruba Networks',

  // Juniper Networks
  '0004CE': 'Juniper Networks', '001778': 'Juniper Networks', '28C021': 'Juniper Networks',

  // ASUS
  '000AEB': 'ASUSTeK Computer', '0015F2': 'ASUSTeK Computer', 'A8F7E0': 'ASUSTeK Computer',

  // Lenovo
  '00C0BF': 'Lenovo Group', '285ED0': 'Lenovo Group', '54EEA8': 'Lenovo Group',

  // Qualcomm / Atheros
  '00037F': 'Qualcomm Atheros', '0022B0': 'Qualcomm Atheros',
};

const MAC_REGEX = /^[0-9a-fA-F]{2}([:.\-]?)(?:[0-9a-fA-F]{2}\1){4}[0-9a-fA-F]{2}$/;

type StatusType = 'idle' | 'known' | 'unknown' | 'invalid';

interface LookupResult {
  status: StatusType;
  vendor: string;
  oui: string;
  formatted: string;
  macType: string;
  isMulticast: boolean;
  isLocal: boolean;
}

function parseMac(raw: string): LookupResult | null {
  const stripped = raw.replace(/[^0-9a-fA-F]/g, '').toUpperCase();
  if (stripped.length !== 12) return null;

  const oui = stripped.slice(0, 6);
  const formatted = `${stripped.slice(0, 2)}:${stripped.slice(2, 4)}:${stripped.slice(4, 6)}:${stripped.slice(6, 8)}:${stripped.slice(8, 10)}:${stripped.slice(10, 12)}`;

  const firstByte = parseInt(stripped.slice(0, 2), 16);
  const isMulticast = (firstByte & 0x01) === 1;
  const isLocal = (firstByte & 0x02) === 2;
  const macType = isMulticast ? 'Multicast' : (isLocal ? 'Locally Administered' : 'Universally Administered');

  const vendor = OUI_DATABASE[oui] || null;

  return {
    status: vendor ? 'known' : 'unknown',
    vendor: vendor ?? 'Unknown Vendor',
    oui: `${oui.slice(0, 2)}:${oui.slice(2, 4)}:${oui.slice(4, 6)}`,
    formatted,
    macType,
    isMulticast,
    isLocal,
  };
}

export default function MacLookup() {
  const [input, setInput] = useState('');
  const [lookupResult, setLookupResult] = useState<LookupResult | null>(null);
  const [status, setStatus] = useState<StatusType>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (val: string) => {
    setInput(val);
    if (val.trim() === '') {
      setStatus('idle');
      setLookupResult(null);
      return;
    }

    const stripped = val.replace(/[^0-9a-fA-F]/g, '');
    if (stripped.length < 12) {
      setStatus('idle');
      setLookupResult(null);
      return;
    }

    if (!MAC_REGEX.test(val.trim())) {
      setStatus('invalid');
      setLookupResult(null);
      return;
    }

    const result = parseMac(val);
    if (result) {
      setLookupResult(result);
      setStatus(result.status);
    }
  };

  const statusConfig = {
    idle:    { icon: <Wifi className="w-5 h-5 text-[var(--color-text-muted)] dark:text-zinc-500" />,          chipIcon: <Wifi className="w-3.5 h-3.5" />,          label: 'Awaiting Input',          badge: 'bg-zinc-100 text-zinc-500 border-zinc-200 dark:bg-zinc-800/60 dark:text-[var(--color-text-muted)] dark:border-zinc-700/40' },
    known:   { icon: <ShieldCheck className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />, chipIcon: <ShieldCheck className="w-3.5 h-3.5" />, label: 'Vendor Identified',     badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' },
    unknown: { icon: <ShieldAlert className="w-5 h-5 text-amber-500 dark:text-amber-400" />,   chipIcon: <ShieldAlert className="w-3.5 h-3.5" />,   label: 'OUI Not in Dictionary', badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' },
    invalid: { icon: <ShieldX className="w-5 h-5 text-rose-500 dark:text-rose-400" />,         chipIcon: <ShieldX className="w-3.5 h-3.5" />,         label: 'Invalid MAC Format',    badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20' },
  };

  const sc = statusConfig[status];

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex flex-col gap-2 border-b border-zinc-200 dark:border-[var(--color-border)] pb-5">
        <div className="flex items-center gap-3">
          <Wifi className="w-5 h-5 text-cyan-400 shrink-0" />
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-[var(--color-text-main)] tracking-tight">
            MAC Address OUI Vendor Lookup — Offline
          </h1>
        </div>
        <p className="text-sm text-zinc-500 dark:text-[var(--color-text-muted)] leading-relaxed">
          Enter a MAC address in any delimiter format (colon, dash, or dot). The OUI prefix is instantly matched against a hardcoded hardware vendor dictionary — completely offline.
        </p>
      </div>

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <Search className="w-4 h-4 text-[var(--color-text-muted)] dark:text-zinc-500" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => handleChange(e.target.value)}
          placeholder="e.g.  00:1A:4B:C0:FF:EE  or  001A4BC0FFEE"
          spellCheck={false}
          aria-label="MAC Address or OUI Prefix Input"
          className={`w-full pl-10 pr-36 py-3.5 rounded-xl border font-mono text-base text-zinc-800 dark:text-[var(--color-text-main)] bg-zinc-100/70 dark:bg-[var(--color-bg)]/70 focus:outline-none transition-all
            ${status === 'invalid'
              ? 'border-rose-500/40 shadow-[0_0_0_1px_rgba(244,63,94,0.15)]'
              : status === 'known'
              ? 'border-emerald-500/40 shadow-[0_0_0_1px_rgba(16,185,129,0.15)]'
              : 'border-zinc-200 dark:border-[var(--color-border)] focus:border-cyan-500/50'
            }`}
        />
        <div className={`absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold ${sc.badge}`}>
          {sc.chipIcon}
          {sc.label}
        </div>
      </div>

      {lookupResult && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className={`col-span-1 md:col-span-2 flex items-start gap-4 py-4 border-b border-zinc-200/40 dark:border-zinc-800/40`}>
            {sc.icon}
            <div className="flex flex-col">
              <p className={`text-lg sm:text-xl font-bold break-all ${status === 'known' ? 'text-emerald-700 dark:text-emerald-400' : 'text-amber-700 dark:text-amber-400'}`}>
                {lookupResult.vendor}
              </p>
              <p className="text-xs font-mono text-zinc-500 mt-1">OUI Prefix: <span className="font-bold">{lookupResult.oui}</span></p>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-6 pt-2">
            {[
              { label: 'Formatted MAC', value: lookupResult.formatted, color: 'text-zinc-800 dark:text-[var(--color-text-main)]' },
              { label: 'MAC Type', value: lookupResult.macType, color: 'text-zinc-700 dark:text-zinc-300' },
              {
                label: 'Multicast Bit',
                value: lookupResult.isMulticast ? 'Set (Bit 0 = 1)' : 'Clear (Bit 0 = 0)',
                color: lookupResult.isMulticast ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400',
              },
              {
                label: 'Local/Universal',
                value: lookupResult.isLocal ? 'Locally Administered' : 'Globally Unique',
                color: lookupResult.isLocal ? 'text-amber-600 dark:text-amber-400' : 'text-cyan-600 dark:text-cyan-400',
              },
            ].map(item => (
              <div key={item.label} className="flex flex-col gap-1.5">
                <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{item.label}</p>
                <p className={`font-mono text-xs font-bold break-all ${item.color}`}>{item.value}</p>
              </div>
            ))}
          </div>

          <div className="col-span-1 md:col-span-2 text-[10px] font-mono text-zinc-500 dark:text-zinc-600 bg-zinc-100 dark:bg-[var(--color-surface)] rounded-lg px-3 py-2 border border-zinc-200 dark:border-[var(--color-border)]">
            Accepted: <span className="text-zinc-450 dark:text-zinc-500">AA:BB:CC:DD:EE:FF</span> · <span className="text-zinc-450 dark:text-zinc-500">AA-BB-CC-DD-EE-FF</span> · <span className="text-zinc-450 dark:text-zinc-500">AABB.CCDD.EEFF</span> · <span className="text-zinc-450 dark:text-zinc-500">AABBCCDDEEFF</span>
          </div>
        </div>
      )}

      {status === 'idle' && !input && (
        <div className="border border-dashed border-zinc-200 dark:border-[var(--color-border)] rounded-xl p-8 flex flex-col items-center justify-center gap-3 text-center">
          <Wifi className="w-10 h-10 text-[var(--color-text-muted)] dark:text-zinc-700" />
          <p className="text-sm text-zinc-500 dark:text-zinc-650 max-w-xs">
            Type any MAC address above. Vendor identification is instant — no API calls required.
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-2">
            {['00:1A:4B:00:00:01', 'A0:27:3E:00:00:01', 'DC:53:C8:00:00:01'].map(example => (
              <button
                key={example}
                onClick={() => handleChange(example)}
                className="text-xs font-mono px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 text-zinc-550 dark:text-[var(--color-text-muted)] hover:text-cyan-600 dark:hover:text-cyan-400 hover:border-zinc-300 dark:hover:border-cyan-500/40 transition-all cursor-pointer"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
