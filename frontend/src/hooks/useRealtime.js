import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export function useRealtime() {
  const [connected, setConnected] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isStale, setIsStale] = useState(false);
  const [liveStreamEvents, setLiveStreamEvents] = useState([]);
  const [latestState, setLatestState] = useState("COMMITTED");

  useEffect(() => {
    const socket = io("http://localhost:4000", {
      reconnectionAttempts: 10,
      reconnectionDelay: 2000
    });

    socket.on("connect", () => {
      setConnected(true);
      setIsStale(false);
    });

    socket.on("disconnect", () => {
      setConnected(false);
      setIsStale(true);
    });

    socket.on("dashboard_update", (update) => {
      setConnected(true);
      setLastUpdated(new Date(update.timestamp));
      setIsStale(false);
      setLatestState(update.lastBackupState);

      setLiveStreamEvents((prev) => [update, ...prev].slice(0, 10));
    });

    // Freshness Monitor Check (Section 7 requirement: visible last-updated timestamp and stale indicator)
    const freshnessCheck = setInterval(() => {
      if (lastUpdated && Date.now() - new Date(lastUpdated).getTime() > 10000) {
        setIsStale(true);
      }
    }, 2000);

    return () => {
      clearInterval(freshnessCheck);
      socket.disconnect();
    };
  }, [lastUpdated]);

  return {
    connected,
    lastUpdated,
    isStale,
    liveStreamEvents,
    latestState
  };
}
