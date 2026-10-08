import { Router } from "express";
import { aggregationService } from "../services/aggregationService.js";
import { createSuccessEnvelope } from "../../contracts/response-envelopes.js";
import { requireRoles } from "../middleware/auth.js";
import { SYSTEM_ROLES } from "../../contracts/shared-types.js";

const router = Router();

// GET /api/v1/ui/reports/storage -> Storage utilization report (D4)
router.get("/storage", requireRoles([SYSTEM_ROLES.IT_ADMIN, SYSTEM_ROLES.AUDITOR]), async (req, res, next) => {
  try {
    const report = await aggregationService.getStorageReport();
    res.json(createSuccessEnvelope(report, req.correlationId));
  } catch (err) {
    next(err);
  }
});

export default router;
