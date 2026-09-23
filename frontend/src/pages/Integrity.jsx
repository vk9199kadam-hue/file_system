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
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Merkle Tree Cryptographic Integrity
            <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono border border-emerald-200">
              Team B DSA Engine
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Cryptographic SHA-256 Merkle root verification, bit-level integrity auditing, and tamper detection
          </p>
        </div>

        {/* Live Tampering Simulator Switch */}
        <div className="flex items-center space-x-2 bg-slate-900 text-white px-3.5 py-2 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 font-medium">Tamper Simulator:</span>
          <button
            onClick={() => setTamperedMode(prev => !prev)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              tamperedMode
                ? "bg-rose-600 text-white shadow-md shadow-rose-600/30"
                : "bg-slate-800 text-slate-300 hover:text-white"
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
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-bold text-slate-800">Merkle Root Status</h2>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                isHealthy
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-rose-50 text-rose-700 border-rose-200 animate-pulse"
              }`}>
                {report?.status || "VERIFIED_INTACT"}
              </span>
            </div>

            <div className="space-y-3 font-mono">
              <div>
                <p className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold">Authoritative Merkle Root (FIPS 180-4)</p>
                <p className={`p-3 rounded-xl break-all text-xs mt-1 border ${
                  isHealthy
                    ? "bg-slate-950 text-emerald-400 border-slate-800"
                    : "bg-rose-950 text-rose-300 border-rose-800"
                }`}>
                  {report?.merkleRoot || "0x8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 font-sans">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="text-slate-500 text-[11px]">Tree Depth</p>
                  <p className="text-lg font-bold text-slate-800 mt-0.5">{report?.treeDepth || 3} levels</p>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <p className="text-slate-500 text-[11px]">Leaf Chunks</p>
                  <p className="text-lg font-bold text-slate-800 mt-0.5">{report?.totalChunks || 4} chunks</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                fetchIntegrityState(tamperedMode);
                runVerificationPreview();
              }}
              disabled={verifying || loadingCheck}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-xl text-xs transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-2"
            >
              <span>{verifying || loadingCheck ? "Auditing SHA-256 Hashes..." : "🔍 Run Full Cryptographic Audit"}</span>
            </button>
          </div>

          {/* Audit Verification Preview Result Card */}
          {previewResult && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-xs space-y-1">
              <p className="font-bold flex items-center space-x-1.5">
                <span>🛡️</span>
                <span>Audit Certificate Issued: SHA-256 Signature Match</span>
              </p>
              <p className="font-mono text-[11px]">Duration: {previewResult.simulated_duration_ms || 38} ms | Algorithm: SHA-256</p>
            </div>
          )}
        </div>

        {/* Right Column: Visual Merkle Tree Diagram */}
        <div className="lg:col-span-7 bg-slate-900 text-white border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h2 className="text-sm font-bold text-white">Hierarchical Merkle Hash Tree</h2>
              <p className="text-[11px] text-slate-400">Recursive pairing: Hash(Leaf 1 + Leaf 2) → Root</p>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              SHA-256 Engine
            </span>
          </div>

          {/* Merkle Visual Graph */}
          <div className="space-y-4 text-xs font-mono">
            {/* Level 0: Merkle Root */}
            <div className="flex flex-col items-center">
              <div className={`p-2.5 rounded-xl border text-center max-w-sm w-full ${
                isHealthy
                  ? "bg-indigo-950 border-indigo-500 text-indigo-200 shadow-lg shadow-indigo-500/20"
                  : "bg-rose-950 border-rose-500 text-rose-200 shadow-lg shadow-rose-500/20"
              }`}>
                <p className="text-[10px] font-sans font-bold uppercase tracking-wider text-slate-400">Top Merkle Root Node</p>
                <p className="font-bold text-xs truncate mt-0.5">{report?.merkleRoot?.slice(0, 32)}...</p>
              </div>
              <div className="w-0.5 h-4 bg-slate-700"></div>
            </div>

            {/* Level 1: Intermediate Hashes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center">
                <div className="p-2 bg-slate-800/90 border border-slate-700 rounded-lg text-center w-full">
                  <p className="text-[9px] text-slate-400 font-sans">Node H(0,1)</p>
                  <p className="text-[10px] text-indigo-300 truncate">0x5f8a...4b12</p>
                </div>
                <div className="w-0.5 h-3 bg-slate-700"></div>
              </div>

              <div className="flex flex-col items-center">
                <div className={`p-2 rounded-lg text-center w-full border ${
                  tamperedMode
                    ? "bg-rose-900/60 border-rose-500 text-rose-200"
                    : "bg-slate-800/90 border-slate-700 text-indigo-300"
                }`}>
                  <p className="text-[9px] text-slate-400 font-sans">Node H(2,3)</p>
                  <p className="text-[10px] truncate">{tamperedMode ? "0xTAMPERED_HASH" : "0x9e1c...7d4a"}</p>
                </div>
                <div className="w-0.5 h-3 bg-slate-700"></div>
              </div>
            </div>

            {/* Level 2: Chunk Leaves */}
            <div className="grid grid-cols-4 gap-2 pt-1">
              {(report?.chunks || [
                { index: 0, hash: "Chunk #1", status: "VALID" },
                { index: 1, hash: "Chunk #2", status: "VALID" },
                { index: 2, hash: "Chunk #3", status: "VALID" },
                { index: 3, hash: "Chunk #4", status: "VALID" }
              ]).map((c, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    c.status === "CORRUPTED"
                      ? "bg-rose-950 border-rose-500 text-rose-300 shadow-md shadow-rose-500/30 animate-pulse"
                      : "bg-slate-950 border-slate-800 text-slate-300"
                  }`}
                >
                  <p className="text-[10px] font-sans font-bold">Chunk {i + 1}</p>
                  <p className="text-[9px] truncate text-slate-400 mt-0.5">{c.hash.slice(0, 10)}...</p>
                  <span className={`inline-block text-[8px] font-bold px-1 py-0.2 rounded mt-1 font-sans ${
                    c.status === "CORRUPTED" ? "bg-rose-500 text-white" : "bg-emerald-500/20 text-emerald-400"
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
