import { Router } from "express";
import { aggregationService } from "../services/aggregationService.js";
import { createSuccessEnvelope, createErrorEnvelope } from "../../contracts/response-envelopes.js";

const router = Router();

// POST /api/v1/ui/restores -> Request point-in-time version restore (D2)
router.post("/", (req, res, next) => {
  try {
    const { file_id, version_id, target_path } = req.body;
    const idempotencyKey = req.headers["idempotency-key"];
    const user = req.headers["x-username"] || "emp_rahul";

    if (!file_id) {
      return res.status(400).json(
        createErrorEnvelope(
          "INVALID_INPUT",
          "Parameter 'file_id' is required to restore a version.",
          [{ field: "file_id", issue: "missing" }],
          req.correlationId
        )
      );
    }

    const restoreResult = aggregationService.orchestrateRestore({
      fileId: file_id,
      versionId: version_id,
      targetPath: target_path,
      idempotencyKey,
      user
    });
    res.status(202).json(createSuccessEnvelope(restoreResult, req.correlationId));
  } catch (err) {
    next(err);
  }
});

export default router;
