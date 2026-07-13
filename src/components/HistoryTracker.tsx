import { FC } from 'react';
import { History, Trash2, ArrowRight, CornerDownRight } from 'lucide-react';

export interface HistoryItem {
  id: string;
  ip: string;
  prefix: number;
  network: string;
  timestamp: number;
}

interface HistoryTrackerProps {
  history: HistoryItem[];
  onLoadHistory: (ip: string, prefix: number) => void;
  onDeleteHistoryItem: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryTracker: FC<HistoryTrackerProps> = ({
  history,
  onLoadHistory,
  onDeleteHistoryItem,
  onClearHistory,
}) => {

  return (
    <div className="bento-card bento-card-hover p-4 md:p-5 flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-zinc-200 dark:border-[var(--color-border)] pb-4">
        <div className="flex items-center gap-2.5">
          <History className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-zinc-900 dark:text-[var(--color-text-main)] tracking-tight font-mono uppercase tracking-widest">Recent Calculations</h2>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            aria-label="Clear all calculation history"
            className="text-[9px] font-mono font-bold tracking-wider uppercase bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/20 px-2 py-1 rounded-md hover:bg-rose-500/20 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <History className="w-7 h-7 text-[var(--color-text-muted)] dark:text-zinc-700 mb-2" />
          <p className="text-xs text-zinc-700 dark:text-[var(--color-text-muted)] font-mono">No history yet</p>
          <p className="text-[10px] text-zinc-700 dark:text-zinc-600 font-mono mt-1">Valid calculations appear here automatically.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5 max-h-[280px] overflow-y-auto scrollbar-none">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 px-2 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-inner-surface-hover)] hover:border-[var(--color-accent)] transition-all group"
            >
              <button
                onClick={() => onLoadHistory(item.ip, item.prefix)}
                className="flex-1 flex flex-col text-left cursor-pointer"
                aria-label={`Load calculation history entry for ${item.ip}/${item.prefix}`}
              >
                <span className="font-mono text-sm font-bold text-[var(--color-text-main)] dark:text-zinc-300 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <span className="text-[var(--color-text-muted)] dark:text-zinc-700 font-normal select-none text-xs">$_</span>
                  {item.ip}/{item.prefix}
                </span>
                <span className="text-[10px] text-zinc-700 dark:text-zinc-600 font-mono mt-0.5 ml-5 flex items-center gap-1">
                  <CornerDownRight className="w-2.5 h-2.5 text-[var(--color-text-muted)] dark:text-zinc-700" />
                  Net: {item.network}
                </span>
              </button>
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onLoadHistory(item.ip, item.prefix)}
                  className="p-1.5 rounded-md bg-[var(--color-inner-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-cyan-700 dark:hover:text-cyan-300 hover:bg-[var(--color-inner-surface-hover)] hover:border-[var(--color-accent)] dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:border-cyan-500/30 transition-all"
                  title="Reload" aria-label={`Reload ${item.ip}/${item.prefix}`}
                >
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onDeleteHistoryItem(item.id)}
                  className="p-1.5 rounded-md bg-[var(--color-inner-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 dark:bg-zinc-800 dark:border-zinc-700 dark:hover:bg-zinc-700 dark:hover:border-rose-500/30 transition-all"
                  title="Delete" aria-label={`Delete ${item.ip}/${item.prefix}`}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
