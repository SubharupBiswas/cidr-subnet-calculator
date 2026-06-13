import { useState, useEffect } from 'react';
import { Network, Terminal, Share2, RefreshCw, Moon, Sun, Calculator, GitFork, Cpu, Layout, BookOpen } from 'lucide-react';
import { CalculatorForm } from './components/CalculatorForm';
import { LiveMatrix } from './components/LiveMatrix';
import { BinaryVisualizer } from './components/BinaryVisualizer';
import { SubnetSplitter } from './components/SubnetSplitter';
import { CheatSheet } from './components/CheatSheet';
import { HistoryTracker, HistoryItem } from './components/HistoryTracker';
import { FaqAccordion } from './components/FaqAccordion';
import { Footer } from './components/Footer';
import { SubnetGuide } from './components/SubnetGuide';
import { WidgetGenerator } from './components/WidgetGenerator';
import { VlsmPlanner } from './components/VlsmPlanner';
import { MacLookup } from './components/MacLookup';
import { calculateSubnet, isValidIp, SubnetResult } from './utils/ipv4Utils';

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

function App() {
  const [ip, setIp] = useState<string>('192.168.1.1');
  const [prefix, setPrefix] = useState<number>(24);
  const [result, setResult] = useState<SubnetResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  
  // View Switcher State — five routing nodes
  type ActiveView = 'calculator' | 'vlsm' | 'oui' | 'widget' | 'guide';
  const [activeView, setActiveView] = useState<ActiveView>('calculator');

  // Embed State
  const [isEmbedded, setIsEmbedded] = useState<boolean>(false);

  // Initialize Dark Mode, History, and URL Params
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('cidr_calc_theme');
      if (storedTheme === 'light') {
        setIsDarkMode(false);
      }
      
      const stored = localStorage.getItem('cidr_calc_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading config', e);
    }
  }, []);

  // Sync Dark Mode to document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cidr_calc_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cidr_calc_theme', 'light');
    }
  }, [isDarkMode]);

  // URL Params parsing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryIp = params.get('ip');
    const queryPrefix = params.get('prefix');
    const embedFlag = params.get('embed') === 'true';

    setIsEmbedded(embedFlag);

    if (queryIp && isValidIp(queryIp)) {
      setIp(queryIp);
    }
    if (queryPrefix) {
      const p = parseInt(queryPrefix, 10);
      if (p >= 1 && p <= 32) {
        setPrefix(p);
      }
    }
  }, []);

  // Perform Subnet Calculation & Sync URL
  useEffect(() => {
    const isIpValid = isValidIp(ip);

    // Sync URL search params
    const params = new URLSearchParams(window.location.search);
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

  // Debounced History Saving
  useEffect(() => {
    if (!result || isEmbedded) return; // Do not save history while embedded

    const timer = setTimeout(() => {
      setHistory(prev => {
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

        const updated = [newItem, ...prev].slice(0, 10);
        localStorage.setItem('cidr_calc_history', JSON.stringify(updated));
        return updated;
      });
    }, 1500);

    return () => clearTimeout(timer);
  }, [result, isEmbedded]);

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

  const handleLoadSubnet = (subIp: string, subPrefix: number) => {
    setIp(subIp);
    setPrefix(subPrefix);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleReset = () => {
    setIp('192.168.1.1');
    setPrefix(24);
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  // -------------------------------------------------------------
  // CONDITIONAL EMBED HANDLING
  // -------------------------------------------------------------
  if (isEmbedded) {
    return (
      <div className="min-h-screen font-sans antialiased flex flex-col p-4 sm:p-6 bg-[#f8f9fc] dark:bg-[#050508] text-zinc-900 dark:text-zinc-100 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] transition-colors duration-300 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-cyan-500/10 dark:from-cyan-500/5 to-transparent blur-[120px] pointer-events-none z-0" />
        <div className="w-full flex flex-col gap-6 relative z-10 max-w-5xl mx-auto">
          <div className="flex justify-between items-center bg-white/70 dark:bg-zinc-900/60 p-3 rounded-xl border border-zinc-200 dark:border-white/[0.04] backdrop-blur-md shadow-sm">
            <div className="flex items-center gap-3">
              <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)] dark:shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                <Network className="w-3 h-3 text-white dark:text-black stroke-[2.5]" />
              </div>
              <h1 className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white">
                subnetmask.tech
              </h1>
            </div>
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-md border border-zinc-200 bg-zinc-50 text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 transition-all duration-200 cursor-pointer shadow-sm"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
          <CalculatorForm
            ip={ip}
            setIp={setIp}
            prefix={prefix}
            setPrefix={setPrefix}
          />
          <LiveMatrix result={result} />
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // FULL APPLICATION RENDER
  // -------------------------------------------------------------
  return (
    <div className="min-h-screen font-sans antialiased flex flex-col justify-between relative overflow-x-hidden bg-[#f8f9fc] dark:bg-[#050508] text-zinc-900 dark:text-zinc-100 bg-[linear-gradient(to_right,rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] transition-colors duration-300">

      {/* Premium Visual Glow Layer */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[350px] bg-gradient-to-b from-cyan-500/10 dark:from-cyan-500/5 to-transparent blur-[140px] pointer-events-none z-0" />

      <div className="max-w-7xl w-full mx-auto p-4 md:p-8 z-10 flex-grow relative">

        {/* Navigation Header Bar */}
        <header className="mb-8 flex items-center justify-between border bg-white/70 border-zinc-200/80 shadow-sm dark:border-white/[0.04] dark:bg-[#090a0f]/40 backdrop-blur-md px-4 md:px-6 h-16 rounded-xl dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)] transition-colors duration-300">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-500 flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.3)] dark:shadow-[0_0_15px_rgba(34,211,238,0.2)]">
              <Network className="w-4 h-4 text-white dark:text-black stroke-[2.5]" />
            </div>
            <h1 className="text-sm font-bold tracking-tight bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-100 dark:to-zinc-400 bg-clip-text text-transparent">
              CIDR Calculator
            </h1>
            <span className="text-[9px] uppercase font-bold tracking-widest text-cyan-600 bg-cyan-100 border-cyan-200 dark:text-cyan-400 dark:bg-cyan-500/10 border dark:border-cyan-500/20 px-2 py-0.5 rounded-md hidden sm:inline-block shadow-[0_0_10px_-2px_rgba(34,211,238,0.1)]">
              Static Edge
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 transition-all duration-200 cursor-pointer shadow-sm"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={handleReset}
              className="p-2 rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-500 hover:text-zinc-800 hover:border-zinc-300 hover:bg-white dark:border-zinc-800 dark:bg-zinc-900/40 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:border-zinc-700 dark:hover:bg-zinc-900 transition-all duration-200 cursor-pointer shadow-sm"
              title="Reset Parameters"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleShare}
              className={`px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 border transition-all duration-200 cursor-pointer shadow-sm ${copiedLink
                  ? 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.1)]'
                  : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-white hover:border-zinc-300 hover:text-zinc-900 dark:bg-zinc-900/40 dark:text-zinc-300 dark:border-zinc-800 dark:hover:bg-zinc-900 dark:hover:border-zinc-700 dark:hover:text-white'
                }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              {copiedLink ? 'Link Copied!' : 'Share Matrix'}
            </button>
          </div>
        </header>

        {/* Global Adsense/Carbon Top Placement */}
        <AdSlot type="banner" className="mb-8" />

        {/* ── Premium 5-Node Glass Control Deck ── */}
        <div className="flex items-center justify-center mb-8 px-2">
          <div className="inline-flex p-1 bg-zinc-100/80 dark:bg-zinc-950/60 border border-zinc-200/60 dark:border-white/[0.04] rounded-xl backdrop-blur-md max-w-full overflow-x-auto scrollbar-none shadow-sm gap-0.5">
            {(
              [
                { key: 'calculator' as const, label: 'Calculator',    icon: <Calculator className="w-3 h-3" /> },
                { key: 'vlsm'       as const, label: 'VLSM Architect', icon: <GitFork    className="w-3 h-3" /> },
                { key: 'oui'        as const, label: 'OUI Lookup',     icon: <Cpu        className="w-3 h-3" /> },
                { key: 'widget'     as const, label: 'Widget Builder', icon: <Layout     className="w-3 h-3" /> },
                { key: 'guide'      as const, label: 'Tech Guide',     icon: <BookOpen   className="w-3 h-3" /> },
              ]
            ).map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveView(tab.key)}
                className={`px-3 sm:px-4 py-2 text-xs font-mono tracking-tight rounded-lg flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all duration-200 ${
                  activeView === tab.key
                    ? 'bg-white dark:bg-zinc-900 text-cyan-600 dark:text-cyan-400 border border-zinc-200/50 dark:border-zinc-800/80 shadow-sm font-semibold'
                    : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-white/60 dark:hover:bg-zinc-900/40'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.key === 'calculator' ? 'Calc' : tab.key === 'vlsm' ? 'VLSM' : tab.key === 'oui' ? 'OUI' : tab.key === 'widget' ? 'Embed' : 'Guide'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Hero intro — calculator tab only */}
        {activeView === 'calculator' && (
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
        )}

        {/* VIEW: CALCULATOR */}
        {activeView === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
            {/* LEFT PANELS */}
            <div className="lg:col-span-5 flex flex-col gap-6 w-full">
              <CalculatorForm ip={ip} setIp={setIp} prefix={prefix} setPrefix={setPrefix} />
              <BinaryVisualizer result={result} ip={ip} setIp={setIp} />
              <HistoryTracker
                history={history}
                onLoadHistory={handleLoadHistory}
                onDeleteHistoryItem={handleDeleteHistoryItem}
                onClearHistory={handleClearHistory}
              />
              <CheatSheet currentPrefix={prefix} onSelectPrefix={setPrefix} />
            </div>

            {/* RIGHT PANELS */}
            <div className="lg:col-span-7 flex flex-col gap-6 w-full">
              <LiveMatrix result={result} />
              <SubnetSplitter result={result} onLoadSubnet={handleLoadSubnet} />
              <AdSlot type="rectangle" />
            </div>
          </div>
        )}

        {/* VIEW: VLSM ARCHITECT */}
        {activeView === 'vlsm' && (
          <VlsmPlanner />
        )}

        {/* VIEW: OUI LOOKUP */}
        {activeView === 'oui' && (
          <MacLookup />
        )}

        {/* VIEW: WIDGET BUILDER */}
        {activeView === 'widget' && (
          <WidgetGenerator />
        )}

        {/* VIEW: TECHNICAL GUIDE */}
        {activeView === 'guide' && (
          <SubnetGuide />
        )}

        {/* FULL-WIDTH FAQ — permanently anchored at the baseline of every view */}
        <div className="w-full mt-12">
          <FaqAccordion />
        </div>

      </div>

      {/* Persistent Compliance Footer */}
      <Footer />
    </div>
  );
}

export default App;