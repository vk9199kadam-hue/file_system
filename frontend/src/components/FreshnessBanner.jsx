import React from "react";

export default function FreshnessBanner({ connected, isStale, lastUpdated }) {
  return (
    <div className="flex items-center justify-between bg-slate-900 text-slate-100 px-4 py-2 rounded-xl text-xs shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1.5">
          <span className={`w-2 h-2 rounded-full ${connected ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`}></span>
          <span className="font-medium">{connected ? "BFF Socket Live Stream" : "Disconnected - Reconnecting"}</span>
        </div>

        {isStale && (
          <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded font-mono">
            ⚠️ STALE DATA (No events &gt;10s)
          </span>
        )}
      </div>

      <div className="text-slate-400 font-mono">
        Last Sync: {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "—"}
      </div>
    </div>
  );
}
