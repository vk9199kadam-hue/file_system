import mongoose from "mongoose";

const BackupJobSchema = new mongoose.Schema(
  {
    job_id: { type: String, required: true, unique: true, index: true },
    file_id: { type: String, required: true },
    file_name: { type: String, required: true },
    scheduling_algorithm: {
      type: String,
      enum: ["ROUND_ROBIN", "LEAST_LOADED", "DYNAMIC_WEIGHTED"],
      default: "DYNAMIC_WEIGHTED"
    },
    workers_dispatched: [{ type: String }],
    chunks_total: { type: Number, default: 0 },
    chunks_unique: { type: Number, default: 0 },
    chunks_deduplicated: { type: Number, default: 0 },
    savings_percentage: { type: Number, default: 0 },
    execution_time_ms: { type: Number, default: 0 },
    state: {
      type: String,
      enum: ["REQUESTED", "QUEUED", "CHUNKING", "DEDUPLICATING", "COMMITTED", "VERIFIED", "COMPLETED", "FAILED"],
      default: "COMPLETED"
    },
    merkle_root: { type: String },
    timestamp: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const BackupJobModel = mongoose.models.BackupJob || mongoose.model("BackupJob", BackupJobSchema, "backup_jobs");
