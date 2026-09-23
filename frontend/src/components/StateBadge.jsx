import React from "react";

const STATE_COLORS = {
  REQUESTED: "bg-blue-100 text-blue-800 border-blue-200",
  QUEUED: "bg-amber-100 text-amber-800 border-amber-200",
  CHUNKING: "bg-indigo-100 text-indigo-800 border-indigo-200",
  DEDUPLICATING: "bg-purple-100 text-purple-800 border-purple-200",
  UPLOADING: "bg-cyan-100 text-cyan-800 border-cyan-200",
  COMMITTED: "bg-emerald-100 text-emerald-800 border-emerald-200",
  VERIFIED: "bg-teal-100 text-teal-800 border-teal-200",
  COMPLETED: "bg-green-100 text-green-800 border-green-200",
  REJECTED: "bg-red-100 text-red-800 border-red-200",
  PARTIAL: "bg-yellow-100 text-yellow-800 border-yellow-200",
  RETRYING: "bg-orange-100 text-orange-800 border-orange-200",
  RESTORED: "bg-indigo-100 text-indigo-800 border-indigo-200",
  CANCELLED: "bg-gray-100 text-gray-800 border-gray-200"
};

export default function StateBadge({ state }) {
  const colorClass = STATE_COLORS[state] || "bg-slate-100 text-slate-700 border-slate-200";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClass}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
      {state}
    </span>
  );
}
