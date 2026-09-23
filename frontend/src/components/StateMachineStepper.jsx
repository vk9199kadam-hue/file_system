import React from "react";

const PRIMARY_STATES = [
  { id: "REQUESTED", label: "Requested", desc: "Backup request validated at BFF" },
  { id: "QUEUED", label: "Queued", desc: "Team A OS Scheduler enqueues job" },
  { id: "CHUNKING", label: "Chunking", desc: "Team B splits file into chunks" },
  { id: "DEDUPLICATING", label: "Deduplicating", desc: "Team B Merkle hash index check" },
  { id: "UPLOADING", label: "Uploading", desc: "Chunks uploaded to MinIO storage" },
  { id: "COMMITTED", label: "Committed", desc: "Team C DBMS commits transaction" },
  { id: "VERIFIED", label: "Verified", desc: "Merkle root SHA-256 integrity verified" },
  { id: "COMPLETED", label: "Completed", desc: "Backup complete & updated in UI" }
];

const ALTERNATIVE_STATES = [
  "REJECTED",
  "PARTIAL",
  "RETRYING",
  "RESTORED",
  "CANCELLED",
  "EXPIRED",
  "COMPENSATION_REQUIRED"
];

export default function StateMachineStepper({ currentState = "COMMITTED", activeFile = null, correlationId = "corr-live-9011" }) {
  const currentIndex = PRIMARY_STATES.findIndex((s) => s.id === currentState);
  const isAlternative = ALTERNATIVE_STATES.includes(currentState);

  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl p-6 shadow-xl space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-base font-bold text-indigo-400">⚡ State Machine Progression (Section 3.4)</span>
            <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-mono px-2 py-0.5 rounded">
              Contract Flow
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            REQUESTED → QUEUED → CHUNKING → DEDUPLICATING → UPLOADING → COMMITTED → VERIFIED → COMPLETED
          </p>
        </div>

        {activeFile && (
          <div className="text-right">
            <p className="text-xs font-semibold text-slate-300 truncate max-w-[200px]">{activeFile}</p>
            <p className="text-[10px] text-slate-500 font-mono">Trace: {correlationId}</p>
          </div>
        )}
      </div>

      {/* Stepper Progress Bar */}
      <div className="relative">
        {/* Progress Line */}
        <div className="hidden md:block absolute top-5 left-6 right-6 h-0.5 bg-slate-800 z-0">
          <div
            className="h-0.5 bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-400 transition-all duration-500"
            style={{
              width: currentIndex >= 0 ? `${(currentIndex / (PRIMARY_STATES.length - 1)) * 100}%` : "0%"
            }}
          ></div>
        </div>

        {/* Stepper Nodes Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3 relative z-10">
          {PRIMARY_STATES.map((st, idx) => {
            const isDone = currentIndex > idx;
            const isCurrent = currentState === st.id;
            const isPending = currentIndex < idx && !isDone;

            return (
              <div
                key={st.id}
                className={`flex flex-col items-center text-center p-2 rounded-xl border transition-all ${
                  isCurrent
                    ? "bg-indigo-600/30 border-indigo-400 shadow-lg shadow-indigo-500/20 scale-105"
                    : isDone
                    ? "bg-slate-800/60 border-emerald-500/40 text-slate-200"
                    : "bg-slate-900/50 border-slate-800/80 opacity-50 text-slate-500"
                }`}
              >
                {/* Node Circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all mb-1.5 ${
                    isDone
                      ? "bg-emerald-500 text-slate-950 font-extrabold"
                      : isCurrent
                      ? "bg-indigo-500 text-white animate-pulse ring-4 ring-indigo-500/30"
                      : "bg-slate-800 text-slate-500"
                  }`}
                >
                  {isDone ? "✓" : idx + 1}
                </div>

                {/* State Label */}
                <p className={`text-[11px] font-bold tracking-wide uppercase ${isCurrent ? "text-indigo-300" : isDone ? "text-emerald-400" : "text-slate-400"}`}>
                  {st.label}
                </p>

                {/* Micro Description */}
                <p className="text-[9px] text-slate-500 line-clamp-2 mt-0.5 font-sans leading-tight">
                  {st.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alternative Outcomes Banner */}
      {isAlternative && (
        <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center justify-between">
          <span className="font-semibold">⚠️ Alternative State Transition: {currentState}</span>
          <span className="text-[10px] font-mono">Recorded by Team C</span>
        </div>
      )}
    </div>
  );
}
