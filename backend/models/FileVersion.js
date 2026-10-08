import mongoose from "mongoose";

const FileVersionSchema = new mongoose.Schema(
  {
    file_id: { type: String, required: true, index: true },
    version_tag: { type: String, required: true }, // e.g., "v1", "v2"
    author: { type: String, required: true },
    merkle_root: { type: String, required: true },
    chunk_manifest: [
      {
        index: { type: Number, required: true },
        chunk_hash: { type: String, required: true },
        is_duplicate: { type: Boolean, default: false }
      }
    ],
    change_summary: { type: String, default: "Point-in-time backup commit" },
    timestamp: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: true }
);

export const FileVersionModel = mongoose.models.FileVersion || mongoose.model("FileVersion", FileVersionSchema, "file_versions");
