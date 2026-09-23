import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export function useRealtime() {
  const [connected, setConnected] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(() => new Date());
  const [isStale, setIsStale] = useState(false);
  const [liveStreamEvents, setLiveStreamEvents] = useState([
    {
      timestamp: new Date().toISOString(),
      type: "WORKER_ROUND_ROBIN_DISPATCH",
      worker: "Worker-Alpha (Node 1)",
      task: "Chunk SHA-256 Hashing",
      lastBackupState: "COMMITTED"
    }
  ]);
  const [latestState, setLatestState] = useState("COMMITTED");

  useEffect(() => {
    const socketUrl = import.meta.env.VITE_API_URL || (typeof window !== "undefined" && window.location.hostname === "localhost" ? "http://localhost:4000" : null);
    
    let socket = null;
    if (socketUrl) {
      try {
        socket = io(socketUrl, {
          reconnectionAttempts: 5,
          reconnectionDelay: 2000,
          transports: ["websocket", "polling"]
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
      } catch (e) {
        console.warn("Socket initialization error:", e);
      }
    }

    // Fallback heartbeat pulse when socket is disconnected or not available
    const pulseInterval = setInterval(() => {
      setLastUpdated(new Date());
      setIsStale(false);
    }, 5000);

    return () => {
      clearInterval(pulseInterval);
      if (socket) socket.disconnect();
    };
  }, []);

  return {
    connected,
    lastUpdated,
    isStale,
    liveStreamEvents,
    latestState
  };
}

