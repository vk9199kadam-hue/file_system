import { Router } from "express";
import { aggregationService } from "../services/aggregationService.js";
import { schedulerService } from "../services/schedulerService.js";
import { createSuccessEnvelope, createErrorEnvelope } from "../../contracts/response-envelopes.js";

const router = Router();

// GET /api/v1/ui/backups/algorithms -> Inspect available OS scheduling algorithms (Team A)
router.get("/algorithms", (req, res, next) => {
  try {
    const algorithms = schedulerService.getAvailableAlgorithms();
    const active = schedulerService.getActivePolicy();
    res.json(
      createSuccessEnvelope(
        {
          active_algorithm: active,
          algorithms: algorithms
        },
        req.correlationId
      )
    );
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/ui/backups/algorithm -> Switch active OS scheduling algorithm (Team A)
router.post("/algorithm", (req, res, next) => {
  try {
    const { algorithm } = req.body;
    if (!algorithm) {
      return res.status(400).json(
        createErrorEnvelope(
          "INVALID_INPUT",
          "Parameter 'algorithm' is required (Choices: ROUND_ROBIN, LEAST_LOADED, DYNAMIC_WEIGHTED).",
          [{ field: "algorithm", issue: "missing" }],
          req.correlationId
        )
      );
    }

    const switchResult = schedulerService.setActivePolicy(algorithm);
    res.json(
      createSuccessEnvelope(
        {
          message: `OS Load Balancing policy successfully switched to ${switchResult.policy}`,
          active_policy: switchResult.policy,
          is_recommended: switchResult.policy === "DYNAMIC_WEIGHTED"
        },
        req.correlationId
      )
    );
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/ui/backups -> Schedule backup (D2)
router.post("/", async (req, res, next) => {
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

    const backupResult = await aggregationService.orchestrateBackup({
      fileId: file_id,
      backupPolicy: backup_type,
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
