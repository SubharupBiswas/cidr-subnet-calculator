"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams, usePathname } from 'next/navigation';
import { Terminal } from 'lucide-react';
import { CalculatorForm } from '../components/CalculatorForm';
import { calculateSubnet, isValidIp, SubnetResult } from '../utils/ipv4Utils';

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
          <CheatSheet currentPrefix={prefix} onSelectPrefix={setPrefix} />
          <AdSlot type="rectangle" />
        </div>
      </main>
    </>
  );
}

export default function SubnetCalculator() {
  const isEmbedded = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('embed') === 'true' : false;

  return (
    <>
      {/* ── Hero Header ── (Extracted from Suspense to guarantee instant LCP) */}
      {!isEmbedded && (
        <section aria-label="Utility Description" className="w-full text-center mb-10">
          <div className="flex items-center justify-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-mono font-bold uppercase tracking-[0.15em] mb-3">
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
      )}

      <Suspense fallback={<div className="animate-pulse h-[200px] w-full" />}>
        <SubnetCalculatorContent />
      </Suspense>
    </>
  );
}
