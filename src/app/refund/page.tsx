import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://subnetmask.tech'),
  title: 'Refund Policy | Subnetmask.tech',
  description:
    'Refund and cancellation guidelines for voluntary contributions and hosting support processed on Subnetmask.tech.',
  alternates: {
    canonical: '/refund',
  },
};

export default function RefundPage() {
  const lastUpdated = '14 July, 2026';

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 w-full box-border space-y-12 py-6 text-slate-700 dark:text-zinc-300 font-sans leading-relaxed">
      
      {/* ── Page Header ── */}
      <header className="space-y-2">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 sm:text-2xl md:text-3xl lg:text-4xl leading-tight">
          Refund &amp; Cancellation Policy
        </h1>
        <p className="text-sm text-slate-400 dark:text-zinc-500">Last updated: {lastUpdated}</p>
      </header>

      {/* ── Section 1 ── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mt-6">
          1. Contribution Policy
        </h2>
        <p className="text-base">
          All monetary support amounts and contributions processed on subnetmask.tech are voluntary provisions to keep our free developer tools live. Because access to tools is constant and financial support actions clear instantly, all transactions are final. Contributions are strictly non-refundable, non-transferable, and cannot be canceled once successfully processed by the network gateway.
        </p>
      </section>

      {/* ── Section 2 ── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mt-6">
          2. Payment Gateway Errors
        </h2>
        <p className="text-base">
          If a transaction fails or you are charged twice due to a network latency issue at the gateway level, please contact your respective bank or Razorpay directly. Disputed transactions are investigated by the payment provider, and standard banking reconciliation periods apply.
        </p>
      </section>

    </div>
  );
}
