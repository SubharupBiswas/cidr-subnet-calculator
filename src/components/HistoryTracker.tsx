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
    <div className="bento-card bento-card-hover p-5 flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-2.5">
          <History className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-bold text-zinc-100 tracking-tight font-mono uppercase tracking-widest">Recent Calculations</h2>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-[9px] font-mono font-bold tracking-wider uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-1 rounded-md hover:bg-rose-500/20 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <History className="w-7 h-7 text-zinc-700 mb-2" />
          <p className="text-xs text-zinc-500 font-mono">No history yet</p>
          <p className="text-[10px] text-zinc-600 font-mono mt-1">Valid calculations appear here automatically.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5 max-h-[280px] overflow-y-auto scrollbar-none">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 px-2 rounded-lg border border-zinc-800/60 hover:bg-zinc-800/40 hover:border-zinc-700/60 transition-all group"
            >
              <button
                onClick={() => onLoadHistory(item.ip, item.prefix)}
                className="flex-1 flex flex-col text-left cursor-pointer"
              >
                <span className="font-mono text-sm font-bold text-zinc-300 group-hover:text-cyan-400 transition-colors flex items-center gap-2">
                  <span className="text-zinc-700 font-normal select-none text-xs">$_</span>
                  {item.ip}/{item.prefix}
                </span>
                <span className="text-[10px] text-zinc-600 font-mono mt-0.5 ml-5 flex items-center gap-1">
                  <CornerDownRight className="w-2.5 h-2.5 text-zinc-700" />
                  Net: {item.network}
                </span>
              </button>
              <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onLoadHistory(item.ip, item.prefix)}
                  className="p-1.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                  title="Reload" aria-label={`Reload ${item.ip}/${item.prefix}`}
                >
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onDeleteHistoryItem(item.id)}
                  className="p-1.5 rounded-md bg-zinc-800 border border-zinc-700 text-zinc-500 hover:text-rose-400 hover:border-rose-500/30 transition-all"
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
