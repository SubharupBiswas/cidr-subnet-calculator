import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://subnetmask.tech'),
  title: 'IPv4 Subnetting & CIDR Guide — Bitwise Logic, VLSM & Classless Routing',
  description:
    'A comprehensive technical guide to IPv4 subnetting, CIDR notation, and VLSM architectural engineering. Learn how routers use bitwise AND operations to compute network boundaries and how classless prefix notation eliminates the wasteful constraints of legacy Class A/B/C addressing.',
  alternates: {
    canonical: '/guide',
  },
};

export default function GuidePage() {
  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 w-full box-border space-y-16 py-6 text-slate-700 dark:text-slate-300">

      {/* ── Page Header ── */}
      <header className="text-center space-y-4">
        <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
          Technical Documentation
        </p>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-zinc-100 sm:text-2xl md:text-3xl lg:text-4xl leading-tight">
          The Complete IPv4 Subnetting &amp; CIDR Reference Manual
        </h1>
        <p className="max-w-2xl mx-auto text-lg leading-relaxed text-slate-500 dark:text-slate-400">
          A deep-dive into the binary mathematics, routing logic, and architectural
          engineering principles that govern every IPv4 network deployed on the internet
          today.
        </p>
      </header>

      {/* ── Section 1: IPv4 Bitwise Logic ── */}
      <article className="space-y-6">
        <div className="border-l-4 border-cyan-500 dark:border-cyan-400 pl-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            Demystifying IPv4 Subnetting &amp; Bitwise Logic
          </h2>
        </div>

        <p className="leading-relaxed">
          Every device connected to an IPv4 network is identified by a unique 32-bit
          integer address. To make this numeric value human-readable, the 32 bits are
          partitioned into four consecutive groups of 8 bits each — referred to as
          octets. Each octet is then converted independently from binary to its decimal
          equivalent and joined with a period delimiter, producing the familiar
          dotted-decimal notation you see every day: <code className="text-cyan-700 dark:text-cyan-300 bg-slate-100 dark:bg-slate-800/60 px-1.5 py-0.5 rounded text-sm font-mono font-semibold">192.168.1.75</code>.
        </p>

        <p className="leading-relaxed">
          When a router receives an incoming packet, it must make a binary-speed
          forwarding decision: does the destination IP address belong to a locally
          connected network segment, or must the packet be forwarded to the next-hop
          gateway? To answer this question, the router executes a{' '}
          <strong className="text-slate-900 dark:text-slate-100">bitwise AND operation</strong> between the
          destination IP address and the subnet mask. A subnet mask is itself a 32-bit
          value, but it follows a rigid structural rule: it always consists of a
          contiguous block of binary 1-bits starting from the most-significant bit (the
          leftmost position), followed immediately by a contiguous block of binary
          0-bits extending to the 32nd position. The 1-bits define the
          <em> network portion</em> of the address, and the 0-bits define the{' '}
          <em>host portion</em>.
        </p>

        <p className="leading-relaxed">
          The bitwise AND rule is elegantly simple: a 1-bit AND a 1-bit yields a
          1-bit; a 1-bit AND a 0-bit yields a 0-bit; a 0-bit AND anything yields a
          0-bit. When applied at every bit position simultaneously across both 32-bit
          values, the result is the{' '}
          <strong className="text-slate-900 dark:text-slate-100">network address</strong> — the canonical
          identifier for the entire subnet block to which the destination belongs. If
          this computed network address matches the network address of one of the
          router&apos;s directly connected interfaces, the packet is delivered locally.
          Otherwise, it is routed upstream.
        </p>

        <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 font-mono text-sm space-y-2 shadow-sm">
          <p className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest mb-4 font-sans font-bold">Bitwise AND — Worked Example</p>
          <p><span className="text-slate-400 dark:text-slate-500">IP Address:   </span><span className="text-amber-600 dark:text-amber-400">11000000.10101000.00000001.01001011</span><span className="text-slate-400 dark:text-slate-500 ml-4">→ 192.168.1.75</span></p>
          <p><span className="text-slate-400 dark:text-slate-500">Subnet Mask:  </span><span className="text-cyan-600 dark:text-cyan-400">11111111.11111111.11111111.00000000</span><span className="text-slate-400 dark:text-slate-500 ml-4">→ 255.255.255.0</span></p>
          <div className="border-t border-slate-200 dark:border-slate-700 my-2" />
          <p><span className="text-slate-400 dark:text-slate-500">Network Addr: </span><span className="text-emerald-600 dark:text-emerald-400">11000000.10101000.00000001.00000000</span><span className="text-slate-400 dark:text-slate-500 ml-4">→ 192.168.1.0</span></p>
        </div>

        <p className="leading-relaxed">
          Consider the example above. The IP address <code className="text-amber-700 dark:text-amber-400 bg-slate-100 dark:bg-slate-800/60 px-1.5 py-0.5 rounded text-sm font-mono font-semibold">192.168.1.75</code> is
          AND-ed with the subnet mask <code className="text-cyan-600 dark:text-cyan-400 bg-slate-100 dark:bg-slate-800/60 px-1.5 py-0.5 rounded text-sm font-mono font-semibold">255.255.255.0</code>. In binary,
          the mask consists of 24 leading 1-bits and 8 trailing 0-bits. Every bit in
          the IP address that aligns with a 1-bit in the mask is preserved in the
          result; every bit that aligns with a 0-bit is zeroed out. The result,{' '}
          <code className="text-emerald-600 dark:text-emerald-400 bg-slate-100 dark:bg-slate-800/60 px-1.5 py-0.5 rounded text-sm font-mono font-semibold">192.168.1.0</code>, is the network address, telling the
          router that this packet belongs to the <code className="text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800/60 px-1.5 py-0.5 rounded text-sm font-mono font-semibold">192.168.1.0/24</code>{' '}
          subnet. The host field — the remaining 8 bits — yields a theoretical address
          space of 2⁸ = 256 total addresses, of which 254 are usable by end devices
          (the first is reserved as the network identifier and the last as the
          broadcast address).
        </p>

        <p className="leading-relaxed">
          This bitwise AND mechanism is executed in hardware at line-rate speeds inside
          modern router ASICs, making it extraordinarily efficient regardless of table
          depth. The consistency and mathematical determinism of the operation also
          means that any two network engineers on opposite sides of the planet will
          always independently derive the same network address from the same IP and
          mask inputs — there is no ambiguity in the IPv4 subnetting model.
        </p>
      </article>

      <hr className="border-slate-200 dark:border-slate-800" />

      {/* ── Section 2: CIDR vs. Classful ── */}
      <article className="space-y-6">
        <div className="border-l-4 border-emerald-500 dark:border-emerald-400 pl-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            Classless Inter-Domain Routing (CIDR) vs. Traditional Classful Networks
          </h2>
        </div>

        <p className="leading-relaxed">
          In the original design of the internet during the early 1980s, IPv4 addresses
          were partitioned into five rigid classes — A, B, C, D, and E — based solely
          on the value of the most-significant bits of the address. Class A networks,
          identified by a leading 0-bit, reserved the first octet as the network
          identifier and devoted the remaining 24 bits to host addressing, permitting a
          single Class A assignment to house over 16 million individual host addresses.
          Class B networks, identified by leading bits{' '}
          <code className="text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800/60 px-1.5 py-0.5 rounded text-sm font-mono font-semibold">
            10
          </code>
          , split the 32-bit space evenly into a 16-bit network field and a 16-bit host
          field, yielding 65,534 usable hosts per block. Class C networks, identified by
          leading bits{' '}
          <code className="text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-800/60 px-1.5 py-0.5 rounded text-sm font-mono font-semibold">
            110
          </code>
          , allocated only 8 bits for hosts, limiting each block to 254 usable addresses.
        </p>

        <p className="leading-relaxed">
          This rigid three-tier model generated enormous structural inefficiency. An
          organisation that required 300 host addresses was forced to request a full
          Class B block of 65,534 addresses — wasting 65,234 globally routable IPs
          that could no longer be assigned to anyone else. Conversely, an organisation
          that needed 300 addresses could not be served by a single Class C block of
          254 addresses either, forcing the assignment of two separate Class C blocks
          and increasing routing table complexity. By the early 1990s, it became
          apparent that the public IPv4 pool would be exhausted within a decade if
          classful allocation continued unchecked.
        </p>

        <p className="leading-relaxed">
          The solution, standardised in{' '}
          <strong className="text-slate-900 dark:text-slate-100">RFC 1519 in 1993</strong>, was Classless
          Inter-Domain Routing (CIDR). CIDR abolished the concept of fixed network
          classes entirely and replaced it with a flexible{' '}
          <strong className="text-slate-900 dark:text-slate-100">prefix-length notation</strong>. Under
          CIDR, a network is specified by the network address followed by a forward
          slash and an integer between 0 and 32 that indicates exactly how many of the
          leading bits constitute the network field. This slash notation is why CIDR is
          commonly called <em>prefix notation</em>: the number after the slash is the
          prefix length.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 my-6">
          {[
            { prefix: '/8',  mask: '255.0.0.0',     hosts: '16,777,214', label: 'Former Class A' },
            { prefix: '/16', mask: '255.255.0.0',   hosts: '65,534',     label: 'Former Class B' },
            { prefix: '/24', mask: '255.255.255.0', hosts: '254',        label: 'Former Class C' },
          ].map(row => (
            <div key={row.prefix} className="bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-center shadow-sm">
              <p className="text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400">{row.prefix}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-mono mt-1">{row.mask}</p>
              <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-2">{row.hosts} hosts</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 font-medium mt-1">{row.label}</p>
            </div>
          ))}
        </div>

        <p className="leading-relaxed">
          Under CIDR, an ISP can assign a customer a{' '}
          <code className="text-cyan-700 dark:text-cyan-300 bg-slate-100 dark:bg-slate-800/60 px-1.5 py-0.5 rounded text-sm font-mono font-semibold">/26</code> block — yielding exactly 62 usable host
          addresses — rather than wasting a full Class C block of 254. Crucially,
          CIDR also introduced{' '}
          <strong className="text-slate-900 dark:text-slate-100">route summarisation</strong> (also called
          supernetting or route aggregation). Because prefix boundaries are no longer
          locked to class boundaries, a single routing advertisement of{' '}
          <code className="text-cyan-700 dark:text-cyan-300 bg-slate-100 dark:bg-slate-800/60 px-1.5 py-0.5 rounded text-sm font-mono font-semibold">203.0.113.0/24</code> can summarise 256 individual host
          routes into a single BGP table entry, dramatically compressing the global
          routing table size and enabling the internet to scale far beyond what the
          classful model would have permitted.
        </p>

        <p className="leading-relaxed">
          Today, every modern router, firewall, cloud VPC, and network operating system
          operates exclusively in classless mode. Understanding CIDR prefix notation is
          therefore a fundamental prerequisite for any network engineering role, from
          configuring a simple home router to designing the backbone infrastructure of
          a global content-delivery network.
        </p>
      </article>

      {/* ── Section 3: VLSM ── */}
      <hr className="border-slate-200 dark:border-slate-800" />

      <article className="space-y-6">
        <div className="border-l-4 border-purple-500 dark:border-purple-400 pl-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100">
            Variable Length Subnet Masking (VLSM) Architectural Engineering
          </h2>
        </div>

        <p className="leading-relaxed">
          Fixed-length subnet masking (FLSM) — applying the same prefix length to every
          subnet carved from an address block — was the dominant practice during the
          classful era and remained common in simpler CIDR deployments. FLSM is
          straightforward to administer but produces significant address waste whenever
          the host requirements of different network segments vary widely. A classic
          enterprise scenario illustrates the problem: a company headquarters requires
          one segment capable of hosting 120 devices, a branch office requires a
          segment for 28 devices, two point-to-point WAN links each require only 2
          host addresses, and a management loopback segment requires a single address.
          Under FLSM with a uniform{' '}
          <code className="text-cyan-700 dark:text-cyan-300 bg-slate-100 dark:bg-slate-800/60 px-1.5 py-0.5 rounded text-sm font-mono font-semibold">/24</code> mask applied to every segment, each
          allocation wastes between 224 and 252 addresses. Under VLSM, each segment
          receives precisely the smallest prefix that satisfies its host count — no
          more, no less.
        </p>

        <p className="leading-relaxed">
          <strong className="text-slate-900 dark:text-slate-100">Variable Length Subnet Masking (VLSM)</strong>,
          standardised in RFC 1009 and further refined in RFC 1812, is the technique
          of applying different prefix lengths to different subnets derived from the
          same parent address block. VLSM is, in essence, recursive subnetting: a
          network block is divided into a set of subnets of varying sizes, and then
          individual subnets within that set can themselves be further divided into
          smaller subnets, ad infinitum, as long as host requirements and available
          address space permit.
        </p>

        <p className="leading-relaxed">
          The canonical VLSM engineering procedure follows a strict algorithmic order:
        </p>

        <ol className="list-decimal list-inside space-y-3 pl-2">
          <li className="leading-relaxed">
            <strong className="text-slate-900 dark:text-slate-100">Inventory and Sort:</strong> Enumerate
            every network segment and its required host count. Sort the list in
            descending order — largest host requirement first. This prevents the
            catastrophic error of allocating a small block early and then being unable
            to fit a large department into the remaining fragmented space.
          </li>
          <li className="leading-relaxed">
            <strong className="text-slate-900 dark:text-slate-100">Select the Minimal Prefix:</strong> For
            the largest host requirement, compute the smallest power of 2 that is
            greater than or equal to the required host count plus 2 (for the network
            and broadcast addresses). The prefix length is then 32 minus the exponent.
            For example, 120 hosts requires at least 122 total addresses; the next
            power of 2 is 128 = 2⁷, so the prefix is /25, yielding 126 usable host
            addresses.
          </li>
          <li className="leading-relaxed">
            <strong className="text-slate-900 dark:text-slate-100">Allocate on a Natural Boundary:</strong>{' '}
            Assign the block starting at the next available address in the parent pool
            that aligns to the natural boundary of the chosen prefix size. A /25 block
            always starts at an address whose final octet is either 0 or 128. Misaligned
            allocations produce overlapping or invalid subnet declarations.
          </li>
          <li className="leading-relaxed">
            <strong className="text-slate-900 dark:text-slate-100">Advance the Pointer:</strong> Move the
            allocation pointer forward by the exact size of the assigned block and
            repeat from step 2 for the next segment on the sorted list.
          </li>
          <li className="leading-relaxed">
            <strong className="text-slate-900 dark:text-slate-100">Recurse for WAN Links:</strong> Point-to-point
            links require exactly 2 host addresses. Assign{' '}
            <code className="text-cyan-700 dark:text-cyan-300 bg-slate-100 dark:bg-slate-800/60 px-1.5 py-0.5 rounded text-sm font-mono font-semibold">/30</code> blocks (4 total addresses, 2 usable) to
            every WAN link. Loopback interfaces and host routes are assigned{' '}
            <code className="text-cyan-700 dark:text-cyan-300 bg-slate-100 dark:bg-slate-800/60 px-1.5 py-0.5 rounded text-sm font-mono font-semibold">/32</code> blocks.
          </li>
        </ol>

        <p className="leading-relaxed">
          In practice, a well-designed VLSM plan can reduce address consumption for a
          typical enterprise branch design by 60–80% compared to FLSM with a uniform
          /24 prefix. This efficiency becomes critical when working with limited private
          RFC 1918 address space — particularly the{' '}
          <code className="text-cyan-700 dark:text-cyan-300 bg-slate-100 dark:bg-slate-800/60 px-1.5 py-0.5 rounded text-sm font-mono font-semibold">172.16.0.0/12</code> block, which provides only
          1,048,576 addresses for an entire organisation — or when justifying public IP
          allocations to a Regional Internet Registry.
        </p>

        <p className="leading-relaxed">
          VLSM is also the technical foundation underlying most modern cloud VPC
          (Virtual Private Cloud) network design patterns. AWS VPCs, Google Cloud VPCs,
          and Azure Virtual Networks all expose CIDR block configuration that maps
          directly to VLSM principles: a large parent CIDR is assigned to the VPC, and
          individual subnets — mapped to different Availability Zones, tiers, or
          security groups — are carved out with progressively smaller prefixes using
          VLSM logic. Mastery of VLSM is therefore not merely an exam competency for
          CCNA certification; it is a daily operational skill for cloud architects,
          infrastructure engineers, and DevOps practitioners worldwide.
        </p>
      </article>

    </div>
  );
}