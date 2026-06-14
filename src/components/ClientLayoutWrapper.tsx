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

  const headerActionBtn = "p-2 rounded-lg border border-zinc-200 dark:border-[var(--color-border)] bg-zinc-100 dark:bg-[var(--color-surface)] text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800/80 transition-all duration-200 cursor-pointer";

  /* ── EMBED MODE ── */
  if (isEmbedded) {
    return (
      <div className="min-h-screen font-sans antialiased flex flex-col p-4 sm:p-6 mesh-bg text-[var(--color-text-main)] transition-colors duration-300 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-gradient-to-b from-cyan-500/8 to-transparent blur-[100px] pointer-events-none z-0" />
        <div className="w-full flex flex-col gap-6 relative z-10 max-w-5xl mx-auto">
          {/* Embed mini-header */}
          <div className="flex justify-between items-center bg-zinc-100/75 dark:bg-[var(--color-surface)] backdrop-blur-xl p-3 rounded-xl border border-zinc-200 dark:border-[var(--color-border)] shadow-md dark:shadow-lg shadow-zinc-200/50 dark:shadow-black/30">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-6 rounded-md bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-[0_4px_12px_rgba(34,211,238,0.15)] dark:shadow-[0_0_12px_rgba(34,211,238,0.35)]">
                <Network className="w-3 h-3 text-zinc-950 stroke-[2.5]" />
              </div>
              <span className="text-xs font-bold tracking-tight text-zinc-800 dark:text-zinc-200 font-mono">subnetmask.tech</span>
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

      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-5 pb-10 z-10 flex-grow relative">

        {/* ── Floating Header ── */}
        <header className="mb-6 flex items-center justify-between bg-zinc-100/75 dark:bg-[var(--color-surface)] backdrop-blur-xl border border-zinc-250 dark:border-[var(--color-border)] px-4 md:px-5 h-14 rounded-2xl shadow-md dark:shadow-lg shadow-zinc-200/50 dark:shadow-black/40 transition-colors duration-300">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-emerald-400 flex items-center justify-center shadow-[0_4px_16px_rgba(34,211,238,0.15)] dark:shadow-[0_0_16px_rgba(34,211,238,0.3)]">
              <Network className="w-4 h-4 text-zinc-950 stroke-[2.5]" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-[var(--color-text-main)] font-mono">subnetmask.tech</span>
              <span className="hidden sm:inline-flex text-[9px] uppercase font-bold tracking-widest text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-md">
                Static Edge
              </span>
            </div>
          </div>

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
                  : 'bg-zinc-100 dark:bg-[var(--color-surface)] text-zinc-500 dark:text-[var(--color-text-muted)] border-zinc-200 dark:border-[var(--color-border)] hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 hover:text-zinc-800 dark:hover:text-zinc-200'
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
          <div className="inline-flex p-1 bg-zinc-200/40 dark:bg-[var(--color-surface)] border border-zinc-200 dark:border-[var(--color-border)] rounded-xl backdrop-blur-md overflow-x-auto whitespace-nowrap scrollbar-none touch-pan-x shadow-inner gap-0.5">
            {navItems.map(tab => {
              const isActive = pathname === tab.path || (tab.path !== '/' && pathname.startsWith(tab.path));
              return (
                <Link
                  key={tab.path}
                  href={`${tab.path}${searchParams.toString() ? `?${searchParams.toString()}` : ''}`}
                  className={`relative px-4 py-2 text-xs font-mono tracking-tight rounded-xl flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer transition-all duration-200 ${
                    isActive
                      ? 'bg-zinc-800/80 text-[var(--color-accent)] border border-zinc-700/50'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] border border-transparent'
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
