import { Router } from "express";
import { aggregationService } from "../services/aggregationService.js";
import { createSuccessEnvelope } from "../../contracts/response-envelopes.js";

const router = Router();

// GET /api/v1/ui/session/users -> Return 15 predefined accounts for fast viva demo selection
router.get("/users", (req, res) => {
  const users = aggregationService.getPredefinedUsers();
  res.json(createSuccessEnvelope(users, req.correlationId));
});

// POST /api/v1/ui/session -> Institution session login
router.post("/", (req, res, next) => {
  try {
    const { username, password, role } = req.body;
    const authResult = aggregationService.authenticateUser(username, password, role);
    res.json(createSuccessEnvelope(authResult, req.correlationId));
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/ui/session -> Terminate session
router.delete("/", (req, res) => {
  res.json(createSuccessEnvelope({ loggedOut: true }, req.correlationId));
});

// GET /api/v1/ui/me -> Current session & role permissions
router.get("/me", (req, res) => {
  const userRole = req.headers["x-user-role"] || "Employee";
  const username = req.headers["x-username"] || "emp_rahul";
  const authResult = aggregationService.authenticateUser(username, "", userRole);
  res.json(createSuccessEnvelope(authResult.user, req.correlationId));
});

export default router;
