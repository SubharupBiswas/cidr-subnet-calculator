"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { Network, Share2, RefreshCw, Moon, Sun, Calculator, GitFork, Cpu, Layout, BookOpen, Check } from 'lucide-react';
import { Footer } from './Footer';
import { FaqAccordion } from './FaqAccordion';

export function AdSlot({ className, type }: { className?: string; type: 'banner' | 'rectangle' }) {
  if (process.env.NODE_ENV === 'development') {
    return (
      <div
        className={`w-full border border-dashed border-zinc-700/40 rounded-xl bg-zinc-900/10 dark:bg-zinc-950/20 flex items-center justify-center text-xs tracking-wider text-[var(--color-text-muted)] ${className ?? ''} ${type === 'banner' ? 'min-h-[90px]' : 'min-h-[250px]'}`}
      >
        ADVERTISEMENT SPACE
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

function LayoutContent({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [copiedLink, setCopiedLink] = useState(false);

  const isEmbedded = searchParams.get('embed') === 'true';

  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('cidr_calc_theme');
      if (storedTheme === 'light') setIsDarkMode(false);
    } catch (e) {
      console.error('Error loading theme', e);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cidr_calc_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cidr_calc_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const handleReset = () => {
    const params = new URLSearchParams();
    params.set('ip', '192.168.1.1');
    params.set('prefix', '24');
    if (isEmbedded) params.set('embed', 'true');
    router.replace(`${pathname}?${params.toString()}`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const navItems = [
    { path: '/',       mobileKey: 'Calc',  label: 'Calculator',     icon: <Calculator className="w-3.5 h-3.5" /> },
    { path: '/vlsm',   mobileKey: 'VLSM',  label: 'VLSM Architect', icon: <GitFork    className="w-3.5 h-3.5" /> },
    { path: '/oui',    mobileKey: 'OUI',   label: 'OUI Lookup',     icon: <Cpu        className="w-3.5 h-3.5" /> },
    { path: '/widget', mobileKey: 'Embed', label: 'Widget Builder',  icon: <Layout     className="w-3.5 h-3.5" /> },
    { path: '/guide',  mobileKey: 'Guide', label: 'Tech Guide',      icon: <BookOpen   className="w-3.5 h-3.5" /> },
  ];

  const headerActionBtn = "p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:border-blue-200 hover:bg-blue-50 dark:hover:bg-zinc-800/80 transition-all duration-200 cursor-pointer";

  /* ── EMBED MODE ── */
  if (isEmbedded) {
    return (
      <div className="min-h-screen font-sans antialiased flex flex-col p-4 sm:p-6 mesh-bg text-[var(--color-text-main)] transition-colors duration-300 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-gradient-to-b from-cyan-500/8 to-transparent blur-[100px] pointer-events-none z-0" />
        <div className="w-full flex flex-col gap-6 relative z-10 max-w-5xl mx-auto">
          {/* Embed mini-header */}
          <div className="flex justify-between items-center bg-[var(--color-surface)] backdrop-blur-xl p-3 rounded-xl border border-[var(--color-border)] shadow-sm transition-colors duration-300">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-[0_4px_12px_rgba(34,211,238,0.15)] dark:shadow-[0_0_12px_rgba(34,211,238,0.35)]">
                <Network className="w-3 h-3 text-white stroke-[2.5]" />
              </div>
              <span className="text-xs font-bold tracking-tight text-[var(--color-text-main)] font-mono">subnetmask.tech</span>
            </div>
            <button onClick={toggleTheme} className={headerActionBtn} aria-label="Toggle theme">
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  }

  /* ── FULL LAYOUT ── */
  return (
    <div className="min-h-screen font-sans antialiased flex flex-col justify-between relative overflow-x-hidden mesh-bg text-[var(--color-text-main)] transition-colors duration-300">
      {/* Top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[300px] bg-gradient-to-b from-cyan-500/6 to-transparent blur-[120px] pointer-events-none z-0" />

      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 pt-5 pb-10 z-10 flex-grow relative flex flex-col">

        {/* ── Floating Header ── */}
        <header className="mb-6 flex items-center justify-between bg-[var(--color-surface)] backdrop-blur-xl border border-[var(--color-border)] px-4 md:px-5 h-14 rounded-2xl shadow-sm transition-colors duration-300">
          {/* Logo — routes to root without full reload */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 rounded-xl"
            aria-label="subnetmask.tech — Go to homepage"
          >
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-[0_4px_16px_rgba(34,211,238,0.15)] dark:shadow-[0_0_16px_rgba(34,211,238,0.3)] group-hover:scale-105 transition-transform duration-200">
              <Network className="w-4 h-4 text-white stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-[var(--color-text-main)] font-mono group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors duration-200">subnetmask.tech</span>
              <span className="hidden sm:inline-flex text-[9px] uppercase font-bold tracking-widest text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">
                Static Edge
              </span>
            </div>
          </Link>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={toggleTheme} className={headerActionBtn} title="Toggle Theme" aria-label="Toggle Dark or Light Mode">
              {isDarkMode ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
            <button onClick={handleReset} className={headerActionBtn} title="Reset Parameters" aria-label="Reset IP and Prefix to Defaults">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleShare}
              aria-label="Share current calculation link"
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition-all duration-200 cursor-pointer font-mono ${
                copiedLink
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 shadow-[0_4px_12px_rgba(16,185,129,0.05)] dark:shadow-[0_0_12px_rgba(16,185,129,0.15)]'
                  : 'bg-[var(--color-inner-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:bg-[var(--color-inner-surface-hover)] hover:border-[var(--color-accent)] hover:text-[var(--color-text-main)] dark:hover:bg-zinc-800 dark:hover:border-zinc-700 dark:hover:text-zinc-200'
              }`}
            >
              {copiedLink ? <Check className="w-3 h-3" /> : <Share2 className="w-3 h-3" />}
              {copiedLink ? 'Copied!' : 'Share'}
            </button>
          </div>
        </header>

        {/* ── Top Ad Banner ── */}
        <AdSlot type="banner" className="mb-6" />

        {/* ── Navigation Tab Bar ── */}
        <nav className="flex items-center justify-center mb-8 px-2" aria-label="Main navigation">
          <div className="inline-flex p-1 bg-blue-50/80 dark:bg-[var(--color-surface)] border border-blue-100 dark:border-[var(--color-border)] rounded-xl backdrop-blur-md overflow-x-auto whitespace-nowrap scrollbar-none touch-pan-x shadow-inner gap-0.5">
            {navItems.map(tab => {
              const isActive = pathname === tab.path || (tab.path !== '/' && pathname.startsWith(tab.path));
              return (
                <Link
                  key={tab.path}
                  href={`${tab.path}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
                  className={`relative px-4 py-2 text-xs font-sans tracking-tight rounded-xl flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer transition-all duration-200 ${
                    isActive
                      ? 'bg-white dark:bg-zinc-800/80 text-blue-700 dark:text-[var(--color-accent)] border border-blue-200 dark:border-zinc-700/50 shadow-sm font-semibold'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border border-transparent hover:bg-white/60 dark:hover:text-zinc-200'
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.mobileKey}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {children}

        {/* ── FAQ ── */}
        <div className="w-full mt-14">
          <FaqAccordion />
        </div>
      </div>

      <Footer />
    </div>
  );
}

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen mesh-bg" />}>
      <LayoutContent>{children}</LayoutContent>
    </Suspense>
  );
}
