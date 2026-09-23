import React, { useState, useEffect } from "react";
import axios from "axios";

export default function VersionHistoryDrawer({ file, isOpen, onClose, onRestoreClick, onDownloadClick }) {
  const [versionData, setVersionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && file) {
      setLoading(true);
      axios
        .get(`/api/v1/ui/files/${file.file_id}/versions`)
        .then((res) => setVersionData(res.data.data))
        .catch(() => setVersionData(null))
        .finally(() => setLoading(false));
    }
  }, [isOpen, file]);

  if (!isOpen || !file) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex justify-end z-50 animate-fadeIn">
      <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-slate-800">Version History (D2)</h2>
              <p className="text-xs text-slate-500 font-mono">{file.name}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-lg">
              ✕
            </button>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1 text-xs">
            <p className="text-slate-500">File ID: <span className="font-mono font-bold text-slate-800">{file.file_id}</span></p>
            <p className="text-slate-500">Storage Class: <span className="font-semibold text-indigo-600">{file.storage_class || "STANDARD"}</span></p>
            <p className="text-slate-500">Retention Policy: <span className="font-semibold text-slate-700">{file.retention_days || 30} days</span></p>
          </div>

          {loading ? (
            <div className="p-6 text-center text-xs text-slate-400">Loading version state from Team C...</div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Browsable Versions</h3>
              {versionData?.versions?.map((ver) => (
                <div key={ver.version_id} className="p-3 border border-slate-200 rounded-xl space-y-2 hover:border-indigo-200 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {ver.version_id}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(ver.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 font-mono space-y-0.5">
                    <p>Size: {ver.size}</p>
                    <p className="truncate text-slate-400">Checksum: {ver.checksum}</p>
                    <p>Chunks Count: {ver.chunks_count}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      onClick={() => onDownloadClick && onDownloadClick(file, ver.version_id)}
                      className="bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-xs font-medium py-1.5 rounded-lg border border-emerald-200 transition-all flex items-center justify-center space-x-1"
                    >
                      <span>📥</span>
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => onRestoreClick(file, ver.version_id)}
                      className="bg-slate-100 hover:bg-indigo-600 hover:text-white text-slate-700 text-xs font-medium py-1.5 rounded-lg border transition-all"
                    >
                      Restore {ver.version_id}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>


        <button
          onClick={onClose}
          className="w-full mt-4 bg-slate-100 text-slate-600 font-medium py-2 rounded-lg text-xs hover:bg-slate-200"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
}
