import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://subnetmask.tech'),
  title: 'Shipping Policy | Subnetmask.tech',
  description:
    'Shipping and delivery policies for Subnetmask.tech. Details instant digital service fulfillment and lack of physical shipping.',
  alternates: {
    canonical: '/shipping',
  },
};

export default function ShippingPage() {
  const lastUpdated = '14 July, 2026';

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 w-full box-border space-y-12 py-6 text-slate-700 dark:text-zinc-300 font-sans leading-relaxed">
      
      {/* ── Page Header ── */}
      <header className="space-y-2">
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 sm:text-2xl md:text-3xl lg:text-4xl leading-tight">
          Shipping &amp; Delivery Policy
        </h1>
        <p className="text-sm text-slate-400 dark:text-zinc-500">Last updated: {lastUpdated}</p>
      </header>

      {/* ── Section 1 ── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mt-6">
          1. Digital Service Delivery
        </h2>
        <p className="text-base">
          Subnetmask.tech operates exclusively as a digital web utilities application suite. We do not manufacture, package, or ship any physical merchandise or tangible goods. Consequently, no physical shipping processes or transit tracking timelines apply. All digital tools access, usage cycles, and voluntary transaction confirmation alerts are delivered instantaneously on-screen and to the contributor&apos;s verified email address immediately following a successful gateway response.
        </p>
      </section>

      {/* ── Section 2 ── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mt-6">
          2. Access Restrictions
        </h2>
        <p className="text-base">
          Access to our tools is unrestricted and instant. We do not impose regional or artificial licensing limits on digital service availability, except where governed by global network availability or hosting provider constraints.
        </p>
      </section>

    </div>
  );
}
