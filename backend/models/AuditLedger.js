import mongoose from "mongoose";

const AuditLedgerSchema = new mongoose.Schema(
  {
    audit_id: { type: String, required: true, unique: true, index: true },
    timestamp: { type: String, required: true },
    action: { type: String, required: true },
    correlation_id: { type: String, required: true },
    user: { type: String, required: true },
    role: { type: String, required: true },
    file_id: { type: String },
    file_name: { type: String },
    status: { type: String, default: "COMMITTED" },
    merkle_root: { type: String },
    network_origin: { type: String, default: "Corporate LAN" },
    details: { type: mongoose.Schema.Types.Mixed }
  },
  { timestamps: true }
);

export const AuditLedgerModel = mongoose.models.AuditLedger || mongoose.model("AuditLedger", AuditLedgerSchema, "audit_ledger");
