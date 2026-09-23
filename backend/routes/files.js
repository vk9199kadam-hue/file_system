import { Router } from "express";
import { aggregationService } from "../services/aggregationService.js";
import { createSuccessEnvelope, createErrorEnvelope } from "../../contracts/response-envelopes.js";
import { requireRoles } from "../middleware/auth.js";
import { SYSTEM_ROLES } from "../../contracts/shared-types.js";

const router = Router();

// GET /api/v1/ui/files -> Browse files with filters (D2)
router.get("/", (req, res, next) => {
  try {
    const { q, folder, storage_class } = req.query;
    const files = aggregationService.getFiles(q, folder, storage_class);
    res.json(createSuccessEnvelope(files, req.correlationId));
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/ui/files/:fileId/versions -> Browsable version history (D2)
router.get("/:fileId/versions", (req, res, next) => {
  try {
    const versions = aggregationService.getFileVersions(req.params.fileId);
    res.json(createSuccessEnvelope(versions, req.correlationId));
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/ui/files -> Upload new file & trigger backup (D2)
router.post("/", (req, res, next) => {
  try {
    const { name, size, storage_class, retention_days, folder } = req.body;

    if (!name) {
      return res.status(400).json(
        createErrorEnvelope(
          "INVALID_INPUT",
          "File 'name' is required to upload a file.",
          [{ field: "name", issue: "missing" }],
          req.correlationId
        )
      );
    }

    const username = req.headers["x-username"] || "emp_rahul";
    const result = aggregationService.addNewUploadedFile({
      fileName: name,
      size,
      folder,
      owner: username,
      storageClass: storage_class,
      retentionDays: retention_days
    });
    res.status(201).json(createSuccessEnvelope(result, req.correlationId));
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/ui/files/:fileId -> Edit retention policy & storage class (D4 - IT Admin only)
router.patch("/:fileId", requireRoles([SYSTEM_ROLES.IT_ADMIN]), (req, res, next) => {
  try {
    const { retention_days, storage_class } = req.body;
    const username = req.headers["x-username"] || "admin_tejashree";
    const updated = aggregationService.updateFilePolicy(req.params.fileId, retention_days, storage_class, username);
    res.json(createSuccessEnvelope(updated, req.correlationId));
  } catch (err) {
    next(err);
  }
});

export default router;
