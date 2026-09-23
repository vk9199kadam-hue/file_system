import { Router } from "express";
import { aggregationService } from "../services/aggregationService.js";
import { createSuccessEnvelope, createErrorEnvelope } from "../../contracts/response-envelopes.js";

const router = Router();

// POST /api/v1/ui/backups -> Schedule backup (D2)
router.post("/", (req, res, next) => {
  try {
    const { file_id, backup_type, priority } = req.body;
    const idempotencyKey = req.headers["idempotency-key"];
    const vpnTunnelId = req.headers["x-vpn-tunnel-id"] || null;
    const user = req.headers["x-username"] || "emp_rahul";

    if (!file_id) {
      return res.status(400).json(
        createErrorEnvelope(
          "INVALID_INPUT",
          "Parameter 'file_id' is required to schedule a backup.",
          [{ field: "file_id", issue: "missing" }],
          req.correlationId
        )
      );
    }

    const backupResult = aggregationService.orchestrateBackup({
      fileId: file_id,
      backupPolicy: backup_type || "ROUND_ROBIN",
      priority: Number(priority) || 3,
      idempotencyKey,
      vpnTunnelId,
      user
    });

    res.status(202).json(createSuccessEnvelope(backupResult, req.correlationId));
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/ui/backups/:backupId -> Get detailed backup status & queue position (D2)
router.get("/:backupId", (req, res, next) => {
  try {
    const status = aggregationService.getBackupById(req.params.backupId);
    res.json(createSuccessEnvelope(status, req.correlationId));
  } catch (err) {
    next(err);
  }
});

export default router;
