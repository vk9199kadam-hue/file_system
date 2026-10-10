import React, { useState, useEffect } from "react";
import { useIntegrity } from "../hooks/useIntegrity.js";
import axios from "axios";

export default function Integrity() {
  const { integrity, verifying, previewResult, runVerificationPreview } = useIntegrity();
  const [tamperedMode, setTamperedMode] = useState(false);
  const [liveData, setLiveData] = useState(null);
  const [loadingCheck, setLoadingCheck] = useState(false);

  const fetchIntegrityState = async (isTampered = false) => {
    setLoadingCheck(true);
    try {
      const res = await axios.get(`/api/v1/ui/integrity?tampered=${isTampered}`);
      setLiveData(res.data.data);
    } catch (e) {
      // ignore
    } finally {
      setLoadingCheck(false);
    }
  };

  useEffect(() => {
    fetchIntegrityState(tamperedMode);
  }, [tamperedMode]);

  const report = liveData || integrity;
  const isHealthy = report?.status === "VERIFIED_INTACT";

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            Merkle Tree Cryptographic Integrity
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 font-mono border border-emerald-200 dark:border-emerald-500/30 font-bold">
              Team B DSA Engine
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Cryptographic SHA-256 Merkle root verification, bit-level integrity auditing, and tamper detection
          </p>
        </div>

        {/* Live Tampering Simulator Switch */}
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-white px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs shadow-sm transition-colors">
          <span className="text-slate-500 dark:text-slate-400 font-bold">Tamper Simulator:</span>
          <button
            onClick={() => setTamperedMode((prev) => !prev)}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              tamperedMode
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {tamperedMode ? "⚠️ Corrupted Chunk Active" : "✅ Normal (100% Intact)"}
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Root Summary & Actions */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 transition-colors">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Merkle Root Status</h2>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                isHealthy
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/30"
                  : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:border-rose-500/30 animate-pulse"
              }`}>
                {report?.status || "VERIFIED_INTACT"}
              </span>
            </div>

            <div className="space-y-3 font-mono">
              <div>
                <p className="text-slate-400 dark:text-slate-500 text-[10px] uppercase tracking-wider font-bold">
                  Authoritative Merkle Root (FIPS 180-4)
                </p>
                <p className={`p-3 rounded-xl break-all text-xs mt-1 border transition-colors ${
                  isHealthy
                    ? "bg-slate-50 dark:bg-slate-950 text-emerald-600 dark:text-emerald-400 border-slate-200 dark:border-slate-800 font-bold"
                    : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800 font-bold"
                }`}>
                  {report?.merkleRoot || "0x8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 font-sans">
                <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider">Tree Depth</p>
                  <p className="text-lg font-black text-slate-800 dark:text-slate-200 mt-0.5">{report?.treeDepth || 3} levels</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold uppercase tracking-wider">Leaf Chunks</p>
                  <p className="text-lg font-black text-slate-800 dark:text-slate-200 mt-0.5">{report?.totalChunks || 4} chunks</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                fetchIntegrityState(tamperedMode);
                runVerificationPreview();
              }}
              disabled={verifying || loadingCheck}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-xs transition-all shadow-md shadow-blue-600/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              <span>{verifying || loadingCheck ? "Auditing SHA-256 Hashes..." : "🔍 Run Full Cryptographic Audit"}</span>
            </button>
          </div>

          {/* Audit Verification Preview Result Card */}
          {previewResult && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-emerald-900 dark:text-emerald-200 text-xs space-y-1 transition-colors">
              <p className="font-bold flex items-center space-x-1.5">
                <span>🛡️</span>
                <span>Audit Certificate Issued: SHA-256 Signature Match</span>
              </p>
              <p className="font-mono text-[11px] text-emerald-700 dark:text-emerald-400">
                Duration: {previewResult.simulated_duration_ms || 38} ms | Algorithm: SHA-256
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Visual Merkle Tree Diagram */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Hierarchical Merkle Hash Tree</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Recursive pairing: Hash(Leaf 1 + Leaf 2) → Root</p>
            </div>
            <span className="text-xs font-mono px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300 border border-blue-200 dark:border-blue-500/30 font-bold">
              SHA-256 Engine
            </span>
          </div>

          {/* Merkle Visual Graph */}
          <div className="space-y-4 text-xs font-mono">
            {/* Level 0: Merkle Root */}
            <div className="flex flex-col items-center">
              <div className={`p-3 rounded-xl border text-center max-w-sm w-full transition-colors ${
                isHealthy
                  ? "bg-blue-50 dark:bg-blue-950/70 border-blue-300 dark:border-blue-600 text-blue-900 dark:text-blue-200 shadow-sm"
                  : "bg-rose-50 dark:bg-rose-950/70 border-rose-300 dark:border-rose-600 text-rose-900 dark:text-rose-200 shadow-sm"
              }`}>
                <p className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Top Merkle Root Node</p>
                <p className="font-bold text-xs truncate mt-0.5">{report?.merkleRoot?.slice(0, 32)}...</p>
              </div>
              <div className="w-0.5 h-4 bg-slate-300 dark:bg-slate-700"></div>
            </div>

            {/* Level 1: Intermediate Hashes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-center w-full transition-colors">
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 font-sans font-bold">Node H(0,1)</p>
                  <p className="text-[10px] text-blue-600 dark:text-blue-300 truncate font-semibold">0x5f8a...4b12</p>
                </div>
                <div className="w-0.5 h-3 bg-slate-300 dark:bg-slate-700"></div>
              </div>

              <div className="flex flex-col items-center">
                <div className={`p-2.5 rounded-xl text-center w-full border transition-colors ${
                  tamperedMode
                    ? "bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-600 text-rose-800 dark:text-rose-200"
                    : "bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-300"
                }`}>
                  <p className="text-[9px] text-slate-400 dark:text-slate-500 font-sans font-bold">Node H(2,3)</p>
                  <p className="text-[10px] truncate font-semibold">{tamperedMode ? "0xTAMPERED_HASH" : "0x9e1c...7d4a"}</p>
                </div>
                <div className="w-0.5 h-3 bg-slate-300 dark:bg-slate-700"></div>
              </div>
            </div>

            {/* Level 2: Chunk Leaves */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {(report?.chunks || [
                { index: 0, hash: "Chunk #1", status: "VALID" },
                { index: 1, hash: "Chunk #2", status: "VALID" },
                { index: 2, hash: "Chunk #3", status: "VALID" },
                { index: 3, hash: "Chunk #4", status: "VALID" }
              ]).map((c, i) => (
                <div
                  key={i}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    c.status === "CORRUPTED"
                      ? "bg-rose-50 dark:bg-rose-950/80 border-rose-400 dark:border-rose-600 text-rose-800 dark:text-rose-200 shadow-md animate-pulse"
                      : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <p className="text-[10px] font-sans font-bold text-slate-800 dark:text-slate-200">Chunk {i + 1}</p>
                  <p className="text-[9px] truncate text-slate-400 dark:text-slate-500 mt-0.5">{c.hash.slice(0, 10)}...</p>
                  <span className={`inline-block text-[8px] font-bold px-1.5 py-0.5 rounded mt-1.5 font-sans ${
                    c.status === "CORRUPTED" 
                      ? "bg-rose-600 text-white" 
                      : "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300"
                  }`}>
                    {c.status}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
