import { Router } from "express";

const router = Router();

// GET /api/v1/ui/dashboard -> aggregated storage/scheduling/alerts summary
router.get("/", (req, res) => {
  res.json({
    data: {
      storageUsedGB: 128.4,
      storageTotalGB: 500,
      activeJobs: 3,
      queueDepth: 5,
      recentAlerts: [
        { level: "warning", message: "Verification degraded for backup bkp-991" },
      ],
    },
    meta: { lastUpdated: new Date().toISOString() },
  });
});

export default router;
