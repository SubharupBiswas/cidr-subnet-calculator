import React from 'react';
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

export const HistoryTracker: React.FC<HistoryTrackerProps> = ({
  history,
  onLoadHistory,
  onDeleteHistoryItem,
  onClearHistory,
}) => {
  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <History className="w-5 h-5 text-cyan-400" />
          <h2 className="text-xl font-bold text-zinc-100 tracking-tight">Recent Calculations</h2>
        </div>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="text-[10px] font-sans font-bold tracking-wider uppercase bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1.5 rounded-lg hover:bg-red-500/20 transition-all flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3 h-3" />
            Clear All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <History className="w-8 h-8 text-zinc-700 mb-2.5" />
          <p className="text-sm text-zinc-500 font-medium">No calculation history yet</p>
          <p className="text-xs text-zinc-650 mt-1 max-w-[200px]">
            Valid calculations will automatically appear here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto pr-1">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between bg-zinc-950/40 border border-zinc-900 hover:border-zinc-800 rounded-xl p-3.5 transition-all group"
            >
              <button
                onClick={() => onLoadHistory(item.ip, item.prefix)}
                className="flex-1 flex flex-col text-left cursor-pointer"
              >
                <span className="font-mono text-sm font-bold text-zinc-200 group-hover:text-cyan-400 transition-colors">
                  {item.ip}/{item.prefix}
                </span>
                <span className="text-[11px] text-zinc-500 font-mono mt-0.5 flex items-center gap-1">
                  <CornerDownRight className="w-2.5 h-2.5 text-zinc-650" />
                  Net: {item.network}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onLoadHistory(item.ip, item.prefix)}
                  className="p-1.5 rounded-lg hover:bg-zinc-800 text-zinc-500 hover:text-cyan-400 border border-transparent transition-all opacity-0 group-hover:opacity-100"
                  title="Reload calculation"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteHistoryItem(item.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-zinc-500 hover:text-red-400 border border-transparent transition-all opacity-0 group-hover:opacity-100"
                  title="Delete calculation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
