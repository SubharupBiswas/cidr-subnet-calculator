'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs: { q: string; a: string }[] = [
  {
    q: 'How does this CIDR Subnet Calculator execute calculations?',
    a: 'Every calculation on this platform is performed entirely within your browser using local JavaScript. When you enter an IP address and a prefix length, the calculator parses each dotted-decimal octet into its 8-bit binary representation and assembles the full 32-bit address integer. A subnet mask is then constructed by setting the most-significant N bits — where N equals the CIDR prefix length — to 1 and the remaining (32 − N) bits to 0. A bitwise AND operation between the IP address integer and the mask integer yields the network address. The broadcast address is derived by OR-ing the network address with the bitwise complement of the mask. Usable host addresses span from network-address-plus-one to broadcast-minus-one. The host count is computed as 2^(32 − prefix) − 2. All of these operations execute synchronously in under one millisecond, with no server round-trip or network request of any kind.',
  },
  {
    q: 'What is the practical difference between a subnet mask and a CIDR prefix?',
    a: 'A subnet mask and a CIDR prefix encode precisely the same information but in different notational formats. A traditional subnet mask is a 32-bit value expressed in dotted-decimal notation — for example, 255.255.255.0. It always consists of a contiguous block of binary 1-bits starting from the leftmost position, followed by a contiguous block of 0-bits. The 1-bits mark the network portion of an address, and the 0-bits mark the host portion. A CIDR prefix — also called slash notation — simply counts those leading 1-bits and expresses them as a single integer after a forward slash: /24. The two forms are interchangeable. 255.255.255.0 is exactly equivalent to /24. 255.255.0.0 is exactly equivalent to /16. The CIDR prefix format is generally preferred in modern documentation and configuration because it is more compact, less error-prone to type, and immediately communicates the size of the address space: a /24 block contains 254 usable hosts, a /25 block contains 126, and so on, halving with every additional prefix bit.',
  },
  {
    q: 'How does the VLSM Planner maximise IP address allocation efficiency?',
    a: 'The Variable Length Subnet Masking (VLSM) Planner implements the canonical engineering procedure for optimal IP space utilisation. First, it accepts a parent network block and a list of required subnet sizes — one for each network segment you need to provision. It then sorts those requirements in descending order by host count, ensuring that the largest segments are allocated from the beginning of the address space before smaller segments are carved out. For each segment, the planner selects the minimal prefix length whose host capacity meets or exceeds the required count: it finds the smallest power of 2 greater than (required hosts + 2), computes log₂ of that value, and subtracts it from 32. Each successive subnet is placed immediately after the previous allocation, aligned to its natural boundary. Point-to-point WAN links are assigned /30 blocks (4 total addresses, 2 usable), and loopbacks or host routes receive /32 blocks. This strictly ordered, boundary-aligned allocation strategy prevents address fragmentation, eliminates wasted ranges, and guarantees that the resulting plan fits entirely within the parent block without overlap.',
  },
  {
    q: 'What ranges are allocated for private networks under RFC 1918?',
    a: 'RFC 1918, published in 1996, defines three non-routable address blocks reserved exclusively for use within private networks. They are 10.0.0.0/8, which provides 16,777,216 addresses and is commonly used by large enterprises, cloud VPCs, and data centres; 172.16.0.0/12, which covers the range 172.16.0.0 through 172.31.255.255 and provides 1,048,576 addresses, often used by mid-size corporate networks; and 192.168.0.0/16, which provides 65,536 addresses and is the ubiquitous choice for small-office and home-office networks, consumer routers, and most residential broadband equipment. Routers on the public internet are configured to drop packets destined for any of these three ranges, preventing private addresses from leaking into global routing tables. Network Address Translation (NAT) devices, typically a home router or an enterprise firewall, map many private addresses to one or more public IPs to provide internet access to private hosts. These RFC 1918 spaces are critical resources for subnetting exercises, cloud VPC design, lab environments, and any scenario where globally unique addressing is not required.',
  },
  {
    q: "Why can't the first and last addresses of a subnet block be assigned to hosts?",
    a: "Every subnet block contains two reserved addresses that cannot be assigned to individual host devices. The first address — where every bit in the host portion of the address is set to binary 0 — is the network identifier, also called the network address or subnet address. It represents the subnet itself in routing table entries and is used by protocols to identify the network as a whole, not any individual host within it. For the subnet 192.168.1.0/24, the network address is 192.168.1.0. The last address — where every bit in the host portion is set to binary 1 — is the directed broadcast address. When a device sends a packet to the broadcast address, every host within that subnet receives and processes the packet. This mechanism is used by protocols such as DHCP discovery and ARP. For 192.168.1.0/24, the broadcast address is 192.168.1.255. Assigning either of these addresses to a host would cause severe network malfunction: a host holding the network address would conflict with routing table entries, and a host holding the broadcast address would receive every broadcast packet sent to the subnet. Consequently, the usable host range for any /N subnet is always 2^(32−N) − 2 addresses.",
  },
];

export default function SubnetFaqs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(prev => (prev === i ? null : i));

  return (
    <section aria-label="Subnet Calculator Frequently Asked Questions" className="w-full">
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-8 text-center">
        Frequently Asked Questions
      </h2>

      <dl className="space-y-3">
        {faqs.map(({ q, a }, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="border border-zinc-200/80 dark:border-zinc-800 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/40 shadow-sm transition-colors duration-200"
            >
              <dt>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-inset cursor-pointer"
                >
                  <span className="text-sm sm:text-base font-semibold text-zinc-800 dark:text-zinc-200 leading-snug transition-colors duration-200">
                    {q}
                  </span>
                  <ChevronDown
                    className={`flex-shrink-0 w-5 h-5 text-zinc-400 dark:text-zinc-500 transition-transform duration-300 ${isOpen ? 'rotate-180 text-cyan-600 dark:text-cyan-400' : ''}`}
                    aria-hidden="true"
                  />
                </button>
              </dt>
              <dd
                className={`grid transition-all duration-300 ease-in-out ${
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                }`}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300 border-t border-zinc-100 dark:border-zinc-800/80 pt-4">
                    {a}
                  </p>
                </div>
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}