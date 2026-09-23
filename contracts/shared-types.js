/**
 * Shared Contract Specifications & State Machine Definitions
 * Owned by Team D - Single Source of Truth for Teams A, B, and C
 */

export const BACKUP_STATES = {
  REQUESTED: "REQUESTED",
  QUEUED: "QUEUED",
  CHUNKING: "CHUNKING",
  DEDUPLICATING: "DEDUPLICATING",
  UPLOADING: "UPLOADING",
  COMMITTED: "COMMITTED",
  VERIFIED: "VERIFIED",
  COMPLETED: "COMPLETED",
  // Alternative / Failure states
  REJECTED: "REJECTED",
  PARTIAL: "PARTIAL",
  RETRYING: "RETRYING",
  RESTORED: "RESTORED",
  CANCELLED: "CANCELLED",
  EXPIRED: "EXPIRED",
  COMPENSATION_REQUIRED: "COMPENSATION_REQUIRED",
};

export const SYSTEM_ROLES = {
  EMPLOYEE: "Employee",
  IT_ADMIN: "IT Admin",
  AUDITOR: "Auditor",
};

/**
 * Common Headers contract
 */
export const REQUIRED_HEADERS = {
  AUTHORIZATION: "Authorization",
  CORRELATION_ID: "X-Correlation-ID",
  IDEMPOTENCY_KEY: "Idempotency-Key",
  API_VERSION: "X-API-Version",
};
