import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useReports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/v1/ui/reports/storage");
      setReport(res.data.data);
    } catch (err) {
      console.error("Failed to load reports:", err);
      setError(err.response?.data?.error?.message || "Failed to load storage report.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { report, loading, error, refresh: fetchReports };
}
