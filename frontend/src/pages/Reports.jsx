import React, { useState } from "react";
import { useReports } from "../hooks/useReports.js";

export default function Reports() {
  const { report, loading, error } = useReports();
  const [searchCorrId, setSearchCorrId] = useState("");
  const [exporting, setExporting] = useState(false);

  const handleExportCSV = () => {
    setExporting(true);
    setTimeout(() => {
      const csvHeader = "Timestamp,Correlation_ID,Action,User,Role,File,Status,Network_Origin\n";
      const csvRows = (report?.auditEvents || [])
        .map(
          (e) =>
            `"${e.timestamp}","${e.correlation_id}","${e.action}","${e.user}","${e.role || "Employee"}","${e.file_name || e.file_id || "-"}","${e.status || "COMMITTED"}","${e.network_origin || "On-Prem"}"`
        )
        .join("\n");
      const csvContent = "data:text/csv;charset=utf-8," + csvHeader + csvRows;
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `apnileap_audit_evidence_ledger_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExporting(false);
    }, 400);
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading ApniLeap compliance &amp; storage reports...</div>;
  if (error) return <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">{error}</div>;

  const filteredLogs = (report?.auditEvents || []).filter(
    (log) =>
      (log.correlation_id && log.correlation_id.toLowerCase().includes(searchCorrId.toLowerCase())) ||
      (log.user && log.user.toLowerCase().includes(searchCorrId.toLowerCase())) ||
      (log.action && log.action.toLowerCase().includes(searchCorrId.toLowerCase())) ||
      (log.file_name && log.file_name.toLowerCase().includes(searchCorrId.toLowerCase()))
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            Audit Ledger &amp; Storage Governance
            <span className="text-xs px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-mono border border-emerald-200">
              Contract D4 / ISO 27001
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Immutable cross-engine audit evidence, correlation tracking, and tiered storage metrics
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-4 py-2.5 rounded-xl font-medium shadow-md transition-all flex items-center space-x-2 disabled:opacity-50"
        >
          <span>📥</span>
          <span>{exporting ? "Generating Evidence CSV..." : "Export Compliance Ledger (CSV)"}</span>
        </button>
      </div>

      {/* Storage Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {report?.breakdownByClass?.map((item) => (
          <div key={item.class} className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-1">
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 uppercase">
              {item.class}
            </span>
            <p className="text-2xl font-bold text-slate-800 mt-2">{item.sizeGB} GB</p>
            <p className="text-xs text-slate-500">{item.filesCount} file package(s)</p>
            <p className="text-[11px] text-slate-400">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Immutable Audit Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Immutable Audit Trace Ledger</h2>
            <p className="text-[11px] text-slate-500">Searchable across all transactions stamped with X-Correlation-ID</p>
          </div>
          <input
            type="text"
            className="border border-slate-300 rounded-xl px-3.5 py-1.5 text-xs w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Search Correlation ID, User or Action..."
            value={searchCorrId}
            onChange={(e) => setSearchCorrId(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-slate-600 uppercase border-b border-slate-200 font-sans font-semibold">
              <tr>
                <th className="px-4 py-2.5">Timestamp (UTC)</th>
                <th className="px-4 py-2.5">X-Correlation-ID</th>
                <th className="px-4 py-2.5">Action</th>
                <th className="px-4 py-2.5">Actor &amp; Origin</th>
                <th className="px-4 py-2.5">File Details</th>
                <th className="px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80">
                  <td className="px-4 py-2.5 text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="px-4 py-2.5 font-bold text-indigo-600">{log.correlation_id}</td>
                  <td className="px-4 py-2.5 text-slate-800 font-sans font-semibold">{log.action}</td>
                  <td className="px-4 py-2.5 font-sans">
                    <span className="font-semibold text-slate-700">{log.user}</span>
                    <span className="text-[10px] text-slate-400 block font-mono">
                      {log.network_origin || "Corporate LAN"}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-600 truncate max-w-xs font-sans">
                    {log.file_name || log.file_id}
                  </td>
                  <td className="px-4 py-2.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200 font-sans">
                      {log.status || "COMMITTED"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
