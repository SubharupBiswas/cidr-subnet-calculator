'use client';

import { useEffect, useRef } from 'react';
import { Heart } from 'lucide-react';

export function RazorpaySupportButtonBox() {
  const containerRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    let callbackId: number | null = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const injectScript = () => {
      if (!containerRef.current) return;

      // Check if the script is already loaded/injected to prevent duplicates
      const existingScript = containerRef.current.querySelector(
        'script[src="https://checkout.razorpay.com/v1/payment-button.js"]'
      );
      if (existingScript) return;

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
      script.setAttribute('data-payment_button_id', 'pl_TD1ak717eOHWkc');
      script.async = true;

      containerRef.current.appendChild(script);
    };

    // Use requestIdleCallback with a setTimeout fallback to run on main thread idle
    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        callbackId = window.requestIdleCallback(() => injectScript());
      } else {
        timeoutId = setTimeout(injectScript, 1);
      }
    }

    return () => {
      // Clean up schedule triggers and form contents on unmount
      if (callbackId !== null && typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(callbackId);
      }
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <section className="bg-white/70 dark:bg-[var(--color-surface)] border border-zinc-200/80 dark:border-[var(--color-border)] rounded-2xl p-6 md:p-8 hover:border-blue-400 dark:hover:border-[var(--color-accent)] transition-all duration-300 shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Subtle glow background */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left max-w-xl">
        <div className="p-3 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center">
          <Heart className="w-6 h-6 fill-current animate-pulse" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
            Support subnetmask.tech
          </h3>
          <p className="text-sm text-zinc-600 dark:text-[var(--color-text-muted)] leading-relaxed">
            We build high-performance, privacy-first developer utilities with zero server-side tracking. If this tool saves you time, consider supporting our hosting and maintenance costs.
          </p>
        </div>
      </div>

      <div className="flex-shrink-0 flex flex-col items-center justify-center min-h-[48px] min-w-[180px]">
        <form ref={containerRef} className="w-full min-h-[48px] flex items-center justify-center" />
        <p className="mt-2 text-[11px] text-slate-400 dark:text-zinc-500 max-w-[220px] text-center leading-normal">
          Note: For regulatory compliance, payment apps will securely display the developer&apos;s verified bank account name.
        </p>
      </div>
    </section>
  );
}
