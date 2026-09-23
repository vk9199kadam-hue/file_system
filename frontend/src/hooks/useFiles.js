import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getLocalFiles, addLocalFile, updateLocalFile } from "../mockData";

export function useFiles() {
  const [files, setFiles] = useState(() => getLocalFiles());
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/v1/ui/files");
      if (res.data?.data && Array.isArray(res.data.data)) {
        setFiles(res.data.data);
      } else {
        setFiles(getLocalFiles());
      }
    } catch (err) {
      console.warn("BFF server unreachable or network error; loading local file cache:", err.message);
      // Graceful offline fallback: Never block user with error banner
      setFiles(getLocalFiles());
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
      console.warn("Backend upload offline, storing locally:", err.message);
      const newFile = addLocalFile({
        name,
        size: size || "3.2 MB",
        storage_class: storageClass || "STANDARD",
        retention_days: retentionDays || 30,
        folder: "uploads",
        owner: localStorage.getItem("apnileap_user")
          ? JSON.parse(localStorage.getItem("apnileap_user")).username
          : "emp_rahul"
      });
      setFiles(getLocalFiles());
      return newFile;
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
      console.warn("Backend update policy offline, updating locally:", err.message);
      const updated = updateLocalFile(fileId, {
        retention_days: retentionDays !== undefined ? Number(retentionDays) : undefined,
        storage_class: storageClass
      });
      setFiles(getLocalFiles());
      return updated;
    }
  };

  return { files, loading, uploading, error, refresh: fetchFiles, uploadFile, updatePolicy };
}

