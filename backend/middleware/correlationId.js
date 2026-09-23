import { randomUUID } from "crypto";

/**
 * X-Correlation-ID Middleware
 * Section 3.1: One ID generated at Team D or Team C, propagated through every service and log.
 */
export function correlationIdMiddleware(req, res, next) {
  const correlationId = req.headers["x-correlation-id"] || "corr-" + randomUUID().slice(0, 8);
  req.correlationId = correlationId;
  res.setHeader("X-Correlation-ID", correlationId);
  next();
}
