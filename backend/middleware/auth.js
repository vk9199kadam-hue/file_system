import { createErrorEnvelope } from "../../contracts/response-envelopes.js";

/**
 * Authorization Middleware
 * Enforces role-based permissions (Employee, IT Admin, Auditor) on BFF endpoints.
 */
export function requireRoles(allowedRoles = []) {
  return (req, res, next) => {
    // Read simulated user role from header or query or default
    const userRole = req.headers["x-user-role"] || req.query.role || "Employee";
    req.userRole = userRole;

    if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
      return res.status(403).json(
        createErrorEnvelope(
          "FORBIDDEN_ACTION",
          `Role '${userRole}' is not authorized to perform this operation. Required: ${allowedRoles.join(", ")}`,
          [{ action: req.method + " " + req.originalUrl, currentRole: userRole }],
          req.correlationId
        )
      );
    }
    next();
  };
}
