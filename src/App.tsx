import { useState, useEffect } from 'react';
import { Network, Terminal, Share2, HelpCircle, RefreshCw, Github } from 'lucide-react';
import { CalculatorForm } from './components/CalculatorForm';
import { LiveMatrix } from './components/LiveMatrix';
import { BinaryVisualizer } from './components/BinaryVisualizer';
import { SubnetSplitter } from './components/SubnetSplitter';
import { CheatSheet } from './components/CheatSheet';
import { HistoryTracker, HistoryItem } from './components/HistoryTracker';
import { FaqAccordion } from './components/FaqAccordion';
import { calculateSubnet, isValidIp, SubnetResult } from './utils/ipv4Utils';

function AdSlot({ className, type }: { className?: string; type: 'banner' | 'rectangle' }) {
  return (
    <div 
      className={`glass-panel border-dashed border-zinc-800 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden select-none bg-zinc-950/20 ${className} ${
        type === 'banner' ? 'min-h-[100px] w-full' : 'min-h-[250px] w-full'
      }`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(#1f1f2e_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />
      <span className="text-[10px] tracking-wider uppercase font-bold text-zinc-500 bg-zinc-900/50 border border-zinc-800 px-2 py-0.5 rounded z-10">
        Ad Placement Space
      </span>
      <span className="text-[9px] text-zinc-600 mt-1.5 z-10">
        {type === 'banner' ? 'Supports 728x90 / 970x90 Leaderboards' : 'Supports 300x250 / 336x280 Rectangles'}
      </span>
    </div>
  );
}

function App() {
  const [ip, setIp] = useState<string>('192.168.1.1');
  const [prefix, setPrefix] = useState<number>(24);
  const [result, setResult] = useState<SubnetResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);

  // 1. Initial State from URL Query Parameters & localStorage History
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryIp = params.get('ip');
    const queryPrefix = params.get('prefix');

    if (queryIp && isValidIp(queryIp)) {
      setIp(queryIp);
    }
    if (queryPrefix) {
      const p = parseInt(queryPrefix, 10);
      if (p >= 1 && p <= 32) {
        setPrefix(p);
      }
    }

    // Load history
    try {
      const stored = localStorage.getItem('cidr_calc_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading history', e);
    }
  }, []);

  // 2. Perform Subnet Calculation when IP/Prefix change & Sync URL
  useEffect(() => {
    const isIpValid = isValidIp(ip);
    
    // Sync URL search params
    const params = new URLSearchParams();
    if (isIpValid) {
      params.set('ip', ip);
    }
    params.set('prefix', prefix.toString());
    const newRelativePathQuery = window.location.pathname + '?' + params.toString();
    window.history.replaceState(null, '', newRelativePathQuery);

    if (isIpValid) {
      const calcResult = calculateSubnet(ip, prefix);
      setResult(calcResult);
    } else {
      setResult(null);
    }
  }, [ip, prefix]);

  // 3. Debounced History Saving to avoid saving partial types
  useEffect(() => {
    if (!result) return;

    const timer = setTimeout(() => {
      setHistory(prev => {
        // Check if matching calculation already exists at the top
        const alreadyExists = prev.find(
          item => item.ip === result.ip && item.prefix === result.prefix
        );
        if (alreadyExists) return prev;

        const newItem: HistoryItem = {
          id: Math.random().toString(36).substring(2, 9),
          ip: result.ip,
          prefix: result.prefix,
          network: result.networkAddress,
          timestamp: Date.now(),
        };

        const updated = [newItem, ...prev].slice(0, 10); // Keep last 10 calculations
        localStorage.setItem('cidr_calc_history', JSON.stringify(updated));
        return updated;
      });
    }, 1500); // 1.5 second debounce

    return () => clearTimeout(timer);
  }, [result]);

  // History Operations
  const handleLoadHistory = (historyIp: string, historyPrefix: number) => {
    setIp(historyIp);
    setPrefix(historyPrefix);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(prev => {
      const updated = prev.filter(item => item.id !== id);
      localStorage.setItem('cidr_calc_history', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('cidr_calc_history');
  };

  // Subnet split loading
  const handleLoadSubnet = (subIp: string, subPrefix: number) => {
    setIp(subIp);
    setPrefix(subPrefix);
  };

  // URL Sharing
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Quick reset to default configuration
  const handleReset = () => {
    setIp('192.168.1.1');
    setPrefix(24);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-cyan-500/25 selection:text-cyan-300">
      
      {/* Decorative Top Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Bar */}
      <header className="border-b border-zinc-900 bg-zinc-950/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
              <Network className="w-5 h-5 text-cyan-400" />
            </div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
              CIDR Calculator
            </h1>
            <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md hidden sm:inline-block">
              Static Edge
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="p-2 rounded-xl border border-zinc-900 bg-zinc-900/30 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800 transition-all cursor-pointer"
              title="Reset to Default"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={handleShare}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
                copiedLink
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-zinc-900/50 text-zinc-300 border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700'
              }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              {copiedLink ? 'Copied Link!' : 'Share'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
        
        {/* Top Banner Ad Placement */}
        <AdSlot type="banner" />

        {/* Banner Title */}
        <section aria-label="Calculator Title and Description" className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <Terminal className="w-3.5 h-3.5" />
            Subnetwork Engineering
          </div>
          <h2 className="text-3xl font-extrabold text-zinc-100 tracking-tight leading-tight sm:text-4xl">
            Advanced IPv4 Subnet Calculator
          </h2>
          <p className="text-sm text-zinc-400 max-w-3xl leading-relaxed">
            Configure IP parameters client-side to instantly visualize boundaries, masks, binary structures, and subnet splits. Ideal for network architects, systems engineers, and DevOps.
          </p>
        </section>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form & History (Col Span 5) */}
          <section aria-label="Calculator Input Form" className="lg:col-span-5 flex flex-col gap-8">
            <CalculatorForm
              ip={ip}
              setIp={setIp}
              prefix={prefix}
              setPrefix={setPrefix}
            />
            
            <HistoryTracker
              history={history}
              onLoadHistory={handleLoadHistory}
              onDeleteHistoryItem={handleDeleteHistoryItem}
              onClearHistory={handleClearHistory}
            />
          </section>

          {/* Right Column: Live Metrics (Col Span 7) */}
          <section aria-label="Calculation Results Matrix" className="lg:col-span-7 flex flex-col gap-8">
            <LiveMatrix result={result} />
            <AdSlot type="rectangle" />
          </section>

        </div>

        {/* Bottom Rows: Binary breakdown, Subnet Splitter, Cheat Sheet, and FAQs */}
        <section aria-label="Subnet Analysis Utilities" className="flex flex-col gap-8">
          
          <article aria-label="32-Bit Binary Visualizer">
            <BinaryVisualizer result={result} />
          </article>
          
          <article aria-label="Subnet Splitter Grid">
            <SubnetSplitter result={result} onLoadSubnet={handleLoadSubnet} />
          </article>
          
          <article aria-label="CIDR Prefix Cheat Sheet">
            <CheatSheet currentPrefix={prefix} onSelectPrefix={setPrefix} />
          </article>

          <article aria-label="Frequently Asked Questions">
            <FaqAccordion />
          </article>

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 mt-16 bg-zinc-950/20 text-zinc-500 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-zinc-600" />
            <span>© 2026 CIDR Calculator. Zero-cost serverless static deployment.</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-zinc-700" />
              RFC 1918 & 3021 Compliant
            </span>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 hover:text-zinc-400 transition-colors flex items-center gap-1"
            >
              <Github className="w-3.5 h-3.5" />
              Docs
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
