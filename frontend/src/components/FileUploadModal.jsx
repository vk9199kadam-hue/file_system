import React, { useState } from "react";

export default function FileUploadModal({ isOpen, onClose, onUpload }) {
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("4.5 MB");
  const [storageClass, setStorageClass] = useState("STANDARD");
  const [retentionDays, setRetentionDays] = useState(30);
  const [fileObj, setFileObj] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFileObj(file);
      setFileName(file.name);
      setFileSize((file.size / (1024 * 1024)).toFixed(1) + " MB");
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileObj(file);
      setFileName(file.name);
      setFileSize((file.size / (1024 * 1024)).toFixed(1) + " MB");
    }
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileName) return;

    setSubmitting(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 150);

    try {
      let contentBase64 = null;
      if (fileObj) {
        try {
          contentBase64 = await readFileAsBase64(fileObj);
        } catch (readErr) {
          console.warn("Could not read file binary, continuing with metadata:", readErr.message);
        }
      }

      await new Promise((res) => setTimeout(res, 400));
      setUploadProgress(100);
      await onUpload(fileName, fileSize, storageClass, retentionDays, contentBase64);
      onClose();
    } finally {
      clearInterval(interval);
      setSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl space-y-5 transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3.5">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Upload New File &amp; Schedule Backup</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Employee Portal: Upload file and initiate Round-Robin backup</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-bold cursor-pointer">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Drag & Drop File Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleFileDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
              dragActive 
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 scale-[0.99]" 
                : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-900"
            }`}
          >
            <input
              type="file"
              id="file-upload-input"
              className="hidden"
              onChange={handleFileSelect}
            />
            <label htmlFor="file-upload-input" className="cursor-pointer space-y-2 block">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 mx-auto flex items-center justify-center text-lg">
                ☁️
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                {fileName ? `Selected: ${fileName}` : "Click to browse or drag and drop file here"}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">PDF, DOCX, CSV, SQL, ZIP up to 500 MB</p>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">File Name</label>
              <input
                type="text"
                required
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g. Q3_financials.pdf"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">File Size</label>
              <input
                type="text"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={fileSize}
                onChange={(e) => setFileSize(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Storage Class Tier</label>
              <select
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                value={storageClass}
                onChange={(e) => setStorageClass(e.target.value)}
              >
                <option value="STANDARD">STANDARD (Normal)</option>
                <option value="HOT_STORAGE">HOT_STORAGE (Frequent Read)</option>
                <option value="COLD_STORAGE">COLD_STORAGE (MinIO Archive)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Retention Period (Days)</label>
              <input
                type="number"
                min="1"
                max="365"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={retentionDays}
                onChange={(e) => setRetentionDays(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Upload Progress Bar */}
          {submitting && (
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] font-bold text-blue-600 dark:text-blue-400">
                <span>Uploading &amp; Triggering Round-Robin Chunks...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !fileName}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Uploading..." : "Upload & Start Backup"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
