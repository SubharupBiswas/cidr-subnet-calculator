import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://subnetmask.tech'),
  title: 'Terms & Conditions | Subnetmask.tech',
  description:
    'Terms of Service and conditions of use for Subnetmask.tech. Outlines guidelines for using our free developer utilities and processing voluntary financial contributions.',
  alternates: {
    canonical: '/terms',
  },
};

export default function TermsPage() {
  const lastUpdated = '14 July, 2026';

  return (
    <div className="space-y-12 py-6 text-slate-700 dark:text-zinc-300 font-sans leading-relaxed">
      
      {/* ── Page Header ── */}
      <header className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">
          Terms &amp; Conditions
        </h1>
        <p className="text-sm text-slate-400 dark:text-zinc-500">Last updated: {lastUpdated}</p>
      </header>

      <p className="text-base">
        Welcome to <strong className="text-slate-900 dark:text-zinc-100">Subnetmask.tech</strong>. By accessing or using this website, you agree to comply with and be bound by the following Terms &amp; Conditions. If you do not agree to these terms, please discontinue usage of this site immediately.
      </p>

      {/* ── Section 1 ── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mt-6">
          1. Use of Services
        </h2>
        <p className="text-base">
          Subnetmask.tech provides free, client-side developer tools and network utilities (including subnet calculators, VLSM planners, and OUI matching). You are permitted to use these tools for personal, educational, or commercial purposes. You agree not to exploit, disrupt, or execute malicious attacks against the website infrastructure.
        </p>
      </section>

      {/* ── Section 2 ── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mt-6">
          2. Voluntary Contributions &amp; Support
        </h2>
        <p className="text-base">
          Any financial transactions processed through the &apos;Buy me a coffee&apos; or support features represent voluntary, non-commercial contributions intended solely to support the ongoing server hosting, utility domain, and open-source maintenance of subnetmask.tech. These transactions do not constitute payments for premium features, licenses, or ongoing service level agreements.
        </p>
      </section>

      {/* ── Section 3 ── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mt-6">
          3. Disclaimer of Warranties
        </h2>
        <p className="text-base">
          The services, utilities, and outputs of Subnetmask.tech are provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, either express or implied. We do not guarantee that the tool calculations are absolutely error-free or suited for critical production environments. Users are responsible for double-checking final CIDR configurations before deployment.
        </p>
      </section>

      {/* ── Section 4 ── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mt-6">
          4. Limitation of Liability
        </h2>
        <p className="text-base">
          In no event shall Subnetmask.tech or its developers be held liable for any direct, indirect, incidental, special, or consequential damages arising out of the use or inability to use this website, even if advised of the possibility of such damages.
        </p>
      </section>

      {/* ── Section 5 ── */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-zinc-100 mt-6">
          5. Governing Law
        </h2>
        <p className="text-base">
          These Terms &amp; Conditions shall be governed by and construed in accordance with the laws of India, without regard to conflict of law principles. Any dispute arising out of or related to these terms shall be subject to the exclusive jurisdiction of the competent courts in India.
        </p>
      </section>

    </div>
  );
}
