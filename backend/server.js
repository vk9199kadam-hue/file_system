import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import sessionRoutes from "./routes/session.js";
import filesRoutes from "./routes/files.js";
import backupsRoutes from "./routes/backups.js";
import dashboardRoutes from "./routes/dashboard.js";

const app = express();
app.use(cors());
app.use(express.json());

// --- Team D's own BFF endpoints ---
// These proxy/aggregate calls to Team C (and Team A/B via Team C).
// For now they return mock data so you can build the UI without waiting
// on the other teams.
app.use("/api/v1/ui/session", sessionRoutes);
app.use("/api/v1/ui/files", filesRoutes);
app.use("/api/v1/ui/backups", backupsRoutes);
app.use("/api/v1/ui/dashboard", dashboardRoutes);

app.get("/api/v1/ui/me", (req, res) => {
  res.json({ data: { username: "demo.user", role: "Employee" }, meta: {} });
});

const httpServer = createServer(app);

// --- Live dashboard stream (Section D3 in the doc) ---
const io = new Server(httpServer, {
  cors: { origin: "*" },
});

io.on("connection", (socket) => {
  console.log("Dashboard client connected:", socket.id);

  // Demo: push a fake state update every 4s so you can see the
  // live-update UI working before Team A/B/C are wired up for real.
  const interval = setInterval(() => {
    socket.emit("dashboard_update", {
      timestamp: new Date().toISOString(),
      queueDepth: Math.floor(Math.random() * 10),
      lastBackupState: "COMMITTED",
    });
  }, 4000);

  socket.on("disconnect", () => {
    clearInterval(interval);
    console.log("Dashboard client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Team D backend (BFF) running on http://localhost:${PORT}`);
});
