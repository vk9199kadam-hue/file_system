import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useFiles() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/v1/ui/files");
      setFiles(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch files:", err);
      setError(err.response?.data?.error?.message || "Failed to load files from BFF server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
  }, [fetchFiles]);

  const uploadFile = async (name, size, storageClass, retentionDays) => {
    setUploading(true);
    setError(null);
    try {
      const res = await axios.post("/api/v1/ui/files", {
        name,
        size: size || "3.2 MB",
        storage_class: storageClass || "STANDARD",
        retention_days: retentionDays || 30
      });
      await fetchFiles();
      return res.data.data;
    } catch (err) {
      const msg = err.response?.data?.error?.message || "Failed to upload file.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setUploading(false);
    }
  };

  const updatePolicy = async (fileId, retentionDays, storageClass) => {
    try {
      const res = await axios.patch(`/api/v1/ui/files/${fileId}`, {
        retention_days: retentionDays,
        storage_class: storageClass
      });
      await fetchFiles();
      return res.data.data;
    } catch (err) {
      throw new Error(err.response?.data?.error?.message || "Failed to update retention policy.");
    }
  };

  return { files, loading, uploading, error, refresh: fetchFiles, uploadFile, updatePolicy };
}
