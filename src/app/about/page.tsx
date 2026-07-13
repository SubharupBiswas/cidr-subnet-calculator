import type { Metadata } from 'next';
import { RazorpaySupportButtonBox } from '../../components/RazorpaySupportButtonBox';

export const metadata: Metadata = {
  metadataBase: new URL('https://subnetmask.tech'),
  title: 'About SubnetMask.tech — Privacy-First, Zero-Latency IPv4 Subnet Calculator',
  description:
    'Learn about the mission, privacy-first technical architecture, and engineering performance standards of SubnetMask.tech — a free, instant, client-side IPv4 CIDR subnet calculator and VLSM planning tool built for network engineers.',
  alternates: {
    canonical: '/about',
  },
};

export default function AboutPage() {
  return (
    <div className="space-y-16 py-6 text-slate-700 dark:text-slate-300">

      {/* ── Page Header ── */}
      <header className="text-center space-y-4">
        <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
          Platform Overview
        </p>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
          About SubnetMask.tech
        </h1>
        <p className="max-w-2xl mx-auto text-lg leading-relaxed text-slate-500 dark:text-slate-400">
          A professional-grade, privacy-first subnet engineering tool built for network
          architects, systems engineers, and infrastructure teams who demand speed,
          accuracy, and absolute data sovereignty.
        </p>
      </header>

      {/* ── Block 1: Core Mission ── */}
      <article className="space-y-6">
        <div className="border-l-4 border-cyan-500 dark:border-cyan-400 pl-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            The Core Mission of SubnetMask.tech
          </h2>
        </div>

        <p className="leading-relaxed">
          SubnetMask.tech was built to solve a frustrating and persistent problem in
          the day-to-day toolkit of network engineers: the latency, friction, and
          unpredictability of legacy subnet calculator tools. Traditional web-based
          calculators require a round-trip HTTP request to a remote server for every
          computation — entering an IP address, changing a prefix, or adjusting a
          VLSM plan all trigger server calls that introduce perceptible delays,
          network-dependency failure modes, and data exposure risks that are entirely
          unnecessary for a class of computations that are purely mathematical and
          deterministic.
        </p>

        <p className="leading-relaxed">
          Our solution delivers{' '}
          <strong className="text-slate-900 dark:text-slate-100">instant, zero-latency client-side processing</strong>{' '}
          by executing every subnetting algorithm — CIDR prefix decomposition, bitwise
          AND network address computation, host count derivation, wildcard mask
          inversion, binary octet visualisation, and VLSM recursive block allocation —
          entirely within the user&apos;s own browser runtime. There are no API calls,
          no server-side computation, and no external service dependencies in the
          critical calculation path. The moment a user adjusts the prefix slider or
          modifies an IP octet, the complete subnet result set — network address,
          broadcast address, subnet mask, wildcard mask, first usable host, last usable
          host, and total host count — is recomputed and rendered in under one
          millisecond.
        </p>

        <p className="leading-relaxed">
          The platform is purpose-built for professionals: CCNA and CCNP candidates
          who need a reliable reference during exam preparation; network architects
          designing enterprise LAN segmentation schemas; cloud infrastructure engineers
          partitioning VPC CIDR blocks across multiple Availability Zones; DevOps teams
          debugging container overlay network address conflicts; and security engineers
          validating access control list (ACL) wildcard mask expressions for firewall
          rule authorship. SubnetMask.tech serves all of these use cases from a single,
          unified, high-performance interface that requires no installation, no
          account creation, and no subscription.
        </p>
      </article>

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* ── Block 2: Privacy Architecture ── */}
      <article className="space-y-6">
        <div className="border-l-4 border-emerald-500 dark:border-emerald-400 pl-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            Privacy-First Technical Architecture
          </h2>
        </div>

        <p className="leading-relaxed">
          IP address data is sensitive operational infrastructure intelligence. A subnet
          plan or VLSM allocation schema reveals the internal topology of a network —
          its segmentation strategy, its department boundaries, its WAN link
          configurations, and its security zone architecture. SubnetMask.tech was
          designed from its first commit with an uncompromising principle: no user
          input ever leaves the browser.
        </p>

        <p className="leading-relaxed">
          All IP address parsing, prefix decomposition, bitwise AND mask operations,
          VLSM subnet grid computations, and binary visualisation transforms are
          performed exclusively within the{' '}
          <strong className="text-slate-900 dark:text-slate-100">local browser context memory</strong>{' '}
          using secure React client-state management. The subnet calculator&apos;s core
          computation engine — housed in a pure TypeScript utility module — accepts raw
          IP strings and prefix integers as function arguments and returns fully typed
          result objects within the same synchronous call. There is no fetch call, no
          XMLHttpRequest, no WebSocket, and no server-sent event involved at any stage
          of the calculation pipeline.
        </p>

        <p className="leading-relaxed">
          <strong className="text-slate-900 dark:text-slate-100">
            Zero address data is ever transmitted to or stored on external servers.
          </strong>{' '}
          When a user enters <code className="text-cyan-700 dark:text-cyan-300 bg-slate-100 dark:bg-slate-800/60 px-1.5 py-0.5 rounded text-sm font-mono font-semibold">10.0.0.0/8</code> into the
          calculator, that value is processed by JavaScript functions running in the
          user&apos;s own V8, SpiderMonkey, or JavaScriptCore engine instance and
          immediately discarded from memory when the browser tab is closed. We maintain
          a session-scoped calculation history using the browser&apos;s local React
          state tree — not localStorage, not IndexedDB, and not any form of persistent
          client-side storage. The history vanishes entirely when the page is refreshed.
        </p>

        <p className="leading-relaxed">
          Our IP-to-URL query parameter feature — which allows users to share or
          bookmark a specific calculation via URL — encodes only the IP and prefix
          values that the user has explicitly chosen to share. This feature is optional
          and entirely user-initiated. The platform&apos;s server infrastructure never
          logs, indexes, or inspects query parameter values beyond the requirements of
          standard HTTP access logging for security and availability monitoring,
          consistent with our published privacy policy.
        </p>
      </article>

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* ── Block 3: Performance Metrics ── */}
      <article className="space-y-6">
        <div className="border-l-4 border-purple-500 dark:border-purple-400 pl-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            Performance Metrics &amp; Engineering Standards
          </h2>
        </div>

        <p className="leading-relaxed">
          SubnetMask.tech is engineered to the highest measurable web performance
          standards. The platform consistently achieves perfect 100/100 scores across
          all four Google PageSpeed Insights audit categories — Performance,
          Accessibility, Best Practices, and SEO — on both desktop and mobile
          emulated device profiles. These scores are not achieved through audit
          workarounds or metric gaming; they reflect fundamental architectural decisions
          made throughout the codebase.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 my-6">
          {[
            {
              label: 'TypeScript Strict Compilation',
              value: '0 errors',
              desc: 'Full strict-mode TypeScript across all components and utility modules, eliminating runtime type mismatches.',
              color: 'text-cyan-600 dark:text-cyan-400',
              border: 'border-cyan-100 dark:border-cyan-950',
              bg: 'bg-cyan-50/40 dark:bg-cyan-950/10',
            },
            {
              label: 'Accessibility Contrast',
              value: 'WCAG AA',
              desc: 'All foreground/background colour pairings pass the 4.5:1 minimum contrast ratio required by the W3C Web Content Accessibility Guidelines.',
              color: 'text-emerald-600 dark:text-emerald-400',
              border: 'border-emerald-100 dark:border-emerald-950',
              bg: 'bg-emerald-50/40 dark:bg-emerald-950/10',
            },
            {
              label: 'Cumulative Layout Shift',
              value: 'CLS 0.000',
              desc: 'Every layout element is statically sized at paint time, eliminating the disorienting content-jump effect that penalises lower-quality web applications.',
              color: 'text-purple-600 dark:text-purple-400',
              border: 'border-purple-100 dark:border-purple-950',
              bg: 'bg-purple-50/40 dark:bg-purple-950/10',
            },
            {
              label: 'Main Thread Execution',
              value: '< 1 ms calc',
              desc: 'Analytics and ad scripts are deferred to browser idle cycles using next/script lazyOnload, leaving the main thread uncontested during hydration.',
              color: 'text-amber-600 dark:text-amber-400',
              border: 'border-amber-100 dark:border-amber-950',
              bg: 'bg-amber-50/40 dark:bg-amber-950/10',
            },
          ].map(item => (
            <div key={item.label} className={`${item.bg} border ${item.border} rounded-xl p-5 space-y-2 shadow-sm`}>
              <p className={`text-2xl font-bold font-mono ${item.color}`}>{item.value}</p>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.label}</p>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{item.desc}</p>
            </div>
          ))}
        </div>

        <p className="leading-relaxed">
          The application is built on Next.js 16 with the App Router and React 19,
          leveraging React Server Components to eliminate unnecessary JavaScript from
          the initial client bundle for static informational pages. Dynamic interactive
          components — the binary visualiser, the VLSM subnet grid, the live host matrix,
          and the calculation history tracker — are loaded via Next.js dynamic imports
          with <code className="text-cyan-700 dark:text-cyan-300 bg-slate-100 dark:bg-slate-800/60 px-1.5 py-0.5 rounded text-sm font-mono font-semibold">ssr: false</code> to strip their JavaScript parse cost
          from the initial page load entirely, ensuring that the critical calculator form
          and hero content paint to screen before any non-essential code is evaluated.
        </p>

        <p className="leading-relaxed">
          Font loading is managed exclusively through the{' '}
          <code className="text-cyan-700 dark:text-cyan-300 bg-slate-100 dark:bg-slate-800/60 px-1.5 py-0.5 rounded text-sm font-mono font-semibold">next/font/google</code> optimisation engine with{' '}
          <code className="text-cyan-700 dark:text-cyan-300 bg-slate-100 dark:bg-slate-800/60 px-1.5 py-0.5 rounded text-sm font-mono font-semibold">display: &apos;swap&apos;</code> enforced on all font
          configurations, guaranteeing that fallback system fonts paint the interface
          text immediately while the premium Inter and JetBrains Mono typefaces
          download in the background. The result is a visually stable, readable
          interface from the very first frame of paint — no flash of invisible text
          (FOIT) and no layout shift on font arrival.
        </p>
      </article>

      <hr className="border-slate-200 dark:border-slate-800" />

      <div id="support" className="scroll-mt-20">
        <RazorpaySupportButtonBox />
      </div>

    </div>
  );
}