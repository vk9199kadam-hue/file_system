import { createErrorEnvelope } from "../../contracts/response-envelopes.js";

/**
 * Standard JSON Error Envelope Middleware
 * Catch-all handler ensuring 100% of backend error classes map to a clear JSON error response.
 */
export function errorHandler(err, req, res, next) {
  console.error(`[ERROR] [CorrelationID: ${req.correlationId}]`, err);
  const status = err.statusCode || 500;
  const code = err.code || "INTERNAL_SERVER_ERROR";
  const message = err.message || "An unexpected error occurred in Team D BFF layer.";
  
  res.status(status).json(
    createErrorEnvelope(code, message, err.details || [], req.correlationId)
  );
}
