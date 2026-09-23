/**
 * Standard Response Envelopes required by Section 3.2 of Leadership Playbook
 * Success: { data: {...}, meta: { correlation_id: "...", api_version: "v1", timestamp: "..." } }
 * Error:   { error: { code: "...", message: "...", details: [...] }, meta: { correlation_id: "...", timestamp: "..." } }
 */

export function createSuccessEnvelope(data, correlationId = "corr-default", metaExtra = {}) {
  return {
    data,
    meta: {
      correlation_id: correlationId,
      api_version: "v1",
      timestamp: new Date().toISOString(),
      ...metaExtra,
    },
  };
}

export function createErrorEnvelope(code, message, details = [], correlationId = "corr-default") {
  return {
    error: {
      code: code || "INTERNAL_SERVER_ERROR",
      message: message || "An unexpected error occurred",
      details,
    },
    meta: {
      correlation_id: correlationId,
      timestamp: new Date().toISOString(),
    },
  };
}
