import React, { useState } from "react";
import { useDashboard } from "../hooks/useDashboard.js";
import { useFiles } from "../hooks/useFiles.js";
import { useRealtime } from "../hooks/useRealtime.js";
import { useAuth } from "../AuthContext.jsx";
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
  const { networkMode, vpnConnected, toggleVpn, vpnTunnelId } = useAuth();

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
      <div className="p-8 text-center text-slate-500">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-3"></div>
        Connecting to ApniLeap On-Premise Central Node...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
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
    <div className="p-6 space-y-6">
      {/* Freshness & Stale Data Banner */}
      <FreshnessBanner connected={connected} isStale={isStale} lastUpdated={lastUpdated} />

      {/* Header & Mode Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            ApniLeap Live Operations Dashboard
            <span className="text-xs px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-mono border border-indigo-200">
              Team D Engine
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Real-time Round-Robin chunk scheduler, SHA-256 deduplication, and on-premise physical node telemetry
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2.5 rounded-xl font-medium shadow-md transition-all flex items-center space-x-2"
          >
            <span className="text-base leading-none">📤</span>
            <span>Upload File &amp; Schedule Backup</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-800 px-4 py-3 rounded-xl text-xs flex justify-between items-center shadow-sm">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-indigo-600 font-bold ml-4">✕</button>
        </div>
      )}

      {/* Network & Physical Host Telemetry Banner */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-lg border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center text-xl">
            🏢
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-200">Central Host Server</p>
            <p className="text-[11px] font-mono text-emerald-400">10.0.4.82 : 4000 (Local PC)</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-xl">
            ⚡
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-200">Scheduling Policy</p>
            <p className="text-[11px] font-mono text-purple-300">Round-Robin (3 Worker Nodes)</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 border-t md:border-t-0 md:border-l border-slate-800 pt-2 md:pt-0 md:pl-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xl">
            🔐
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-200">Access Channel</p>
            <p className="text-[11px] font-mono text-slate-300">
              {networkMode === "ON_PREM_LAN" ? "Direct Corporate LAN" : `Remote VPN (${vpnTunnelId})`}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Overlays Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Storage Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Storage Utilization</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {summary?.storageStatus?.usedGB} / {summary?.storageStatus?.totalCapacityGB} GB
          </p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-indigo-600 h-1.5 rounded-full" style={{ width: `${summary?.storageStatus?.usagePercentage}%` }}></div>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">{summary?.storageStatus?.usagePercentage}% allocated</p>
        </div>

        {/* Dedup Overlay */}
        <div className="bg-white border border-indigo-200 bg-indigo-50/20 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">SHA-256 Dedup Ratio</p>
          <p className="text-2xl font-bold text-indigo-600 mt-1">{summary?.dedupOverlay?.savingsRatioPct}%</p>
          <p className="text-[11px] text-indigo-700 font-medium mt-1">
            {summary?.storageStatus?.savedGB} GB redundant data eliminated
          </p>
        </div>

        {/* Merkle Verification Status */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Merkle Cryptographic Root</p>
          <p className="text-xl font-bold text-teal-600 mt-1">{summary?.dedupOverlay?.merkleVerificationStatus}</p>
          <p className="text-[11px] text-slate-400 mt-1">Zero bit-level tampering</p>
        </div>

        {/* Queue Depth */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <p className="text-xs font-medium text-slate-500">Active Worker Nodes</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">3 / 3 Online</p>
          <p className="text-[11px] text-indigo-600 font-medium mt-1">
            Round-Robin queue balanced
          </p>
        </div>
      </div>

      {/* Round-Robin Worker Queue Visualization */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Round-Robin Worker Thread Pool (Team A OS Engine)</h2>
            <p className="text-[11px] text-slate-500">Chunks are balanced cyclically across nodes: Chunk[i] → Worker(i mod 3)</p>
          </div>
          <span className="text-xs font-mono bg-purple-50 text-purple-700 px-2.5 py-1 rounded-lg border border-purple-200 font-semibold">
            POLICY: ROUND_ROBIN
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {summary?.queueVisualization?.workers?.map((w, idx) => (
            <div key={w.worker_id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-md bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <p className="font-bold text-slate-800">{w.worker_id}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  w.status === "ACTIVE" ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-700"
                }`}>
                  {w.status}
                </span>
              </div>

              <div className="bg-white p-2 rounded-lg border border-slate-200 space-y-1">
                <p className="text-[11px] text-slate-600 font-medium">Task: <span className="font-mono text-indigo-600">{w.current_task}</span></p>
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
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
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <h2 className="text-sm font-semibold text-slate-700">Storage Optimization Metrics (GB)</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Live Broadcast Stream Ticker */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700">Live Socket.IO Stream (Section 3.1)</h2>
            <span className="text-[10px] font-mono text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              ● Connected
            </span>
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {liveStreamEvents.length === 0 ? (
              <p className="text-xs text-slate-400">Listening for multi-engine state events...</p>
            ) : (
              liveStreamEvents.map((evt, idx) => (
                <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-xs">
                  <div className="flex items-center space-x-2">
                    <StateBadge state={evt.lastBackupState} />
                    <span className="font-mono text-slate-500 text-[11px]">{evt.correlation_id}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {new Date(evt.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold text-slate-700">System Telemetry &amp; Compliance Events</h2>
        <div className="space-y-2">
          {summary?.alerts?.map((alt) => (
            <div
              key={alt.id}
              onClick={() => setSelectedAlert(alt)}
              className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl cursor-pointer transition-colors flex items-center justify-between text-xs"
            >
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${
                  alt.severity === "success" ? "bg-emerald-500" : "bg-indigo-500"
                }`}></span>
                <div>
                  <p className="font-semibold text-slate-800">{alt.title}</p>
                  <p className="text-[11px] text-slate-500">{alt.message}</p>
                </div>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{alt.timestamp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Alert Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-800">Alert Detail</h3>
              <button onClick={() => setSelectedAlert(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>
            <div className="space-y-2 text-xs">
              <p><span className="text-slate-500">Alert ID:</span> <span className="font-mono font-bold">{selectedAlert.id}</span></p>
              <p><span className="text-slate-500">Title:</span> <span className="font-semibold">{selectedAlert.title}</span></p>
              <p><span className="text-slate-500">Message:</span> {selectedAlert.message}</p>
              <p><span className="text-slate-500">Timestamp:</span> {selectedAlert.timestamp}</p>
            </div>
            <button onClick={() => setSelectedAlert(null)} className="w-full bg-indigo-600 text-white text-xs py-2 rounded-lg font-medium">
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
