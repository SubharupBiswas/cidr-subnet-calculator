"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useSearchParams, usePathname } from 'next/navigation';
import { Terminal } from 'lucide-react';
import { CalculatorForm } from '../components/CalculatorForm';
import { calculateSubnet, isValidIp, SubnetResult } from '../utils/ipv4Utils';
import SubnetFaqs from '../components/SubnetFaqs';

// Below-fold components: dynamically imported so they are excluded from the
// critical mobile bundle. Each sheds JS parse time on the initial load.
const LiveMatrix = dynamic(
  () => import('../components/LiveMatrix').then(m => m.LiveMatrix),
  { ssr: false, loading: () => <div className="animate-pulse h-[250px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-full" /> }
);
const BinaryVisualizer = dynamic(
  () => import('../components/BinaryVisualizer').then(m => m.BinaryVisualizer),
  { ssr: false, loading: () => <div className="animate-pulse h-[180px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-full" /> }
);
const SubnetSplitter = dynamic(
  () => import('../components/SubnetSplitter').then(m => m.SubnetSplitter),
  { ssr: false, loading: () => <div className="animate-pulse h-[140px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-full" /> }
);
const CheatSheet = dynamic(() => import('../components/CheatSheet').then(m => m.CheatSheet), { ssr: false, loading: () => <div className="animate-pulse h-[100px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-full" /> });
const HistoryTracker = dynamic(() => import('../components/HistoryTracker').then(m => m.HistoryTracker), { ssr: false, loading: () => <div className="animate-pulse h-[140px] bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl w-full" /> });


import type { HistoryItem } from '../components/HistoryTracker';

function AdSlot({ className, type }: { className?: string; type: 'banner' | 'rectangle' }) {
  if (process.env.NODE_ENV === 'development') {
    return (
      <div
        className={`relative w-full overflow-hidden select-none rounded-2xl border bg-white border-zinc-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:bg-[#090a10]/40 dark:border-[var(--color-border)] dark:backdrop-blur-md flex flex-col items-center justify-center dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.01)] ${className ?? ''} ${type === 'banner' ? 'min-h-[90px]' : 'min-h-[250px]'
          }`}
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
        <span className="text-[9px] tracking-[0.2em] uppercase font-mono font-bold text-zinc-700 bg-zinc-100 dark:bg-[var(--color-surface)] border border-zinc-300 dark:border-[var(--color-border)] px-2 py-0.5 rounded-md z-10 shadow-sm">
          Ad Placement Space
        </span>
        <span className="text-[10px] font-mono text-zinc-700 dark:text-zinc-600 mt-1 z-10">
          {type === 'banner' ? 'Supports 728x90 / 970x90 Leaderboards' : 'Supports 300x250 / 336x280 Rectangles'}
        </span>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden flex justify-center items-center ${className ?? ''} ${type === 'banner' ? 'min-h-[90px]' : 'min-h-[250px]'}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-production-id"
        data-ad-slot="production-slot"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

function SubnetCalculatorContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const rawIp = searchParams.get('ip') || '192.168.1.1';
  const rawPrefix = searchParams.get('prefix') || '24';
  const isEmbedded = searchParams.get('embed') === 'true';

  const [ip, setIpState] = useState<string>(rawIp);
  const [prefix, setPrefixState] = useState<number>(parseInt(rawPrefix, 10) || 24);
  const [result, setResult] = useState<SubnetResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Track whether the current state update came from the URL so we don't
  // push back to the router and create a circular update loop.
  const isUpdatingFromUrl = useRef(false);

  // Effect 1: Sync URL → state (only runs when searchParams changes from outside)
  useEffect(() => {
    const queryIp = searchParams.get('ip');
    const queryPrefix = searchParams.get('prefix');

    let needsUpdate = false;

    if (queryIp !== null && (isValidIp(queryIp) || queryIp === '') && queryIp !== ip) {
      needsUpdate = true;
    } else if (queryIp === null && ip !== '192.168.1.1') {
      needsUpdate = true;
    }

    if (queryPrefix !== null) {
      const p = parseInt(queryPrefix, 10);
      if (p >= 1 && p <= 32 && p !== prefix) needsUpdate = true;
    } else if (prefix !== 24) {
      needsUpdate = true;
    }

    if (!needsUpdate) return;

    isUpdatingFromUrl.current = true;

    if (queryIp !== null && (isValidIp(queryIp) || queryIp === '')) {
      setIpState(queryIp);
    } else if (queryIp === null) {
      setIpState('192.168.1.1');
    }

    if (queryPrefix !== null) {
      const p = parseInt(queryPrefix, 10);
      if (p >= 1 && p <= 32) setPrefixState(p);
    } else {
      setPrefixState(24);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Effect 2: Sync state → URL + recalculate (only when ip/prefix change from user input)
  useEffect(() => {
    const isIpValid = isValidIp(ip);

    // Always recalculate
    if (isIpValid) {
      const calcResult = calculateSubnet(ip, prefix);
      setResult(calcResult);
    } else {
      setResult(null);
    }

    // Only push to URL if this change came from user input, not from a URL sync
    if (isUpdatingFromUrl.current) {
      isUpdatingFromUrl.current = false;
      return;
    }

    const currentQueryIp = searchParams.get('ip');
    const currentQueryPrefix = searchParams.get('prefix');

    const ipChanged = isIpValid ? currentQueryIp !== ip : (ip === '' ? currentQueryIp !== null : false);
    const prefixChanged = currentQueryPrefix !== prefix.toString();

    if (ipChanged || prefixChanged) {
      const nextParams = new URLSearchParams(searchParams.toString());
      if (isIpValid) {
        nextParams.set('ip', ip);
      } else if (ip === '') {
        nextParams.delete('ip');
      }
      nextParams.set('prefix', prefix.toString());
      window.history.replaceState(null, '', `${pathname}?${nextParams.toString()}`);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ip, prefix]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('cidr_calc_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading config', e);
    }
  }, []);

  useEffect(() => {
    if (!result || isEmbedded) return;

    const timer = setTimeout(() => {
      setHistory((prev) => {
        const alreadyExists = prev.find(
          (item) => item.ip === result.ip && item.prefix === result.prefix
        );
        if (alreadyExists) return prev;

        const newItem: HistoryItem = {
          id: Math.random().toString(36).substring(2, 9),
          ip: result.ip,
          prefix: result.prefix,
          network: result.networkAddress,
          timestamp: Date.now(),
        };

        const updated = [newItem, ...prev].slice(0, 10);
        localStorage.setItem('cidr_calc_history', JSON.stringify(updated));
        return updated;
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [result, isEmbedded]);

  const handleLoadHistory = (historyIp: string, historyPrefix: number) => {
    setIpState(historyIp);
    setPrefixState(historyPrefix);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      localStorage.setItem('cidr_calc_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('cidr_calc_history');
  };

  const handleLoadSubnet = (subIp: string, subPrefix: number) => {
    setIpState(subIp);
    setPrefixState(subPrefix);
  };

  const setIp = (newIp: string) => {
    setIpState(newIp);
  };

  const setPrefix = (newPrefix: number) => {
    setPrefixState(newPrefix);
  };

  if (isEmbedded) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <CalculatorForm
          ip={ip}
          setIp={setIp}
          prefix={prefix}
          setPrefix={setPrefix}
        />
        <LiveMatrix result={result} />
      </div>
    );
  }

  return (
    <>

      {/* ── Primary Calculator Stream ── */}
      <main className="w-full flex flex-col items-center gap-8">
        {/* Calculator Input Board */}
        <div className="w-full">
          <CalculatorForm ip={ip} setIp={setIp} prefix={prefix} setPrefix={setPrefix} />
        </div>

        {/* Live Metric Grid */}
        <div className="w-full">
          <LiveMatrix result={result} />
        </div>

        {/* Sub-Tools Stack */}
        <div className="w-full flex flex-col gap-10">
          <BinaryVisualizer result={result} ip={ip} setIp={setIp} />
          <SubnetSplitter result={result} onLoadSubnet={handleLoadSubnet} />
          <HistoryTracker
            history={history}
            onLoadHistory={handleLoadHistory}
            onDeleteHistoryItem={handleDeleteHistoryItem}
            onClearHistory={handleClearHistory}
          />
 
          {/* Support CTA */}
          <div className="w-full py-4 px-6 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/50 bg-slate-100/30 dark:bg-zinc-900/20 backdrop-blur-sm text-center shadow-sm">
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 font-mono">
              Saved you a few minutes of binary math?{' '}
              <Link
                href="/about#support"
                aria-label="Support subnetmask.tech hosting costs"
                className="text-zinc-700 dark:text-zinc-200 hover:text-cyan-600 dark:hover:text-cyan-400 hover:underline transition-colors duration-200 font-semibold cursor-pointer"
              >
                Consider supporting the site&apos;s hosting costs.
              </Link>
            </p>
          </div>
 
          <CheatSheet currentPrefix={prefix} onSelectPrefix={setPrefix} />
          <AdSlot type="rectangle" />
        </div>
      </main>

      {/* ── Educational Content Section ── Statically compiled for SEO and AdSense policy compliance */}
      <article className="w-full mt-16 max-w-4xl mx-auto px-1 sm:px-0" aria-label="Subnet Calculator Educational Reference">
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-14 flex flex-col gap-14">

          {/* Section 1: CIDR vs Classful */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-4">
              CIDR vs. Classful Addressing: Why the Internet Moved On
            </h2>
            <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
              Before 1993, every IPv4 address was assigned to a rigid, fixed-size class. A <strong>Class A</strong> network
              consumed a full <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">/8</code> prefix — 16,777,214 usable host addresses.
              A <strong>Class B</strong> consumed a <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">/16</code> — 65,534 hosts.
              A <strong>Class C</strong> consumed a <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">/24</code> — only 254 hosts.
              The problem was catastrophic waste: a company needing 500 host addresses was forced into a Class B block,
              squandering over 65,000 addresses. By the early 1990s, the routing tables were exploding and the 32-bit
              address space faced imminent exhaustion.
            </p>
            <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
              <strong>Classless Inter-Domain Routing (CIDR)</strong>, ratified under <strong>RFC 1519</strong> in September 1993,
              replaced this system entirely. Instead of locking network boundaries to octet edges, CIDR introduced the
              concept of a <em>variable prefix length</em> — any integer from <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">/1</code> to <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">/32</code> could define
              the split between the network portion and the host portion of an address. This enabled administrators to
              allocate exactly the block size their topology required, eliminating the waste of classful addressing.
            </p>
            <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
              CIDR also introduced <strong>route aggregation</strong> (also called supernetting). Rather than advertising hundreds
              of Class C routes to the global BGP table, ISPs could summarize contiguous blocks into a single CIDR
              announcement. A block of 256 consecutive Class C networks — each a <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">/24</code> — could be
              collapsed into a single <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">/16</code> advertisement, dramatically reducing global routing table size and
              improving backbone convergence speeds. This is the fundamental mechanism that keeps the modern Internet
              operationally stable under billions of connected endpoints.
            </p>
            <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
              Today, CIDR notation — the <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">address/prefix-length</code> format — is the universal language
              of IP networking across data centres, cloud platforms (AWS VPCs, Azure VNets, GCP subnets all use CIDR),
              enterprise WANs, and carrier networks. Every engineer working with network infrastructure must have a
              precise, intuitive understanding of how to read, manipulate, and plan CIDR blocks.
            </p>
          </section>

          {/* Section 2: Bitwise Mathematics */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-4">
              The Bitwise Mathematics of Subnet Calculation
            </h2>
            <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
              Every result this tool produces — network address, broadcast address, wildcard mask, usable host range — is derived
              from three fundamental binary operations applied to the raw 32-bit IPv4 address stream. Understanding these
              operations is the foundation of all routing and firewall rule logic.
            </p>

            <div className="flex flex-col gap-8">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 font-mono">
                  1. Network Address — Bitwise AND
                </h3>
                <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
                  To isolate the network address, the tool performs a bitwise <strong>AND</strong> between the 32-bit IP address
                  and the 32-bit subnet mask. In every bit position where <em>both</em> values are <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">1</code>,
                  the result is <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">1</code>. Wherever the mask is <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">0</code> (the host bit positions),
                  the result is forced to <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">0</code>, zeroing out all host bits and leaving only the network
                  identifier. For <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">192.168.1.75/24</code>: <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">IP AND Mask = 192.168.1.0</code>.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 font-mono">
                  2. Broadcast Address — Bitwise NOT + OR
                </h3>
                <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-3">
                  The broadcast address is computed in two passes. First, the subnet mask is inverted with a bitwise
                  <strong> NOT</strong>, flipping all <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">1</code>s to <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">0</code>s and vice versa. This produces the
                  <em> wildcard mask</em>, where every host bit position is now <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">1</code>. Then a bitwise <strong>OR</strong>
                  is applied between the network address and the wildcard mask, forcing all host bits high and producing the
                  subnet's broadcast boundary — the all-ones host address. For the same example:
                  <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded ml-1">Network OR Wildcard = 192.168.1.255</code>.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2 font-mono">
                  3. Usable Host Capacity — Exponential Formula
                </h3>
                <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  The total address pool for any subnet follows the formula <strong>2^(32 − n)</strong>, where <em>n</em> is
                  the prefix length. Subtracting 2 reserves the network and broadcast addresses, yielding
                  <strong> 2^(32 − n) − 2</strong> usable host IPs. A <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">/24</code> gives
                  <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded ml-1">2^8 − 2 = 254</code> hosts.
                  A <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">/22</code> gives <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">2^10 − 2 = 1,022</code> hosts.
                  A <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">/16</code> gives <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">2^16 − 2 = 65,534</code> hosts.
                  This exponential relationship is why choosing the right prefix is critical to efficient address planning.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Quick Reference Table */}
          <section>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-4">
              CIDR Quick Reference Table
            </h2>
            <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
              The table below maps the most commonly used CIDR prefix lengths to their equivalent decimal subnet masks,
              wildcard masks, and usable host pool sizes. Use this as your field reference for rapid network design decisions.
            </p>
            <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
              <table className="w-full text-sm font-mono text-left">
                <caption className="sr-only">CIDR prefix lengths with subnet masks, wildcard masks, and usable host counts</caption>
                <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                  <tr className="text-zinc-600 dark:text-zinc-400 text-xs uppercase tracking-widest">
                    <th scope="col" className="py-3 px-4 font-semibold">Prefix</th>
                    <th scope="col" className="py-3 px-4 font-semibold">Subnet Mask</th>
                    <th scope="col" className="py-3 px-4 font-semibold">Wildcard Mask</th>
                    <th scope="col" className="py-3 px-4 font-semibold text-right">Usable Hosts</th>
                    <th scope="col" className="py-3 px-4 font-semibold hidden sm:table-cell">Common Use</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {[
                    { prefix: '/8',  mask: '255.0.0.0',       wild: '0.255.255.255', hosts: '16,777,214', use: 'Large ISP / RIR allocation' },
                    { prefix: '/16', mask: '255.255.0.0',     wild: '0.0.255.255',   hosts: '65,534',     use: 'Enterprise campus / large VPC' },
                    { prefix: '/20', mask: '255.255.240.0',   wild: '0.0.15.255',    hosts: '4,094',      use: 'Data centre rack block' },
                    { prefix: '/22', mask: '255.255.252.0',   wild: '0.0.3.255',     hosts: '1,022',      use: 'Office floor / building segment' },
                    { prefix: '/24', mask: '255.255.255.0',   wild: '0.0.0.255',     hosts: '254',        use: 'Standard LAN / home network' },
                    { prefix: '/26', mask: '255.255.255.192', wild: '0.0.0.63',      hosts: '62',         use: 'Department VLAN segment' },
                    { prefix: '/28', mask: '255.255.255.240', wild: '0.0.0.15',      hosts: '14',         use: 'Server cluster / DMZ zone' },
                    { prefix: '/30', mask: '255.255.255.252', wild: '0.0.0.3',       hosts: '2',          use: 'Point-to-point WAN link' },
                    { prefix: '/32', mask: '255.255.255.255', wild: '0.0.0.0',       hosts: '1',          use: 'Host route / loopback' },
                  ].map(row => (
                    <tr key={row.prefix} className="bg-white dark:bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-cyan-700 dark:text-cyan-400">{row.prefix}</td>
                      <td className="py-3 px-4 text-zinc-800 dark:text-zinc-200">{row.mask}</td>
                      <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{row.wild}</td>
                      <td className="py-3 px-4 text-right text-emerald-700 dark:text-emerald-400 font-semibold">{row.hosts}</td>
                      <td className="py-3 px-4 text-zinc-500 dark:text-zinc-500 hidden sm:table-cell">{row.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </article>
    </>
  );
}

export default function SubnetCalculator() {
  return (
    <>
      {/*
        ── Hero Header ── (Always server-rendered in the SSR HTML stream)
        The embed check is handled inside SubnetCalculatorContent via useSearchParams.
        isEmbedded logic is inside the Suspense boundary, the hero is intentionally
        always present in the initial HTML so Googlebot and mobile browsers paint it
        immediately without waiting for client hydration, minimising LCP.
      */}
      <section aria-label="Utility Description" className="w-full text-center mb-10">
        <div className="flex items-center justify-center gap-2 text-cyan-700 dark:text-cyan-300 text-xs font-mono font-bold uppercase tracking-[0.15em] mb-3">
          <Terminal className="w-3.5 h-3.5 stroke-[2.5]" />
          &gt;_ Subnetwork Engineering
        </div>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-snug text-slate-900 dark:text-slate-100 text-center max-w-4xl mx-auto font-sans [text-wrap:balance]">
          Free IPv4 CIDR Subnet Calculator &amp; Network Mask Tool
        </h1>
        <p className="max-w-2xl mx-auto text-lg sm:text-xl leading-relaxed text-[var(--color-text-muted)] mb-8 mt-4">
          Configure IP parameters client-side to instantly visualize boundaries, masks, binary structures, and subnet splits. Ideal for network architects, systems engineers, and DevOps.
        </p>
      </section>

      <Suspense fallback={<div className="animate-pulse h-[200px] w-full" />}>
        <SubnetCalculatorContent />
      </Suspense>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pb-12">
        <SubnetFaqs />
      </div>
    </>
  );
}

