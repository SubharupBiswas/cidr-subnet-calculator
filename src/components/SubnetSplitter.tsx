import { useState, useEffect, FC } from 'react';
import { Columns, ArrowRight, CornerDownRight } from 'lucide-react';
import { SubnetResult, ipToLong, longToIp } from '../utils/ipv4Utils';

interface SubnetSplitterProps {
  result: SubnetResult | null;
  onLoadSubnet: (ip: string, prefix: number) => void;
}

export const SubnetSplitter: FC<SubnetSplitterProps> = ({
  result,
  onLoadSubnet,
}) => {
  const currentPrefix = result?.prefix ?? 24;
  const networkAddress = result?.networkAddress ?? '192.168.1.0';
  const networkLong = ipToLong(networkAddress);

  const [targetPrefix, setTargetPrefix] = useState<number>(currentPrefix + 1);

  // Keep target prefix valid if current prefix changes
  useEffect(() => {
    if (targetPrefix <= currentPrefix) {
      setTargetPrefix(Math.min(currentPrefix + 1, 32));
    }
  }, [currentPrefix, targetPrefix]);

  if (currentPrefix >= 32) {
    return null; // Cannot split a /32 single host network
  }

  const numSubnets = Math.pow(2, targetPrefix - currentPrefix);
  const stepSize = Math.pow(2, 32 - targetPrefix);
  const displayLimit = 64;
  const isCapped = numSubnets > displayLimit;

  const subnetsList = [];
  const limit = Math.min(numSubnets, displayLimit);

  for (let i = 0; i < limit; i++) {
    const subnetNetworkLong = (networkLong + i * stepSize) >>> 0;
    const subnetBroadcastLong = (subnetNetworkLong + stepSize - 1) >>> 0;

    let usableRange = '';
    let totalHosts = 0;

    if (targetPrefix === 32) {
      usableRange = longToIp(subnetNetworkLong);
      totalHosts = 1;
    } else if (targetPrefix === 31) {
      usableRange = `${longToIp(subnetNetworkLong)} - ${longToIp(subnetBroadcastLong)}`;
      totalHosts = 2;
    } else {
      usableRange = `${longToIp(subnetNetworkLong + 1)} - ${longToIp(subnetBroadcastLong - 1)}`;
      totalHosts = stepSize - 2;
    }

    subnetsList.push({
      network: `${longToIp(subnetNetworkLong)}/${targetPrefix}`,
      networkIp: longToIp(subnetNetworkLong),
      broadcast: longToIp(subnetBroadcastLong),
      range: usableRange,
      hosts: totalHosts,
    });
  }

  const containerClasses = 'bento-card bento-card-hover p-4 md:p-5 flex flex-col gap-6 w-full max-w-full block';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-200 dark:border-[var(--color-border)] pb-4">
        <div className="flex items-center gap-3">
          <Columns className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-zinc-900 dark:text-[var(--color-text-main)] font-mono uppercase tracking-widest">Subnet Splitter</h2>
        </div>
        
        {/* Split Target Controls */}
        <div className="flex items-center gap-3 bg-[var(--color-inner-surface)] border border-[var(--color-border)] rounded-xl px-3 py-1.5 self-start md:self-auto hover:border-[var(--color-accent)] transition-colors">
          <span className="text-[10px] font-semibold tracking-wider text-[var(--color-text-muted)] uppercase">Split into</span>
          <select
            value={targetPrefix}
            onChange={(e) => setTargetPrefix(parseInt(e.target.value, 10))}
            className="bg-transparent text-cyan-600 dark:text-cyan-400 font-mono font-bold text-sm focus:outline-none cursor-pointer"
          >
            {Array.from({ length: 32 - currentPrefix }, (_, idx) => {
              const prefixVal = currentPrefix + 1 + idx;
              const subCount = Math.pow(2, prefixVal - currentPrefix);
              return (
                 <option key={prefixVal} value={prefixVal} className="bg-white dark:bg-[var(--color-surface)] text-zinc-800 dark:text-zinc-300">
                  /{prefixVal} ({subCount.toLocaleString('en-US')} subnets)
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
            Splitting <span className="font-mono text-[var(--color-text-main)] font-bold">{networkAddress}/{currentPrefix}</span> into <strong className="text-teal-600 dark:text-teal-400 font-semibold">{numSubnets.toLocaleString('en-US')}</strong> subnetworks of size <span className="font-mono text-[var(--color-text-main)]">/{targetPrefix}</span>.
          </p>
          <p className="text-xs text-zinc-500 dark:text-[var(--color-text-muted)] leading-relaxed">
            Each subnet provides <strong className="text-zinc-700 dark:text-zinc-300 font-semibold">{targetPrefix >= 31 ? stepSize : stepSize - 2}</strong> usable IP addresses.
          </p>
        </div>

        {/* Scrollable Subnets Table (No text truncation) */}
        <div className="w-full overflow-x-auto bg-[var(--color-surface)] border border-zinc-200/60 dark:border-zinc-800/60 rounded-2xl p-6 shadow-sm">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="bg-zinc-200/50 dark:bg-[var(--color-surface)] border-b border-zinc-200 dark:border-[var(--color-border)] text-zinc-500 dark:text-[var(--color-text-muted)] font-semibold tracking-wider text-[9px] uppercase font-mono">
                <th className="py-3 px-4 w-12 text-center">No.</th>
                <th className="py-3 px-4">Network Address</th>
                <th className="py-3 px-4">Usable Host Range</th>
                <th className="py-3 px-4">Broadcast</th>
                <th className="py-3 px-4 text-right">Hosts</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/40">
              {subnetsList.map((sub, idx) => (
              <tr key={idx} className="hover:bg-[var(--color-inner-surface)] dark:hover:bg-zinc-800/30 transition-colors text-[var(--color-text-main)] dark:text-zinc-300 group">
                  <td className="py-3 px-4 text-[var(--color-text-muted)] text-center font-semibold">{idx + 1}</td>
                  {/* Network Address - Cyan */}
                  <td className="py-3 px-4 text-cyan-600 dark:text-cyan-400 font-semibold">{sub.network}</td>
                  {/* Usable Range - Emerald */}
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 break-words min-w-[200px]">{sub.range}</td>
                  {/* Broadcast - Amber */}
                  <td className="py-3 px-4 text-amber-600 dark:text-amber-400">{sub.broadcast}</td>
                  
                  <td className="py-3 px-4 text-right text-zinc-700 dark:text-[var(--color-text-muted)] font-bold">{sub.hosts.toLocaleString('en-US')}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => onLoadSubnet(sub.networkIp, targetPrefix)}
                      className="p-1.5 text-[var(--color-text-muted)] dark:text-zinc-500 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-500/10 rounded-md transition-colors inline-flex items-center justify-center cursor-pointer"
                      title="Load Subnet"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isCapped && (
          <div className="flex items-center gap-2 text-xs text-[var(--color-text-muted)] bg-[var(--color-inner-surface)] border border-[var(--color-border)] rounded-xl p-3">
            <CornerDownRight className="w-3.5 h-3.5 text-teal-500/60 shrink-0" />
            <span>
              Showing the first <strong>{displayLimit}</strong> subnets of <strong>{numSubnets.toLocaleString('en-US')}</strong>.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
