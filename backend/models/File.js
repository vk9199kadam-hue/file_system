import mongoose from "mongoose";

const FileSchema = new mongoose.Schema(
  {
    file_id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    folder: { type: String, default: "general" },
    extension: { type: String, default: "dat" },
    mime_type: { type: String, default: "application/octet-stream" },
    size_bytes: { type: Number, default: 0 },
    size: { type: String, default: "0 KB" }, // Formatted representation for UI
    storage_class: {
      type: String,
      enum: ["HOT_STORAGE", "STANDARD", "COLD_STORAGE"],
      default: "STANDARD"
    },
    retention_days: { type: Number, default: 90 },
    owner: { type: String, required: true, default: "emp_rahul" },
    lastVersion: { type: String, default: "v1" },
    merkle_root: { type: String, required: true },
    checksum: { type: String }, // Whole-file SHA-256
    total_chunks: { type: Number, default: 1 },
    unique_chunks: { type: Number, default: 1 },
    storage_pointer: { type: String, required: true }, // Pointer to local physical storage, NOT physical binary in DB
    status: {
      type: String,
      enum: ["COMMITTED", "QUEUED", "VERIFIED", "ARCHIVED"],
      default: "COMMITTED"
    },
    last_backup_at: { type: String }
  },
  { timestamps: true }
);

export const FileModel = mongoose.models.File || mongoose.model("File", FileSchema, "files");
