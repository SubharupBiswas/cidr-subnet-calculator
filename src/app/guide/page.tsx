"use client";

import { FC, ReactNode } from 'react';
import { getMaskLong, longToIp } from '../../utils/ipv4Utils';

const SectionCard: FC<{ children: ReactNode }> = ({ children }) => (
  <section className="flex flex-col gap-6 pt-4 pb-8 border-b border-zinc-200 dark:border-[var(--color-border)] last:border-0">
    {children}
  </section>
);

const CodeBadge: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <code className="inline-block font-mono text-xs px-1.5 py-0.5 font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-200/50 dark:bg-zinc-800/50">
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

  const prose = 'text-sm text-zinc-600 dark:text-[var(--color-text-muted)] leading-relaxed tracking-wide max-w-2xl';
  const heading = 'text-xl font-light text-zinc-900 dark:text-[var(--color-text-main)] tracking-tight mb-2';
  const strong  = 'font-medium text-zinc-800 dark:text-zinc-200';

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8 space-y-8">
      <div className="flex flex-col gap-4 border-b border-zinc-200 dark:border-[var(--color-border)] pb-8">
        <h1 className="text-3xl font-light text-zinc-900 dark:text-[var(--color-text-main)] tracking-tight">
          IPv4 Subnetting Tutorial &amp; CIDR Notation Reference Guide
        </h1>
        <p className={prose}>
          A complete technical knowledge base covering IP address architecture, bitwise subnet mathematics, step-by-step subnetting procedures, and modern IPv6 allocation standards.
          Designed for network architects, systems engineers, and DevOps practitioners.
        </p>
      </div>

      <div className="flex flex-col">
        <SectionCard>
          <h3 className={heading}>
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
          <div className="font-mono text-sm flex flex-col gap-2 mt-4 pl-4 border-l-2 border-zinc-300 dark:border-zinc-700">
            <span className="text-zinc-500 text-[10px] uppercase tracking-widest mb-1">syntax</span>
            <span className="text-zinc-800 dark:text-zinc-200 mb-2">address/prefix-length</span>
            <span className="text-zinc-800 dark:text-zinc-200">10.0.0.0/24<span className="ml-4 text-zinc-500"># 254 usable hosts — Class C equivalent</span></span>
            <span className="text-zinc-800 dark:text-zinc-200">172.16.0.0/20<span className="ml-4 text-zinc-500"># 4,094 usable hosts — mid-size segment</span></span>
            <span className="text-zinc-800 dark:text-zinc-200">192.168.1.128/26<span className="ml-4 text-zinc-500"># 62 usable hosts — fine-grained split</span></span>
          </div>
          <p className={prose + " mt-4"}>
            The <CodeBadge>/24</CodeBadge> suffix means the first 24 bits are fixed network bits,
            leaving the remaining 8 bits to address <span className={strong}>256 total endpoints</span> (254 usable — the network and broadcast addresses are reserved).
          </p>
        </SectionCard>

        <SectionCard>
          <h3 className={heading}>
            The Bitwise Mathematics Behind Subnet Masking
          </h3>
          <p className={prose}>
            All subnet calculations are pure binary arithmetic. Three operations cover every boundary derivation in the IPv4 space:
          </p>
          <div className="flex flex-col gap-8 mt-4">
            <div className="flex flex-col gap-1">
              <span className={strong + ' font-mono text-sm'}>[1] Network Address — Bitwise AND</span>
              <p className={prose}>
                Perform a bitwise <CodeBadge>AND</CodeBadge> between the host IP and the Subnet Mask.
                Every bit position where <em>both</em> the IP and the Mask are <CodeBadge>1</CodeBadge> stays
                as <CodeBadge>1</CodeBadge>; all host bits are forced to <CodeBadge>0</CodeBadge>,
                revealing the base Network Address.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className={strong + ' font-mono text-sm'}>[2] Broadcast Address — Bitwise NOT + OR</span>
              <p className={prose}>
                First invert the Subnet Mask using a bitwise <CodeBadge>NOT</CodeBadge> to produce the
                Wildcard Mask (all host bits become <CodeBadge>1</CodeBadge>). Then apply a bitwise{' '}
                <CodeBadge>OR</CodeBadge> between the Network Address and the Wildcard Mask.
                The result forces all host bits high, producing the Broadcast boundary.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <span className={strong + ' font-mono text-sm'}>[3] Usable Host Capacity</span>
              <p className={prose}>
                Total addressable IPs in any subnet follow the power sequence{' '}
                <CodeBadge>2^(32 − n)</CodeBadge>, where <em>n</em> is the prefix length.
                Subtracting 2 (for the reserved Network and Broadcast addresses) yields usable endpoint capacity:{' '}
                <CodeBadge>2^(32 − n) − 2</CodeBadge>.
                A <CodeBadge>/24</CodeBadge> therefore provides{' '}
                <CodeBadge>2^8 − 2 = 254</CodeBadge> usable host IPs.
              </p>
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <h3 className={heading}>
            Subnetting Tutorial — Predictable 4-Step Engineering Moves
          </h3>
          <p className={prose}>
            Subnetting is fully deterministic once you know the target host count or the required number of segments.
            The following worked example demonstrates splitting a large block into equal partitions:
          </p>

          <div className="pl-4 border-l-2 border-zinc-300 dark:border-zinc-700 py-2 my-4 flex flex-col gap-4">
            <p className="text-sm font-mono font-semibold text-zinc-800 dark:text-zinc-200">
              Goal: Split <CodeBadge>172.16.0.0/16</CodeBadge> into at least 10 equal subnets.
            </p>
            <ol className="list-none flex flex-col gap-4 text-sm text-zinc-600 dark:text-[var(--color-text-muted)]">
              <li className="flex gap-4">
                <span className="shrink-0 font-mono text-zinc-400">Step 1</span>
                <span><span className={strong}>Determine the minimum number of subnet bits needed.</span> We require at least 10 subnets. Evaluate the power-of-two sequence: 2¹=2, 2²=4, 2³=8, 2⁴=<span className="font-bold text-zinc-900 dark:text-zinc-100">16 ✓</span>. We need to borrow <strong>4 bits</strong>.</span>
              </li>
              <li className="flex gap-4">
                <span className="shrink-0 font-mono text-zinc-400">Step 2</span>
                <span><span className={strong}>Calculate the new prefix length.</span> Original prefix was <CodeBadge>/16</CodeBadge>. Add the 4 borrowed bits → new working prefix is <CodeBadge>/20</CodeBadge>.</span>
              </li>
              <li className="flex gap-4">
                <span className="shrink-0 font-mono text-zinc-400">Step 3</span>
                <span><span className={strong}>Confirm usable host capacity per subnet.</span> Each <CodeBadge>/20</CodeBadge> block provides 2^(32−20)−2 = <strong>4,094 usable endpoint host nodes</strong>.</span>
              </li>
              <li className="flex gap-4">
                <span className="shrink-0 font-mono text-zinc-400">Step 4</span>
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
            IPv6 Subnetting Architecture Standards
          </h3>
          <p className={prose}>
            IPv6 expands the address space to 128 bits — approximately 3.4 × 10³⁸ total addresses — eliminating the scarcity constraints that drove the CIDR revolution.
            While this tool focuses on IPv4, understanding IPv6 allocation tiers is critical for modern dual-stack infrastructure planning.
          </p>

          <div className="flex flex-col gap-6 mt-6">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <CodeBadge>/64</CodeBadge>
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Standard LAN Segment</span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-[var(--color-text-muted)] leading-relaxed mt-2">
                The canonical size for a single IPv6 subnet. Provides <span className={strong}>18.4 quintillion (2⁶⁴) addresses</span> per segment.
                You should never subnet below a /64 on a single segment — doing so breaks SLAAC (Stateless Address Autoconfiguration) and NDP (Neighbour Discovery Protocol), which require a full 64-bit host interface identifier field.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <CodeBadge>/56</CodeBadge>
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Consumer / Home Route Delegation</span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-[var(--color-text-muted)] leading-relaxed mt-2">
                The typical ISP delegation for residential and small-office endpoints via DHCPv6-PD (Prefix Delegation).
                A /56 grants the subscriber <span className={strong}>256 independent /64 subnets</span> to route across local VLAN segments, IoT networks, or guest SSIDs.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <CodeBadge>/48</CodeBadge>
                <span className="text-sm font-medium text-zinc-800 dark:text-zinc-200">Enterprise Site Allocation</span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-[var(--color-text-muted)] leading-relaxed mt-2">
                The recommended allocation for a single enterprise campus or data centre site, typically announced via BGP.
                A /48 provides <span className={strong}>65,536 /64 subnets</span> — sufficient to address every VLAN, server rack, DMZ, and management plane of any large organisation with room for decades of growth.
              </p>
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="flex flex-col pt-8">
        <div className="border-b-2 border-zinc-800 dark:border-zinc-200 pb-2 mb-4 flex items-center justify-between">
          <h4 className="font-bold text-xs font-mono uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
            Prefix Scaling Matrix
          </h4>
          <span className="text-[10px] font-mono text-zinc-500">/8 → /32</span>
        </div>
        <div className="w-full overflow-x-auto bg-[var(--color-surface)] border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-6 shadow-sm">
          <table className="table-auto w-full text-left font-mono text-sm tracking-tight">
            <thead className="border-b border-zinc-200 dark:border-[var(--color-border)]">
              <tr className="text-zinc-500 text-[10px] uppercase tracking-widest">
                <th className="py-2 px-2 font-normal">CIDR</th>
                <th className="py-2 px-2 font-normal">Subnet Mask</th>
                <th className="py-2 px-2 text-right font-normal">Usable Hosts</th>
              </tr>
            </thead>
            <tbody>
              {matrixRows.map((row) => (
                <tr key={row.prefix} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="py-2 px-2 text-zinc-900 dark:text-zinc-100 font-medium">
                    /{row.prefix}
                  </td>
                  <td className="py-2 px-2 text-zinc-500">
                    {row.mask}
                  </td>
                  <td className="py-2 px-2 text-right text-zinc-500 tabular-nums">
                    {row.hosts.toLocaleString('en-US')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
