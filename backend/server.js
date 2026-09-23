import express from "express";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

import { correlationIdMiddleware } from "./middleware/correlationId.js";
import { errorHandler } from "./middleware/errorHandler.js";

import sessionRoutes from "./routes/session.js";
import filesRoutes from "./routes/files.js";
import backupsRoutes from "./routes/backups.js";
import restoresRoutes from "./routes/restores.js";
import dashboardRoutes from "./routes/dashboard.js";
import reportsRoutes from "./routes/reports.js";
import integrityRoutes from "./routes/integrity.js";
import { mockTeamA } from "./mocks/teamMocks.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));


// Section 3.1: X-Correlation-ID injection across all incoming requests
app.use(correlationIdMiddleware);

// --- Section 4.4 (D1–D4) Endpoints ---
app.use("/api/v1/ui/session", sessionRoutes);      // D1 Auth
app.use("/api/v1/ui/files", filesRoutes);          // D2 Browse & D4 Admin edit
app.use("/api/v1/ui/backups", backupsRoutes);      // D2 Schedule & Status lookup
app.use("/api/v1/ui/restores", restoresRoutes);    // D2 Version restore
app.use("/api/v1/ui/dashboard", dashboardRoutes);  // D3 Live dashboard summary
app.use("/api/v1/ui/reports", reportsRoutes);      // D4 Storage reports
app.use("/api/v1/ui/integrity", integrityRoutes);  // D3 Integrity & D4 verify preview

app.get("/api/v1/ui/me", (req, res) => {
  const userRole = req.headers["x-user-role"] || "IT Admin";
  res.json({
    data: { username: "admin_tejashree", role: userRole, institution_id: "RIT-CSE-2026" },
    meta: { correlation_id: req.correlationId, api_version: "v1" }
  });
});

// Standard Error Envelope Middleware
app.use(errorHandler);

const httpServer = createServer(app);

// --- D3. Live Operations Streaming Relay ---
const io = new Server(httpServer, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log(`[D3 Stream] Dashboard client connected: ${socket.id}`);

  // Broadcast live updates every 3 seconds matching D3 requirements
  const interval = setInterval(() => {
    const correlationId = "corr-stream-" + Math.floor(1000 + Math.random() * 9000);

    socket.emit("dashboard_update", {
      timestamp: new Date().toISOString(),
      correlation_id: correlationId,
      queueDepth: mockTeamA.queueDepth,
      dedupSavingsRatioPct: 73.5,
      merkleStatus: "100% HEALTHY",
      activeWorkersCount: 3,
      workers: mockTeamA.workers,
      schedulingPolicy: mockTeamA.schedulingPolicy,
      lastBackupState: "COMMITTED",
      serverNode: {
        host: "ApniLeap-Central-Node-01 (On-Premise Host)",
        ip: "10.0.4.82",
        status: "ONLINE",
        port: 4000
      }
    });
  }, 3000);

  socket.on("disconnect", () => {
    clearInterval(interval);
    console.log(`[D3 Stream] Client disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`Team D Backend-For-Frontend (BFF) running on http://localhost:${PORT}`);
  console.log(`OpenAPI v1 Endpoints (D1-D4) exposed at http://localhost:${PORT}/api/v1/ui/*`);
});
