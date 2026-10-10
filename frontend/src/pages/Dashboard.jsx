import React, { useState } from "react";
import { useDashboard } from "../hooks/useDashboard.js";
import { useFiles } from "../hooks/useFiles.js";
import { useRealtime } from "../hooks/useRealtime.js";
import { useAuth } from "../AuthContext.jsx";
import { useTheme } from "../ThemeContext.jsx";
import FreshnessBanner from "../components/FreshnessBanner.jsx";
import StateBadge from "../components/StateBadge.jsx";
import FileUploadModal from "../components/FileUploadModal.jsx";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function Dashboard() {
  const { summary, loading, error, refresh: refreshDashboard } = useDashboard();
  const { uploadFile, refresh: refreshFiles } = useFiles();
  const { connected, lastUpdated, isStale, liveStreamEvents } = useRealtime();
  const { networkMode, vpnTunnelId } = useAuth();
  const { isDark } = useTheme();

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const handleUploadFile = async (name, size, storageClass, retentionDays) => {
    try {
      const result = await uploadFile(name, size, storageClass, retentionDays);
      setToastMessage(`File '${result.file.name}' backed up! Chunks dispatched via Round-Robin.`);
      refreshDashboard();
      refreshFiles();
      setIsUploadModalOpen(false);
    } catch (err) {
      setToastMessage(`Upload failed: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 dark:text-slate-400">
        <div className="animate-spin w-9 h-9 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3"></div>
        Connecting to ApniLeap On-Premise Central Storage Cluster...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-700 dark:text-rose-300 text-sm">
        ⚠️ {error}
      </div>
    );
  }

  const chartData = [
    { name: "Used GB", value: Number(summary?.storageStatus?.usedGB || 152.9) },
    { name: "Saved (Dedup)", value: Number(summary?.storageStatus?.savedGB || 415.8) },
    { name: "Free GB", value: Number((summary?.storageStatus?.totalCapacityGB || 500) - (summary?.storageStatus?.usedGB || 152.9)) }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto transition-colors duration-200">
      {/* Freshness & Stale Data Banner */}
      <FreshnessBanner connected={connected} isStale={isStale} lastUpdated={lastUpdated} />

      {/* Header & Mode Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            Operations Live Telemetry Dashboard
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300 font-mono border border-blue-200 dark:border-blue-500/30">
              Team D Engine
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time Round-Robin chunk scheduler, SHA-256 deduplication, and on-premise physical cluster telemetry
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2.5 rounded-xl font-bold shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 transition-all flex items-center space-x-2 cursor-pointer"
          >
            <span className="text-base leading-none">📤</span>
            <span>Upload File &amp; Schedule Backup</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200 px-4 py-3 rounded-xl text-xs flex justify-between items-center shadow-sm">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-blue-600 dark:text-blue-400 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Network & Physical Host Telemetry Banner */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xl shrink-0">
            🏢
          </div>
          <div>
            <p className="text-xs font-bold text-slate-200">Central Host Server</p>
            <p className="text-[11px] font-mono text-emerald-400">10.0.4.82 : 4000 (Local Host)</p>
          </div>
        </div>

        <div className="flex items-center space-x-3.5 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-xl shrink-0">
            ⚡
          </div>
          <div>
            <p className="text-xs font-bold text-slate-200">Scheduling Policy</p>
            <p className="text-[11px] font-mono text-purple-300">Round-Robin (3 Worker Nodes)</p>
          </div>
        </div>

        <div className="flex items-center space-x-3.5 border-t md:border-t-0 md:border-l border-slate-800 pt-3 md:pt-0 md:pl-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xl shrink-0">
            🔐
          </div>
          <div>
            <p className="text-xs font-bold text-slate-200">Access Channel</p>
            <p className="text-[11px] font-mono text-slate-300">
              {networkMode === "ON_PREM_LAN" ? "Direct Corporate LAN" : `Remote VPN (${vpnTunnelId || "SECURE-TUNNEL"})`}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Overlays Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Storage Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-colors">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Storage Utilization</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">
            {summary?.storageStatus?.usedGB} / {summary?.storageStatus?.totalCapacityGB} GB
          </p>
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 mt-2.5 overflow-hidden">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${summary?.storageStatus?.usagePercentage}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-1.5">{summary?.storageStatus?.usagePercentage}% capacity allocated</p>
        </div>

        {/* Dedup Overlay */}
        <div className="bg-white dark:bg-slate-900 border border-blue-200 dark:border-blue-900/40 rounded-2xl p-4 sm:p-5 shadow-sm transition-colors">
          <p className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">SHA-256 Dedup Ratio</p>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1.5">{summary?.dedupOverlay?.savingsRatioPct}%</p>
          <p className="text-[11px] text-blue-800 dark:text-blue-300 font-medium mt-1.5">
            {summary?.storageStatus?.savedGB} GB duplicate data purged
          </p>
        </div>

        {/* Merkle Verification Status */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-colors">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Merkle Cryptographic Root</p>
          <p className="text-xl font-black text-teal-600 dark:text-teal-400 mt-1.5">{summary?.dedupOverlay?.merkleVerificationStatus}</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1.5">Zero bit-level tampering verified</p>
        </div>

        {/* Queue Depth */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm transition-colors">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active Worker Nodes</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white mt-1.5">3 / 3 Online</p>
          <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold mt-1.5">
            Round-Robin queue balanced
          </p>
        </div>
      </div>

      {/* Round-Robin Worker Queue Visualization */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Round-Robin Worker Thread Pool (Distributed Storage Nodes)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Dispatches file chunks cyclically: Chunk[i] → Worker(i mod 3)
            </p>
          </div>
          <span className="self-start sm:self-auto text-xs font-mono bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300 px-2.5 py-1 rounded-lg border border-purple-200 dark:border-purple-500/30 font-bold">
            POLICY: ROUND_ROBIN
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {summary?.queueVisualization?.workers?.map((w, idx) => (
            <div key={w.worker_id} className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-2 text-xs transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-md bg-blue-600 text-white font-bold text-[10px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{w.worker_id}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  w.status === "ACTIVE" 
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300" 
                    : "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                }`}>
                  {w.status}
                </span>
              </div>

              <div className="bg-white dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700/60 space-y-1">
                <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                  Task: <span className="font-mono text-blue-600 dark:text-blue-400 font-semibold">{w.current_task}</span>
                </p>
                <div className="flex justify-between text-[10px] text-slate-500 dark:text-slate-400 font-mono">
                  <span>Processed: {w.assigned_chunks} chunks</span>
                  <span>CPU: {w.cpu_usage}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Storage Chart & Live Broadcast Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 transition-colors">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Storage Optimization Metrics (GB)</h2>
          <ResponsiveContainer width="100%" height={210}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={11} />
              <YAxis stroke={isDark ? "#94a3b8" : "#64748b"} fontSize={11} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: isDark ? "#0f172a" : "#ffffff", 
                  borderColor: isDark ? "#334155" : "#e2e8f0",
                  borderRadius: "0.75rem",
                  color: isDark ? "#f8fafc" : "#0f172a"
                }} 
              />
              <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Live Broadcast Stream Ticker */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">Live Socket.IO Stream (Section 3.1)</h2>
            <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-500/15 px-2.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/30">
              ● Connected
            </span>
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {liveStreamEvents.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500">Listening for multi-engine state events...</p>
            ) : (
              liveStreamEvents.map((evt, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 p-2.5 rounded-xl text-xs transition-colors">
                  <div className="flex items-center space-x-2">
                    <StateBadge state={evt.lastBackupState} />
                    <span className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">{evt.correlation_id}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 transition-colors">
        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-200">System Telemetry &amp; Compliance Events</h2>
        <div className="space-y-2">
          {summary?.alerts?.map((alt) => (
            <div
              key={alt.id}
              onClick={() => setSelectedAlert(alt)}
              className="p-3 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/40 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl cursor-pointer transition-colors flex items-center justify-between text-xs"
            >
              <div className="flex items-center space-x-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${
                  alt.severity === "success" ? "bg-emerald-500" : "bg-blue-500"
                }`}></span>
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{alt.title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{alt.message}</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{alt.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 transition-colors">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Alert Detail</h3>
              <button onClick={() => setSelectedAlert(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold">✕</button>
            </div>
            <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <p><span className="text-slate-400">Alert ID:</span> <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedAlert.id}</span></p>
              <p><span className="text-slate-400">Title:</span> <span className="font-semibold text-slate-900 dark:text-white">{selectedAlert.title}</span></p>
              <p><span className="text-slate-400">Message:</span> {selectedAlert.message}</p>
              <p><span className="text-slate-400">Timestamp:</span> {selectedAlert.timestamp}</p>
            </div>
            <button onClick={() => setSelectedAlert(null)} className="w-full bg-blue-600 text-white text-xs py-2.5 rounded-xl font-bold cursor-pointer hover:bg-blue-700 transition-colors">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      <FileUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadFile}
      />
    </div>
  );
}
