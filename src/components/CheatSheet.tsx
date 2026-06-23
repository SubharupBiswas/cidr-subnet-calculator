import { useState, useRef, useEffect, FC } from 'react';
import { BookOpen, ChevronDown } from 'lucide-react';
import { getMaskLong, longToIp } from '../utils/ipv4Utils';

interface CheatSheetProps {
  currentPrefix: number;
  onSelectPrefix: (prefix: number) => void;
}

interface SheetRow {
  prefix: number;
  mask: string;
  wildcard: string;
  hosts: number;
}

export const CheatSheet: FC<CheatSheetProps> = ({
  currentPrefix,
  onSelectPrefix,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const activeRowRef = useRef<HTMLTableRowElement | null>(null);

  // Generate cheat sheet data
  const cheatSheetData: SheetRow[] = [];
  for (let p = 1; p <= 32; p++) {
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

  // Scroll active prefix row into view inside scroll area when opened
  useEffect(() => {
    let rafId: number | null = null;
    if (isOpen && activeRowRef.current) {
      const el = activeRowRef.current;
      rafId = requestAnimationFrame(() => {
        el.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      });
    }
    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isOpen, currentPrefix]);

  const containerClasses = 'bento-card bento-card-hover p-4 md:p-5 flex flex-col gap-4';

  return (
    <div className={containerClasses}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left group focus:outline-none cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-zinc-900 dark:text-[var(--color-text-main)] tracking-tight font-mono uppercase tracking-widest">CIDR Cheat Sheet</h2>
        </div>
        <div className="p-1 rounded-md border border-zinc-200 dark:border-[var(--color-border)] bg-zinc-100 dark:bg-[var(--color-surface)] text-zinc-700 group-hover:text-zinc-800 dark:group-hover:text-zinc-300 group-hover:border-zinc-300 dark:group-hover:border-zinc-700 transition-all">
          <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-teal-800 dark:text-teal-400' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="flex flex-col gap-4 mt-2 animate-fade-in">
          <p className="text-[10px] text-zinc-700 dark:text-zinc-600 font-mono">
            Click any row to load that prefix into the calculator.
          </p>

          <div className="overflow-y-auto border border-zinc-200 dark:border-[var(--color-border)] rounded-xl bg-zinc-100/30 dark:bg-[var(--color-bg)]/40 max-h-[380px] scrollbar-none">
            <table className="w-full text-left border-collapse font-mono text-xs">
              <thead className="sticky top-0 bg-zinc-200/95 dark:bg-[var(--color-surface)] backdrop-blur-sm z-10 border-b border-zinc-200 dark:border-[var(--color-border)]">
                <tr className="text-zinc-700 dark:text-zinc-500 font-semibold tracking-wider text-[9px] uppercase font-mono">
                  <th className="py-2.5 px-4 w-16 text-center">CIDR</th>
                  <th className="py-2.5 px-4">Subnet Mask</th>
                  <th className="py-2.5 px-4">Wildcard Mask</th>
                  <th className="py-2.5 px-4 text-right">Usable Hosts</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/50">
                {cheatSheetData.map((row) => {
                  const isActive = row.prefix === currentPrefix;
                  return (
                    <tr
                      key={row.prefix}
                      ref={isActive ? activeRowRef : null}
                      onClick={() => onSelectPrefix(row.prefix)}
                      className={`cursor-pointer transition-all font-mono text-xs ${
                        isActive
                          ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-semibold'
                          : 'hover:bg-zinc-200/40 dark:hover:bg-zinc-800/40 text-zinc-700 dark:text-[var(--color-text-muted)] hover:text-zinc-900 dark:hover:text-zinc-200'
                      }`}
                    >
                      <td className={`py-2 px-4 text-center font-bold font-mono ${isActive ? 'text-cyan-700 dark:text-cyan-300' : 'text-[var(--color-text-muted)] dark:text-zinc-600'}`}>
                        /{row.prefix}
                      </td>
                      <td className="py-2.5 px-4 font-medium">{row.mask}</td>
                      <td className="py-2.5 px-4 text-zinc-700 dark:text-zinc-500">{row.wildcard}</td>
                      <td className="py-2.5 px-4 text-right font-bold pr-5">
                        {row.hosts.toLocaleString('en-US')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
