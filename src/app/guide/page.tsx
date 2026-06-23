import { FC, ReactNode } from 'react';
import { getMaskLong, longToIp } from '../../utils/ipv4Utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'IPv4 Subnetting Guide, VLSM & Binary Routing Reference | Subnetmask.tech',
  description:
    'Master IPv4 subnetting, VLSM design, and binary routing physics. A comprehensive technical reference for network architects, systems engineers, CCNA students, and DevOps professionals.',
};

const SectionCard: FC<{ children: ReactNode }> = ({ children }) => (
  <section className="flex flex-col gap-6 pt-4 pb-12 border-b border-zinc-200 dark:border-[var(--color-border)] last:border-0">
    {children}
  </section>
);

const CodeBadge: FC<{ children: ReactNode; className?: string }> = ({ children, className }) => (
  <code className={`inline-block font-mono text-xs px-1.5 py-0.5 font-semibold text-zinc-800 dark:text-zinc-200 bg-zinc-200/50 dark:bg-zinc-800/50 rounded${className ? ' ' + className : ''}`}>
    {children}
  </code>
);

const ArticleDivider = () => (
  <div className="flex items-center gap-4 my-4">
    <div className="flex-1 border-t-2 border-zinc-200 dark:border-zinc-700" />
    <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400 dark:text-zinc-600 px-2">
      Article
    </span>
    <div className="flex-1 border-t-2 border-zinc-200 dark:border-zinc-700" />
  </div>
);

export default function SubnetGuide() {
  const matrixRows = [];
  for (let p = 8; p <= 32; p++) {
    const maskLong   = getMaskLong(p);
    const hostsCount = p === 32 ? 1 : p === 31 ? 2 : Math.pow(2, 32 - p) - 2;
    matrixRows.push({ prefix: p, mask: longToIp(maskLong), hosts: hostsCount });
  }

  const prose = 'text-base text-zinc-700 dark:text-zinc-300 leading-relaxed';
  const h2    = 'text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-4';
  const h3    = 'text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3 mt-6';
  const strong = 'font-semibold text-zinc-900 dark:text-zinc-100';

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-8 space-y-8">

      {/* ── Page Header ── */}
      <header className="flex flex-col gap-4 border-b border-zinc-200 dark:border-[var(--color-border)] pb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-[var(--color-text-main)] tracking-tight">
          IPv4 Subnetting Guide, VLSM &amp; Binary Routing Reference
        </h1>
        <p className={prose + ' max-w-3xl'}>
          A complete technical knowledge base covering IP address architecture, bitwise subnet mathematics,
          Variable Length Subnet Masking (VLSM) design, binary packet-forwarding physics, and the full
          prefix scaling matrix. Designed for network architects, systems engineers, CCNA candidates, and DevOps practitioners.
        </p>
      </header>

      <div className="flex flex-col gap-2">

        {/* ── Foundational Reference Section ── */}
        <SectionCard>
          <h2 className={h2}>Understanding Classless Inter-Domain Routing (CIDR)</h2>
          <p className={prose}>
            Ratified in 1993 via <span className={strong}>RFC 1519</span>, CIDR replaced the rigid Class A / B / C address hierarchy
            that had governed IP allocation since the early ARPANET era. Under classful routing, a company needing
            300 hosts was forced to consume an entire Class B block (65,534 addresses), wasting tens of thousands
            of usable IPs. CIDR resolved this by decoupling the network boundary from fixed octet boundaries,
            allowing any arbitrary prefix length to define the split between network and host portions.
          </p>
          <p className={prose}>
            A CIDR address combines an IP with a <span className={strong}>prefix-length</span> suffix that
            dictates exactly how many leading bits belong to the network identifier:
          </p>
          <div className="font-mono text-sm flex flex-col gap-2 mt-2 pl-4 border-l-2 border-zinc-300 dark:border-zinc-700">
            <span className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase tracking-widest mb-1">syntax</span>
            <span className="text-zinc-800 dark:text-zinc-200 mb-2">address/prefix-length</span>
            <span className="text-zinc-800 dark:text-zinc-200">10.0.0.0/24<span className="ml-4 text-zinc-600 dark:text-zinc-500"># 254 usable hosts — Class C equivalent</span></span>
            <span className="text-zinc-800 dark:text-zinc-200">172.16.0.0/20<span className="ml-4 text-zinc-600 dark:text-zinc-500"># 4,094 usable hosts — mid-size segment</span></span>
            <span className="text-zinc-800 dark:text-zinc-200">192.168.1.128/26<span className="ml-4 text-zinc-600 dark:text-zinc-500"># 62 usable hosts — fine-grained split</span></span>
          </div>
          <p className={prose}>
            The <CodeBadge>/24</CodeBadge> suffix means the first 24 bits are fixed network bits,
            leaving the remaining 8 bits to address <span className={strong}>256 total endpoints</span> (254 usable — the
            network and broadcast addresses are reserved).
          </p>
        </SectionCard>

        <SectionCard>
          <h2 className={h2}>The Bitwise Mathematics Behind Subnet Masking</h2>
          <p className={prose}>
            All subnet calculations are pure binary arithmetic. Three operations cover every boundary derivation in the IPv4 space:
          </p>
          <div className="flex flex-col gap-8 mt-2">
            <div>
              <h3 className={h3}><span className="font-mono">[1]</span> Network Address — Bitwise AND</h3>
              <p className={prose}>
                Perform a bitwise <CodeBadge>AND</CodeBadge> between the host IP and the Subnet Mask.
                Every bit position where <em>both</em> the IP and the Mask are <CodeBadge>1</CodeBadge> stays
                as <CodeBadge>1</CodeBadge>; all host bits are forced to <CodeBadge>0</CodeBadge>,
                revealing the base Network Address.
              </p>
            </div>
            <div>
              <h3 className={h3}><span className="font-mono">[2]</span> Broadcast Address — Bitwise NOT + OR</h3>
              <p className={prose}>
                First invert the Subnet Mask using a bitwise <CodeBadge>NOT</CodeBadge> to produce the
                Wildcard Mask (all host bits become <CodeBadge>1</CodeBadge>). Then apply a bitwise{' '}
                <CodeBadge>OR</CodeBadge> between the Network Address and the Wildcard Mask.
                The result forces all host bits high, producing the Broadcast boundary.
              </p>
            </div>
            <div>
              <h3 className={h3}><span className="font-mono">[3]</span> Usable Host Capacity</h3>
              <p className={prose}>
                Total addressable IPs follow the power sequence{' '}
                <CodeBadge>2^(32 − n)</CodeBadge>, where <em>n</em> is the prefix length.
                Subtracting 2 (for the reserved Network and Broadcast addresses) yields usable endpoint capacity:{' '}
                <CodeBadge>2^(32 − n) − 2</CodeBadge>.
                A <CodeBadge>/24</CodeBadge> therefore provides{' '}
                <CodeBadge>2^8 − 2 = 254</CodeBadge> usable host IPs.
              </p>
            </div>
          </div>
        </SectionCard>

        {/* ── Article 1: VLSM ── */}
        <ArticleDivider />
        <SectionCard>
          <article>
            <h2 className={h2}>
              Understanding Variable Length Subnet Masking (VLSM): Maximizing IP Efficiency in Enterprise Topologies
            </h2>

            <p className={prose + ' mb-6'}>
              Variable Length Subnet Masking (VLSM) is a technique in IP network design that allows a single contiguous
              address block to be divided into multiple subnets of <em>different sizes</em> — each sized precisely to
              the actual number of hosts it must serve. Before VLSM, all subnets derived from a given network block were
              required to use identical prefix lengths. VLSM, defined in <strong>RFC 1009</strong> and made universally
              practical by CIDR and classless routing protocols (OSPF, EIGRP, BGP, IS-IS), broke this constraint entirely.
            </p>

            <h3 className={h3}>The Problem VLSM Solves</h3>
            <p className={prose + ' mb-4'}>
              Consider a typical enterprise network that must accommodate the following segments simultaneously:
            </p>
            <ul className="list-disc pl-6 mb-6 flex flex-col gap-2 text-base text-zinc-700 dark:text-zinc-300">
              <li>A headquarters LAN with 200 user workstations</li>
              <li>A data centre server segment with 50 hosts</li>
              <li>A VoIP VLAN with 30 IP phones</li>
              <li>Four separate branch office networks, each with 10 hosts</li>
              <li>Three point-to-point WAN links connecting the branch offices to HQ</li>
            </ul>
            <p className={prose + ' mb-6'}>
              Under fixed-length subnet masking (FLSM), every subnet would be sized to accommodate the <em>largest</em> segment
              — the 200-host HQ LAN — requiring a <CodeBadge>/24</CodeBadge> (254 usable hosts) for every single
              segment including the point-to-point WAN links, which require only 2 hosts each. The waste would be
              catastrophic: each WAN link alone would consume 252 unnecessarily allocated addresses. In a large enterprise
              with hundreds of such links, this waste compounds into thousands of unusable IPs drained from a finite pool.
            </p>

            <h3 className={h3}>VLSM Design Methodology</h3>
            <p className={prose + ' mb-4'}>
              The canonical approach to VLSM planning follows a strict size-descending allocation order:
            </p>
            <ol className="list-none flex flex-col gap-5 mb-6">
              {[
                { step: '1', title: 'Inventory all segments', desc: 'List every network segment with its exact host count requirement. Include router interfaces, management VLANs, and WAN links.' },
                { step: '2', title: 'Sort descending by host count', desc: 'Always allocate the largest subnet first. This prevents large blocks from being stranded at the end of the address space where they cannot fit contiguously.' },
                { step: '3', title: 'Calculate the minimum prefix for each segment', desc: 'For each segment, find the smallest prefix n such that 2^(32−n) − 2 ≥ required_hosts. A 200-host segment needs /24 (254 usable). A 50-host segment needs /26 (62 usable). A 30-host segment needs /27 (30 usable). A 10-host segment needs /28 (14 usable). A 2-host WAN link needs /30 (2 usable).' },
                { step: '4', title: 'Assign contiguous blocks', desc: 'Allocate each subnet sequentially from the parent address block, ensuring block boundaries align to their natural power-of-two boundaries to avoid fragmentation.' },
                { step: '5', title: 'Document and validate', desc: 'Verify that no two allocated subnets overlap, and that all subnets fit within the parent block without exceeding its boundary.' },
              ].map(item => (
                <li key={item.step} className="flex gap-4">
                  <span className="shrink-0 font-mono text-sm font-bold text-cyan-700 dark:text-cyan-400 w-10">
                    Step {item.step}
                  </span>
                  <span className="text-base text-zinc-700 dark:text-zinc-300">
                    <strong className="text-zinc-900 dark:text-zinc-100">{item.title}:</strong>{' '}
                    {item.desc}
                  </span>
                </li>
              ))}
            </ol>

            <h3 className={h3}>Worked Example: Designing a Multi-Tier Enterprise Network</h3>
            <p className={prose + ' mb-4'}>
              Starting with a parent block of <CodeBadge>10.10.0.0/21</CodeBadge> (2,046 usable host IPs),
              a network architect must carve out the segments listed above. Applying VLSM:
            </p>
            <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-6">
              <table className="w-full text-sm font-mono text-left">
                <caption className="sr-only">VLSM subnet allocation table example</caption>
                <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                  <tr className="text-zinc-600 dark:text-zinc-400 text-xs uppercase tracking-widest">
                    <th scope="col" className="py-3 px-4 font-semibold">Segment</th>
                    <th scope="col" className="py-3 px-4 font-semibold">Required Hosts</th>
                    <th scope="col" className="py-3 px-4 font-semibold">Prefix</th>
                    <th scope="col" className="py-3 px-4 font-semibold">Allocated Block</th>
                    <th scope="col" className="py-3 px-4 font-semibold text-right">Usable</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {[
                    { seg: 'HQ LAN',       req: 200,  pfx: '/24', block: '10.10.0.0/24',   usable: 254 },
                    { seg: 'Data Centre',  req: 50,   pfx: '/26', block: '10.10.1.0/26',   usable: 62  },
                    { seg: 'VoIP VLAN',    req: 30,   pfx: '/27', block: '10.10.1.64/27',  usable: 30  },
                    { seg: 'Branch A',     req: 10,   pfx: '/28', block: '10.10.1.96/28',  usable: 14  },
                    { seg: 'Branch B',     req: 10,   pfx: '/28', block: '10.10.1.112/28', usable: 14  },
                    { seg: 'Branch C',     req: 10,   pfx: '/28', block: '10.10.1.128/28', usable: 14  },
                    { seg: 'Branch D',     req: 10,   pfx: '/28', block: '10.10.1.144/28', usable: 14  },
                    { seg: 'WAN Link 1',   req: 2,    pfx: '/30', block: '10.10.1.160/30', usable: 2   },
                    { seg: 'WAN Link 2',   req: 2,    pfx: '/30', block: '10.10.1.164/30', usable: 2   },
                    { seg: 'WAN Link 3',   req: 2,    pfx: '/30', block: '10.10.1.168/30', usable: 2   },
                  ].map(row => (
                    <tr key={row.seg} className="bg-white dark:bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3 px-4 text-zinc-800 dark:text-zinc-200 font-semibold">{row.seg}</td>
                      <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{row.req}</td>
                      <td className="py-3 px-4 text-cyan-700 dark:text-cyan-400 font-bold">{row.pfx}</td>
                      <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300">{row.block}</td>
                      <td className="py-3 px-4 text-right text-emerald-700 dark:text-emerald-400 font-semibold">{row.usable}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={prose + ' mb-4'}>
              This allocation consumes only <strong>354 total addresses</strong> from the parent block,
              leaving <strong>1,692 addresses</strong> still available for future growth — all within the original
              <CodeBadge>/21</CodeBadge> announcement to the upstream BGP peer. Without VLSM, this topology
              would have consumed nine <CodeBadge>/24</CodeBadge> blocks (2,286 addresses), exceeding the
              parent block entirely and requiring a second, discontiguous allocation.
            </p>

            <h3 className={h3}>VLSM in Modern Cloud Infrastructure</h3>
            <p className={prose + ' mb-4'}>
              Every major cloud platform has adopted VLSM principles natively. In <strong>AWS VPCs</strong>,
              a VPC CIDR of <CodeBadge>/16</CodeBadge> is routinely subdivided into purpose-specific subnets:
              <CodeBadge>/20</CodeBadge> blocks for application tiers, <CodeBadge>/24</CodeBadge> subnets for
              individual availability zones, and <CodeBadge>/28</CodeBadge> blocks for Lambda VPC endpoints or
              PrivateLink interfaces. <strong>Azure VNets</strong> follow the same model with subnet delegation.
              <strong>Google Cloud VPCs</strong> operate in custom mode, requiring manual CIDR assignment across regions.
            </p>
            <p className={prose}>
              Whether you are designing physical data centre topologies, cloud virtual networks, or hybrid SD-WAN
              architectures, VLSM mastery is a non-negotiable competency. The <strong>VLSM Subnet Splitter</strong>
              on this platform&apos;s calculator page automates the prefix selection step interactively,
              showing you the exact block boundaries, ranges, and host capacities in real time as you adjust
              your target prefix depth.
            </p>
          </article>
        </SectionCard>

        {/* ── Article 2: Binary Routing Physics ── */}
        <ArticleDivider />
        <SectionCard>
          <article>
            <h2 className={h2}>
              The Binary Physics of Routing: How Routers Parse IPv4 Octets at the Hardware Layer
            </h2>
            <p className={prose + ' mb-6'}>
              When a packet arrives at a router interface, the forwarding decision happens in microseconds at the silicon
              level. Understanding what actually occurs during this operation — from the raw binary representation of the
              destination IP through the longest-prefix match (LPM) lookup and out through the egress interface — provides
              insight into why CIDR notation, subnet masks, and routing table design work the way they do. This article
              traces the complete forwarding path of a single IPv4 packet through the hardware layer.
            </p>

            <h3 className={h3}>Step 1: IPv4 Packet Ingress and Header Parsing</h3>
            <p className={prose + ' mb-4'}>
              An IPv4 packet begins with a 20-byte (160-bit) fixed header. The forwarding-relevant fields are:
            </p>
            <ul className="list-disc pl-6 mb-6 flex flex-col gap-2 text-base text-zinc-700 dark:text-zinc-300">
              <li><strong>Destination IP Address</strong> (bits 128–159 of the header): the 32-bit address the router uses for the LPM lookup.</li>
              <li><strong>TTL (Time-To-Live)</strong>: decremented by 1 at each hop; packet is dropped with an ICMP TTL Exceeded if it reaches 0.</li>
              <li><strong>Header Checksum</strong>: recalculated at each hop after TTL decrement.</li>
            </ul>
            <p className={prose + ' mb-6'}>
              Modern line card ASICs extract the destination IP directly from the byte stream in the switching fabric,
              typically within the first clock cycles of the packet arriving on the ingress port. The rest of the
              payload is buffered while the forwarding decision is computed in parallel.
            </p>

            <h3 className={h3}>Step 2: The Binary Representation of an IPv4 Address</h3>
            <p className={prose + ' mb-4'}>
              Every IPv4 address is internally a 32-bit unsigned integer stored in network byte order (big-endian).
              The familiar dotted-decimal notation — such as <CodeBadge>192.168.10.45</CodeBadge> — is purely
              a human-readable serialisation of four 8-bit octets. At the hardware level, the router sees:
            </p>
            <div className="font-mono text-sm flex flex-col gap-1 pl-4 border-l-2 border-cyan-400/50 dark:border-cyan-600/50 mb-6">
              <span className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase tracking-widest mb-2">binary decomposition</span>
              <span className="text-zinc-800 dark:text-zinc-200">192  →  1100 0000</span>
              <span className="text-zinc-800 dark:text-zinc-200">168  →  1010 1000</span>
              <span className="text-zinc-800 dark:text-zinc-200"> 10  →  0000 1010</span>
              <span className="text-zinc-800 dark:text-zinc-200"> 45  →  0010 1101</span>
              <span className="text-zinc-500 dark:text-zinc-600 mt-2">Full: 11000000.10101000.00001010.00101101</span>
            </div>
            <p className={prose + ' mb-6'}>
              The subnet mask for a <CodeBadge>/24</CodeBadge> prefix is:
              <CodeBadge className="ml-2">11111111.11111111.11111111.00000000</CodeBadge> — 24 consecutive 1-bits
              followed by 8 zero-bits. This is the bitmask applied during the LPM calculation.
            </p>

            <h3 className={h3}>Step 3: The Longest Prefix Match (LPM) Algorithm</h3>
            <p className={prose + ' mb-4'}>
              The routing table is a collection of network prefix entries, each with an associated next-hop
              and egress interface. For every incoming packet, the router must find the <em>most specific</em>
              matching entry — the entry whose prefix captures the maximum number of leading bits of the
              destination address. This is the Longest Prefix Match (LPM) algorithm, and it is the
              foundational operation of all IP routing.
            </p>
            <p className={prose + ' mb-4'}>
              For each entry <CodeBadge>network/prefix</CodeBadge> in the routing table, the router computes:
            </p>
            <div className="font-mono text-sm pl-4 border-l-2 border-zinc-300 dark:border-zinc-700 mb-6 py-2 flex flex-col gap-1">
              <span className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase tracking-widest mb-2">match condition</span>
              <span className="text-zinc-800 dark:text-zinc-200">(destination_ip AND subnet_mask) == network_address</span>
              <span className="text-zinc-500 dark:text-zinc-600 mt-2 text-xs">If TRUE → this entry matches. Select the one with the largest prefix length.</span>
            </div>
            <p className={prose + ' mb-6'}>
              Consider a router with the following RIB (Routing Information Base) entries:
            </p>
            <div className="overflow-x-auto rounded-xl border border-zinc-200 dark:border-zinc-800 shadow-sm mb-6">
              <table className="w-full text-sm font-mono text-left">
                <caption className="sr-only">Routing table longest prefix match example</caption>
                <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                  <tr className="text-zinc-600 dark:text-zinc-400 text-xs uppercase tracking-widest">
                    <th scope="col" className="py-3 px-4 font-semibold">Prefix</th>
                    <th scope="col" className="py-3 px-4 font-semibold">Next Hop</th>
                    <th scope="col" className="py-3 px-4 font-semibold">Match for 10.10.1.45?</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {[
                    { prefix: '0.0.0.0/0',    hop: '203.0.113.1', match: 'Yes (default route, 0 bits)' },
                    { prefix: '10.0.0.0/8',   hop: '10.0.0.1',    match: 'Yes (8 bits match)' },
                    { prefix: '10.10.0.0/16', hop: '10.10.0.1',   match: 'Yes (16 bits match)' },
                    { prefix: '10.10.1.0/24', hop: '10.10.1.1',   match: 'Yes ✓ (24 bits — SELECTED)' },
                    { prefix: '10.10.2.0/24', hop: '10.10.2.1',   match: 'No' },
                  ].map((row, i) => (
                    <tr key={i} className={`bg-white dark:bg-transparent transition-colors ${row.match.includes('SELECTED') ? 'bg-emerald-50 dark:bg-emerald-950/30' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900/40'}`}>
                      <td className="py-3 px-4 text-cyan-700 dark:text-cyan-400 font-bold">{row.prefix}</td>
                      <td className="py-3 px-4 text-zinc-600 dark:text-zinc-400">{row.hop}</td>
                      <td className={`py-3 px-4 ${row.match.includes('SELECTED') ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-zinc-600 dark:text-zinc-400'}`}>{row.match}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={prose + ' mb-6'}>
              The <CodeBadge>10.10.1.0/24</CodeBadge> entry wins because it has the longest (most specific)
              prefix that still matches the destination. The packet is forwarded to next-hop <CodeBadge>10.10.1.1</CodeBadge>.
              Without this algorithm, IP routing across the global Internet would be impossible — the BGP table alone
              contains over 900,000 prefixes, all evaluated by LPM for every forwarded packet.
            </p>

            <h3 className={h3}>Step 4: TCAM — Hardware-Accelerated LPM at Line Rate</h3>
            <p className={prose + ' mb-4'}>
              Software-based routing cannot evaluate hundreds of thousands of prefix entries in microseconds. Modern
              routers and Layer 3 switches use <strong>TCAM (Ternary Content-Addressable Memory)</strong> to perform
              LPM at hardware speed. Unlike conventional RAM which retrieves data by address, CAM retrieves data by
              content — you supply the data and it returns the address. TCAM extends this with a third state
              (the &quot;ternary&quot; bit): each bit position can be <CodeBadge>0</CodeBadge>, <CodeBadge>1</CodeBadge>,
              or <CodeBadge>X</CodeBadge> (wildcard/don't-care).
            </p>
            <p className={prose + ' mb-4'}>
              Each routing table entry is stored as a TCAM word where the host bit positions of the subnet
              are encoded as wildcards. The router presents the 32-bit destination address to the TCAM bus
              simultaneously across all entries, and the hardware returns all matching entries in a single clock cycle
              — typically operating at nanosecond speeds. A priority encoder then selects the entry with the
              longest prefix among all matches.
            </p>
            <p className={prose + ' mb-6'}>
              This is why TCAM capacity is one of the most critical hardware specifications for enterprise and
              carrier-grade switches. A device with 256K TCAM entries can hold roughly 256,000 routing table
              prefixes — a number that approaches the full BGP Internet table on smaller edge devices.
              TCAM is expensive, power-hungry, and physically large compared to DRAM, which is why routing
              table size limits vary dramatically between consumer, enterprise, and service provider equipment.
            </p>

            <h3 className={h3}>Step 5: Egress Processing, ARP, and Frame Encapsulation</h3>
            <p className={prose + ' mb-4'}>
              Once the LPM lookup resolves the next-hop IP address and egress interface, the router must
              determine the Layer 2 MAC address of the next-hop device. This requires an <strong>ARP (Address
              Resolution Protocol)</strong> lookup in the router's ARP cache. If the next-hop MAC is already
              cached, the packet is immediately encapsulated in a new Ethernet frame with the next-hop MAC
              as the destination, the router's own interface MAC as the source, and forwarded to the egress queue.
            </p>
            <p className={prose}>
              If the ARP entry is missing, the router broadcasts an ARP request on the egress interface,
              buffers the outbound packet, and waits for an ARP reply before completing the forwarding operation.
              This ARP resolution step is why the first packet to a new next-hop may experience a brief delay
              compared to subsequent packets — a latency artifact completely invisible once the ARP cache is warm.
              Understanding this full path — from binary address parsing through TCAM lookup to ARP resolution and
              frame encapsulation — is the foundation of advanced network debugging, latency analysis, and
              hardware-aware infrastructure design.
            </p>
          </article>
        </SectionCard>

        {/* ── Subnetting Tutorial ── */}
        <SectionCard>
          <h2 className={h2}>
            Subnetting Tutorial — Predictable 4-Step Engineering Moves
          </h2>
          <p className={prose}>
            Subnetting is fully deterministic once you know the target host count or the required number of segments.
            The following worked example demonstrates splitting a large block into equal partitions:
          </p>

          <div className="pl-4 border-l-2 border-zinc-300 dark:border-zinc-700 py-2 my-4 flex flex-col gap-4">
            <p className="text-sm font-mono font-semibold text-zinc-800 dark:text-zinc-200">
              Goal: Split <CodeBadge>172.16.0.0/16</CodeBadge> into at least 10 equal subnets.
            </p>
            <ol className="list-none flex flex-col gap-4 text-sm text-zinc-700 dark:text-zinc-300">
              {[
                { step: 'Step 1', body: <><span className="font-semibold text-zinc-900 dark:text-zinc-100">Determine the minimum number of subnet bits needed.</span> We require at least 10 subnets. Evaluate the power-of-two sequence: 2¹=2, 2²=4, 2³=8, 2⁴=<span className="font-bold text-zinc-900 dark:text-zinc-100">16 ✓</span>. We need to borrow <strong>4 bits</strong>.</> },
                { step: 'Step 2', body: <><span className="font-semibold text-zinc-900 dark:text-zinc-100">Calculate the new prefix length.</span> Original prefix was <CodeBadge>/16</CodeBadge>. Add the 4 borrowed bits → new working prefix is <CodeBadge>/20</CodeBadge>.</> },
                { step: 'Step 3', body: <><span className="font-semibold text-zinc-900 dark:text-zinc-100">Confirm usable host capacity per subnet.</span> Each <CodeBadge>/20</CodeBadge> block provides 2^(32−20)−2 = <strong>4,094 usable endpoint host nodes</strong>.</> },
                { step: 'Step 4', body: <><span className="font-semibold text-zinc-900 dark:text-zinc-100">Map subnet block boundaries.</span> The block size is 2^12 = 4096 addresses. The 16 subnets begin at: 172.16.0.0, 172.16.16.0, 172.16.32.0 … 172.16.240.0, each separated by a 4096-address increment.</> },
              ].map(item => (
                <li key={item.step} className="flex gap-4">
                  <span className="shrink-0 font-mono text-zinc-600 dark:text-zinc-500">{item.step}</span>
                  <span>{item.body}</span>
                </li>
              ))}
            </ol>
          </div>
          <p className={prose}>
            This four-step method — <em>identify requirement → borrow bits → verify capacity → plot boundaries</em> — scales
            to any CIDR block, any prefix depth, and forms the foundation of enterprise VLSM design.
          </p>
        </SectionCard>

        {/* ── IPv6 Section ── */}
        <SectionCard>
          <h2 className={h2}>IPv6 Subnetting Architecture Standards</h2>
          <p className={prose}>
            IPv6 expands the address space to 128 bits — approximately 3.4 × 10³⁸ total addresses — eliminating the scarcity
            constraints that drove the CIDR revolution. While this tool focuses on IPv4, understanding IPv6 allocation tiers
            is critical for modern dual-stack infrastructure planning.
          </p>

          <div className="flex flex-col gap-6 mt-4">
            {[
              { prefix: '/64', title: 'Standard LAN Segment', body: 'The canonical size for a single IPv6 subnet. Provides 18.4 quintillion (2⁶⁴) addresses per segment. You should never subnet below a /64 on a single segment — doing so breaks SLAAC (Stateless Address Autoconfiguration) and NDP (Neighbour Discovery Protocol).' },
              { prefix: '/56', title: 'Consumer / Home Route Delegation', body: 'The typical ISP delegation for residential endpoints via DHCPv6-PD (Prefix Delegation). A /56 grants the subscriber 256 independent /64 subnets to route across local VLAN segments, IoT networks, or guest SSIDs.' },
              { prefix: '/48', title: 'Enterprise Site Allocation', body: 'The recommended allocation for a single enterprise campus or data centre site, typically announced via BGP. A /48 provides 65,536 /64 subnets — sufficient to address every VLAN, server rack, DMZ, and management plane of any large organisation.' },
            ].map(item => (
              <div key={item.prefix} className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <CodeBadge>{item.prefix}</CodeBadge>
                  <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{item.title}</span>
                </div>
                <p className="text-base text-zinc-700 dark:text-zinc-300 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </SectionCard>

      </div>

      {/* ── Prefix Scaling Matrix ── */}
      <div className="flex flex-col pt-8">
        <div className="border-b-2 border-zinc-800 dark:border-zinc-200 pb-2 mb-4 flex items-center justify-between">
          <h2 className="font-bold text-xs font-mono uppercase tracking-widest text-zinc-900 dark:text-zinc-100">
            Prefix Scaling Matrix
          </h2>
          <span className="text-[10px] font-mono text-zinc-600 dark:text-zinc-500">/8 → /32</span>
        </div>
        <div className="w-full overflow-x-auto bg-[var(--color-surface)] border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-6 shadow-sm">
          <table className="table-auto w-full text-left font-mono text-sm tracking-tight">
            <caption className="sr-only">Complete prefix scaling matrix from /8 to /32 with subnet masks and usable host counts</caption>
            <thead className="border-b border-zinc-200 dark:border-[var(--color-border)]">
              <tr className="text-zinc-600 dark:text-zinc-500 text-[10px] uppercase tracking-widest">
                <th scope="col" className="py-2 px-2 font-semibold">CIDR</th>
                <th scope="col" className="py-2 px-2 font-semibold">Subnet Mask</th>
                <th scope="col" className="py-2 px-2 text-right font-semibold">Usable Hosts</th>
              </tr>
            </thead>
            <tbody>
              {matrixRows.map((row) => (
                <tr key={row.prefix} className="border-b border-zinc-100 dark:border-zinc-800/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                  <td className="py-2 px-2 text-zinc-900 dark:text-zinc-100 font-medium">
                    /{row.prefix}
                  </td>
                  <td className="py-2 px-2 text-zinc-700 dark:text-zinc-400">
                    {row.mask}
                  </td>
                  <td className="py-2 px-2 text-right text-zinc-700 dark:text-zinc-400 tabular-nums">
                    {row.hosts.toLocaleString('en-US')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
