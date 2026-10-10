import React from "react";

export default function FreshnessBanner({ connected, isStale, lastUpdated }) {
  return (
    <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-4 py-2.5 rounded-2xl text-xs border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}></span>
          <span className="font-bold">{connected ? "BFF Socket Live Stream" : "Disconnected - Reconnecting"}</span>
        </div>

        {isStale && (
          <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/40 px-2 py-0.5 rounded-md font-mono font-bold">
            ⚠️ STALE DATA (No events &gt;10s)
          </span>
        )}
      </div>

      <div className="text-slate-500 dark:text-slate-400 font-mono text-[11px]">
        Last Sync: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "—"}
      </div>
    </div>
  );
}
