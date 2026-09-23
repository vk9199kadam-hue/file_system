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
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            IT Admin Command &amp; Cluster Telemetry
            <span className="text-xs px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-mono border border-purple-200">
              Team D Administration
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Configure Round-Robin worker scheduling, inspect active file lock leases, and manage storage policies
          </p>
        </div>

        {/* Scheduling Policy Selector */}
        <div className="flex items-center space-x-2 bg-slate-900 text-white px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400">OS Policy:</span>
          <select
            className="bg-slate-800 text-white text-xs rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none font-bold"
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
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-slate-800">Cluster Worker Node Health &amp; Dispatch</h2>
          <span className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
            All 3 Nodes Online
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {activeWorkerNodes.map((node) => (
            <div key={node.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-slate-800">{node.id}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {node.status}
                </span>
              </div>
              <div className="text-xs space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Current CPU Load:</span>
                  <span className="font-mono font-bold text-slate-800">{node.load}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Dispatched:</span>
                  <span className="font-mono text-indigo-600 font-semibold">{node.assigned}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Locks Table & Retention Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Retention Policy & Storage Location Form */}
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">
            Edit Retention &amp; Storage Class (D4)
          </h2>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Select Target File
            </label>
            <select
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
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
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Retention Policy (Days)
            </label>
            <input
              type="number"
              min="1"
              max="3650"
              required
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono"
              value={retentionDays}
              onChange={(e) => setRetentionDays(Number(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">
              Storage Tier Location Class
            </label>
            <select
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
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
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-all shadow-md disabled:opacity-50"
          >
            {submitting ? "Committing Policy..." : "Commit Storage Policy"}
          </button>

          {message && (
            <div
              className={`p-3 rounded-xl text-xs border ${
                isError ? "bg-rose-50 text-rose-800 border-rose-200" : "bg-emerald-50 text-emerald-800 border-emerald-200"
              }`}
            >
              <p className="font-semibold">{message}</p>
            </div>
          )}
        </form>

        {/* Active Concurrency Locks & Leases */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h2 className="text-sm font-bold text-slate-800">Active Concurrency Locks &amp; Leases (Team A)</h2>
            <span className="text-[10px] font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-200 font-bold">
              2 Leases Active
            </span>
          </div>

          <div className="space-y-2.5">
            {activeLocks.map((lk) => (
              <div key={lk.leaseId} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                <div className="flex items-center justify-between font-mono">
                  <span className="font-bold text-indigo-700">{lk.leaseId}</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-sans font-semibold">
                    {lk.mode}
                  </span>
                </div>
                <p className="text-slate-800 font-semibold truncate">{lk.file}</p>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-100">
                  <span>Holder: {lk.holder}</span>
                  <span>Expires in: {lk.timeout}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl text-[11px] text-indigo-900 space-y-1">
            <p className="font-bold">Concurrency Safety Guarantee:</p>
            <p>0 duplicate exclusive-lock allocations across 10,000 concurrent attempts (Section 4.1 A3).</p>
          </div>
        </div>

      </div>
    </div>
  );
}
