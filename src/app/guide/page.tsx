"use client";

import { FC, ReactNode } from 'react';
import { BookOpen, HelpCircle, GraduationCap, Server, Layers } from 'lucide-react';
import { getMaskLong, longToIp } from '../../utils/ipv4Utils';

const SectionCard: FC<{ children: ReactNode }> = ({ children }) => (
  <div className="bento-inner-card p-5 flex flex-col gap-4">
    {children}
  </div>
);

const CodeBadge: FC<{ children: ReactNode; color?: 'teal' | 'cyan' | 'amber' | 'purple' | 'rose' | 'zinc' }> = ({
  children,
  color = 'teal',
}) => {
  const palette: Record<string, string> = {
    teal:   'bg-teal-500/10  text-teal-700 dark:text-teal-400  border-teal-500/20',
    cyan:   'bg-cyan-500/10  text-cyan-700 dark:text-cyan-400  border-cyan-500/20',
    amber:  'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20',
    purple: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20',
    rose:   'bg-rose-500/10  text-rose-700 dark:text-rose-400  border-rose-500/20',
    zinc:   'bg-zinc-150 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-zinc-250 dark:border-zinc-700',
  };
  return (
    <code className={`inline-block font-mono text-xs px-2 py-0.5 rounded border ${palette[color]}`}>
      {children}
    </code>
  );
};

export default function SubnetGuide() {
  const matrixRows = [];
  for (let p = 8; p <= 32; p++) {
    const maskLong   = getMaskLong(p);
    const hostsCount = p === 32 ? 1 : p === 31 ? 2 : Math.pow(2, 32 - p) - 2;
    matrixRows.push({ prefix: p, mask: longToIp(maskLong), hosts: hostsCount });
  }

  const prose = 'text-sm text-zinc-550 dark:text-zinc-400 leading-relaxed';
  const heading = 'text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2.5';
  const strong  = 'font-semibold text-zinc-800 dark:text-zinc-200';

  return (
    <div className="bento-card p-5 md:p-7 w-full flex flex-col gap-10">
      <div className="flex flex-col gap-3 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
            IPv4 Subnetting Guide
          </h2>
        </div>
        <p className={prose}>
          A complete technical knowledge base covering IP address architecture, bitwise subnet mathematics, step-by-step subnetting procedures, and modern IPv6 allocation standards.
          Designed for network architects, systems engineers, and DevOps practitioners.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 flex flex-col gap-8">
          <SectionCard>
            <h3 className={heading}>
              <GraduationCap className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0" />
              Understanding Classless Inter-Domain Routing (CIDR)
            </h3>
            <p className={prose}>
              Ratified in 1993 via <span className={strong}>RFC 1519</span>, CIDR replaced the rigid Class A / B / C address hierarchy
              that had governed IP allocation since the early ARPANET era. Under classful routing, a company needing
              300 hosts was forced to consume an entire Class B block (65,534 addresses), wasting tens of thousands
              of usable IPs. CIDR resolved this by decoupling the network boundary from fixed octet boundaries,
              allowing any arbitrary prefix length to define the split between network and host portions.
            </p>
            <p className={prose}>
              A CIDR address combines an IP with a <span className={strong}>prefix-length</span> suffix that
              dictates exactly how many leading bits belong to the network identifier:
            </p>
            <div className="bg-zinc-100 dark:bg-zinc-950/80 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 font-mono text-sm flex flex-col gap-2">
              <span className="text-zinc-500 dark:text-zinc-500 text-[11px] uppercase tracking-widest">syntax</span>
              <span className="text-teal-700 dark:text-teal-300">address/prefix-length</span>
              <span className="text-zinc-400 dark:text-zinc-500">──────────────────────</span>
              <span className="text-zinc-800 dark:text-zinc-200">10.0.0.0<span className="text-cyan-600 dark:text-cyan-400">/24</span>
                <span className="ml-4 text-zinc-500 dark:text-zinc-500"># 254 usable hosts — Class C equivalent</span>
              </span>
              <span className="text-zinc-800 dark:text-zinc-200">172.16.0.0<span className="text-cyan-600 dark:text-cyan-400">/20</span>
                <span className="ml-4 text-zinc-500 dark:text-zinc-500"># 4,094 usable hosts — mid-size segment</span>
              </span>
              <span className="text-zinc-800 dark:text-zinc-200">192.168.1.128<span className="text-cyan-600 dark:text-cyan-400">/26</span>
                <span className="ml-4 text-zinc-500 dark:text-zinc-500"># 62 usable hosts — fine-grained split</span>
              </span>
            </div>
            <p className={prose}>
              The <CodeBadge color="cyan">/24</CodeBadge> suffix means the first 24 bits are fixed network bits,
              leaving the remaining 8 bits to address <span className={strong}>256 total endpoints</span> (254 usable — the network and broadcast addresses are reserved).
            </p>
          </SectionCard>

          <SectionCard>
            <h3 className={heading}>
              <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              The Bitwise Mathematics Behind Subnet Masking
            </h3>
            <p className={prose}>
              All subnet calculations are pure binary arithmetic. Three operations cover every boundary derivation in the IPv4 space:
            </p>
            <div className="flex flex-col gap-4">
              <div className="flex gap-3">
                <span className="mt-0.5 w-6 h-6 shrink-0 rounded-md bg-cyan-100 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 flex items-center justify-center text-[10px] font-bold text-cyan-700 dark:text-cyan-400">1</span>
                <div className="flex flex-col gap-1">
                  <span className={strong + ' text-sm'}>Network Address — Bitwise AND</span>
                  <p className={prose}>
                    Perform a bitwise <CodeBadge color="cyan">AND</CodeBadge> between the host IP and the Subnet Mask.
                    Every bit position where <em>both</em> the IP and the Mask are <CodeBadge color="zinc">1</CodeBadge> stays
                    as <CodeBadge color="zinc">1</CodeBadge>; all host bits are forced to <CodeBadge color="zinc">0</CodeBadge>,
                    revealing the base Network Address.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="mt-0.5 w-6 h-6 shrink-0 rounded-md bg-amber-100 dark:bg-amber-50/10 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center text-[10px] font-bold text-amber-700 dark:text-amber-400">2</span>
                <div className="flex flex-col gap-1">
                  <span className={strong + ' text-sm'}>Broadcast Address — Bitwise NOT + OR</span>
                  <p className={prose}>
                    First invert the Subnet Mask using a bitwise <CodeBadge color="amber">NOT</CodeBadge> to produce the
                    Wildcard Mask (all host bits become <CodeBadge color="zinc">1</CodeBadge>). Then apply a bitwise{' '}
                    <CodeBadge color="amber">OR</CodeBadge> between the Network Address and the Wildcard Mask.
                    The result forces all host bits high, producing the Broadcast boundary.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="mt-0.5 w-6 h-6 shrink-0 rounded-md bg-emerald-100 dark:bg-emerald-50/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-700 dark:text-emerald-400">3</span>
                <div className="flex flex-col gap-1">
                  <span className={strong + ' text-sm'}>Usable Host Capacity</span>
                  <p className={prose}>
                    Total addressable IPs in any subnet follow the power sequence{' '}
                    <CodeBadge color="teal">2^(32 − n)</CodeBadge>, where <em>n</em> is the prefix length.
                    Subtracting 2 (for the reserved Network and Broadcast addresses) yields usable endpoint capacity:{' '}
                    <CodeBadge color="teal">2^(32 − n) − 2</CodeBadge>.
                    A <CodeBadge color="cyan">/24</CodeBadge> therefore provides{' '}
                    <CodeBadge color="zinc">2^8 − 2 = 254</CodeBadge> usable host IPs.
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard>
            <h3 className={heading}>
              <Layers className="w-5 h-5 text-purple-600 dark:text-purple-400 shrink-0" />
              Subnetting Tutorial — Predictable 4-Step Engineering Moves
            </h3>
            <p className={prose}>
              Subnetting is fully deterministic once you know the target host count or the required number of segments.
              The following worked example demonstrates splitting a large block into equal partitions:
            </p>

            <div className="bg-purple-500/[0.03] dark:bg-purple-500/5 border border-purple-500/20 rounded-xl p-5 flex flex-col gap-4">
              <p className="text-sm font-semibold text-purple-800 dark:text-purple-300">
                Goal: Split <CodeBadge color="purple">172.16.0.0/16</CodeBadge> into at least <strong>10 equal subnets</strong>.
              </p>
              <ol className="list-none flex flex-col gap-3 text-sm text-zinc-650 dark:text-zinc-400">
                <li className="flex gap-3">
                  <span className="shrink-0 font-bold text-purple-700 dark:text-purple-400 w-5">①</span>
                  <span><span className={strong}>Determine the minimum number of subnet bits needed.</span> We require at least 10 subnets. Evaluate the power-of-two sequence: 2¹=2, 2²=4, 2³=8, 2⁴=<span className="font-bold text-purple-700 dark:text-purple-400">16 ✓</span>. We need to borrow <strong>4 bits</strong>.</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 font-bold text-purple-700 dark:text-purple-400 w-5">②</span>
                  <span><span className={strong}>Calculate the new prefix length.</span> Original prefix was <CodeBadge color="purple">/16</CodeBadge>. Add the 4 borrowed bits → new working prefix is <CodeBadge color="purple">/20</CodeBadge>.</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 font-bold text-purple-700 dark:text-purple-400 w-5">③</span>
                  <span><span className={strong}>Confirm usable host capacity per subnet.</span> Each <CodeBadge color="purple">/20</CodeBadge> block provides 2^(32−20)−2 = <strong>4,094 usable endpoint host nodes</strong>.</span>
                </li>
                <li className="flex gap-3">
                  <span className="shrink-0 font-bold text-purple-700 dark:text-purple-400 w-5">④</span>
                  <span><span className={strong}>Map subnet block boundaries.</span> The block size is 2^12 = 4096 addresses. The 16 subnets begin at: 172.16.0.0, 172.16.16.0, 172.16.32.0 … 172.16.240.0, each separated by a 4096-address increment in the third octet.</span>
                </li>
              </ol>
            </div>

            <p className={prose}>
              This four-step method — <em>identify requirement → borrow bits → verify capacity → plot boundaries</em> — scales to any CIDR block, any prefix depth, and forms the foundation of enterprise VLSM design.
            </p>
          </SectionCard>

          <SectionCard>
            <h3 className={heading}>
              <Server className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
              IPv6 Subnetting Architecture Standards
            </h3>
            <p className={prose}>
              IPv6 expands the address space to 128 bits — approximately 3.4 × 10³⁸ total addresses — eliminating the scarcity constraints that drove the CIDR revolution.
              While this tool focuses on IPv4, understanding IPv6 allocation tiers is critical for modern dual-stack infrastructure planning.
            </p>

            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-3 bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/40 rounded-lg p-4">
                <CodeBadge color="teal">/64</CodeBadge>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Standard LAN Segment</span>
                  <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed">
                    The canonical size for a single IPv6 subnet. Provides <span className={strong}>18.4 quintillion (2⁶⁴) addresses</span> per segment.
                    You should never subnet below a /64 on a single segment — doing so breaks SLAAC (Stateless Address Autoconfiguration) and NDP (Neighbour Discovery Protocol), which require a full 64-bit host interface identifier field.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/40 rounded-lg p-4">
                <CodeBadge color="amber">/56</CodeBadge>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Consumer / Home Route Delegation</span>
                  <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed">
                    The typical ISP delegation for residential and small-office endpoints via DHCPv6-PD (Prefix Delegation).
                    A /56 grants the subscriber <span className={strong}>256 independent /64 subnets</span> to route across local VLAN segments, IoT networks, or guest SSIDs.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-zinc-100 dark:bg-zinc-800/40 border border-zinc-200 dark:border-zinc-700/40 rounded-lg p-4">
                <CodeBadge color="purple">/48</CodeBadge>
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">Enterprise Site Allocation</span>
                  <p className="text-xs text-zinc-550 dark:text-zinc-400 leading-relaxed">
                    The recommended allocation for a single enterprise campus or data centre site, typically announced via BGP.
                    A /48 provides <span className={strong}>65,536 /64 subnets</span> — sufficient to address every VLAN, server rack, DMZ, and management plane of any large organisation with room for decades of growth.
                  </p>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>

        <div className="lg:col-span-5">
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-100/30 dark:bg-zinc-950/50 overflow-hidden flex flex-col sticky top-8">
            <div className="bg-zinc-200/50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
              <h4 className="font-bold text-xs font-mono uppercase tracking-widest text-zinc-600 dark:text-zinc-400">
                Prefix Scaling Matrix
              </h4>
              <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-500">/8 → /32</span>
            </div>
            <div className="overflow-y-auto custom-scrollbar" style={{ maxHeight: '680px' }}>
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead className="sticky top-0 bg-zinc-200/95 dark:bg-zinc-950/90 backdrop-blur-sm z-10 border-b border-zinc-200 dark:border-zinc-800">
                  <tr className="text-zinc-550 dark:text-zinc-400 font-semibold tracking-wider text-[10px] uppercase">
                    <th className="py-2.5 px-4 text-center">CIDR</th>
                    <th className="py-2.5 px-4">Subnet Mask</th>
                    <th className="py-2.5 px-4 text-right">Usable Hosts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
                  {matrixRows.map((row) => (
                    <tr key={row.prefix} className="hover:bg-zinc-200/40 dark:hover:bg-zinc-800/30 transition-colors">
                      <td className="py-2.5 px-4 text-center font-bold text-cyan-600 dark:text-cyan-400">
                        /{row.prefix}
                      </td>
                      <td className="py-2.5 px-4 text-zinc-700 dark:text-zinc-300 font-medium">
                        {row.mask}
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-zinc-600 dark:text-zinc-400">
                        {row.hosts.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
