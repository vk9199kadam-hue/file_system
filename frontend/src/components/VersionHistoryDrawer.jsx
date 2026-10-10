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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex justify-end z-50">
      <div className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 w-full max-w-md h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto border-l border-slate-200 dark:border-slate-800 transition-colors">
        <div className="space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Version History (D2)</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">{file.name}</p>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold text-lg cursor-pointer">
              ✕
            </button>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-1 text-xs">
            <p className="text-slate-500 dark:text-slate-400">File ID: <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{file.file_id}</span></p>
            <p className="text-slate-500 dark:text-slate-400">Storage Class: <span className="font-bold text-blue-600 dark:text-blue-400">{file.storage_class || "STANDARD"}</span></p>
            <p className="text-slate-500 dark:text-slate-400">Retention Policy: <span className="font-semibold text-slate-700 dark:text-slate-300">{file.retention_days || 30} days</span></p>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400 dark:text-slate-500">Loading version state from Team C...</div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Browsable Versions</h3>
              {versionData?.versions?.map((ver) => (
                <div key={ver.version_id} className="p-3.5 border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/30 rounded-xl space-y-2 hover:border-blue-300 dark:hover:border-blue-600 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-300 bg-blue-50 dark:bg-blue-500/15 px-2.5 py-0.5 rounded-md border border-blue-200 dark:border-blue-500/30">
                      {ver.version_id}
                    </span>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                      {new Date(ver.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-600 dark:text-slate-400 font-mono space-y-0.5">
                    <p>Size: {ver.size}</p>
                    <p className="truncate text-slate-400 dark:text-slate-500">Checksum: {ver.checksum}</p>
                    <p>Chunks Count: {ver.chunks_count}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1.5">
                    <button
                      onClick={() => onDownloadClick && onDownloadClick(file, ver.version_id)}
                      className="bg-emerald-50 dark:bg-emerald-500/15 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-600 text-emerald-700 dark:text-emerald-300 text-xs font-bold py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-500/30 transition-all flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>📥</span>
                      <span>Download</span>
                    </button>
                    <button
                      onClick={() => onRestoreClick(file, ver.version_id)}
                      className="bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-slate-700 dark:text-slate-300 text-xs font-bold py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
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
          className="w-full mt-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
        >
          Close Drawer
        </button>
      </div>
    </div>
  );
}
