import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Subnetmask.tech — Open Developer Networking Tool',
  description:
    'Subnetmask.tech is a high-performance, open developer utility for IPv4 subnetting, CIDR calculation, VLSM planning, and binary network analysis. Built for systems engineers, cloud architects, and networking students.',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 font-sans leading-relaxed">

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--color-text-heading)] mb-6">
        About Subnetmask.tech
      </h1>

      <p className="mb-6 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
        <strong className="text-zinc-900 dark:text-zinc-100">Subnetmask.tech</strong> is a free, open-access developer
        tool engineered from the ground up to accelerate the daily workflows of <strong className="text-zinc-900 dark:text-zinc-100">systems engineers</strong>,{' '}
        <strong className="text-zinc-900 dark:text-zinc-100">cloud architects</strong>,{' '}
        <strong className="text-zinc-900 dark:text-zinc-100">network administrators</strong>, and{' '}
        <strong className="text-zinc-900 dark:text-zinc-100">networking students</strong> preparing for professional
        certifications such as CCNA, CCNP, and CompTIA Network+.
      </p>

      <p className="mb-6 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
        The core subnet calculator performs all computations entirely client-side using bitwise arithmetic on the raw
        32-bit IPv4 address stream — the same mathematical operations that routers, firewalls, and network operating
        systems perform at the hardware layer. There are no round-trip server calls, no query logging, and no
        transmission of your IP addresses or network data over the network. Every result — network address,
        broadcast address, subnet mask, wildcard mask, usable host range, binary breakdown — is computed
        locally in your browser in under a millisecond.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mt-10 mb-4">
        What Subnetmask.tech Provides
      </h2>

      <ul className="list-disc pl-6 mb-6 flex flex-col gap-3 text-base text-zinc-700 dark:text-zinc-300">
        <li>
          <strong className="text-zinc-900 dark:text-zinc-100">IPv4 CIDR Subnet Calculator:</strong> Instantly computes
          all subnet parameters for any IPv4 address and prefix length from /1 to /32. Supports URL parameters for
          shareable calculation links.
        </li>
        <li>
          <strong className="text-zinc-900 dark:text-zinc-100">Interactive 32-Bit Binary Visualizer:</strong> Renders
          the full binary decomposition of any IPv4 address with real-time bit-level highlighting of the network and
          host portions as you adjust the prefix slider.
        </li>
        <li>
          <strong className="text-zinc-900 dark:text-zinc-100">VLSM Subnet Splitter:</strong> Automatically calculates
          and lists all sub-network blocks when dividing a parent CIDR block into a target prefix depth. Displays
          network addresses, usable ranges, and broadcast addresses for each slice.
        </li>
        <li>
          <strong className="text-zinc-900 dark:text-zinc-100">MAC OUI Lookup:</strong> Identifies the manufacturer
          and vendor organisation behind any Ethernet hardware MAC address, useful for network inventory management,
          forensics, and device identification.
        </li>
        <li>
          <strong className="text-zinc-900 dark:text-zinc-100">CIDR &amp; Subnetting Reference Guide:</strong> A
          statically rendered technical knowledge base covering VLSM design methodology, binary routing physics, the
          complete prefix scaling matrix (/8 through /32), IPv6 allocation standards, and the bitwise AND/OR/NOT
          mathematics behind all subnet calculations.
        </li>
        <li>
          <strong className="text-zinc-900 dark:text-zinc-100">Calculation History Tracker:</strong> Stores recent
          subnet calculations locally in your browser so you can revisit and compare previous entries without
          re-entering parameters.
        </li>
        <li>
          <strong className="text-zinc-900 dark:text-zinc-100">Embeddable Widget:</strong> A clean, minimal version of
          the calculator designed for embedding in documentation platforms, internal wikis, and educational portals
          via <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">?embed=true</code>.
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mt-10 mb-4">
        Design Philosophy
      </h2>
      <p className="mb-6 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
        The application was built with three core principles:
      </p>
      <ol className="list-decimal pl-6 mb-6 flex flex-col gap-4 text-base text-zinc-700 dark:text-zinc-300">
        <li>
          <strong className="text-zinc-900 dark:text-zinc-100">Zero-latency computation.</strong> All subnet arithmetic
          runs synchronously in the JavaScript main thread with no async overhead, producing instantaneous output as
          the user types or adjusts the prefix slider. The tool is fully functional offline with no dependency on any
          external API.
        </li>
        <li>
          <strong className="text-zinc-900 dark:text-zinc-100">Privacy by design.</strong> No analytics SDKs are loaded
          until the browser is completely idle. No user IP addresses, query history, or interaction events are
          transmitted to any server. All computation and history storage stays entirely within the user's browser.
        </li>
        <li>
          <strong className="text-zinc-900 dark:text-zinc-100">Educational depth.</strong> Beyond pure calculation,
          the platform serves as a learning resource. Every result is accompanied by a binary breakdown, contextual
          explanations, and a comprehensive technical guide covering the underlying network mathematics — making it
          suitable for students, practitioners, and experts alike.
        </li>
      </ol>

      <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mt-10 mb-4">
        Technology Stack
      </h2>
      <p className="mb-6 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
        Subnetmask.tech is built with <strong className="text-zinc-900 dark:text-zinc-100">Next.js</strong> (App Router,
        static generation), <strong className="text-zinc-900 dark:text-zinc-100">React</strong>, and{' '}
        <strong className="text-zinc-900 dark:text-zinc-100">TypeScript</strong>. The subnet calculation engine is a pure
        TypeScript utility library with no external dependencies, using standard JavaScript bitwise operators
        (<code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">&amp;</code>,{' '}
        <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">|</code>,{' '}
        <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">~</code>,{' '}
        <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">&gt;&gt;&gt;</code>)
        to replicate the exact binary arithmetic performed by network hardware.
      </p>
      <p className="mb-6 text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
        The application achieves a perfect <strong className="text-zinc-900 dark:text-zinc-100">100 Lighthouse performance
        score on desktop</strong> and a 91+ score on mobile through aggressive code splitting, lazy loading of
        below-the-fold components, <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">font-display: swap</code>
        {' '}font loading, and <code className="font-mono text-sm bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">strategy=&quot;lazyOnload&quot;</code>
        {' '}deferral of all third-party advertising and analytics scripts.
      </p>

      <h2 className="text-2xl font-bold text-[var(--color-text-heading)] mt-10 mb-4">
        Contact
      </h2>
      <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">
        For feature requests, bug reports, or partnership enquiries, please use the{' '}
        <a href="/contact" className="text-cyan-700 dark:text-cyan-400 hover:underline font-semibold">Contact</a> page.
        We welcome feedback from the networking community and actively iterate on the tool based on practitioner needs.
      </p>

    </div>
  );
}
