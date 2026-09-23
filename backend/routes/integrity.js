import { Router } from "express";
import { aggregationService } from "../services/aggregationService.js";
import { createSuccessEnvelope } from "../../contracts/response-envelopes.js";

const router = Router();

// GET /api/v1/ui/integrity -> Merkle tree verification state (D3)
router.get("/", (req, res, next) => {
  try {
    const isTampered = req.query.tampered === "true";
    const report = aggregationService.getIntegrityReport(isTampered);
    res.json(createSuccessEnvelope(report, req.correlationId));
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/ui/verify/preview -> Trigger verification preview audit (D4)
router.post("/preview", (req, res, next) => {
  try {
    const result = aggregationService.runVerifyPreview();
    res.json(createSuccessEnvelope(result, req.correlationId));
  } catch (err) {
    next(err);
  }
});

export default router;
