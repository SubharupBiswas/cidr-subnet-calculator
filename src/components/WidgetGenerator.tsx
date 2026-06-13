import React, { useState, useEffect } from 'react';
import { Code, Check, Copy, Layout } from 'lucide-react';
import { CalculatorForm } from './CalculatorForm';
import { LiveMatrix } from './LiveMatrix';
import { calculateSubnet, isValidIp, SubnetResult } from '../utils/ipv4Utils';

export const WidgetGenerator: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [previewIp, setPreviewIp] = useState<string>('192.168.1.1');
  const [previewPrefix, setPreviewPrefix] = useState<number>(24);
  const [previewResult, setPreviewResult] = useState<SubnetResult | null>(null);

  useEffect(() => {
    if (isValidIp(previewIp)) {
      setPreviewResult(calculateSubnet(previewIp, previewPrefix));
    } else {
      setPreviewResult(null);
    }
  }, [previewIp, previewPrefix]);

  const iframeCode = `<iframe src="https://subnetmask.tech/?embed=true" width="100%" height="800" style="border:1px solid #27272a; border-radius:12px; background:#050508;" allow="clipboard-write"></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const containerClasses = "bg-white border-zinc-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:bg-[#0d0e15]/80 dark:border-white/[0.04] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)] rounded-2xl p-6 md:p-8 transition-all duration-300 w-full flex flex-col gap-8";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Layout className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Embeddable Widget Generator</h2>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm">
          Integrate our advanced IPv4 subnet calculator directly into your internal company dashboard, documentation site, or developer portal. It's fully responsive and client-side zero-latency.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        {/* Preview Pane */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> Live Sandbox Preview
          </h3>
          <div className="w-full border border-zinc-200 dark:border-zinc-800/80 rounded-xl overflow-y-auto bg-zinc-50 dark:bg-[#050508] p-4 flex flex-col gap-4 max-h-[700px] custom-scrollbar">
            <CalculatorForm
              ip={previewIp}
              setIp={setPreviewIp}
              prefix={previewPrefix}
              setPrefix={setPreviewPrefix}
            />
            <LiveMatrix result={previewResult} />
          </div>
        </div>

        {/* Code Pane */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
            <Code className="w-4 h-4 text-zinc-400 dark:text-zinc-500" /> Integration Snippet
          </h3>
          <div className="relative group">
            <pre className="bg-zinc-100 dark:bg-[#090a0d] border border-zinc-200 dark:border-zinc-800/80 rounded-xl p-4 overflow-x-auto text-sm text-zinc-700 dark:text-zinc-300 font-mono shadow-inner">
              <code>{iframeCode}</code>
            </pre>
            <button
              onClick={handleCopy}
              className={`absolute top-3 right-3 p-2 rounded-lg border transition-all cursor-pointer ${
                copied
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/30'
                  : 'bg-white border-zinc-200 text-zinc-400 hover:text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50 dark:bg-zinc-800/80 dark:border-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 opacity-0 group-hover:opacity-100'
              }`}
              title="Copy snippet"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs px-2 py-1 bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-400 rounded-md font-mono border border-teal-100 dark:border-teal-500/20">
              allow="clipboard-write"
            </span>
            <span className="text-xs text-zinc-500">Required for the "Copy to clipboard" functionality within the iframe.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
