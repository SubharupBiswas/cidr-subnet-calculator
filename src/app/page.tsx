"use client";

import { useState, useEffect, Suspense, lazy } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Terminal } from 'lucide-react';
import { CalculatorForm } from '../components/CalculatorForm';
import { LiveMatrix } from '../components/LiveMatrix';
import { calculateSubnet, isValidIp, SubnetResult } from '../utils/ipv4Utils';

const BinaryVisualizer = lazy(() => import('../components/BinaryVisualizer').then(m => ({ default: m.BinaryVisualizer })));
const SubnetSplitter = lazy(() => import('../components/SubnetSplitter').then(m => ({ default: m.SubnetSplitter })));
const CheatSheet = lazy(() => import('../components/CheatSheet').then(m => ({ default: m.CheatSheet })));
const HistoryTracker = lazy(() => import('../components/HistoryTracker').then(m => ({ default: m.HistoryTracker })));

import type { HistoryItem } from '../components/HistoryTracker';

function AdSlot({ className, type }: { className?: string; type: 'banner' | 'rectangle' }) {
  return (
    <div
      className={`relative w-full overflow-hidden select-none rounded-2xl border bg-white border-zinc-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:bg-[#090a10]/40 dark:border-zinc-800/40 dark:backdrop-blur-md flex flex-col items-center justify-center dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.01)] ${className} ${type === 'banner' ? 'min-h-[90px]' : 'min-h-[250px]'
        }`}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
      <span className="text-[9px] tracking-[0.2em] uppercase font-mono font-bold text-zinc-500 bg-zinc-100 dark:bg-zinc-900/80 border border-zinc-300 dark:border-zinc-800/60 px-2 py-0.5 rounded-md z-10 shadow-sm">
        Ad Placement Space
      </span>
      <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-600 mt-1 z-10">
        {type === 'banner' ? 'Supports 728x90 / 970x90 Leaderboards' : 'Supports 300x250 / 336x280 Rectangles'}
      </span>
    </div>
  );
}

function SubnetCalculatorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const rawIp = searchParams.get('ip') || '192.168.1.1';
  const rawPrefix = searchParams.get('prefix') || '24';
  const isEmbedded = searchParams.get('embed') === 'true';

  const [ip, setIpState] = useState<string>(rawIp);
  const [prefix, setPrefixState] = useState<number>(parseInt(rawPrefix, 10) || 24);
  const [result, setResult] = useState<SubnetResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const queryIp = searchParams.get('ip');
    const queryPrefix = searchParams.get('prefix');

    if (queryIp !== null) {
      if ((isValidIp(queryIp) || queryIp === '') && queryIp !== ip) {
        setIpState(queryIp);
      }
    } else if (ip !== '192.168.1.1') {
      setIpState('192.168.1.1');
    }

    if (queryPrefix !== null) {
      const p = parseInt(queryPrefix, 10);
      if (p >= 1 && p <= 32 && p !== prefix) {
        setPrefixState(p);
      }
    } else if (prefix !== 24) {
      setPrefixState(24);
    }
  }, [searchParams, ip, prefix]);

  useEffect(() => {
    const isIpValid = isValidIp(ip);
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
      router.replace(`${pathname}?${nextParams.toString()}`);
    }

    if (isIpValid) {
      const calcResult = calculateSubnet(ip, prefix);
      setResult(calcResult);
    } else {
      setResult(null);
    }
  }, [ip, prefix, searchParams, router, pathname]);

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
      <section aria-label="Utility Description" className="mb-10 max-w-3xl">
        <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-mono font-bold uppercase tracking-[0.15em] mb-2.5">
          <Terminal className="w-3.5 h-3.5 stroke-[2.5]" />
          &gt;_ Subnetwork Engineering
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight leading-tight sm:text-4xl text-zinc-900 dark:text-white">
          Advanced IPv4 Subnet Calculator
        </h2>
        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Configure IP parameters client-side to instantly visualize boundaries, masks, binary structures, and subnet splits. Ideal for network architects, systems engineers, and DevOps.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        <div className="lg:col-span-5 flex flex-col gap-6 w-full">
          <CalculatorForm ip={ip} setIp={setIp} prefix={prefix} setPrefix={setPrefix} />
          <Suspense fallback={<div className="animate-pulse h-[200px] bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-850 rounded-2xl w-full" />}>
            <BinaryVisualizer result={result} ip={ip} setIp={setIp} />
          </Suspense>
          <Suspense fallback={<div className="animate-pulse h-[140px] bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-850 rounded-2xl w-full" />}>
            <HistoryTracker
              history={history}
              onLoadHistory={handleLoadHistory}
              onDeleteHistoryItem={handleDeleteHistoryItem}
              onClearHistory={handleClearHistory}
            />
          </Suspense>
          <Suspense fallback={<div className="animate-pulse h-[100px] bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-850 rounded-2xl w-full" />}>
            <CheatSheet currentPrefix={prefix} onSelectPrefix={setPrefix} />
          </Suspense>
        </div>

        <div className="lg:col-span-7 flex flex-col gap-6 w-full">
          <LiveMatrix result={result} />
          <Suspense fallback={<div className="animate-pulse h-[260px] bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-850 rounded-2xl w-full" />}>
            <SubnetSplitter result={result} onLoadSubnet={handleLoadSubnet} />
          </Suspense>
          <AdSlot type="rectangle" />
        </div>
      </div>
    </>
  );
}

export default function SubnetCalculator() {
  return (
    <Suspense fallback={<div className="animate-pulse h-[200px] w-full" />}>
      <SubnetCalculatorContent />
    </Suspense>
  );
}
