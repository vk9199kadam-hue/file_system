import { Router } from "express";

const router = Router();

// GET /api/v1/ui/files -> browse files
router.get("/", (req, res) => {
  // TODO: replace with real call to Team C's GET /api/v1/files
  res.json({
    data: [
      { file_id: "f1", name: "thesis_draft.docx", lastVersion: "v3", size: "2.1 MB" },
      { file_id: "f2", name: "lab_photos.zip", lastVersion: "v1", size: "45 MB" },
      { file_id: "f3", name: "project_report.pdf", lastVersion: "v5", size: "890 KB" },
    ],
    meta: {},
  });
});

// PATCH /api/v1/ui/files/:fileId -> admin edits retention/storage location
router.patch("/:fileId", (req, res) => {
  res.json({ data: { fileId: req.params.fileId, updated: true, ...req.body }, meta: {} });
});

export default router;
