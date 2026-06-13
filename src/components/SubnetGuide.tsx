import React from 'react';
import { BookOpen, HelpCircle, GraduationCap, Server } from 'lucide-react';
import { getMaskLong, longToIp } from '../utils/ipv4Utils';

export const SubnetGuide: React.FC = () => {
  const containerClasses = "bg-white border-zinc-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:bg-[#0d0e15]/80 dark:border-white/[0.04] dark:shadow-[inset_0_1px_2px_rgba(255,255,255,0.01)] rounded-2xl p-6 md:p-8 transition-all duration-300 w-full flex flex-col gap-10";

  // Generate cheat sheet data /8 to /32
  const cheatSheetData = [];
  for (let p = 8; p <= 32; p++) {
    const maskLong = getMaskLong(p);
    const wildcardLong = ~maskLong >>> 0;
    const hostsCount = p === 32 ? 1 : p === 31 ? 2 : Math.pow(2, 32 - p) - 2;

    cheatSheetData.push({
      prefix: p,
      mask: longToIp(maskLong),
      wildcard: longToIp(wildcardLong),
      hosts: hostsCount,
    });
  }

  return (
    <div className={containerClasses}>
      <div className="flex flex-col gap-3 border-b border-zinc-100 dark:border-zinc-800/60 pb-6">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-teal-600 dark:text-teal-400" />
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">IPv4 Subnetting Guide</h2>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
          Master the fundamentals of IP addressing, subnet masking, and CIDR notation. This knowledge base serves as a technical reference for network architects and system administrators.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Markdown Content */}
        <div className="lg:col-span-7 flex flex-col gap-10 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          
          <section className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              Understanding Classless Inter-Domain Routing (CIDR)
            </h3>
            <p>
              Introduced in 1993, <strong className="text-zinc-800 dark:text-white">CIDR</strong> replaced the traditional Class A, B, and C network architecture. Prior to CIDR, routing protocols were heavily constrained by classful boundaries, forcing engineers to waste millions of IPs by allocating large Class B blocks when only a fraction were actually utilized. Instead of fixed blocks, CIDR uses a variable-length subnet masking technique, allowing for a much more granular and efficient allocation of IPv4 addresses.
            </p>
            <p>
              A CIDR notation combines an IP address with its routing prefix. For example: <code className="bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-teal-600 dark:text-teal-400 font-mono border border-zinc-200 dark:border-zinc-800">10.0.0.0/24</code>. 
            </p>
            <p>
              The <code className="font-mono text-cyan-600 dark:text-cyan-400">/24</code> suffix explicitly declares that the first 24 bits of the 32-bit IP address are strictly dedicated to the network identifier. This leaves the remaining 8 bits isolated to mathematically assign unique host endpoint addresses inside the network boundary.
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              The Mechanics of Variable Length Subnet Masking (VLSM)
            </h3>
            <p>
              <strong>VLSM</strong> is the process of subnetting an already established subnet. This powerful architectural maneuver allows network engineers to recursively divide an IP space into varying sizes, establishing intricate hierarchies without wasting IP capacity.
            </p>
            <p>
              At the core level, determining subnetwork bounds relies entirely on bitwise manipulation:
            </p>
            <ul className="list-disc pl-5 flex flex-col gap-2 mb-2">
              <li>
                <strong>Bitwise-AND:</strong> To calculate the base Network ID, the system performs a bitwise-AND operation between the host IP Address and the Subnet Mask.
              </li>
              <li>
                <strong>Bitwise-NOT & OR:</strong> To find the Broadcast Address limit, the system bitwise-inverts the Subnet Mask to create a Wildcard Mask, and then performs a bitwise-OR against the Network ID.
              </li>
            </ul>
            <p>
              For example, rather than assigning a <code className="font-mono text-teal-600 dark:text-teal-400">/24</code> block (which provides 254 hosts) to a point-to-point router link that only strictly requires 2 IPs, VLSM allows you to slice that block down dynamically to a <code className="font-mono text-teal-600 dark:text-teal-400">/30</code> or <code className="font-mono text-teal-600 dark:text-teal-400">/31</code>, perfectly tailoring the IP cost to the physical topology requirements. (Check the reference matrix for precise scale conversions).
            </p>
          </section>

          <section className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-2">
              <Server className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              Advanced IPv6 Architectural Addressing Subnetting Basics
            </h3>
            <p>
              While this tool focuses on IPv4 scaling, it's vital to recognize modern IPv6 structural mechanics. IPv6 addresses expand the available bits to a massive 128-bit space.
            </p>
            <div className="bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 mt-2 flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">/64</span>
                <span className="text-sm">The absolute standard LAN size. You should almost never subnet smaller than a /64 on a single subnet (like a /96), as it critically breaks fundamental IPv6 features like SLAAC (Stateless Address Autoconfiguration).</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">/56</span>
                <span className="text-sm">The common deployment block delegated by ISPs for small/residential edge environments. A /56 grants the end-user up to 256 standard /64 subnets to route internally.</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-mono text-xs px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">/48</span>
                <span className="text-sm">The typical enterprise or large site allocation limit. This provides a massive routing table of 65,536 /64 subnets, usually routed independently via BGP.</span>
              </div>
            </div>
          </section>

        </div>

        {/* Right Column: Cheat Sheet Matrix */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="border border-zinc-200 dark:border-zinc-800/80 rounded-xl bg-zinc-50 dark:bg-zinc-950/40 overflow-hidden flex flex-col h-[600px]">
            <div className="bg-zinc-100 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-3">
              <h4 className="font-bold text-sm text-zinc-700 dark:text-zinc-300 tracking-tight">Prefix Scaling Matrix</h4>
            </div>
            <div className="overflow-y-auto custom-scrollbar h-full">
              <table className="w-full text-left border-collapse font-mono text-xs">
                <thead className="sticky top-0 bg-zinc-50/90 dark:bg-zinc-950/90 backdrop-blur-sm z-10 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <tr className="text-zinc-500 dark:text-zinc-400 font-semibold tracking-wider text-[10px] uppercase">
                    <th className="py-2.5 px-4 text-center">CIDR</th>
                    <th className="py-2.5 px-4">Subnet Mask</th>
                    <th className="py-2.5 px-4 text-right">Hosts</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
                  {cheatSheetData.map((row) => (
                    <tr key={row.prefix} className="hover:bg-white dark:hover:bg-zinc-900/30 transition-colors">
                      <td className="py-2.5 px-4 text-center font-bold text-teal-600 dark:text-teal-400">
                        /{row.prefix}
                      </td>
                      <td className="py-2.5 px-4 text-zinc-700 dark:text-zinc-300 font-medium">
                        {row.mask}
                      </td>
                      <td className="py-2.5 px-4 text-right font-bold text-zinc-600 dark:text-zinc-400">
                        {row.hosts.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
