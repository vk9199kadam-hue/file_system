import { Router } from "express";
import { aggregationService } from "../services/aggregationService.js";
import { createSuccessEnvelope } from "../../contracts/response-envelopes.js";

const router = Router();

// GET /api/v1/ui/dashboard -> Live operations dashboard summary (<200ms target) (D3)
router.get("/", (req, res, next) => {
  try {
    const summary = aggregationService.getDashboardSummary();
    res.json(createSuccessEnvelope(summary, req.correlationId));
  } catch (err) {
    next(err);
  }
});

export default router;
