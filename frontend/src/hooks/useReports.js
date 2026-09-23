import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { getLocalReports } from "../mockData";

export function useReports() {
  const [report, setReport] = useState(() => getLocalReports());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReports = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/v1/ui/reports/storage");
      if (res.data?.data) {
        setReport(res.data.data);
      } else {
        setReport(getLocalReports());
      }
    } catch (err) {
      console.warn("Reports API offline, using local compliance & audit records:", err.message);
      setReport(getLocalReports());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return { report, loading, error, refresh: fetchReports };
}

