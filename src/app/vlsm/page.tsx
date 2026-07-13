"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { Plus, Trash2, Zap, AlertTriangle, Network, Terminal } from 'lucide-react';
import { ipToLong, longToIp, getMaskLong, isValidIp } from '../../utils/ipv4Utils';

interface Department {
  id: string;
  name: string;
  hosts: string;
}

interface VlsmAllocation {
  department: string;
  requiredHosts: number;
  allocatedPrefix: number;
  subnetMask: string;
  networkAddress: string;
  broadcastAddress: string;
  firstUsable: string;
  lastUsable: string;
  actualCapacity: number;
  wastedHosts: number;
}

interface SlackFragment {
  networkAddress: string;
  prefix: number;
  size: number;
}

function neededPrefix(required: number): number {
  for (let prefix = 30; prefix >= 1; prefix--) {
    const capacity = Math.pow(2, 32 - prefix) - 2;
    if (capacity >= required) return prefix;
  }
  return 1;
}

function runVlsm(
  parentIp: string,
  parentPrefix: number,
  departments: { name: string; hosts: number }[]
): { allocations: VlsmAllocation[]; slack: SlackFragment[]; error: string | null } {
  if (!isValidIp(parentIp)) return { allocations: [], slack: [], error: 'Invalid parent network IP address.' };
  if (departments.length === 0) return { allocations: [], slack: [], error: 'Add at least one department.' };

  const parentMaskLong = getMaskLong(parentPrefix);
  const parentNetLong = (ipToLong(parentIp) & parentMaskLong) >>> 0;
  const parentSize = Math.pow(2, 32 - parentPrefix);

  const sorted = [...departments].sort((a, b) => b.hosts - a.hosts);

  const allocations: VlsmAllocation[] = [];
  let cursor = parentNetLong;

  for (const dept of sorted) {
    const prefix = neededPrefix(dept.hosts);
    const blockSize = Math.pow(2, 32 - prefix);
    const maskLong = getMaskLong(prefix);

    const aligned = (Math.ceil(cursor / blockSize) * blockSize) >>> 0;

    if (aligned + blockSize > parentNetLong + parentSize) {
      return {
        allocations,
        slack: [],
        error: `Address space exhausted before allocating "${dept.name}". Reduce host requirements or use a larger parent block.`,
      };
    }

    const broadcastLong = (aligned + blockSize - 1) >>> 0;
    const capacity = blockSize - 2;

    allocations.push({
      department: dept.name,
      requiredHosts: dept.hosts,
      allocatedPrefix: prefix,
      subnetMask: longToIp(maskLong),
      networkAddress: longToIp(aligned),
      broadcastAddress: longToIp(broadcastLong),
      firstUsable: longToIp(aligned + 1),
      lastUsable: longToIp(broadcastLong - 1),
      actualCapacity: capacity,
      wastedHosts: capacity - dept.hosts,
    });

    cursor = (aligned + blockSize) >>> 0;
  }

  const slack: SlackFragment[] = [];
  const end = (parentNetLong + parentSize) >>> 0;
  let remaining = cursor;

  while (remaining < end) {
    let found = false;
    for (let p = 1; p <= 32; p++) {
      const size = Math.pow(2, 32 - p);
      if (remaining + size <= end && remaining % size === 0) {
        slack.push({ networkAddress: longToIp(remaining), prefix: p, size });
        remaining = (remaining + size) >>> 0;
        found = true;
        break;
      }
    }
    if (!found) break;
  }

  return { allocations, slack, error: null };
}

export default function VlsmPlanner() {
  const [parentBlock, setParentBlock] = useState('192.168.1.0');
  const [parentPrefix, setParentPrefix] = useState(24);
  const [departments, setDepartments] = useState<Department[]>([
    { id: '1', name: 'Engineering', hosts: '50' },
    { id: '2', name: 'Sales', hosts: '20' },
    { id: '3', name: 'HR', hosts: '10' },
  ]);
  const [result, setResult] = useState<{ allocations: VlsmAllocation[]; slack: SlackFragment[]; error: string | null } | null>(null);

  const prefixRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = prefixRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY < 0 ? 1 : -1;
      setParentPrefix(prev => Math.min(30, Math.max(1, prev + delta)));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const addDept = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDepartments(prev => [...prev, { id: crypto.randomUUID(), name: '', hosts: '' }]);
  };

  const removeDept = (id: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setDepartments(prev => prev.filter(d => d.id !== id));
  };

  const updateDept = (id: string, field: 'name' | 'hosts', value: string) => {
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const generate = useCallback((e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const depts = departments
      .map(d => ({ name: d.name || 'Unnamed', hosts: parseInt(d.hosts, 10) || 0 }))
      .filter(d => d.hosts > 0);

    const r = runVlsm(parentBlock, parentPrefix, depts);
    setResult(r);
  }, [parentBlock, parentPrefix, departments]);

  const fieldInput = [
    'bg-transparent w-full font-mono text-sm text-[var(--color-text-main)]',
    'placeholder:text-[var(--color-text-muted)]',
    'focus:outline-none',
  ].join(' ');

  const fieldWrap = [
    'bg-[var(--color-surface)]',
    'border border-[var(--color-border)]',
    'focus-within:border-blue-300 dark:focus-within:border-cyan-500/40',
    'rounded-xl px-3.5 py-2.5 transition-all duration-200',
  ].join(' ');

  return (
    <div className="w-full flex flex-col gap-0">
      <div className="flex flex-col gap-2 border-b border-zinc-200 dark:border-[var(--color-border)] pb-6 mb-7">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <Network className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-[var(--color-text-main)] tracking-tight leading-none">
              VLSM Calculator — Variable Length Subnet Mask Planner
            </h1>
            <p className="text-[11px] font-mono text-zinc-700 dark:text-zinc-500 mt-0.5 tracking-wide">
              Variable Length Subnet Masking Engine
            </p>
          </div>
        </div>
        <p className="text-sm text-zinc-700 dark:text-[var(--color-text-muted)] leading-relaxed mt-1">
          Input a parent CIDR block and department host requirements. The engine sorts requirements
          largest-first, then allocates optimally-sized subnets to prevent address starvation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-7">
        <div className="flex flex-col gap-2">
          <label htmlFor="vlsm-parent-net" className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-700 dark:text-zinc-500 flex items-center gap-1.5">
            <Terminal className="w-3 h-3" />
            Parent Network
          </label>
          <div className={fieldWrap}>
            <input
              id="vlsm-parent-net"
              value={parentBlock}
              onChange={e => setParentBlock(e.target.value)}
              placeholder="192.168.1.0"
              spellCheck={false}
              className={`${fieldInput} font-bold text-base tracking-wide`}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="vlsm-parent-prefix" className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-700 dark:text-zinc-500 flex items-center gap-2">
            <Terminal className="w-3 h-3" />
            Prefix Length
            <span className="font-mono text-sm font-bold text-cyan-600 dark:text-cyan-400 ml-auto normal-case tracking-normal">
              /{parentPrefix}
            </span>
          </label>
          {/* Single coordinate-space container: both input and labels reference
              the same bounding box. No padding, no overflow tricks. */}
          <div className="relative w-full block">
            <input
              ref={prefixRef}
              id="vlsm-parent-prefix"
              type="range"
              min={1}
              max={30}
              value={parentPrefix}
              onChange={e => setParentPrefix(parseInt(e.target.value))}
              className="w-full block m-0 p-0 touch-none"
              style={{
                background: `linear-gradient(to right, var(--color-accent) ${((parentPrefix - 1) / 29) * 100}%, var(--color-border) ${((parentPrefix - 1) / 29) * 100}%)`
              }}
              aria-label="Parent network prefix slider"
            />
            {/* Labels: each badge is placed at the exact pixel where the thumb
                center sits for that value.
                Formula: calc(7px + fraction*(100%-14px))
                  - 7px  = half the 14px thumb diameter (from index.css)
                  - fraction = (value-min)/(max-min)
                -translate-x-1/2 centers the badge over that point. */}
            <div className="relative w-full h-14 mt-1 select-none">
              {([1, 8, 16, 24, 30] as const).map((p) => {
                const isActive = parentPrefix === p;
                const fraction = (p - 1) / 29;          // range 1–30
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setParentPrefix(p)}
                    aria-label={`Set prefix to /${p}`}
                    aria-pressed={isActive}
                    className="absolute top-0 -translate-x-1/2 min-w-[44px] min-h-[44px] flex flex-col items-center justify-start pt-1 group cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md"
                    style={{ left: `calc(7px + ${fraction} * (100% - 14px))` }}
                  >
                    {/* Tick dot — sits directly below the track */}
                    <span className={`w-1 h-1 rounded-full transition-all duration-200 flex-shrink-0 ${
                      isActive
                        ? 'bg-accent shadow-[0_0_8px_rgba(34,211,238,0.8)] scale-125'
                        : 'bg-zinc-300 dark:bg-zinc-700 group-hover:bg-zinc-400 dark:group-hover:bg-zinc-500'
                    }`} />
                    {/* Label Badge */}
                    <span className={`mt-1 px-2 py-0.5 text-[10px] font-mono font-bold rounded-md transition-all duration-200 border whitespace-nowrap ${
                      isActive
                        ? 'text-accent bg-accent/10 border-accent/30 shadow-[0_2px_8px_-2px_rgba(34,211,238,0.2)]'
                        : 'text-zinc-400 dark:text-zinc-500 bg-transparent border-transparent group-hover:text-zinc-700 dark:group-hover:text-zinc-300 group-hover:bg-zinc-100 dark:group-hover:bg-zinc-800/40 group-hover:border-zinc-200/50 dark:group-hover:border-zinc-700/50'
                    }`}>
                      /{p}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-700 dark:text-zinc-500">
            Department Requirements
          </span>
          <span className="text-[10px] font-mono text-zinc-700 dark:text-zinc-500 bg-zinc-100 dark:bg-[var(--color-surface)] border border-zinc-200 dark:border-[var(--color-border)] px-2 py-0.5 rounded-md">
            {departments.length} dept{departments.length !== 1 ? 's' : ''}
          </span>
        </div>

        {departments.map((dept, idx) => (
          <div
            key={dept.id}
            className="flex items-center gap-2 bg-zinc-100/60 dark:bg-[var(--color-surface)] border border-zinc-200 dark:border-[var(--color-border)] rounded-xl px-3 py-2 group hover:border-zinc-300 dark:hover:border-zinc-700/60 transition-all duration-150"
          >
            <span className="font-mono text-xs font-bold text-[var(--color-text-muted)] dark:text-zinc-700 w-7 shrink-0 select-none">
              $_{idx + 1}
            </span>
            <input
              value={dept.name}
              onChange={e => updateDept(dept.id, 'name', e.target.value)}
              placeholder="Department name"
              className="flex-1 bg-transparent font-mono text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-[var(--color-text-muted)] dark:placeholder:text-zinc-700 focus:outline-none min-w-0"
              aria-label={`Department ${idx + 1} Name`}
            />
            <span className="text-[var(--color-text-muted)] dark:text-zinc-700 font-mono text-sm shrink-0 select-none">·</span>
            <input
              type="number"
              min={1}
              value={dept.hosts}
              onChange={e => updateDept(dept.id, 'hosts', e.target.value)}
              placeholder="hosts"
              className="w-20 shrink-0 bg-transparent font-mono text-sm text-zinc-800 dark:text-zinc-200 placeholder:text-[var(--color-text-muted)] dark:placeholder:text-zinc-700 focus:outline-none text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              aria-label={`Department ${idx + 1} Required Hosts`}
            />
            <span className="text-[10px] font-mono text-zinc-700 dark:text-zinc-600 shrink-0">hosts</span>
            <button
              onClick={(e) => removeDept(dept.id, e)}
              className="text-zinc-700 dark:text-[var(--color-text-muted)] hover:text-rose-600 dark:hover:text-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-500/10 p-1.5 rounded-lg transition-all shrink-0 cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100 ml-1"
              tabIndex={0}
              title="Remove department"
              aria-label={`Delete Department ${dept.name || idx + 1}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        <button
          onClick={addDept}
          className="w-full border border-dashed border-zinc-200 dark:border-[var(--color-border)] hover:border-cyan-500/40 dark:hover:border-cyan-500/30 rounded-xl p-3 text-xs font-mono font-medium text-zinc-700 dark:text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 bg-transparent hover:bg-cyan-500/[0.03] transition-all cursor-pointer flex items-center justify-center gap-2 mt-1"
        >
          <Plus className="w-3.5 h-3.5" />
          add_department_requirement()
        </button>
      </div>

      <button
        onClick={generate}
        className="w-full py-3.5 px-4 rounded-xl font-mono text-xs font-bold tracking-wider uppercase bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-black shadow-[0_4px_20px_rgba(34,211,238,0.2)] hover:shadow-[0_4px_25px_rgba(34,211,238,0.35)] transition-all duration-300 transform active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 mb-1"
      >
        <Zap className="w-3.5 h-3.5" />
        generate_topology_tree()
      </button>

      {result && (
        <div className="mt-7 flex flex-col gap-5">
          {result.error && (
            <div className="flex items-start gap-3 bg-rose-50 dark:bg-rose-500/[0.07] border border-rose-200 dark:border-rose-500/20 rounded-xl p-4">
              <AlertTriangle className="w-4 h-4 text-rose-550 dark:text-rose-400 shrink-0 mt-0.5" />
              <p className="text-sm text-rose-700 dark:text-rose-400 font-mono leading-relaxed">{result.error}</p>
            </div>
          )}

          {result.allocations.length > 0 && (
            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500 shadow-[0_2px_6px_rgba(20,184,166,0.4)] dark:shadow-[0_0_8px_rgba(20,184,166,0.6)]" />
                </span>
                <h2 className="text-xs font-bold font-mono uppercase tracking-[0.15em] text-zinc-700 dark:text-[var(--color-text-muted)]">
                  Allocated Subnets
                  <span className="ml-2 font-mono text-[var(--color-text-muted)] dark:text-zinc-600 normal-case tracking-normal">({result.allocations.length})</span>
                </h2>
              </div>

              <div className="relative border-l-2 border-zinc-200/50 dark:border-zinc-800/60 ml-3 pl-6 py-2 flex flex-col gap-8 mt-4">
                {result.allocations.map((alloc, i) => (
                  <div key={i} className="relative group">
                    {/* Node Dot */}
                    <span className="absolute -left-[31px] top-1.5 flex h-2.5 w-2.5 rounded-full bg-cyan-500 ring-4 ring-[var(--color-bg)] transition-transform duration-300 group-hover:scale-125" />
                    
                    <div className="flex flex-col gap-3">
                      {/* Title and Address block */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col">
                          <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5">
                            <span className="font-mono text-[10px] text-zinc-700">$_{i + 1}</span>
                            {alloc.department}
                            <span className="text-[10px] font-mono font-medium text-zinc-700">({alloc.requiredHosts} req)</span>
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-mono text-sm font-extrabold text-cyan-600 dark:text-cyan-400">
                              {alloc.networkAddress}/{alloc.allocatedPrefix}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-mono text-xs font-bold text-emerald-800 dark:text-emerald-400 tabular-nums">
                            {alloc.actualCapacity.toLocaleString('en-US')} hosts
                          </span>
                          <span className="font-mono text-[10px] text-zinc-700 mt-0.5 tabular-nums">
                            {alloc.wastedHosts.toLocaleString('en-US')} wasted
                          </span>
                        </div>
                      </div>

                      {/* Detail Metrics Matrix */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-zinc-200/50 dark:border-zinc-800/60">
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">Subnet Mask</span>
                          <span className="font-mono text-xs text-purple-600 dark:text-purple-400">{alloc.subnetMask}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">First Usable</span>
                          <span className="font-mono text-xs text-emerald-800 dark:text-emerald-400">{alloc.firstUsable}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">Last Usable</span>
                          <span className="font-mono text-xs text-emerald-800 dark:text-emerald-400">{alloc.lastUsable}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">Broadcast</span>
                          <span className="font-mono text-xs text-amber-600 dark:text-amber-400">{alloc.broadcastAddress}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {result.slack.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600 shrink-0" />
                <h2 className="text-xs font-bold font-mono uppercase tracking-[0.15em] text-zinc-700 dark:text-zinc-400">
                  Unallocated Slack
                  <span className="ml-2 font-mono text-[var(--color-text-muted)] dark:text-zinc-400 normal-case tracking-normal">({result.slack.length} fragment{result.slack.length !== 1 ? 's' : ''})</span>
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.slack.map((frag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-lg bg-zinc-100/50 dark:bg-[var(--color-surface)] border border-zinc-200 dark:border-[var(--color-border)] text-zinc-700 dark:text-[var(--color-text-muted)]"
                  >
                    <span className="text-zinc-700 dark:text-zinc-400">{frag.networkAddress}</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-500">/{frag.prefix}</span>
                    <span className="text-zinc-700 dark:text-zinc-400 text-[10px]">({frag.size.toLocaleString('en-US')})</span>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
