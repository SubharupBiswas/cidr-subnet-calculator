"use client";

import { useState, useEffect } from 'react';
import { Code, Check, Copy, Layout, Zap } from 'lucide-react';
import { CalculatorForm } from '../../components/CalculatorForm';
import { LiveMatrix } from '../../components/LiveMatrix';
import { calculateSubnet, isValidIp, SubnetResult } from '../../utils/ipv4Utils';

export default function WidgetGenerator() {
  const [copied, setCopied] = useState(false);

  // --------------- Isolated sandbox state ---------------
  const [widgetIp, setWidgetIp] = useState('10.0.0.1');
  const [widgetPrefix, setWidgetPrefix] = useState(24);
  const [widgetResult, setWidgetResult] = useState<SubnetResult | null>(null);

  useEffect(() => {
    if (isValidIp(widgetIp)) {
      setWidgetResult(calculateSubnet(widgetIp, widgetPrefix));
    } else {
      setWidgetResult(null);
    }
  }, [widgetIp, widgetPrefix]);
  // ------------------------------------------------------

  const iframeCode = `<iframe
  src="https://subnetmask.tech/?embed=true"
  width="100%"
  height="800"
  style="border:none; background:transparent;"
  allow="clipboard-write">
</iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-7">
      <div className="flex flex-col gap-2 border-b border-zinc-200 dark:border-[var(--color-border)] pb-5">
        <div className="flex items-center gap-3">
          <Layout className="w-5 h-5 text-cyan-400" />
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-[var(--color-text-main)] tracking-tight">
            Embeddable Subnet Calculator Widget
          </h1>
        </div>
        <p className="text-sm text-zinc-700 dark:text-[var(--color-text-muted)] leading-relaxed">
          Integrate our advanced IPv4 subnet calculator directly into your internal dashboard, documentation portal, or developer hub. Fully responsive, client-side, and zero-latency.
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6 w-full items-start justify-between">
        {/* Sandbox Container */}
        <div className="w-full xl:w-3/5 bg-slate-50/50 dark:bg-zinc-900/40 p-2 sm:p-4 rounded-xl border border-slate-200 dark:border-zinc-800/60 overflow-hidden">
          <div className="flex flex-col gap-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-400 font-mono flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Interactive Sandbox
          </h3>

          <div className="w-full flex flex-col">
            <div className="flex items-center gap-2 px-0 py-2.5 border-b border-zinc-200/40 dark:border-zinc-800/40 bg-transparent">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400/70 dark:bg-rose-500/50"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400/70 dark:bg-amber-500/50"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70 dark:bg-emerald-500/50"></span>
              <span className="ml-3 flex-1 text-[10px] font-mono text-[var(--color-text-muted)] dark:text-zinc-500 truncate">
                subnetmask.tech/?embed=true
              </span>
              <Zap className="w-3 h-3 text-cyan-500" />
            </div>

            <div className="py-6 flex flex-col gap-6 max-h-[680px] overflow-y-auto custom-scrollbar">
              <CalculatorForm
                ip={widgetIp}
                setIp={setWidgetIp}
                prefix={widgetPrefix}
                setPrefix={setWidgetPrefix}
              />
              <LiveMatrix result={widgetResult} />
            </div>
          </div>
          </div>
        </div>

        {/* Code Snippet Container */}
        <div className="w-full xl:w-2/5 flex-shrink-0">
          <div className="sticky top-24 h-max flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-700 dark:text-zinc-400 font-mono flex items-center gap-2">
            <Code className="w-4 h-4 text-[var(--color-text-muted)] dark:text-zinc-500" />
            Integration Snippet
          </h3>

          <div className="relative group">
            <pre className="bg-zinc-100/80 dark:bg-[var(--color-bg)]/80 border border-zinc-200 dark:border-[var(--color-border)] rounded-xl p-5 overflow-x-auto text-xs text-zinc-700 dark:text-zinc-300 font-mono leading-relaxed scrollbar-none">
              <code>{iframeCode}</code>
            </pre>
            <button
              onClick={handleCopy}
              className={`absolute top-3 right-3 p-2 rounded-lg border transition-all duration-200 cursor-pointer ${
                copied
                  ? 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-400 border-emerald-500/30'
                  : 'bg-zinc-100 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700 text-zinc-700 hover:text-zinc-800 dark:hover:text-zinc-200 hover:border-zinc-300 dark:hover:border-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-700/80'
              }`}
              title="Copy snippet"
              aria-label="Copy widget embed iframe code"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex flex-col gap-3 mt-2">
            <div className="flex items-start gap-2">
              <span className="text-xs px-2 py-0.5 bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 rounded-md font-mono border border-teal-100 dark:border-teal-500/20 shrink-0 mt-0.5">
                allow="clipboard-write"
              </span>
              <span className="text-xs text-zinc-700 dark:text-[var(--color-text-muted)] leading-relaxed">
                Required permission attribute — enables the embedded calculator's "Copy to clipboard" buttons to function correctly inside the iframe sandbox.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-xs px-2 py-0.5 bg-zinc-100 text-zinc-700 dark:bg-[var(--color-surface)] dark:text-[var(--color-text-muted)] rounded-md font-mono border border-zinc-200 dark:border-[var(--color-border)] shrink-0 mt-0.5">
                height="800"
              </span>
              <span className="text-xs text-zinc-700 dark:text-[var(--color-text-muted)] leading-relaxed">
                Recommended minimum height to display both the form input panel and the full metric matrix without vertical clipping.
              </span>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
