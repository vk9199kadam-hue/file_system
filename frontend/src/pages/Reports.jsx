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

  if (loading) return <div className="p-12 text-center text-slate-500 dark:text-slate-400 font-medium">Loading ApniLeap compliance &amp; storage reports...</div>;
  if (error) return <div className="p-6 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-2xl text-rose-700 dark:text-rose-300 text-sm">{error}</div>;

  const filteredLogs = (report?.auditEvents || []).filter(
    (log) =>
      (log.correlation_id && log.correlation_id.toLowerCase().includes(searchCorrId.toLowerCase())) ||
      (log.user && log.user.toLowerCase().includes(searchCorrId.toLowerCase())) ||
      (log.action && log.action.toLowerCase().includes(searchCorrId.toLowerCase())) ||
      (log.file_name && log.file_name.toLowerCase().includes(searchCorrId.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2.5">
            Audit Ledger &amp; Storage Governance
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300 font-mono border border-emerald-200 dark:border-emerald-500/30 font-bold">
              Contract D4 / ISO 27001
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Immutable cross-engine audit evidence, correlation tracking, and tiered storage metrics
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={exporting}
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2.5 rounded-xl font-bold shadow-md shadow-blue-600/20 transition-all flex items-center space-x-2 disabled:opacity-50 cursor-pointer"
        >
          <span>📥</span>
          <span>{exporting ? "Generating Evidence CSV..." : "Export Compliance Ledger (CSV)"}</span>
        </button>
      </div>

      {/* Storage Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {report?.breakdownByClass?.map((item) => (
          <div key={item.class} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-1.5 transition-colors">
            <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/15 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-500/30 uppercase">
              {item.class}
            </span>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-2">{item.sizeGB} GB</p>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{item.filesCount} file package(s)</p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Immutable Audit Ledger Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Immutable Audit Trace Ledger</h2>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Searchable across all transactions stamped with X-Correlation-ID</p>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 text-xs">
              🔍
            </span>
            <input
              type="text"
              className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl pl-8 pr-3.5 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Search Correlation ID, User or Action..."
              value={searchCorrId}
              onChange={(e) => setSearchCorrId(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-400 uppercase border-b border-slate-200 dark:border-slate-800 font-sans font-bold tracking-wider">
              <tr>
                <th className="px-4 py-3">Timestamp (UTC)</th>
                <th className="px-4 py-3">X-Correlation-ID</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Actor &amp; Origin</th>
                <th className="px-4 py-3">File Details</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLogs.map((log, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                  <td className="px-4 py-3 font-bold text-blue-600 dark:text-blue-400">{log.correlation_id}</td>
                  <td className="px-4 py-3 text-slate-900 dark:text-slate-100 font-sans font-semibold">{log.action}</td>
                  <td className="px-4 py-3 font-sans">
                    <span className="font-bold text-slate-800 dark:text-slate-200">{log.user}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-mono">
                      {log.network_origin || "Corporate LAN"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300 truncate max-w-xs font-sans">
                    {log.file_name || log.file_id}
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] border border-emerald-200 dark:border-emerald-500/30 font-sans">
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
