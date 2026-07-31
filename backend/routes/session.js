import { Router } from "express";

const router = Router();

// POST /api/v1/ui/session  -> login
router.post("/", (req, res) => {
  const { username, role } = req.body;
  // TODO: replace with real call to Team C's auth once available
  res.json({
    data: {
      token: "mock-token-123",
      user: { username: username || "demo.user", role: role || "Employee" },
    },
    meta: { correlation_id: "corr-" + Date.now(), api_version: "v1" },
  });
});

// DELETE /api/v1/ui/session -> logout
router.delete("/", (req, res) => {
  res.json({ data: { loggedOut: true }, meta: {} });
});

export default router;
