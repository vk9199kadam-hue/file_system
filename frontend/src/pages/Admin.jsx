import React, { useState } from "react";
import { useFiles } from "../hooks/useFiles.js";

export default function Admin() {
  const { files, updatePolicy } = useFiles();

  const [selectedFileId, setSelectedFileId] = useState("f1");
  const [retentionDays, setRetentionDays] = useState(90);
  const [storageClass, setStorageClass] = useState("HOT_STORAGE");
  const [schedulingPolicy, setSchedulingPolicy] = useState("ROUND_ROBIN");
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    setIsError(false);
    try {
      const res = await updatePolicy(selectedFileId, retentionDays, storageClass);
      setMessage(`[D4 Policy Committed] File '${selectedFileId}' updated -> Retention: ${res.retention_days} days, Storage Tier: ${res.storage_class}`);
    } catch (err) {
      setIsError(true);
      setMessage(`[D4 Error Feedback] ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const activeWorkerNodes = [
    { id: "Worker-Alpha (Node 1)", status: "ACTIVE", load: "34%", assigned: "14 chunks", policy: schedulingPolicy },
    { id: "Worker-Beta (Node 2)", status: "ACTIVE", load: "58%", assigned: "13 chunks", policy: schedulingPolicy },
    { id: "Worker-Gamma (Node 3)", status: "IDLE", load: "12%", assigned: "12 chunks", policy: schedulingPolicy }
  ];

  const activeLocks = [
    { leaseId: "lease-x99-4012", file: "apnileap_financial_ledger_2026.pdf", holder: "Worker-Alpha", timeout: "45s", mode: "EXCLUSIVE_WRITE" },
    { leaseId: "lease-x99-8821", file: "apnileap_production_db_dump.sql", holder: "Worker-Beta", timeout: "120s", mode: "SHARED_READ" }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            IT Admin Command &amp; Cluster Telemetry
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300 font-mono border border-purple-200 dark:border-purple-500/30 font-bold">
              Team D Administration
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure Round-Robin worker scheduling, inspect active file lock leases, and manage storage policies
          </p>
        </div>

        {/* Scheduling Policy Selector */}
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs shadow-sm transition-colors">
          <span className="text-slate-500 dark:text-slate-400 font-bold">OS Policy:</span>
          <select
            className="bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-xl px-2.5 py-1 border border-slate-200 dark:border-slate-700 focus:outline-none font-bold cursor-pointer"
            value={schedulingPolicy}
            onChange={(e) => setSchedulingPolicy(e.target.value)}
          >
            <option value="ROUND_ROBIN">Round-Robin (OS Balanced)</option>
            <option value="PRIORITY_QUEUE">Priority Preemptive Queue</option>
            <option value="SHORTEST_JOB_FIRST">Shortest Job First (SJF)</option>
          </select>
        </div>
      </div>

      {/* Cluster Nodes & Worker Load */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-3 transition-colors">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white">Cluster Worker Node Health &amp; Dispatch</h2>
          <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/30 font-bold">
            All 3 Nodes Online
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {activeWorkerNodes.map((node) => (
            <div key={node.id} className="p-4 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl space-y-2 transition-colors">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{node.id}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                  {node.status}
                </span>
              </div>
              <div className="text-xs space-y-1 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Current CPU Load:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{node.load}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Dispatched:</span>
                  <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{node.assigned}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Locks Table & Retention Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Retention Policy & Storage Location Form */}
        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 transition-colors">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5">
            Edit Retention &amp; Storage Class (D4)
          </h2>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Select Target File
            </label>
            <select
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono cursor-pointer"
              value={selectedFileId}
              onChange={(e) => setSelectedFileId(e.target.value)}
            >
              {files.map((f) => (
                <option key={f.file_id} value={f.file_id}>
                  {f.name} ({f.file_id})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Retention Policy (Days)
            </label>
            <input
              type="number"
              min="1"
              max="3650"
              required
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
              value={retentionDays}
              onChange={(e) => setRetentionDays(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Storage Tier Location Class
            </label>
            <select
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3.5 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
              value={storageClass}
              onChange={(e) => setStorageClass(e.target.value)}
            >
              <option value="HOT_STORAGE">HOT_STORAGE (Frequent Read Access / SSD)</option>
              <option value="STANDARD">STANDARD (NVMe Production Tier)</option>
              <option value="COLD_STORAGE">COLD_STORAGE (MinIO Glacier Archival)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Committing Policy..." : "Commit Storage Policy"}
          </button>

          {message && (
            <div
              className={`p-3.5 rounded-xl text-xs border transition-colors ${
                isError 
                  ? "bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-200 border-rose-200 dark:border-rose-800" 
                  : "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800"
              }`}
            >
              <p className="font-semibold">{message}</p>
            </div>
          )}
        </form>

        {/* Active Concurrency Locks & Leases */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Active Concurrency Locks &amp; Leases (Team A)</h2>
            <span className="text-[10px] font-mono text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/15 px-2.5 py-0.5 rounded-md border border-purple-200 dark:border-purple-500/30 font-bold">
              2 Leases Active
            </span>
          </div>

          <div className="space-y-2.5">
            {activeLocks.map((lk) => (
              <div key={lk.leaseId} className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-xl text-xs space-y-1 transition-colors">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-blue-600 dark:text-blue-400">{lk.leaseId}</span>
                  <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded font-sans font-semibold">
                    {lk.mode}
                  </span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 font-bold truncate">{lk.file}</p>
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>Holder: {lk.holder}</span>
                  <span>Expires in: {lk.timeout}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3.5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-xl text-[11px] text-blue-900 dark:text-blue-200 space-y-1 transition-colors">
            <p className="font-bold">Concurrency Safety Guarantee:</p>
            <p>0 duplicate exclusive-lock allocations across 10,000 concurrent attempts (Section 4.1 A3).</p>
          </div>
        </div>

      </div>
    </div>
  );
}
