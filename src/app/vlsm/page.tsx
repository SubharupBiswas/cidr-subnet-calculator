"use client";

import { useState, useCallback } from 'react';
import { Plus, Trash2, Zap, AlertTriangle, ChevronDown, ChevronUp, Network, Terminal } from 'lucide-react';
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
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const addDept = () => {
    setDepartments(prev => [...prev, { id: crypto.randomUUID(), name: '', hosts: '' }]);
  };

  const removeDept = (id: string) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
  };

  const updateDept = (id: string, field: 'name' | 'hosts', value: string) => {
    setDepartments(prev => prev.map(d => d.id === id ? { ...d, [field]: value } : d));
  };

  const generate = useCallback(() => {
    const depts = departments
      .map(d => ({ name: d.name || 'Unnamed', hosts: parseInt(d.hosts, 10) || 0 }))
      .filter(d => d.hosts > 0);

    const r = runVlsm(parentBlock, parentPrefix, depts);
    setResult(r);
    setExpandedRow(null);
  }, [parentBlock, parentPrefix, departments]);

  const fieldInput = [
    'bg-transparent w-full font-mono text-sm text-zinc-800 dark:text-zinc-200',
    'placeholder:text-zinc-450 dark:placeholder:text-zinc-700',
    'focus:outline-none',
  ].join(' ');

  const fieldWrap = [
    'bg-zinc-100 dark:bg-[var(--color-bg)]/60',
    'border border-zinc-250 dark:border-[var(--color-border)]',
    'focus-within:border-cyan-500/40',
    'rounded-xl px-3.5 py-2.5 transition-all duration-200',
  ].join(' ');

  return (
    <div className="bento-card p-5 sm:p-7 flex flex-col gap-0">
      <div className="flex flex-col gap-2 border-b border-zinc-200 dark:border-[var(--color-border)] pb-6 mb-7">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <Network className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-[var(--color-text-main)] tracking-tight leading-none">
              VLSM Topology Architect
            </h2>
            <p className="text-[11px] font-mono text-zinc-550 dark:text-[var(--color-text-main)]0 mt-0.5 tracking-wide">
              Variable Length Subnet Masking Engine
            </p>
          </div>
        </div>
        <p className="text-sm text-[var(--color-text-main)]0 dark:text-[var(--color-text-muted)] leading-relaxed mt-1">
          Input a parent CIDR block and department host requirements. The engine sorts requirements
          largest-first, then allocates optimally-sized subnets to prevent address starvation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-7">
        <div className="flex flex-col gap-2">
          <label htmlFor="vlsm-parent-net" className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-main)]0 dark:text-[var(--color-text-main)]0 flex items-center gap-1.5">
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
          <label htmlFor="vlsm-parent-prefix" className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-main)]0 dark:text-[var(--color-text-main)]0 flex items-center gap-2">
            <Terminal className="w-3 h-3" />
            Prefix Length
            <span className="font-mono text-sm font-bold text-cyan-600 dark:text-cyan-400 ml-auto normal-case tracking-normal">
              /{parentPrefix}
            </span>
          </label>
          <div className={`${fieldWrap} flex flex-col justify-center gap-2`}>
            <input
              id="vlsm-parent-prefix"
              type="range"
              min={1}
              max={30}
              value={parentPrefix}
              onChange={e => setParentPrefix(parseInt(e.target.value))}
              className={[
                'w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer focus:outline-none',
                '[&::-webkit-slider-thumb]:appearance-none',
                '[&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3',
                '[&::-webkit-slider-thumb]:rounded-full',
                '[&::-webkit-slider-thumb]:bg-cyan-400',
                '[&::-webkit-slider-thumb]:shadow-[0_0_12px_#22d3ee]',
                '[&::-webkit-slider-thumb]:transition-transform',
                '[&::-webkit-slider-thumb]:hover:scale-125',
                '[&::-moz-range-thumb]:w-3 [&::-moz-range-thumb]:h-3',
                '[&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0',
                '[&::-moz-range-thumb]:bg-cyan-400',
              ].join(' ')}
            />
            <div className="flex justify-between text-[9px] font-mono text-[var(--color-text-main)]0 dark:text-zinc-600 select-none">
              <span>/1</span>
              <span>/8</span>
              <span>/16</span>
              <span>/24</span>
              <span>/30</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 mb-5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--color-text-main)]0 dark:text-[var(--color-text-main)]0">
            Department Requirements
          </span>
          <span className="text-[10px] font-mono text-[var(--color-text-main)]0 dark:text-[var(--color-text-main)]0 bg-zinc-150 dark:bg-[var(--color-surface)] border border-zinc-250 dark:border-[var(--color-border)] px-2 py-0.5 rounded-md">
            {departments.length} dept{departments.length !== 1 ? 's' : ''}
          </span>
        </div>

        {departments.map((dept, idx) => (
          <div
            key={dept.id}
            className="flex items-center gap-2 bg-zinc-100/60 dark:bg-[var(--color-surface)] border border-zinc-250 dark:border-[var(--color-border)] rounded-xl px-3 py-2 group hover:border-zinc-350 dark:hover:border-zinc-700/60 transition-all duration-150"
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
            <span className="text-[10px] font-mono text-[var(--color-text-main)]0 dark:text-zinc-600 shrink-0">hosts</span>
            <button
              onClick={() => removeDept(dept.id)}
              className="text-zinc-450 dark:text-[var(--color-text-muted)] hover:text-rose-600 dark:hover:text-rose-500 hover:bg-rose-500/10 dark:hover:bg-rose-500/10 p-1.5 rounded-lg transition-all shrink-0 cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100 ml-1"
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
          className="w-full border border-dashed border-zinc-250 dark:border-[var(--color-border)] hover:border-cyan-500/40 dark:hover:border-cyan-500/30 rounded-xl p-3 text-xs font-mono font-medium text-[var(--color-text-main)]0 dark:text-[var(--color-text-main)]0 hover:text-cyan-600 dark:hover:text-cyan-400 bg-transparent hover:bg-cyan-500/[0.03] transition-all cursor-pointer flex items-center justify-center gap-2 mt-1"
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
                <h3 className="text-xs font-bold font-mono uppercase tracking-[0.15em] text-zinc-550 dark:text-[var(--color-text-muted)]">
                  Allocated Subnets
                  <span className="ml-2 font-mono text-[var(--color-text-muted)] dark:text-zinc-600 normal-case tracking-normal">({result.allocations.length})</span>
                </h3>
              </div>

              <div className="hidden md:grid grid-cols-[minmax(0,1fr)_60px_minmax(120px,auto)_minmax(120px,auto)_72px_72px] gap-x-4 px-4 py-1.5 text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-main)]0 dark:text-zinc-600 border-b border-zinc-200 dark:border-[var(--color-border)]">
                <span>Department</span>
                <span className="text-center">Prefix</span>
                <span>Network</span>
                <span>Broadcast</span>
                <span className="text-right">Capacity</span>
                <span className="text-right">Wasted</span>
              </div>

              {result.allocations.map((alloc, i) => (
                <div key={i}>
                  <button
                    onClick={() => setExpandedRow(expandedRow === `${i}` ? null : `${i}`)}
                    className={[
                      'w-full text-left rounded-xl border transition-all duration-200 cursor-pointer',
                      'px-4 py-3',
                      expandedRow === `${i}`
                        ? 'bg-zinc-200/50 dark:bg-zinc-800/50 border-zinc-300 dark:border-zinc-700/60'
                        : 'bg-zinc-100/50 dark:bg-[var(--color-surface)] border-zinc-200 dark:border-[var(--color-border)] hover:bg-zinc-200 dark:hover:bg-zinc-800/40 hover:border-zinc-250 dark:hover:border-zinc-700/50',
                      'shadow-sm dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.01)]',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between md:hidden">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="font-mono text-[10px] font-bold text-[var(--color-text-muted)] dark:text-zinc-700 shrink-0">
                          $_{i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-zinc-800 dark:text-[var(--color-text-main)] truncate">{alloc.department}</p>
                          <p className="text-[10px] font-mono text-[var(--color-text-main)]0 dark:text-[var(--color-text-muted)] mt-0.5">
                            {alloc.networkAddress}<span className="text-cyan-600 dark:text-cyan-400 font-bold">/{alloc.allocatedPrefix}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {alloc.actualCapacity.toLocaleString('en-US')} hosts
                        </span>
                        {expandedRow === `${i}`
                          ? <ChevronUp className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                          : <ChevronDown className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                        }
                      </div>
                    </div>

                    <div className="hidden md:grid grid-cols-[minmax(0,1fr)_60px_minmax(120px,auto)_minmax(120px,auto)_72px_72px] gap-x-4 items-center">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="font-mono text-[10px] font-bold text-[var(--color-text-muted)] dark:text-zinc-700 shrink-0 select-none">
                          $_{i + 1}
                        </span>
                        <span className="text-sm font-semibold text-zinc-800 dark:text-[var(--color-text-main)] truncate">
                          {alloc.department}
                        </span>
                        <span className="text-[10px] font-mono text-[var(--color-text-main)]0 dark:text-[var(--color-text-main)]0 shrink-0">
                          ({alloc.requiredHosts} req)
                        </span>
                      </div>
                      <span className="text-center font-mono text-sm font-bold text-cyan-600 dark:text-cyan-400">
                        /{alloc.allocatedPrefix}
                      </span>
                      <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300 tabular-nums">
                        {alloc.networkAddress}
                      </span>
                      <span className="font-mono text-xs text-amber-600 dark:text-amber-400 tabular-nums">
                        {alloc.broadcastAddress}
                      </span>
                      <span className="text-right font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                        {alloc.actualCapacity.toLocaleString('en-US')}
                      </span>
                      <span className="text-right font-mono text-xs text-[var(--color-text-main)]0 dark:text-zinc-550 tabular-nums">
                        {alloc.wastedHosts.toLocaleString('en-US')}
                      </span>
                    </div>
                  </button>

                  {expandedRow === `${i}` && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-1.5 mx-0.5 px-4 py-4 bg-zinc-100/60 dark:bg-[var(--color-surface)] border border-zinc-200 dark:border-[var(--color-border)] rounded-xl">
                      {[
                        { label: 'Subnet Mask',  value: alloc.subnetMask,                                color: 'text-purple-600 dark:text-purple-400' },
                        { label: 'First Usable', value: alloc.firstUsable,                               color: 'text-emerald-600 dark:text-emerald-400' },
                        { label: 'Last Usable',  value: alloc.lastUsable,                                color: 'text-emerald-600 dark:text-emerald-400' },
                        { label: 'Capacity',     value: `${alloc.actualCapacity.toLocaleString('en-US')} hosts`,color: 'text-teal-600 dark:text-teal-400' },
                        { label: 'Required',     value: `${alloc.requiredHosts.toLocaleString('en-US')} hosts`, color: 'text-zinc-700 dark:text-zinc-300' },
                        { label: 'Wasted',       value: `${alloc.wastedHosts.toLocaleString('en-US')} addrs`,   color: 'text-[var(--color-text-main)]0 dark:text-[var(--color-text-main)]0' },
                      ].map(item => (
                        <div key={item.label} className="flex flex-col gap-0.5">
                          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--color-text-main)]0 dark:text-zinc-650">
                            {item.label}
                          </p>
                          <p className={`font-mono text-sm font-bold ${item.color} break-all`}>
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {result.slack.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-600 shrink-0" />
                <h3 className="text-xs font-bold font-mono uppercase tracking-[0.15em] text-[var(--color-text-main)]0 dark:text-[var(--color-text-main)]0">
                  Unallocated Slack
                  <span className="ml-2 font-mono text-[var(--color-text-muted)] dark:text-zinc-700 normal-case tracking-normal">({result.slack.length} fragment{result.slack.length !== 1 ? 's' : ''})</span>
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {result.slack.map((frag, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 font-mono text-xs px-3 py-1.5 rounded-lg bg-zinc-100/50 dark:bg-[var(--color-surface)] border border-zinc-200 dark:border-[var(--color-border)] text-zinc-600 dark:text-[var(--color-text-muted)]"
                  >
                    <span className="text-zinc-550 dark:text-[var(--color-text-main)]0">{frag.networkAddress}</span>
                    <span className="font-bold text-cyan-600 dark:text-cyan-500">/{frag.prefix}</span>
                    <span className="text-zinc-450 dark:text-zinc-700 text-[10px]">({frag.size.toLocaleString('en-US')})</span>
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
