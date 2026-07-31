import { Router } from "express";

const router = Router();

// POST /api/v1/ui/backups -> start a backup
router.post("/", (req, res) => {
  const { file_id } = req.body;
  // TODO: replace with real call to Team C's POST /api/v1/backups
  res.json({
    data: {
      backup_id: "bkp-" + Date.now(),
      file_id,
      state: "QUEUED",
      queue_position: 2,
      estimated_start: new Date(Date.now() + 60000).toISOString(),
    },
    meta: { correlation_id: "corr-" + Date.now() },
  });
});

// GET /api/v1/ui/backups/:backupId -> check status
router.get("/:backupId", (req, res) => {
  res.json({
    data: {
      backup_id: req.params.backupId,
      state: "COMMITTED",
      dedup: { savings_ratio: 0.42 },
      verification: { status: "VERIFIED" },
    },
    meta: {},
  });
});

export default router;
