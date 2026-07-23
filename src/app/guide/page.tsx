import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://subnetmask.tech'),
  title: 'IPv4 Subnetting & CIDR Guide — Bitwise Logic, VLSM & Classless Routing',
  description:
    'A comprehensive technical reference manual on IPv4 subnetting, CIDR notation, VLSM architectural design, TCAM routing hardware physics, and route aggregation.',
  alternates: {
    canonical: '/guide',
  },
};

export default function GuidePage() {
  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 w-full box-border space-y-16 py-6 text-slate-700 dark:text-slate-300 max-w-5xl mx-auto font-sans leading-relaxed">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'TechArticle',
            headline: 'The Complete IPv4 Subnetting, CIDR & VLSM Technical Reference Manual',
            description:
              'An authoritative engineering manual covering IPv4 bitwise mathematics, TCAM hardware lookup, Classless Inter-Domain Routing (CIDR), VLSM allocation algorithms, and BGP/OSPF route aggregation.',
            author: {
              '@type': 'Organization',
              name: 'Subnetmask.tech',
              url: 'https://subnetmask.tech',
            },
            publisher: {
              '@type': 'Organization',
              name: 'Subnetmask.tech',
              url: 'https://subnetmask.tech',
            },
            mainEntityOfPage: 'https://subnetmask.tech/guide',
            inLanguage: 'en-US',
          }),
        }}
      />

      {/* Page Header */}
      <header className="text-center space-y-4">
        <p className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-400">
          Engineering Reference Manual
        </p>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100 sm:text-3xl md:text-4xl lg:text-5xl leading-tight">
          The Complete IPv4 Subnetting, CIDR &amp; VLSM Reference Manual
        </h1>
        <p className="max-w-3xl mx-auto text-base sm:text-lg leading-relaxed text-slate-500 dark:text-slate-400">
          An in-depth technical analysis of binary mathematics, hardware-level TCAM routing logic, Classless Inter-Domain Routing (RFC 1519), and enterprise VLSM topology engineering.
        </p>
      </header>

      {/* ARTICLE 1 */}
      <article className="space-y-10">
        <header className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <span>Part I</span>
            <span>•</span>
            <span>Bitwise Mechanics &amp; Hardware Physics</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            The Physics of IPv4 Bitwise Arithmetic &amp; CIDR Mechanics
          </h2>
        </header>

        {/* Section 1.1 */}
        <section className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            1. Historical Context: Classful Exhaustion &amp; The RFC 1519 Paradigm Shift
          </h3>
          <p>
            When RFC 791 formally specified the Internet Protocol in 1981, the global network architecture was structured around a rigid system known as <strong>Classful Addressing</strong>. The 32-bit IPv4 address space (comprising 2<sup>32</sup> = 4,294,967,296 theoretical unique addresses) was partitioned into five discrete classes—Class A, B, C, D, and E—derived strictly from the most significant bits (MSBs) of the first octet.
          </p>
          <ul className="list-disc list-inside space-y-2 pl-4">
            <li>
              <strong>Class A (<code className="font-mono text-xs px-1.5 py-0.5 rounded font-semibold bg-slate-100 dark:bg-slate-800/80 text-cyan-700 dark:text-cyan-300">0.0.0.0/8</code> to <code className="font-mono text-xs px-1.5 py-0.5 rounded font-semibold bg-slate-100 dark:bg-slate-800/80 text-cyan-700 dark:text-cyan-300">127.255.255.255/8</code>):</strong> Leading bit <code className="font-mono text-xs">0</code>. Allocated 8 bits for the network identifier and 24 bits for host addressing, granting each of the 128 Class A assignments a colossal capacity of 2<sup>24</sup> - 2 = 16,777,214 usable host IP addresses.
            </li>
            <li>
              <strong>Class B (<code className="font-mono text-xs px-1.5 py-0.5 rounded font-semibold bg-slate-100 dark:bg-slate-800/80 text-cyan-700 dark:text-cyan-300">128.0.0.0/16</code> to <code className="font-mono text-xs px-1.5 py-0.5 rounded font-semibold bg-slate-100 dark:bg-slate-800/80 text-cyan-700 dark:text-cyan-300">191.255.255.255/16</code>):</strong> Leading bits <code className="font-mono text-xs">10</code>. Split the 32-bit space evenly into 16 network bits and 16 host bits, yielding 65,534 usable hosts per block across 16,384 distinct networks.
            </li>
            <li>
              <strong>Class C (<code className="font-mono text-xs px-1.5 py-0.5 rounded font-semibold bg-slate-100 dark:bg-slate-800/80 text-cyan-700 dark:text-cyan-300">192.0.0.0/24</code> to <code className="font-mono text-xs px-1.5 py-0.5 rounded font-semibold bg-slate-100 dark:bg-slate-800/80 text-cyan-700 dark:text-cyan-300">223.255.255.255/24</code>):</strong> Leading bits <code className="font-mono text-xs">110</code>. Allocated 24 bits to the network identifier and only 8 bits to hosts, capping each block at a modest 254 usable addresses across 2,097,152 networks.
            </li>
            <li>
              <strong>Class D (<code className="font-mono text-xs">224.0.0.0/4</code>) &amp; Class E (<code className="font-mono text-xs">240.0.0.0/4</code>):</strong> Reserved exclusively for IP Multicast groups and experimental/future research respectively.
            </li>
          </ul>
          <p>
            By the late 1980s, the explosive commercial adoption of TCP/IP triggered a severe structural crisis. Mid-sized enterprises routinely required more than 254 host addresses, making a single Class C assignment insufficient. However, granting a full Class B block (65,534 addresses) to an organization needing only 500 IP addresses resulted in an astounding 99% address waste rate. This coarse granularity rapidly depleted the unassigned Class B pool and caused an unmanageable explosion in global Border Gateway Protocol (BGP) routing table entries, as ISPs were forced to advertise thousands of fragmented Class C routes.
          </p>
          <blockquote className="border-l-4 border-cyan-500 dark:border-cyan-400 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-r-xl italic text-slate-600 dark:text-slate-400 my-4">
            &quot;In September 1993, the Internet Engineering Task Force (IETF) published <strong>RFC 1519</strong>, officially defining Classless Inter-Domain Routing (CIDR). CIDR permanently abolished rigid class boundaries, introducing variable-length prefix notation and saving the IPv4 architecture from premature collapse.&quot;
          </blockquote>
          <p>
            Under CIDR, a network boundary is no longer restricted to 8, 16, or 24-bit octet boundaries. Instead, an arbitrary integer prefix <em>N</em> (where 0 &le; <em>N</em> &le; 32) is appended to an IP address with a forward slash (e.g., <code className="font-mono text-xs px-1.5 py-0.5 rounded font-semibold bg-slate-100 dark:bg-slate-800/80 text-cyan-700 dark:text-cyan-300">10.50.0.0/22</code>). The integer <em>N</em> explicitly denotes the exact number of high-order contiguous 1-bits in the subnet mask vector. This granularity allows network architects to provision subnets sized precisely to operational host demands, ranging from a massive <code className="font-mono text-xs">/12</code> cloud VPC space down to a concise <code className="font-mono text-xs">/30</code> or <code className="font-mono text-xs">/31</code> point-to-point link.
          </p>
        </section>

        {/* Section 1.2 */}
        <section className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            2. Mathematical Foundations: 32-Bit Unsigned Binary Conversion
          </h3>
          <p>
            Although human engineers interact with IPv4 addresses using <strong>Dotted-Decimal Notation</strong> (four base-10 integers separated by periods, e.g., <code className="font-mono text-xs px-1.5 py-0.5 rounded font-semibold bg-slate-100 dark:bg-slate-800/80 text-cyan-700 dark:text-cyan-300">192.168.1.75</code>), underlying networking silicon, operating system kernels, and hardware switch fabrics process IP addresses exclusively as raw 32-bit unsigned binary integers.
          </p>
          <p>
            Converting a dotted-decimal IPv4 address (<em>O</em><sub>1</sub>, <em>O</em><sub>2</sub>, <em>O</em><sub>3</sub>, <em>O</em><sub>4</sub>) into its scalar 32-bit integer representation <em>V</em><sub>32</sub> is governed by positional bit-shifting mathematics:
          </p>
          <pre className="bg-slate-900 text-slate-100 border border-slate-800 rounded-xl p-5 font-mono text-xs sm:text-sm overflow-x-auto shadow-md my-4">
<code>{`V_32 = (O_1 << 24) | (O_2 << 16) | (O_3 << 8) | O_4

Mathematical Expansion:
V_32 = (O_1 * 2^24) + (O_2 * 2^16) + (O_3 * 2^8) + (O_4 * 2^0)

Example: Converting 192.168.1.75
  Octet 1: 192 -> 11000000_2  (192 * 16,777,216 = 3,221,225,472)
  Octet 2: 168 -> 10101000_2  (168 * 65,536     =    11,010,048)
  Octet 3:   1 -> 00000001_2  (1   * 256        =           256)
  Octet 4:  75 -> 01001011_2  (75  * 1          =            75)
------------------------------------------------------------------
Total Unsigned 32-Bit Scalar Integer         = 3,232,235,851`}</code>
          </pre>
          <p>
            In JavaScript and TypeScript engine runtimes (V8, JavaScriptCore), standard bitwise operations implicitly convert operands into <em>signed 32-bit integers</em> (two&apos;s complement). Consequently, performing a left shift on an octet like 192 (<code className="font-mono text-xs">192 &lt;&lt; 24</code>) causes bit 31 to flip to 1, producing a negative integer (-1,073,741,824). To force the JavaScript runtime to interpret the binary result as an <strong>unsigned 32-bit scalar</strong>, network utility functions execute a zero-fill right shift by 0 bits (<code className="font-mono text-xs px-1.5 py-0.5 rounded font-semibold bg-slate-100 dark:bg-slate-800/80 text-cyan-700 dark:text-cyan-300">&gt;&gt;&gt; 0</code>):
          </p>
          <pre className="bg-slate-900 text-slate-100 border border-slate-800 rounded-xl p-5 font-mono text-xs sm:text-sm overflow-x-auto shadow-md my-4">
<code>{`// Production TypeScript IPv4 Conversion Engine
export function ipToLong(ip: string): number {
  const octets = ip.split('.').map(Number);
  return (((octets[0] << 24) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0);
}`}</code>
          </pre>
        </section>

        {/* Section 1.3 */}
        <section className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            3. Explaining Bitwise Routing Operations: AND (&amp;), NOT (~), and OR (|)
          </h3>
          <p>
            Routers evaluate packet forwardability by executing hardware-level bitwise boolean logic across the 32-bit IP address vector and the Subnet Mask vector.
          </p>

          {/* Subnet Mask Vector Generation */}
          <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-4">
            A. Subnet Mask Vector Generation
          </h4>
          <p>
            A subnet mask vector corresponding to CIDR prefix <em>N</em> (1 &le; <em>N</em> &le; 32) consists of <em>N</em> consecutive 1-bits starting from the MSB, padded with 32 - <em>N</em> 0-bits to the LSB. Mathematically, it is generated via binary left shift:
          </p>
          <pre className="bg-slate-900 text-slate-100 border border-slate-800 rounded-xl p-5 font-mono text-xs sm:text-sm overflow-x-auto shadow-md my-4">
<code>{`maskLong = (0xFFFFFFFF << (32 - N)) >>> 0;

For N = 26 (/26 Prefix):
32 - 26 = 6 host bits
0xFFFFFFFF << 6 = 11111111.11111111.11111111.11000000_2
Dotted-Decimal Equivalent = 255.255.255.192`}</code>
          </pre>

          {/* Bitwise AND */}
          <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-4">
            B. Network Address Derivation via Bitwise AND (<code className="font-mono text-base">&amp;</code>)
          </h4>
          <p>
            The <strong>Bitwise AND</strong> operator compares corresponding bits of two 32-bit integers. The resulting bit is <code className="font-mono text-xs">1</code> if and only if <em>both</em> input bits are <code className="font-mono text-xs">1</code>; otherwise, it resolves to <code className="font-mono text-xs">0</code>.
          </p>
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 font-mono text-xs sm:text-sm space-y-3 shadow-sm my-4">
            <p className="text-slate-400 dark:text-slate-500 text-xs uppercase tracking-widest font-sans font-bold mb-2">
              Bitwise AND Truth Table &amp; Network Vector Extraction
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs mb-4 border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>Bit A &amp; Bit B = Output</div>
              <div>0 &amp; 0 = 0 | 0 &amp; 1 = 0 | 1 &amp; 0 = 0 | <strong>1 &amp; 1 = 1</strong></div>
            </div>
            <p><span className="text-slate-400 dark:text-slate-500">IP (192.168.1.75):   </span><span className="text-amber-600 dark:text-amber-400 font-bold">11000000.10101000.00000001.01</span>001011</p>
            <p><span className="text-slate-400 dark:text-slate-500">Mask (/26):          </span><span className="text-cyan-600 dark:text-cyan-400 font-bold">11111111.11111111.11111111.11</span>000000</p>
            <div className="border-t border-slate-200 dark:border-slate-700 my-2" />
            <p><span className="text-slate-400 dark:text-slate-500">Network (192.168.1.64):</span><span className="text-emerald-600 dark:text-emerald-400 font-bold">11000000.10101000.00000001.01</span>000000</p>
          </div>
          <p>
            Because the mask contains 26 leading 1s, the bitwise AND preserves the high-order 26 network bits of the IP address unchanged while zeroing out all 6 host bits. The resulting integer <code className="font-mono text-xs">192.168.1.64</code> represents the immutable <strong>Network ID</strong>.
          </p>

          {/* Bitwise NOT and OR */}
          <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight mt-6">
            C. Wildcard &amp; Broadcast Derivation via Bitwise NOT (<code className="font-mono text-base">~</code>) and OR (<code className="font-mono text-base">|</code>)
          </h4>
          <p>
            The <strong>Wildcard Mask</strong> (the inverse of the subnet mask, utilized extensively in Cisco Access Control Lists and OSPF area declarations) is derived by executing a <strong>Bitwise NOT</strong> on the subnet mask vector:
          </p>
          <pre className="bg-slate-900 text-slate-100 border border-slate-800 rounded-xl p-5 font-mono text-xs sm:text-sm overflow-x-auto shadow-md my-4">
<code>{`wildcardLong = (~maskLong) >>> 0;

For /26 Subnet Mask (255.255.255.192):
~11111111.11111111.11111111.11000000_2
= 00000000.00000000.00000000.00111111_2
Dotted-Decimal Wildcard = 0.0.0.63`}</code>
          </pre>
          <p>
            To compute the <strong>Directed Broadcast Address</strong> (the highest address in the block where all host bits are set to 1), the router executes a <strong>Bitwise OR</strong> (<code className="font-mono text-xs">|</code>) between the Network Address integer and the Wildcard integer:
          </p>
          <pre className="bg-slate-900 text-slate-100 border border-slate-800 rounded-xl p-5 font-mono text-xs sm:text-sm overflow-x-auto shadow-md my-4">
<code>{`broadcastLong = (networkLong | wildcardLong) >>> 0;

  11000000.10101000.00000001.01000000_2  (Network: 192.168.1.64)
| 00000000.00000000.00000000.00111111_2  (Wildcard: 0.0.0.63)
-----------------------------------------------------------------
= 11000000.10101000.00000001.01111111_2  (Broadcast: 192.168.1.127)`}</code>
          </pre>
        </section>

        {/* Section 1.4 */}
        <section className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            4. Hardware Silicon Physics: TCAM &amp; Longest Prefix Match (LPM)
          </h3>
          <p>
            In core backbone routers (e.g., Cisco Nexus, Arista 7000 series, Juniper PTX), processing millions of packet headers per second per line card renders software-based RAM lookup algorithms far too slow. Enterprise routing silicon implements two specialized hardware concepts: <strong>Longest Prefix Match (LPM)</strong> and <strong>Ternary Content-Addressable Memory (TCAM)</strong>.
          </p>
          <p>
            When a router receives an IP packet, its Routing Information Base (RIB) may contain multiple overlapping CIDR matches for the destination address. For example, a packet heading to <code className="font-mono text-xs">192.168.1.75</code> matches all three of the following routing table rules:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-4 font-mono text-xs sm:text-sm">
            <li>Rule 1: <code className="font-semibold text-cyan-600 dark:text-cyan-400">10.0.0.0/8</code> (Default corporate aggregate)</li>
            <li>Rule 2: <code className="font-semibold text-cyan-600 dark:text-cyan-400">192.168.0.0/16</code> (Regional branch aggregate)</li>
            <li>Rule 3: <code className="font-semibold text-cyan-600 dark:text-cyan-400">192.168.1.64/26</code> (Local VLAN subnet)</li>
          </ul>
          <p>
            The <strong>Longest Prefix Match (LPM)</strong> algorithm dictates that the router <em>must always select the matching route entry with the highest prefix length N</em> (the most specific route). In this case, Rule 3 (<code className="font-mono text-xs">/26</code>) is selected over Rule 2 (<code className="font-mono text-xs">/16</code>) and Rule 1 (<code className="font-mono text-xs">/8</code>).
          </p>
          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 space-y-3 shadow-sm my-4">
            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm tracking-wide font-mono uppercase">
              TCAM Cell Architectural Mechanics
            </h4>
            <p className="text-sm">
              Standard RAM cell arrays store binary bits in two states: <strong>0</strong> or <strong>1</strong>. <strong>TCAM (Ternary CAM)</strong> hardware memory cells store bits in three possible states: <strong>0</strong>, <strong>1</strong>, or <strong>X (&quot;Don&apos;t Care&quot;)</strong>.
            </p>
            <p className="text-sm">
              When programming a CIDR prefix like <code className="font-mono text-xs">192.168.1.0/24</code> into TCAM hardware:
            </p>
            <pre className="bg-slate-900 text-slate-100 border border-slate-800 rounded-lg p-3 font-mono text-xs overflow-x-auto">
<code>{`High-Order 24 Network Bits: 11000000.10101000.00000001 (Stored as 1s and 0s)
Low-Order  8 Host Bits:    XXXXXXXX                  (Stored as Don't Care X)`}</code>
            </pre>
            <p className="text-sm">
              When an ingress IP header arrives, the switch ASIC presents the 32-bit IP vector across the entire TCAM array simultaneously. Because TCAM cells execute parallel transistor comparisons in a <strong>single clock cycle</strong> (sub-nanosecond latency), all matching prefixes hit instantly. Priority encoder hardware then selects the matching entry with the longest prefix length and forwards the packet to the corresponding egress switch port.
            </p>
          </div>
        </section>
      </article>

      <hr className="border-slate-200 dark:border-slate-800 my-12" />

      {/* ARTICLE 2 */}
      <article className="space-y-10">
        <header className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <span>Part II</span>
            <span>•</span>
            <span>Enterprise Architecture &amp; Topologies</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Enterprise VLSM Subnet Design &amp; Routing Topology Strategy
          </h2>
        </header>

        {/* Section 2.1 */}
        <section className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            1. The VLSM Paradigm: Eliminating Fixed Subnet Mask (FLSM) Waste
          </h3>
          <p>
            In Fixed-Length Subnet Masking (FLSM), an engineer partitions a network block into equal-sized subnets using a single, static prefix length applied across all segments. While administratively simple, FLSM leads to catastrophic address starvation in heterogeneous enterprise networks.
          </p>
          <p>
            Consider a typical corporate branch requiring five distinct network segments:
          </p>
          <ol className="list-decimal list-inside space-y-1 pl-4">
            <li>Engineering &amp; R&amp;D Workstations: 110 hosts</li>
            <li>Finance &amp; HR Department: 50 hosts</li>
            <li>Executive Management &amp; Legal: 25 hosts</li>
            <li>Internal Server Farm &amp; DevOps: 12 hosts</li>
            <li>Point-to-Point Router WAN Links (2 links): 2 hosts each</li>
          </ol>
          <p>
            If an engineer provisions this branch using FLSM with a fixed <code className="font-mono text-xs px-1.5 py-0.5 rounded font-semibold bg-slate-100 dark:bg-slate-800/80 text-cyan-700 dark:text-cyan-300">/25</code> mask (126 usable hosts per subnet) to accommodate the 110-host Engineering department, every single segment consumes a full 128-address block. The point-to-point WAN links (requiring only 2 host IP addresses) waste 124 IP addresses each (a 98.4% waste rate).
          </p>
          <p>
            <strong>Variable Length Subnet Masking (VLSM)</strong> (standardized in RFC 1009 and RFC 1812) solves this by enabling <em>recursive subnetting</em>. A parent CIDR address space is dynamically sub-divided into subnets with distinct prefix lengths tailored to exact host requirements.
          </p>
        </section>

        {/* Section 2.2 */}
        <section className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            2. Algorithmic Host Allocation &amp; Natural Boundary Alignment
          </h3>
          <p>
            Executing an enterprise VLSM allocation requires strict adherence to a four-step mathematical algorithm:
          </p>

          <div className="space-y-4 my-6">
            <div className="bg-slate-50 dark:bg-slate-900 border-l-4 border-cyan-500 p-4 rounded-r-xl shadow-sm">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Step 1: Descending Requirement Ordering (Crucial Rule)
              </h4>
              <p className="text-sm mt-1">
                All target subnets <strong>MUST be sorted in descending order of required host capacity</strong> (largest host count first). Allocating small subnets prior to large subnets fragments the address space, creating unalignable gaps that prevent subsequent large block allocations.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border-l-4 border-emerald-500 p-4 rounded-r-xl shadow-sm">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Step 2: Power-of-Two Capacity Exponent Derivation
              </h4>
              <p className="text-sm mt-1">
                For a host requirement <em>H</em><sub>req</sub>, calculate the minimum number of host bits <em>h</em> satisfying:
              </p>
              <div className="font-mono text-xs sm:text-sm bg-slate-900 text-slate-100 p-3 rounded-lg my-2">
                2^h - 2 &gt;= H_req  --&gt;  2^h &gt;= H_req + 2  --&gt;  CIDR Prefix P = 32 - h
              </div>
              <p className="text-sm">
                (The subtract-2 rule accounts for the reserved Network ID and Broadcast Address).
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border-l-4 border-amber-500 p-4 rounded-r-xl shadow-sm">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Step 3: Natural Boundary Integer Alignment
              </h4>
              <p className="text-sm mt-1">
                A subnet block of size <em>S</em> = 2<sup><em>h</em></sup> <strong>MUST begin on a 32-bit integer address that is an exact integer multiple of <em>S</em></strong>:
              </p>
              <div className="font-mono text-xs sm:text-sm bg-slate-900 text-slate-100 p-3 rounded-lg my-2">
                NetworkAddress_32 % S === 0
              </div>
              <p className="text-sm">
                For example, a <code className="font-mono text-xs">/26</code> block (<em>S</em> = 64) can only start at octet boundaries of <code className="font-mono text-xs">.0</code>, <code className="font-mono text-xs">.64</code>, <code className="font-mono text-xs">.128</code>, or <code className="font-mono text-xs">.192</code>. Attempting to start a /26 block at <code className="font-mono text-xs">.32</code> violates natural alignment and creates overlapping subnets.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-900 border-l-4 border-purple-500 p-4 rounded-r-xl shadow-sm">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                Step 4: Pointer Advancement &amp; Recurse for Point-to-Point WAN Links
              </h4>
              <p className="text-sm mt-1">
                Advance the allocation pointer by <em>S</em> addresses (NextPointer = CurrentNetwork + <em>S</em>) and repeat for the next sorted requirement. Point-to-point WAN links (2 hosts) are assigned <code className="font-mono text-xs">/30</code> blocks (<em>S</em> = 4, usable: 2). Loopback interfaces are assigned <code className="font-mono text-xs">/32</code> host routes.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2.3 */}
        <section className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            3. Step-by-Step Enterprise Allocation Walkthrough Scenario
          </h3>
          <p>
            Let us execute a complete, real-world VLSM allocation. We are assigned a parent IP block of <code className="font-mono text-xs px-1.5 py-0.5 rounded font-semibold bg-slate-100 dark:bg-slate-800/80 text-cyan-700 dark:text-cyan-300">10.50.0.0/24</code> (256 total addresses, spanning <code className="font-mono text-xs">10.50.0.0</code> to <code className="font-mono text-xs">10.50.0.255</code>) to provision the multi-department branch described above.
          </p>

          <div className="overflow-x-auto my-6 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            <table className="w-full text-left font-mono text-xs sm:text-sm border-collapse">
              <thead className="bg-slate-100 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-bold uppercase">
                <tr>
                  <th className="p-3">Department</th>
                  <th className="p-3">Req. Hosts</th>
                  <th className="p-3">Block Size (2<sup><em>h</em></sup>)</th>
                  <th className="p-3">Prefix</th>
                  <th className="p-3">Subnet Address</th>
                  <th className="p-3">Usable Host Range</th>
                  <th className="p-3">Broadcast</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900/40">
                <tr>
                  <td className="p-3 font-semibold text-cyan-700 dark:text-cyan-400 font-sans">1. Engineering</td>
                  <td className="p-3">110</td>
                  <td className="p-3">128 (2<sup>7</sup>)</td>
                  <td className="p-3 font-bold text-cyan-600 dark:text-cyan-400">/25</td>
                  <td className="p-3">10.50.0.0</td>
                  <td className="p-3 text-emerald-700 dark:text-emerald-400">10.50.0.1 - 10.50.0.126</td>
                  <td className="p-3 text-amber-600 dark:text-amber-400">10.50.0.127</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-cyan-700 dark:text-cyan-400 font-sans">2. Finance &amp; HR</td>
                  <td className="p-3">50</td>
                  <td className="p-3">64 (2<sup>6</sup>)</td>
                  <td className="p-3 font-bold text-cyan-600 dark:text-cyan-400">/26</td>
                  <td className="p-3">10.50.0.128</td>
                  <td className="p-3 text-emerald-700 dark:text-emerald-400">10.50.0.129 - 10.50.0.190</td>
                  <td className="p-3 text-amber-600 dark:text-amber-400">10.50.0.191</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-cyan-700 dark:text-cyan-400 font-sans">3. Executive</td>
                  <td className="p-3">25</td>
                  <td className="p-3">32 (2<sup>5</sup>)</td>
                  <td className="p-3 font-bold text-cyan-600 dark:text-cyan-400">/27</td>
                  <td className="p-3">10.50.0.192</td>
                  <td className="p-3 text-emerald-700 dark:text-emerald-400">10.50.0.193 - 10.50.0.222</td>
                  <td className="p-3 text-amber-600 dark:text-amber-400">10.50.0.223</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-cyan-700 dark:text-cyan-400 font-sans">4. DevOps/Servers</td>
                  <td className="p-3">12</td>
                  <td className="p-3">16 (2<sup>4</sup>)</td>
                  <td className="p-3 font-bold text-cyan-600 dark:text-cyan-400">/28</td>
                  <td className="p-3">10.50.0.224</td>
                  <td className="p-3 text-emerald-700 dark:text-emerald-400">10.50.0.225 - 10.50.0.238</td>
                  <td className="p-3 text-amber-600 dark:text-amber-400">10.50.0.239</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-cyan-700 dark:text-cyan-400 font-sans">5. WAN Link A</td>
                  <td className="p-3">2</td>
                  <td className="p-3">4 (2<sup>2</sup>)</td>
                  <td className="p-3 font-bold text-purple-600 dark:text-purple-400">/30</td>
                  <td className="p-3">10.50.0.240</td>
                  <td className="p-3 text-emerald-700 dark:text-emerald-400">10.50.0.241 - 10.50.0.242</td>
                  <td className="p-3 text-amber-600 dark:text-amber-400">10.50.0.243</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-cyan-700 dark:text-cyan-400 font-sans">6. WAN Link B</td>
                  <td className="p-3">2</td>
                  <td className="p-3">4 (2<sup>2</sup>)</td>
                  <td className="p-3 font-bold text-purple-600 dark:text-purple-400">/30</td>
                  <td className="p-3">10.50.0.244</td>
                  <td className="p-3 text-emerald-700 dark:text-emerald-400">10.50.0.245 - 10.50.0.246</td>
                  <td className="p-3 text-amber-600 dark:text-amber-400">10.50.0.247</td>
                </tr>
                <tr className="bg-slate-100/50 dark:bg-zinc-800/50 italic text-slate-500 dark:text-zinc-400">
                  <td className="p-3 font-sans font-bold">Unallocated Slack</td>
                  <td className="p-3">8 (Free)</td>
                  <td className="p-3">8 (2<sup>3</sup>)</td>
                  <td className="p-3 font-bold">/29</td>
                  <td className="p-3">10.50.0.248</td>
                  <td className="p-3">10.50.0.249 - 10.50.0.254</td>
                  <td className="p-3">10.50.0.255</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p>
            By applying VLSM algorithms, we successfully satisfied all department requirements, provisioned two point-to-point WAN links, and preserved a contiguous <code className="font-mono text-xs">10.50.0.248/29</code> slack block for future growth—all within a single parent <code className="font-mono text-xs">/24</code> allocation. Under FLSM, this topology would have required three full <code className="font-mono text-xs">/24</code> blocks.
          </p>
        </section>

        {/* Section 2.4 */}
        <section className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            4. Route Aggregation &amp; Summarization Strategy
          </h3>
          <p>
            Beyond address conservation, VLSM and CIDR enable <strong>Route Summarization (Supernetting)</strong>. Route summarization collapses multiple contiguous specific routing table entries into a single aggregate prefix advertisement.
          </p>
          <p>
            For example, an edge router managing four branch subnets (<code className="font-mono text-xs">172.16.0.0/24</code>, <code className="font-mono text-xs">172.16.1.0/24</code>, <code className="font-mono text-xs">172.16.2.0/24</code>, and <code className="font-mono text-xs">172.16.3.0/24</code>) can summarize all four subnets into a single prefix: <code className="font-mono text-xs px-1.5 py-0.5 rounded font-semibold bg-slate-100 dark:bg-slate-800/80 text-cyan-700 dark:text-cyan-300">172.16.0.0/22</code>.
          </p>
          <pre className="bg-slate-900 text-slate-100 border border-slate-800 rounded-xl p-5 font-mono text-xs sm:text-sm overflow-x-auto shadow-md my-4">
<code>{`Binary Breakdown of Subnet Third Octets:
  172.16.0.0/24:  10101100.00010000.000000 00.00000000
  172.16.1.0/24:  10101100.00010000.000000 01.00000000
  172.16.2.0/24:  10101100.00010000.000000 10.00000000
  172.16.3.0/24:  10101100.00010000.000000 11.00000000
                  |<--- Common 22 Bits --->|
Summarized CIDR Advertised to BGP/OSPF: 172.16.0.0/22`}</code>
          </pre>
          <p>
            Route summarization provides two critical benefits to enterprise routing stability:
          </p>
          <ol className="list-decimal list-inside space-y-2 pl-4">
            <li>
              <strong>LSDB/RIB Table Reduction:</strong> Reduces BGP global routing table memory consumption and speeds up switch ASIC hardware processing.
            </li>
            <li>
              <strong>Route Flap Dampening Isolation:</strong> If an individual internal link in <code className="font-mono text-xs">172.16.2.0/24</code> flaps (repeatedly drops and recovers), only the local router recomputes OSPF Shortest Path First (SPF). External core routers advertising the aggregate <code className="font-mono text-xs">172.16.0.0/22</code> route remain completely stable, preventing global routing instability.
            </li>
          </ol>
        </section>

        {/* Section 2.5 */}
        <section className="space-y-4">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            5. Comprehensive Subnet Prefix Quick-Reference Matrix
          </h3>
          <p>
            The reference matrix below details every CIDR prefix from <code className="font-mono text-xs">/8</code> to <code className="font-mono text-xs">/32</code>, mapping prefix lengths to dotted-decimal masks, wildcard vectors, total IP block capacities, and usable host counts.
          </p>

          <div className="overflow-x-auto my-6 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead className="bg-slate-100 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 font-bold uppercase">
                <tr>
                  <th className="p-2.5">Prefix</th>
                  <th className="p-2.5">Subnet Mask</th>
                  <th className="p-2.5">Wildcard Mask</th>
                  <th className="p-2.5">Total IPs</th>
                  <th className="p-2.5">Usable Hosts</th>
                  <th className="p-2.5">Typical Application Scope</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900/40">
                <tr>
                  <td className="p-2.5 font-bold text-cyan-600 dark:text-cyan-400">/8</td>
                  <td className="p-2.5">255.0.0.0</td>
                  <td className="p-2.5">0.255.255.255</td>
                  <td className="p-2.5">16,777,216</td>
                  <td className="p-2.5 font-semibold text-emerald-600 dark:text-emerald-400">16,777,214</td>
                  <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400">Class A / Large ISP backbone allocation</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-cyan-600 dark:text-cyan-400">/12</td>
                  <td className="p-2.5">255.240.0.0</td>
                  <td className="p-2.5">0.15.255.255</td>
                  <td className="p-2.5">1,048,576</td>
                  <td className="p-2.5 font-semibold text-emerald-600 dark:text-emerald-400">1,048,574</td>
                  <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400">Private RFC 1918 (172.16.0.0/12) / Cloud Multi-Region VPC</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-cyan-600 dark:text-cyan-400">/16</td>
                  <td className="p-2.5">255.255.0.0</td>
                  <td className="p-2.5">0.0.255.255</td>
                  <td className="p-2.5">65,536</td>
                  <td className="p-2.5 font-semibold text-emerald-600 dark:text-emerald-400">65,534</td>
                  <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400">Class B / Standard Cloud VPC (AWS/GCP/Azure)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-cyan-600 dark:text-cyan-400">/20</td>
                  <td className="p-2.5">255.255.240.0</td>
                  <td className="p-2.5">0.0.15.255</td>
                  <td className="p-2.5">4,096</td>
                  <td className="p-2.5 font-semibold text-emerald-600 dark:text-emerald-400">4,094</td>
                  <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400">Large Regional Office / Kubernetes Cluster Pod CIDR</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-cyan-600 dark:text-cyan-400">/22</td>
                  <td className="p-2.5">255.255.252.0</td>
                  <td className="p-2.5">0.0.3.255</td>
                  <td className="p-2.5">1,024</td>
                  <td className="p-2.5 font-semibold text-emerald-600 dark:text-emerald-400">1,022</td>
                  <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400">Enterprise Campus Data Center VLAN</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-cyan-600 dark:text-cyan-400">/24</td>
                  <td className="p-2.5">255.255.255.0</td>
                  <td className="p-2.5">0.0.0.255</td>
                  <td className="p-2.5">256</td>
                  <td className="p-2.5 font-semibold text-emerald-600 dark:text-emerald-400">254</td>
                  <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400">Class C / Standard LAN Subnet / Office Access Segment</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-cyan-600 dark:text-cyan-400">/25</td>
                  <td className="p-2.5">255.255.255.128</td>
                  <td className="p-2.5">0.0.0.127</td>
                  <td className="p-2.5">128</td>
                  <td className="p-2.5 font-semibold text-emerald-600 dark:text-emerald-400">126</td>
                  <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400">Medium Department VLAN (100+ hosts)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-cyan-600 dark:text-cyan-400">/26</td>
                  <td className="p-2.5">255.255.255.192</td>
                  <td className="p-2.5">0.0.0.63</td>
                  <td className="p-2.5">64</td>
                  <td className="p-2.5 font-semibold text-emerald-600 dark:text-emerald-400">62</td>
                  <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400">Standard Department Subnet (50 hosts)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-cyan-600 dark:text-cyan-400">/27</td>
                  <td className="p-2.5">255.255.255.224</td>
                  <td className="p-2.5">0.0.0.31</td>
                  <td className="p-2.5">32</td>
                  <td className="p-2.5 font-semibold text-emerald-600 dark:text-emerald-400">30</td>
                  <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400">Small Office / Management VLAN (25 hosts)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-cyan-600 dark:text-cyan-400">/28</td>
                  <td className="p-2.5">255.255.255.240</td>
                  <td className="p-2.5">0.0.0.15</td>
                  <td className="p-2.5">16</td>
                  <td className="p-2.5 font-semibold text-emerald-600 dark:text-emerald-400">14</td>
                  <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400">DMZ Server Segment / Small Infrastructure Pool</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-cyan-600 dark:text-cyan-400">/29</td>
                  <td className="p-2.5">255.255.255.248</td>
                  <td className="p-2.5">0.0.0.7</td>
                  <td className="p-2.5">8</td>
                  <td className="p-2.5 font-semibold text-emerald-600 dark:text-emerald-400">6</td>
                  <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400">HA Router Gateway Pair / Small Public IP Block</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-purple-600 dark:text-purple-400">/30</td>
                  <td className="p-2.5">255.255.255.252</td>
                  <td className="p-2.5">0.0.0.3</td>
                  <td className="p-2.5">4</td>
                  <td className="p-2.5 font-semibold text-emerald-600 dark:text-emerald-400">2</td>
                  <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400">Legacy Point-to-Point Serial WAN Links</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-purple-600 dark:text-purple-400">/31</td>
                  <td className="p-2.5">255.255.255.254</td>
                  <td className="p-2.5">0.0.0.1</td>
                  <td className="p-2.5">2</td>
                  <td className="p-2.5 font-semibold text-emerald-600 dark:text-emerald-400">2</td>
                  <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400">RFC 3021 Point-to-Point Ethernet Links (Zero Waste)</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold text-purple-600 dark:text-purple-400">/32</td>
                  <td className="p-2.5">255.255.255.255</td>
                  <td className="p-2.5">0.0.0.0</td>
                  <td className="p-2.5">1</td>
                  <td className="p-2.5 font-semibold text-emerald-600 dark:text-emerald-400">1</td>
                  <td className="p-2.5 font-sans text-slate-600 dark:text-slate-400">Single Host Route / Router Loopback Interface</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </article>
    </div>
  );
}